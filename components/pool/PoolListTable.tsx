import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
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
  TableSortLabel, Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Trash as TrashIcon,
} from 'react-feather';
import { saveAs } from 'file-saver';
import debounce from 'lodash/debounce';
import { useConfirm } from 'material-ui-confirm';
import { setLimit, setPage, setSearchText, setOrder, restoreEnabledColumns, setEnabledColumns, setExpandedRow } from 'src/slices/pool';
import moment from 'moment/moment';
import SearchIcon from '../../icons/Search';
import type { Pool } from '../../types/pool';
import { Scrollbar } from '../scrollbar';
import { useDispatch, useSelector } from '../../store';
import Contacts from '../Contacts';
import PoolListBulkActions from './PoolListBulkActions';
import ColumnManagement, { Column } from '../ColumnManagement';
import {
  POOL_LIST_COLUMN_ID,
  POOL_LIST_COLUMN_NAME,
  POOL_LIST_COLUMN_ADDRESS,
  POOL_LIST_COLUMN_SURFACE_TYPE,
  POOL_LIST_COLUMN_POOL_TYPE,
  POOL_LIST_COLUMN_LINKED_CONTACTS,
  POOL_LIST_COLUMN_CREATED_DATE,
} from './constants';
import { alpha, useTheme } from '@mui/material/styles';
import PoolTableExpandedRow from './PoolTableExpandedRow';
import UploadIcon from '../../icons/Upload';
import DownloadIcon from '../../icons/Download';
import {
  useChangeVisibilityMutation,
  useDeletePoolMutation,
  useExportPoolMutation,
} from '../../api/pool';

interface PoolListTableProps {
  className?: string;
  pools: Pool[];
  isLoading: boolean;
}

function useColumnManagement() : [Column[], string[], (newIds: string[]) => void] {
  const dispatch = useDispatch();
  const { enabledColumns, enabledColumnsRestored } = useSelector((state) => state.pool);

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
  const { className, pools, isLoading, ...other } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const confirm = useConfirm();
  const [exportPool] = useExportPoolMutation();
  const [deletePool] = useDeletePoolMutation();
  const [changeVisibilityPool, { isLoading: isChangeVisibilityLoading }] = useChangeVisibilityMutation();
  const { organisation } = useSelector((state) => state.account);
  const { limit, page, total, searchText, orderBy, order, expandedPoolId } = useSelector((state) => state.pool);
  const [selectedPools, setSelectedPools] = useState<number[]>([]);
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

  const handleSelectAllPools = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedPools(event.target.checked
      ? pools.map((pool) => pool.id)
      : []);
  };

  const handleSelectOnePool = (event: ChangeEvent<HTMLInputElement>, poolId: number): void => {
    if (!selectedPools.includes(poolId)) {
      setSelectedPools((prevSelected) => [...prevSelected, poolId]);
    } else {
      setSelectedPools((prevSelected) => prevSelected.filter((id) => id !== poolId));
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const exportPools = useCallback(async () => {
    try {
      // TODO: move to the slice
      const response:any = await exportPool({ organisationId: organisation.id });
      const csv = new Blob([response.data], {
        type: 'application/csv'
      });
      const fileName = `Contacts_export_${new Date().toLocaleDateString()}.csv`;
      saveAs(csv, fileName);
    } catch (err) {
      console.error(err);
    }
  }, [organisation]);

  const handleDelete = (pool: Pool) => {
    confirm({ description: `This will permanently delete ${pool.full_address}` })
      .then(async () => {
        await deletePool({
          organisationId: organisation.id,
          id: parseInt(pool.id.toString(), 10)
        });
      })
      .catch(() => {
      });
  };

  const handleChangeVisibility = async (pool: Pool): Promise<void> => {
    if (isChangeVisibilityLoading) return;
    await changeVisibilityPool({
      organisationId: organisation.id,
      id: parseInt(pool.id.toString(), 10),
      body: {
        visibility: +Boolean(!pool.visibility)
      }
    });
  };

  // Usually query is done on backend with indexing solutions
  const enableBulkActions = selectedPools.length > 0;
  const selectedSomePools = selectedPools.length > 0
    && selectedPools.length < pools.length;
  const selectedAllPools = selectedPools.length === pools.length;

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
          <Box
            sx={{
              display: 'flex'
            }}
          >
            <Button
              color="primary"
              startIcon={<UploadIcon fontSize="small" />}
              sx={{ m: 1 }}
              onClick={() => router.push('/pools/import')}
            >
              Import
            </Button>
            <Button
              color="primary"
              startIcon={<DownloadIcon fontSize="small" />}
              sx={{ m: 1 }}
              onClick={exportPools}
            >
              Export
            </Button>
            <ColumnManagement
              columns={columns}
              selectedColumnIds={selectedColumns}
              onChange={handleChangeColumns}
            />
          </Box>
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllPools}
                      indeterminate={selectedSomePools}
                      onChange={handleSelectAllPools}
                    />
                  </TableCell>
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
                {pools.map((pool) => {
                  const isPoolSelected = selectedPools.includes(pool.id);

                  return (
                    <React.Fragment key={`${pool.id}pool`}>
                      <TableRow
                        hover
                        selected={isPoolSelected}
                        onClick={() => handleExpandRow(expandedPoolId === pool.id ? null : pool.id)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: expandedPoolId === pool.id ? alpha(theme.palette.primary.main, 0.10) : 'inherit'
                        }}
                      >
                        <TableCell
                          padding="checkbox"
                          sx={{
                            borderLeft: expandedPoolId === pool.id ? `8px solid ${theme.palette.primary.main}` : 0
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isPoolSelected}
                            onChange={(event) => handleSelectOnePool(event, pool.id)}
                            value={isPoolSelected}
                          />
                        </TableCell>
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
                            <NextLink
                              href={`/pools/${pool.id}/edit`}
                              passHref
                            >
                              <IconButton
                                component="a"
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
                    </React.Fragment>
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
      <PoolListBulkActions
        open={enableBulkActions}
        selected={selectedPools}
      />
    </>
  );
};

PoolListTable.propTypes = {
  className: PropTypes.string,
  pools: PropTypes.array.isRequired
};

export default PoolListTable;
