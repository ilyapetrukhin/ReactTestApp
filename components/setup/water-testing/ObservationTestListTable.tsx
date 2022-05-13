import React, { useEffect, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
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
  Tooltip,
  Switch
} from '@mui/material';
import {
  Edit as EditIcon,
  Trash as TrashIcon,
} from 'react-feather';
import debounce from 'lodash/debounce';
import { useConfirm } from 'material-ui-confirm';
import { deleteObservationTest, changeDefault, setLimit, setPage, setSearchText, setOrder } from 'src/slices/observationTest';
import toast from 'react-hot-toast';
import SearchIcon from 'src/icons/Search';
import type { ObservationTest } from 'src/types/chemical';
import { Scrollbar } from 'src/components/scrollbar';
import { useDispatch, useSelector } from 'src/store';
import InformationCircleIcon from 'src/icons/InformationCircle';
import Breadcrumbs from '../../Breadcrumbs';

interface ObservationTestListTableProps {
  observationTests: ObservationTest[];
}

const ObservationTestListTable: FC<ObservationTestListTableProps> = (props) => {
  const { observationTests, ...other } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const confirm = useConfirm();

  const { organisation } = useSelector((state) => state.account);
  const { limit, page, total, searchText, orderBy, order } = useSelector((state) => state.observationTest);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setQuery(searchText);
  }, []);

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

  const handleSortChange = (orderBy: string, order: SortDirection): void => {
    dispatch(setOrder(orderBy, order));
  };

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const handleDelete = (observationTest: ObservationTest) => {
    confirm({ description: `This will permanently delete ${observationTest.name}` })
      .then(async () => {
        await dispatch(deleteObservationTest(organisation.id, observationTest.id));
        toast.success('Observation test successfully deleted');
      })
      .catch(() => {});
  };

  const handleChangeDefault = async (observationTest: ObservationTest): Promise<void> => {
    await dispatch(changeDefault(organisation.id, observationTest.id, !observationTest.is_default));
    toast.success('Observation test updated');
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
              placeholder="Search observation tests"
              value={query}
              variant="outlined"
            />
          </Box>
          <Box flexGrow={1} />
        </Box>
        <Scrollbar>
          <Box>
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
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        width: 150
                      }}
                    >
                      Show by default
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          ml: 1
                        }}
                      >
                        <Tooltip
                          title="Exceptions mean that when the chemical calculator reads a pool with those characteristics, it updates the min, max and target accordingly. Exceptions can be applied on a surface, sanitiser or custom level. You can add new fields to these by going to Settings / Pool Characteristics."
                        >
                          <InformationCircleIcon
                            color="primary"
                            fontSize="small"
                          />
                        </Tooltip>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {observationTests.map((observationTest) => (
                  <TableRow
                    hover
                    key={observationTest.id}
                    onClick={() => router.push(`/setup/water-testing/observation-tests/${observationTest.id}`)}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {observationTest.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 150
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Switch
                        checked={observationTest.is_default}
                        color="primary"
                        edge="start"
                        name="visibility"
                        onChange={() => handleChangeDefault(observationTest)}
                        value={observationTest.is_default}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <NextLink
                        href={`/setup/water-testing/observation-tests/${observationTest.id}`}
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
                        onClick={() => handleDelete(observationTest)}
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

ObservationTestListTable.propTypes = {
  observationTests: PropTypes.array.isRequired
};

export default ObservationTestListTable;
