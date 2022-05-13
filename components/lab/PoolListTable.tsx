import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
// import NextLink from 'next/link';
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
  TableSortLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Trash as TrashIcon,
} from 'react-feather';
import debounce from 'lodash/debounce';
import { useConfirm } from 'material-ui-confirm';
import { deletePool, changeVisibility, setLimit, setPage, setSearchText, setOrder, restoreEnabledColumns, setEnabledColumns, setExpandedRow } from 'src/slices/waterTestPools';
import toast from 'react-hot-toast';
import moment from 'moment/moment';
import SearchIcon from '../../icons/Search';
import type { Pool } from '../../types/pool';
import { Scrollbar } from '../scrollbar';
import { useDispatch, useSelector } from '../../store';
import Contacts from '../Contacts';
import ColumnManagement, { Column } from '../ColumnManagement';
import {
  POOL_LIST_COLUMN_ID,
  POOL_LIST_COLUMN_NAME,
  POOL_LIST_COLUMN_ADDRESS,
  POOL_LIST_COLUMN_SURFACE_TYPE,
  POOL_LIST_COLUMN_POOL_TYPE,
  POOL_LIST_COLUMN_LINKED_CONTACTS,
  POOL_LIST_COLUMN_CREATED_DATE,
} from 'src/components/pool/constants';
import { alpha, useTheme } from '@mui/material/styles';
import PoolTableExpandedRow from './PoolTableExpandedRow';

interface PoolListTableProps {
  className?: string;
  pools: Pool[];
}

function useColumnManagement() : [Column[], string[], (newIds: string[]) => void] {
  const dispatch = useDispatch();
  const { enabledColumns, enabledColumnsRestored } = useSelector((state) => state.waterTestPools);

  const columns = useMemo<Column[]>(() => [
    {
      id: POOL_LIST_COLUMN_ID,
      label: 'ID',
    },
    {
      id: POOL_LIST_COLUMN_NAME,
      label: 'Name',
    },
    {
      id: POOL_LIST_COLUMN_ADDRESS,
      label: 'Address',
    },
    {
      id: POOL_LIST_COLUMN_SURFACE_TYPE,
      label: 'Surface type',
    },
    {
      id: POOL_LIST_COLUMN_POOL_TYPE,
      label: 'Pool type',
    },
    {
      id: POOL_LIST_COLUMN_CREATED_DATE,
      label: 'Created date',
    },
  ], []);

  useEffect(() => {
    if (!enabledColumnsRestored) {
      dispatch(restoreEnabledColumns());
    }
  }, [enabledColumnsRestored]);

  useEffect(() => {
    if (enabledColumns == null && enabledColumnsRestored) {
      dispatch(setEnabledColumns(columns.map(({ id }) => id)));
    }
  }, [enabledColumns, enabledColumnsRestored]);

  const handleChangeColumns = useCallback((newIds: string[]) => {
    dispatch(setEnabledColumns(newIds));
  }, []);

  return [columns, enabledColumns || [], handleChangeColumns];
}

const PoolListTable: FC<PoolListTableProps> = (props) => {
  const { className, pools, ...other } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const confirm = useConfirm();

  const { organisation } = useSelector((state) => state.account);
  const { limit, page, total, searchText, orderBy, order, expandedPoolId } = useSelector((state) => state.waterTestPools);
  const [query, setQuery] = useState<string>('');
  const [columns, selectedColumns, handleChangeColumns] = useColumnManagement();

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

  const handleExpandRow = (poolId: number | null): void => {
    dispatch(setExpandedRow(poolId));
  };

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const handleDelete = (pool: Pool) => {
    confirm({ description: `This will permanently delete ${pool.full_address}` })
      .then(async () => {
        await dispatch(deletePool(organisation.id, pool.id));
        toast.success('Pool successfully deleted');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChangeVisibility = (pool: Pool): void => {
    dispatch(changeVisibility(organisation.id, pool.id, !pool.visibility));
  };

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
              mr: 2,
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
              placeholder="Search pools"
              value={query}
              variant="outlined"
            />
          </Box>
          <Box flexGrow={1} />
          <ColumnManagement
            columns={columns}
            selectedColumnIds={selectedColumns}
            onChange={handleChangeColumns}
          />
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {
                    selectedColumns.includes(POOL_LIST_COLUMN_ID) && (
                      <TableCell>
                        ID
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(POOL_LIST_COLUMN_NAME) && (
                      <TableCell
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
                    )
                  }
                  {
                    selectedColumns.includes(POOL_LIST_COLUMN_ADDRESS) && (
                      <TableCell
                        sortDirection={orderBy === 'address_street_one' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'address_street_one'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('address_street_one', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Address
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(POOL_LIST_COLUMN_SURFACE_TYPE) && (
                      <TableCell>
                        Surface type
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(POOL_LIST_COLUMN_POOL_TYPE) && (
                      <TableCell
                        sortDirection={orderBy === 'pool_type_id' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'pool_type_id'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('pool_type_id', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Pool type
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(POOL_LIST_COLUMN_LINKED_CONTACTS) && (
                      <TableCell>
                        Linked contacts
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(POOL_LIST_COLUMN_CREATED_DATE) && (
                      <TableCell
                        sortDirection={orderBy === 'created_at' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'created_at'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('created_at', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Created date
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  <TableCell>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pools.map((pool) => (
                  <>
                    <TableRow
                      hover
                      key={pool.id}
                      onClick={() => handleExpandRow(expandedPoolId === pool.id ? null : pool.id)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: expandedPoolId === pool.id ? alpha(theme.palette.primary.main, 0.10) : 'inherit'
                      }}
                    >
                      {
                          selectedColumns.includes(POOL_LIST_COLUMN_ID) && (
                            <TableCell>
                              {pool.id}
                            </TableCell>
                          )
                        }
                      {
                          selectedColumns.includes(POOL_LIST_COLUMN_NAME) && (
                            <TableCell>
                              {pool.name}
                            </TableCell>
                          )
                        }
                      {
                          selectedColumns.includes(POOL_LIST_COLUMN_ADDRESS) && (
                            <TableCell>
                              {pool.full_address}
                            </TableCell>
                          )
                        }
                      {
                          selectedColumns.includes(POOL_LIST_COLUMN_SURFACE_TYPE) && (
                            <TableCell>
                              {pool.pool_surface_type ? pool.pool_surface_type.name : ''}
                            </TableCell>
                          )
                        }
                      {
                          selectedColumns.includes(POOL_LIST_COLUMN_POOL_TYPE) && (
                            <TableCell>
                              {pool.pool_type ? pool.pool_type.name : ''}
                            </TableCell>
                          )
                        }
                      {
                          selectedColumns.includes(POOL_LIST_COLUMN_LINKED_CONTACTS) && (
                            <TableCell
                              onClick={(e) => e.stopPropagation()}
                              align="center"
                            >
                              {pool.contacts.length
                                ? <Contacts contacts={pool.contacts} />
                                : null}
                            </TableCell>
                          )
                        }
                      {
                          selectedColumns.includes(POOL_LIST_COLUMN_CREATED_DATE) && (
                            <TableCell>
                              {moment(pool.created_at).format('DD MMM YYYY')}
                            </TableCell>
                          )
                        }
                      <TableCell
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                        >
                          {/* <IconButton */}
                          {/*  component={RouterLink} */}
                          {/*  sx={{ */}
                          {/*    color: 'primary.main', */}
                          {/*  }} */}
                          {/*  to={`/pools/${pool.id}/edit`} */}
                          {/* > */}
                          {/*  <EditIcon /> */}
                          {/* </IconButton> */}
                          <IconButton
                            sx={{
                              color: 'error.main',
                            }}
                            onClick={() => handleDelete(pool)}
                          >
                            <TrashIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          p: 0,
                          borderLeft: expandedPoolId === pool.id ? `8px solid ${theme.palette.primary.main}` : 0,
                          borderBottom: expandedPoolId === pool.id ? `1px solid ${theme.palette.divider}` : 'none',
                          backgroundColor: expandedPoolId === pool.id ? alpha(theme.palette.primary.main, 0.10) : 'inherit'
                        }}
                        colSpan={selectedColumns.length + 2}
                      >
                        <PoolTableExpandedRow
                          pool={pool}
                          isExpanded={expandedPoolId === pool.id}
                          onChangeVisibility={handleChangeVisibility}
                        />
                      </TableCell>
                    </TableRow>
                  </>
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

PoolListTable.propTypes = {
  className: PropTypes.string,
  pools: PropTypes.array.isRequired
};

export default PoolListTable;
