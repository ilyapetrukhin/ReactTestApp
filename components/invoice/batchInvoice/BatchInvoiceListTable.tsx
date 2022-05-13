import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import numeral from 'numeral';
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
  Grid,
  Tooltip
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import type { Theme as ThemeType } from '@mui/material';
import {
  Trash as TrashIcon,
  Send as SendIcon,
  AlertTriangle as AlertTriangleIcon,
} from 'react-feather';
import { BeatLoader, ClipLoader } from 'react-spinners';
import VendIcon from 'src/icons/Vend';
import debounce from 'lodash/debounce';
import { useConfirm } from 'material-ui-confirm';
import { deleteBatchInvoice, setLimit, setPage, setSearchText, setStatusFilter, setOrder, selectRange, restoreEnabledColumns, setEnabledColumns } from 'src/slices/batchInvoice';
import toast from 'react-hot-toast';
import moment from 'moment/moment';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { BATCH_STATUS_FILTERS } from 'src/constants/invoice';
import SearchIcon from 'src/icons/Search';
import type { BatchInvoice, StatusFilter } from 'src/types/contactInvoice';
import { Scrollbar } from '../../scrollbar';
import { useDispatch, useSelector } from 'src/store';
import Label from '../../Label';
import BatchInvoiceListBulkActions from './BatchInvoiceListBulkActions';
import BatchInvoiceListTableRowMenu from './BatchInvoiceListTableRowMenu';
import ColumnManagement, { Column } from '../../ColumnManagement';
import { BATCH_INVOICE_LIST_COLUMN_AMOUNT, BATCH_INVOICE_LIST_COLUMN_CONTACT, BATCH_INVOICE_LIST_COLUMN_DATE, BATCH_INVOICE_LIST_COLUMN_INVOICE, BATCH_INVOICE_LIST_COLUMN_NUMBER, BATCH_INVOICE_LIST_COLUMN_STATUS, BATCH_INVOICE_LIST_COLUMN_VEND } from '../constants';
import { useRouter } from 'next/router';

interface BatchInvoiceListTableProps {
  className?: string;
  invoices: BatchInvoice[];
}

function useColumnManagement() : [Column[], string[], (newIds: string[]) => void] {
  const dispatch = useDispatch();
  const { isVendConnected } = useSelector((state) => state.account);
  const { enabledColumns, enabledColumnsRestored } = useSelector((state) => state.batchInvoice);
  const columns = useMemo<Column[]>(() => [
    {
      id: BATCH_INVOICE_LIST_COLUMN_INVOICE,
      label: 'Invoice',
    },
    {
      id: BATCH_INVOICE_LIST_COLUMN_STATUS,
      label: 'Status',
    },
    {
      id: BATCH_INVOICE_LIST_COLUMN_VEND,
      label: 'Vend',
    },
    {
      id: BATCH_INVOICE_LIST_COLUMN_DATE,
      label: 'Invoice date',
    },
    {
      id: BATCH_INVOICE_LIST_COLUMN_NUMBER,
      label: 'Number',
    },
    {
      id: BATCH_INVOICE_LIST_COLUMN_CONTACT,
      label: 'Contact',
    },
    {
      id: BATCH_INVOICE_LIST_COLUMN_AMOUNT,
      label: 'Amount',
    },
  ].filter(({ id }) => {
    if (isVendConnected) {
      return true;
    }

    return id !== BATCH_INVOICE_LIST_COLUMN_VEND;
  }), []);

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

const vendStatusOptions = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Synced',
    value: 1
  },
  {
    label: 'Not synced',
    value: 0
  },
];

const getStatusLabel = (invoice: BatchInvoice): JSX.Element => {
  let invoiceStatus = invoice.is_invoice_paid ? 'paid' : 'unpaid';

  if (!invoice.is_invoice_paid && moment(invoice.due_date).diff(moment()) < 0) {
    invoiceStatus = 'overdue';
  }

  const map = {
    overdue: {
      color: 'error',
      text: 'Overdue'
    },
    paid: {
      color: 'success',
      text: 'Paid'
    },
    unpaid: {
      color: 'warning',
      text: 'Unpaid'
    }
  };

  const { text, color }: any = map[invoiceStatus];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
};

const getEmailStatusIcon = (invoice: BatchInvoice, theme: ThemeType): JSX.Element => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {invoice.mailgun_status === 'sending' && (
      <BeatLoader
        color={theme.palette.primary.main}
        size={5}
        margin={5}
      />
    )}
    {invoice.mailgun_status === 'dropped' && (
      <Tooltip
        title="Dropped"
      >
        <AlertTriangleIcon color={theme.palette.warning.main} />
      </Tooltip>
    )}
    {invoice.mailgun_status === 'delivered' && (
      <Tooltip
        title="Delivered"
      >
        <SendIcon color={theme.palette.primary.main} />
      </Tooltip>
    )}
  </Box>
);

const BatchInvoiceListTable: FC<BatchInvoiceListTableProps> = (props) => {
  const { className, invoices, ...other } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const confirm = useConfirm();
  const router = useRouter();

  const { organisation, isVendConnected } = useSelector((state) => state.account);
  const { selectedRange, isLoading, limit, page, total, searchText, statusFilter, orderBy, order } = useSelector((state) => state.batchInvoice);
  const [selectedBatchInvoices, setSelectedBatchInvoices] = useState<number[]>([]);
  const [query, setQuery] = useState<string>('');
  const [statusOptions] = useState<StatusFilter[]>([
    {
      value: 'all',
      label: 'All'
    },
    ...BATCH_STATUS_FILTERS
  ]);
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

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    dispatch(setStatusFilter(value));
  };

  const handleSortChange = (orderBy: string, order: SortDirection): void => {
    dispatch(setOrder(orderBy, order));
  };

  const handleSelectAllBatchInvoices = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedBatchInvoices(event.target.checked
      ? invoices.map((contact) => contact.id)
      : []);
  };

  const handleSelectOneBatchInvoice = (event: ChangeEvent<HTMLInputElement>, invoiceId: number): void => {
    if (!selectedBatchInvoices.includes(invoiceId)) {
      setSelectedBatchInvoices((prevSelected) => [...prevSelected, invoiceId]);
    } else {
      setSelectedBatchInvoices((prevSelected) => prevSelected.filter((id) => id !== invoiceId));
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

  const handleDelete = (invoice: BatchInvoice) => {
    confirm({ description: `This will permanently delete ${invoice.prefixed_invoice_no}` })
      .then(async () => {
        await dispatch(deleteBatchInvoice(organisation.id, invoice.id));
        toast.success('Batch invoice successfully deleted');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleEmail = useCallback((invoice: BatchInvoice) => {
    router.push(`/invoices/batch/${invoice.id}/resend`);
  }, []);

  // Usually query is done on backend with indexing solutions
  const enableBulkActions = selectedBatchInvoices.length > 0;
  const selectedSomeBatchInvoices = selectedBatchInvoices.length > 0
    && selectedBatchInvoices.length < invoices.length;
  const selectedAllBatchInvoices = selectedBatchInvoices.length === invoices.length;

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
                    {isLoading
                      ? (
                        <ClipLoader
                          size={20}
                          color={theme.palette.primary.main}
                        />
                      )
                      : <SearchIcon />}
                  </InputAdornment>
                )
              }}
              onChange={handleQueryChange}
              placeholder="Search invoices"
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
          {isVendConnected && (
            <Box
              sx={{
                m: 1,
                maxWidth: '100%',
              }}
            >
              <TextField
                fullWidth
                label="Vend status"
                name="vend_status"
                onChange={handleStatusChange}
                select
                SelectProps={{ native: true }}
                variant="outlined"
              >
                {vendStatusOptions.map((statusOption) => (
                  <option
                    key={statusOption.value}
                    value={statusOption.value}
                  >
                    {statusOption.label}
                  </option>
                ))}
              </TextField>
            </Box>
          )}
          <Box flexGrow={1} />
          <Box
            sx={{
              m: 1,
              mr: 2,
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
                  onChange={handleToDateChange}
                  value={selectedRange.to}
                />
              </Grid>
            </Grid>
          </Box>
          <Box flexGrow={1} />
          <ColumnManagement
            columns={columns}
            selectedColumnIds={selectedColumns}
            onChange={handleChangeColumns}
          />
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 1200 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllBatchInvoices}
                      indeterminate={selectedSomeBatchInvoices}
                      onChange={handleSelectAllBatchInvoices}
                    />
                  </TableCell>
                  {
                    selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_INVOICE) && (
                      <TableCell align="center">
                        Invoice
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_STATUS) && (
                      <TableCell align="center">
                        Status
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_VEND) && isVendConnected && (
                      <TableCell align="center">
                        Vend
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_DATE) && (
                      <TableCell
                        sortDirection={orderBy === 'send_date' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'send_date'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('send_date', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Invoice date
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_NUMBER) && (
                      <TableCell
                        sortDirection={orderBy === 'id' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'id'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('id', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Number
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_CONTACT) && (
                      <TableCell
                        sortDirection={orderBy === 'contact_name' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'contact_name'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('contact_name', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Contact
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_AMOUNT) && (
                      <TableCell
                        sortDirection={orderBy === 'total' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'total'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('total', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Amount
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  <TableCell align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => {
                  const isBatchInvoiceSelected = selectedBatchInvoices.includes(invoice.id);

                  return (
                    <TableRow
                      hover
                      key={invoice.id}
                      selected={isBatchInvoiceSelected}
                      onClick={() => router.push(`/invoices/batch/${invoice.id}`)}
                      sx={{
                        cursor: 'pointer'
                      }}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isBatchInvoiceSelected}
                          onChange={(event) => handleSelectOneBatchInvoice(event, invoice.id)}
                          value={isBatchInvoiceSelected}
                        />
                      </TableCell>
                      {
                        selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_INVOICE) && (
                          <TableCell align="center">
                            {invoice.is_invoice_sent
                              ? (
                                getEmailStatusIcon(invoice, theme)
                              )
                              : (
                                <Label color="warning">
                                  Not sent
                                </Label>
                              )}
                          </TableCell>
                        )
                      }
                      {
                        selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_STATUS) && (
                          <TableCell align="center">
                            {getStatusLabel(invoice)}
                          </TableCell>
                        )
                      }
                      {
                        selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_VEND) && isVendConnected && (
                          <TableCell
                            align="center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {invoice.vend_invoice_id
                              ? (
                                <Tooltip
                                  title="Synced to Vend"
                                >
                                  <VendIcon
                                    fontSize="large"
                                    sx={{
                                      color: theme.palette.success.main
                                    }}
                                  />
                                </Tooltip>
                              )
                              : (
                                <Tooltip
                                  title="Push invoice to Vend"
                                >
                                  <IconButton
                                    onClick={() => {}}
                                  >
                                    <VendIcon
                                      fontSize="large"
                                      sx={{
                                        color: alpha(theme.palette.error.main, 0.70)
                                      }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}
                          </TableCell>
                        )
                      }
                      {
                        selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_DATE) && (
                          <TableCell>
                            {moment(invoice.send_date).format('DD MMM YYYY')}
                          </TableCell>
                        )
                      }
                      {
                        selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_NUMBER) && (
                          <TableCell>
                            {invoice.prefixed_invoice_no}
                          </TableCell>
                        )
                      }
                      {
                        selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_CONTACT) && (
                          <TableCell>
                            {`${invoice.contact_first_name} ${invoice.contact_last_name}`}
                          </TableCell>
                        )
                      }
                      {
                        selectedColumns.includes(BATCH_INVOICE_LIST_COLUMN_AMOUNT) && (
                          <TableCell>
                            {numeral(invoice.total)
                              .format('$0,0.00')}
                          </TableCell>
                        )
                      }
                      <TableCell
                        align="right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Box
                          display="flex"
                          justifyContent="center"
                        >
                          <IconButton
                            sx={{
                              color: 'error.main',
                            }}
                            onClick={() => handleDelete(invoice)}
                          >
                            <TrashIcon />
                          </IconButton>
                          <BatchInvoiceListTableRowMenu onEmail={() => handleEmail(invoice)} />
                        </Box>
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
      <BatchInvoiceListBulkActions
        open={enableBulkActions}
        selected={selectedBatchInvoices}
      />
    </>
  );
};

BatchInvoiceListTable.propTypes = {
  className: PropTypes.string,
  invoices: PropTypes.array.isRequired
};

export default BatchInvoiceListTable;
