import React, { useEffect, useMemo, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
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
  Grid
} from '@mui/material';
import ArrowRightIcon from 'src/icons/ArrowRight';
import debounce from 'lodash/debounce';
import { setLimit, setPage, setStatusFilter, setSearchText, setOrder, selectRange } from 'src/slices/jobToInvoice';
import moment from 'moment/moment';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { ALL_JOBS_TO_INVOICE_FILTER } from 'src/types/job';
import { getEntityAddress } from 'src/utils/address';
import SearchIcon from '../../icons/Search';
import type { Job } from '../../types/job';
import { Scrollbar } from '../scrollbar';
import { useDispatch, useSelector } from '../../store';
import JobToJobListBulkActions from './JobToInvoiceListBulkActions';

interface JobToJobListTableProps {
  className?: string;
  jobsToInvoice: Job[];
}

const statusOptions = [
  {
    label: 'All',
    value: ALL_JOBS_TO_INVOICE_FILTER
  },
  {
    label: 'Visible',
    value: 1
  },
  {
    label: 'Hidden',
    value: 0
  },
];

const JobToJobListTable: FC<JobToJobListTableProps> = (props) => {
  const { className, jobsToInvoice, ...other } = props;
  const dispatch = useDispatch();
  const { selectedRange, isLoading, limit, page, total, searchText, statusFilter, orderBy, order } = useSelector((state) => state.jobToInvoice);
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setQuery(searchText);
  }, []);

  const minDate = useMemo(
    () => moment(selectedRange.from).toDate(),
    [selectedRange.from]
  );

  const maxDate = useMemo(
    () => moment(selectedRange.to).toDate(),
    [selectedRange.to]
  );

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

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();

    dispatch(setStatusFilter(event.target.value));
  };

  const handleSortChange = (orderBy: string, order: SortDirection): void => {
    dispatch(setOrder(orderBy, order));
  };

  const handleSelectAllJobs = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedJobs(event.target.checked
      ? jobsToInvoice.map((job) => job.id)
      : []);
  };

  const handleSelectOneJob = (event: ChangeEvent<HTMLInputElement>, jobId: number): void => {
    if (!selectedJobs.includes(jobId)) {
      setSelectedJobs((prevSelected) => [...prevSelected, jobId]);
    } else {
      setSelectedJobs((prevSelected) => prevSelected.filter((id) => id !== jobId));
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const handleFromDateChange = (date: Date): void => {
    dispatch(selectRange(date, new Date(selectedRange.to)));
  };

  const handleToDateChange = (date: Date): void => {
    dispatch(selectRange(new Date(selectedRange.from), date));
  };

  // Usually query is done on backend with indexing solutions
  const enableBulkActions = selectedJobs.length > 0;
  const selectedSomeJobs = selectedJobs.length > 0
    && selectedJobs.length < jobsToInvoice.length;
  const selectedAllJobs = selectedJobs.length === jobsToInvoice.length;

  return (
    <>
      <Card
        className={className}
        {...other}
      >
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
              placeholder="Search jobs to invoice"
              value={query}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
              width: 240
            }}
          >
            <TextField
              fullWidth
              label="Status"
              name="status"
              onChange={handleStatusChange}
              select
              SelectProps={{ native: true }}
              value={statusFilter}
              variant="outlined"
            >
              {statusOptions.map((statusOption) => (
                <option
                  key={statusOption.value}
                  value={statusOption.value}
                >
                  {statusOption.label}
                </option>
              ))}
            </TextField>
          </Box>
          <Box flexGrow={1} />
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid
                item
              >
                <MobileDatePicker
                  label="From date"
                  renderInput={(props) => (
                    <TextField
                      fullWidth
                      variant="outlined"
                      {...props}
                    />
                  )}
                  disableFuture
                  mask="YYYY-MM-DD"
                  disableCloseOnSelect={false}
                  showToolbar={false}
                  disableMaskedInput
                  inputFormat="dd MMM yyyy"
                  loading={isLoading}
                  maxDate={maxDate}
                  onChange={handleFromDateChange}
                  value={selectedRange.from}
                />
              </Grid>
              <Grid item>
                <MobileDatePicker
                  label="To date"
                  renderInput={(props) => (
                    <TextField
                      fullWidth
                      variant="outlined"
                      {...props}
                    />
                  )}
                  disableFuture
                  disableCloseOnSelect={false}
                  showToolbar={false}
                  disableMaskedInput
                  inputFormat="dd MMM yyyy"
                  loading={isLoading}
                  minDate={minDate}
                  onChange={handleToDateChange}
                  value={selectedRange.to}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 1200 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllJobs}
                      indeterminate={selectedSomeJobs}
                      onChange={handleSelectAllJobs}
                    />
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === 'start_time' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'start_time'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('start_time', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Date of job
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === 'job_template' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'job_template'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('job_template', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Job description
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === 'pool_address' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'pool_address'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('pool_address', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Pool address
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === 'contact_name' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'contact_name'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('contact_name', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Contact name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === 'user_name' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'user_name'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('user_name', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Technician
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobsToInvoice.map((job) => {
                  const isJobSelected = selectedJobs.includes(job.id);

                  return (
                    <TableRow
                      hover
                      key={job.id}
                      selected={isJobSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isJobSelected}
                          onChange={(event) => handleSelectOneJob(event, job.id)}
                          value={isJobSelected}
                        />
                      </TableCell>
                      <TableCell>
                        {moment(job.start_time).format('DD MMM YYYY')}
                      </TableCell>
                      <TableCell>
                        {job.job_template ? job.job_template.name : 'Unknown job template'}
                      </TableCell>
                      <TableCell>
                        {job.pool ? getEntityAddress(job.pool, 'pool', true) : 'Unknown pool'}
                      </TableCell>
                      <TableCell>
                        {job.contact ? job.contact.full_name : 'Unknown contact'}
                      </TableCell>
                      <TableCell>
                        {job.user ? `${job.user.first_name} ${job.user.last_name}` : 'Unassigned'}
                      </TableCell>
                      <TableCell align="center">
                        <NextLink
                          href={`/jobs/${job.id}`}
                          passHref
                        >
                          <IconButton
                            sx={{
                              color: 'primary.main',
                            }}
                          >
                            <ArrowRightIcon />
                          </IconButton>
                        </NextLink>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
      <JobToJobListBulkActions
        open={enableBulkActions}
        selected={selectedJobs}
      />
    </>
  );
};

JobToJobListTable.propTypes = {
  className: PropTypes.string,
  jobsToInvoice: PropTypes.array.isRequired
};

export default JobToJobListTable;
