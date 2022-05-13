import React, { useEffect, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  SortDirection,
  TextField,
  TableSortLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Trash as TrashIcon,
} from 'react-feather';
import debounce from 'lodash/debounce';
import { useConfirm } from 'material-ui-confirm';
import { deleteTemplate, setJobType, setLimit, setPage, setSearchText, setOrder } from 'src/slices/jobTemplate';
import toast from 'react-hot-toast';
import SearchIcon from 'src/icons/Search';
import type { JobTemplate, JobType } from 'src/types/jobTemplate';
import { Scrollbar } from 'src/components/scrollbar';
import { useDispatch, useSelector } from 'src/store';

interface JobTemplateListTableProps {
  jobTemplates: JobTemplate[];
}

const JobTemplateListTable: FC<JobTemplateListTableProps> = (props) => {
  const { jobTemplates, ...other } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const confirm = useConfirm();

  const { organisation } = useSelector((state) => state.account);
  const { jobTypeFilter, limit, page, total, jobTypes, searchText, orderBy, order } = useSelector((state) => state.jobTemplate);
  const [query, setQuery] = useState<string>('');
  const [jobTypeOptions, setJobTypeOptions] = useState<JobType[]>([{
    id: 0,
    name: 'All'
  }]);

  useEffect(() => {
    setQuery(searchText);
  }, []);

  useEffect(() => {
    setJobTypeOptions([
      ...jobTypeOptions,
      ...jobTypes
    ]);
  }, [jobTypes]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
    event.persist();
    const handleChangeDebounce = debounce(() => {
      if (event.target.value === '' || event.target.value.length >= 3) {
        dispatch(setSearchText(event.target.value));
      }
    }, 2000);
    handleChangeDebounce();
  };

  const handleJobTypeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();

    dispatch(setJobType(parseInt(event.target.value, 10)));
  };

  const handleSortChange = (orderBy: string, order: SortDirection): void => {
    dispatch(setOrder(orderBy, order));
  };

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const handleDelete = (jobTemplate: JobTemplate) => {
    confirm({ description: `This will permanently delete ${jobTemplate.name}` })
      .then(async () => {
        await dispatch(deleteTemplate(organisation.id, jobTemplate.id));
        toast.success('Job template successfully deleted');
      })
      .catch(() => {});
  };

  return (
    <>
      <Card {...other}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            p: 2
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 500
            }}
          >
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              onChange={handleQueryChange}
              placeholder="Search job templates"
              value={query}
              variant="outlined"
            />
          </Box>
          <Box flexGrow={1} />
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
            }}
          >
            <TextField
              sx={{
                flexBasis: 200
              }}
              label="Job type"
              name="job_type"
              onChange={handleJobTypeChange}
              select
              SelectProps={{ native: true }}
              value={jobTypeFilter}
              variant="outlined"
            >
              {jobTypeOptions.map((jobTypeOption) => (
                <option
                  key={jobTypeOption.id}
                  value={jobTypeOption.id}
                >
                  {jobTypeOption.name}
                </option>
              ))}
            </TextField>
          </Box>
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    size="medium"
                    sortDirection={orderBy === 'name' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('name', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    size="medium"
                    sortDirection={orderBy === 'job_type_id' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'job_type_id'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('job_type_id', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Job Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobTemplates.map((jobTemplate) => (
                  <TableRow
                    hover
                    key={jobTemplate.id}
                    onClick={() => router.push(`/setup/jobs/job-templates/${jobTemplate.id}`)}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {jobTemplate.name}
                    </TableCell>
                    <TableCell>
                      {jobTemplate.job_type ? jobTemplate.job_type.name : ''}
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <NextLink
                        href={`/setup/jobs/job-templates/${jobTemplate.id}`}
                        passHref
                      >
                        <IconButton
                          sx={{
                            color: 'primary.main',
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </NextLink>
                      <IconButton
                        sx={{
                          color: 'error.main',
                        }}
                        onClick={() => handleDelete(jobTemplate)}
                      >
                        <TrashIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={total}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

JobTemplateListTable.propTypes = {
  jobTemplates: PropTypes.array.isRequired
};

export default JobTemplateListTable;
