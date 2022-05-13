import React, { useCallback, useMemo, useEffect, useState } from 'react';
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
  Tooltip,
  Button
} from '@mui/material';
import { saveAs } from 'file-saver';
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
import {
  setLimit,
  setPage,
  setSearchText,
  setStatusFilter,
  setOrder,
  selectRange,
  restoreEnabledColumns,
  setEnabledColumns,
} from 'src/slices/contactInvoice';
import moment from 'moment/moment';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { STATUS_FILTERS } from 'src/constants/invoice';
import SearchIcon from '../../icons/Search';
import type { Invoice, StatusFilter } from '../../types/contactInvoice';
import { Scrollbar } from '../scrollbar';
import { useDispatch, useSelector } from '../../store';
import Label from '../Label';
import InvoiceListBulkActions from './InvoiceListBulkActions';
import InvoiceStatusLabel from 'src/components/widgets/invoice/InvoiceStatusLabel';
import InvoiceListTableRowMenu from './InvoiceListTableRowMenu';
import ColumnManagement, { Column } from '../ColumnManagement';

import {
  CONTACT_INVOICE_LIST_COLUMN_AMOUNT,
  CONTACT_INVOICE_LIST_COLUMN_CONTACT_INVOICE,
  CONTACT_INVOICE_LIST_COLUMN_ID,
  CONTACT_INVOICE_LIST_COLUMN_INVOICE,
  CONTACT_INVOICE_LIST_COLUMN_INVOICE_DATE,
  CONTACT_INVOICE_LIST_COLUMN_JOB_DESCRIPTION,
  CONTACT_INVOICE_LIST_COLUMN_JOB_SHEET,
  CONTACT_INVOICE_LIST_COLUMN_NUMBER,
  CONTACT_INVOICE_LIST_COLUMN_STATUS,
  CONTACT_INVOICE_LIST_COLUMN_VEND,
} from './constants';
import DownloadIcon from '../../icons/Download';
import { useRouter } from 'next/router';
import { useDeleteInvoiceMutation, useExportInvoiceMutation } from '../../api/invoice';

interface InvoiceListTableProps {
  className?: string;
  invoices: Invoice[];
}

function useColumnManagement() : [Column[], string[], (newIds: string[]) => void] {
  const dispatch = useDispatch();
  const { enabledColumns, enabledColumnsRestored } = useSelector((state) => state.contactInvoice);
  const { isVendConnected } = useSelector((state) => state.account);

  const columns = useMemo<Column[]>(() => [
    {
      id: CONTACT_INVOICE_LIST_COLUMN_ID,
      label: 'ID',
    },
    {
      id: CONTACT_INVOICE_LIST_COLUMN_INVOICE,
      label: 'Invoice',
    },
    {
      id: CONTACT_INVOICE_LIST_COLUMN_JOB_SHEET,
      label: 'Job sheet',
    },
    {
      id: CONTACT_INVOICE_LIST_COLUMN_STATUS,
      label: 'Status',
    },
    {
      id: CONTACT_INVOICE_LIST_COLUMN_VEND,
      label: 'Vend',
    },
    {
      id: CONTACT_INVOICE_LIST_COLUMN_INVOICE_DATE,
      label: 'Invoice date',
    },
    {
      id: CONTACT_INVOICE_LIST_COLUMN_NUMBER,
      label: 'Number',
    },
    {
      id: CONTACT_INVOICE_LIST_COLUMN_CONTACT_INVOICE,
      label: 'Contact',
    },
    {
      id: CONTACT_INVOICE_LIST_COLUMN_JOB_DESCRIPTION,
      label: 'Job description',
    },
    {
      id: CONTACT_INVOICE_LIST_COLUMN_AMOUNT,
      label: 'Amount',
    },
  ].filter(({ id }) => {
    if (isVendConnected) {
      return true;
    }

    return id !== CONTACT_INVOICE_LIST_COLUMN_VEND;
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

const getEmailStatusIcon = (invoice: Invoice, theme: ThemeType): JSX.Element => (
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

const InvoiceListTable: FC<InvoiceListTableProps> = (props) => {
  const { className, invoices, ...other } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const confirm = useConfirm();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [exportInvoice] = useExportInvoiceMutation();
  const { organisation, isVendConnected } = useSelector((state) => state.account);
  const { selectedRange, isLoading, limit, page, total, searchText, statusFilter, orderBy, order } = useSelector((state) => state.contactInvoice);
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [query, setQuery] = useState<string>('');
  const [statusOptions] = useState<StatusFilter[]>([
    {
      value: 'all',
      label: 'All'
    },
    ...STATUS_FILTERS
  ]);
  const [columns, selectedColumns, handleChangeColumns] = useColumnManagement();

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
    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    dispatch(setStatusFilter(value));
  };

  const handleSortChange = (orderBy: string, order: SortDirection): void => {
    dispatch(setOrder(orderBy, order));
  };

  const handleSelectAllInvoices = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedInvoices(event.target.checked
      ? invoices.map((contact) => contact.id)
      : []);
  };

  const handleSelectOneInvoice = (event: ChangeEvent<HTMLInputElement>, invoiceId: number): void => {
    if (!selectedInvoices.includes(invoiceId)) {
      setSelectedInvoices((prevSelected) => [...prevSelected, invoiceId]);
    } else {
      setSelectedInvoices((prevSelected) => prevSelected.filter((id) => id !== invoiceId));
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

  const handleDelete = (invoice: Invoice) => {
    confirm({ description: `This will permanently delete ${invoice.prefixed_invoice_no}` })
      .then(async () => {
        await deleteInvoice({
          organisationId: organisation.id,
          id: parseInt(invoice.id.toString(), 10)
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const exportInvoices:any = useCallback(async () => {
    try {
      // TODO: move to the slice
      const data = { ...selectedRange,
        filter: searchText,
        status: statusFilter
      };
      const response:any = await exportInvoice({ organisationId: organisation.id, body: data });
      const csv = new Blob([response.data], {
        type: 'application/csv'
      });
      const fileName = `Invoices_export_${selectedRange.from}_${selectedRange.to}.csv`;
      saveAs(csv, fileName);
    } catch (err) {
      console.error(err);
    }
  }, [organisation, selectedRange, searchText, statusFilter]);

  // Usually query is done on backend with indexing solutions
  const enableBulkActions = selectedInvoices.length > 0;
  const selectedSomeInvoices = selectedInvoices.length > 0
    && selectedInvoices.length < invoices.length;
  const selectedAllInvoices = selectedInvoices.length === invoices.length;

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
              value={statusFilter || ''}
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
          <Box flexGrow={1} />
          <Box
            sx={{
              display: 'flex'
            }}
          >
            <Button
              color="primary"
              startIcon={<DownloadIcon fontSize="small" />}
              onClick={exportInvoices}
              sx={{ m: 1 }}
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
                      checked={selectedAllInvoices}
                      indeterminate={selectedSomeInvoices}
                      onChange={handleSelectAllInvoices}
                    />
                  </TableCell>
                  {
                    selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_ID) && (
                      <TableCell>
                        ID
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_INVOICE) && (
                      <TableCell align="center">
                        Invoice
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_JOB_SHEET) && (
                      <TableCell align="center">
                        Job sheet
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_STATUS) && (
                      <TableCell align="center">
                        Status
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_VEND) && isVendConnected && (
                      <TableCell align="center">
                        Vend
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_INVOICE_DATE) && (
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
                    selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_NUMBER) && (
                      <TableCell
                        sortDirection={orderBy === 'invoice_no' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'invoice_no'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('invoice_no', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Number
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_CONTACT_INVOICE) && (
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
                    selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_JOB_DESCRIPTION) && (
                      <TableCell
                        sortDirection={orderBy === 'job_template_name' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'job_template_name'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('job_template_name', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Job description
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_AMOUNT) && (
                      <TableCell>
                        Amount
                      </TableCell>
                    )
                  }
                  <TableCell>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => {
                  const isInvoiceSelected = selectedInvoices.includes(invoice.id);

                  return (
                    <TableRow
                      hover
                      key={invoice.id}
                      selected={isInvoiceSelected}
                      onClick={() => router.push(`/invoices/${invoice.id}`)}
                      sx={{
                        cursor: 'pointer'
                      }}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isInvoiceSelected}
                          onChange={(event) => handleSelectOneInvoice(event, invoice.id)}
                          value={isInvoiceSelected}
                        />
                      </TableCell>
                      {
                        selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_ID) && (
                          <TableCell>
                            {invoice.id}
                          </TableCell>
                        )
                      }
                      {
                        selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_INVOICE) && (
                          <TableCell align="center">
                            {invoice.is_invoice_sent && invoice.is_invoice_sheet_attached
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
                        selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_JOB_SHEET) && (
                          <TableCell align="center">
                            {invoice.is_invoice_sent && invoice.is_job_sheet_attached
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
                        selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_STATUS) && (
                          <TableCell align="center">
                            <InvoiceStatusLabel invoice={invoice} />
                          </TableCell>
                        )
                      }
                      {selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_VEND) && isVendConnected && (
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
                      )}
                      {
                        selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_INVOICE_DATE) && (
                          <TableCell>
                            {moment(invoice.send_date).format('DD MMM YYYY')}
                          </TableCell>
                        )
                      }
                      {
                        selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_NUMBER) && (
                          <TableCell>
                            {invoice.prefixed_invoice_no}
                          </TableCell>
                        )
                      }
                      {
                        selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_CONTACT_INVOICE) && (
                          <TableCell>
                            {`${invoice.contact_first_name} ${invoice.contact_last_name}`}
                          </TableCell>
                        )
                      }
                      {
                        selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_JOB_DESCRIPTION) && (
                          <TableCell>
                            {invoice.job_template_name}
                          </TableCell>
                        )
                      }
                      {
                        selectedColumns.includes(CONTACT_INVOICE_LIST_COLUMN_AMOUNT) && (
                          <TableCell>
                            {numeral(invoice.total_amount)
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
                        >
                          <IconButton
                            sx={{
                              color: 'error.main',
                            }}
                            onClick={() => handleDelete(invoice)}
                          >
                            <TrashIcon />
                          </IconButton>
                          <InvoiceListTableRowMenu onEmail={() => router.push(`/invoices/${invoice.id}/resend`)} />
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
      <InvoiceListBulkActions
        open={enableBulkActions}
        selected={selectedInvoices}
      />
    </>
  );
};

InvoiceListTable.propTypes = {
  className: PropTypes.string,
  invoices: PropTypes.array.isRequired
};

export default InvoiceListTable;
