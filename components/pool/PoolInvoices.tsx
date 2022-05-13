import React, { useEffect, ChangeEvent, useMemo } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Card,
  Grid,
  SortDirection,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';
import { Scrollbar } from '../scrollbar';
import numeral from 'numeral';
import { useDispatch, useSelector } from 'src/store';
import { getPoolInvoices, selectInvoicesRange, setInvoicesLimit, setInvoicesOrder, setInvoicesPage } from 'src/slices/poolDetail';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import moment from 'moment/moment';
import InvoiceStatusLabel from 'src/components/widgets/invoice/InvoiceStatusLabel';

const PoolInvoices: FC = (props) => {
  const router = useRouter();
  const { poolId } = router.query;
  const { organisation } = useSelector((state) => state.account);
  const { invoices, selectedInvoicesRange, isInvoicesLoading, invoicesTotal, invoicesPage, invoicesLimit, invoicesOrder, invoicesOrderBy } = useSelector((state) => state.poolDetail);
  const dispatch = useDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(getPoolInvoices(organisation.id, parseInt(poolId, 10), selectedInvoicesRange, invoicesLimit, invoicesPage, invoicesOrderBy));
  }, [organisation, getPoolInvoices, poolId, selectedInvoicesRange, invoicesLimit, invoicesPage, invoicesOrderBy]);

  const minDate = useMemo(
    () => moment(selectedInvoicesRange.from).toDate(),
    [selectedInvoicesRange.from]
  );

  const maxDate = useMemo(
    () => moment(selectedInvoicesRange.to).toDate(),
    [selectedInvoicesRange.to]
  );

  const handleFromDateChange = (date: Date): void => {
    dispatch(selectInvoicesRange(date, new Date(selectedInvoicesRange.to)));
  };

  const handleToDateChange = (date: Date): void => {
    dispatch(selectInvoicesRange(new Date(selectedInvoicesRange.from), date));
  };

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setInvoicesPage(newPage));
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setInvoicesLimit(parseInt(event.target.value, 10)));
  };

  const handleSortChange = (orderBy: string, order: SortDirection): void => {
    dispatch(setInvoicesOrder(orderBy, order));
  };

  return (
    <>
      <Card
        {...props}
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
                  loading={isInvoicesLoading}
                  maxDate={maxDate}
                  onChange={handleFromDateChange}
                  value={selectedInvoicesRange.from}
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
                  loading={isInvoicesLoading}
                  minDate={minDate}
                  onChange={handleToDateChange}
                  value={selectedInvoicesRange.to}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    ID
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                  <TableCell
                    sortDirection={invoicesOrderBy === 'send_date' ? invoicesOrder : false}
                  >
                    <TableSortLabel
                      active={invoicesOrderBy === 'send_date'}
                      direction={invoicesOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('send_date', invoicesOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      Invoice date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={invoicesOrderBy === 'invoice_no' ? invoicesOrder : false}
                  >
                    <TableSortLabel
                      active={invoicesOrderBy === 'invoice_no'}
                      direction={invoicesOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('invoice_no', invoicesOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      Number
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={invoicesOrderBy === 'contact_name' ? invoicesOrder : false}
                  >
                    <TableSortLabel
                      active={invoicesOrderBy === 'contact_name'}
                      direction={invoicesOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('contact_name', invoicesOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      Contact
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={invoicesOrderBy === 'job_template_name' ? invoicesOrder : false}
                  >
                    <TableSortLabel
                      active={invoicesOrderBy === 'job_template_name'}
                      direction={invoicesOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('job_template_name', invoicesOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      Job description
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow
                    hover
                    key={invoice.id}
                    onClick={() => router.push(`/invoice/${invoice.id}/detail`)}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {invoice.id}
                    </TableCell>
                    <TableCell>
                      <InvoiceStatusLabel invoice={invoice} />
                    </TableCell>
                    <TableCell>
                      {moment(invoice.send_date).format('DD MMM YYYY')}
                    </TableCell>
                    <TableCell>
                      {invoice.prefixed_invoice_no}
                    </TableCell>
                    <TableCell>
                      {`${invoice.contact_first_name} ${invoice.contact_last_name}`}
                    </TableCell>
                    <TableCell>
                      {invoice.job_template_name}
                    </TableCell>
                    <TableCell>
                      {numeral(invoice.total_amount)
                        .format('$0,0.00')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={invoicesTotal}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={invoicesPage}
              rowsPerPage={invoicesLimit}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

export default PoolInvoices;
