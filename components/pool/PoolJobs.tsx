import React, { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import NextLink from 'next/link';
import { format } from 'date-fns';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import ArrowRightIcon from '../../icons/ArrowRight';
import type { CustomerInvoice } from '../../types/customer';
import axios from '../../lib/axios';
import Label from '../Label';
import { Scrollbar } from '../scrollbar';

const PoolJobs: FC = (props) => {
  const isMountedRef = useIsMountedRef();
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);

  const getInvoices = useCallback(async () => {
    try {
      const response = await axios.get<{ invoices: CustomerInvoice[] }>('/api/customers/1/invoices');

      if (isMountedRef.current) {
        setInvoices(response.data.invoices);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getInvoices();
  }, []);

  return (
    <Card {...props}>
      <CardHeader
        title="Jobs"
      />
      <Divider />
      <Scrollbar>
        <Box sx={{ minWidth: 1150 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
                <TableCell>
                  Description
                </TableCell>
                <TableCell>
                  Payment Method
                </TableCell>
                <TableCell>
                  Total
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    #
                    {invoice.id}
                  </TableCell>
                  <TableCell>
                    {format(invoice.issueDate, 'dd/MM/yyyy | HH:mm')}
                  </TableCell>
                  <TableCell>
                    {invoice.description}
                  </TableCell>
                  <TableCell>
                    {invoice.paymentMethod}
                  </TableCell>
                  <TableCell>
                    {invoice.currency}
                    {invoice.value}
                  </TableCell>
                  <TableCell>
                    <Label color="primary">
                      {invoice.status}
                    </Label>
                  </TableCell>
                  <TableCell align="right">
                    <NextLink
                      href="/dashboard/invoices/1"
                      passHref
                    >
                      <IconButton>
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={invoices.length}
        onPageChange={(): void => {
        }}
        onRowsPerPageChange={(): void => {
        }}
        page={0}
        rowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default PoolJobs;
