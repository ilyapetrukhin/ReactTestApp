import React, { useCallback, useMemo, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SortDirection,
  TableSortLabel,
  Typography,
  styled,
} from '@mui/material';
import numeral from 'numeral';
import lodashOrderBy from 'lodash/orderBy';

import { ContactInvoice } from 'src/types/batchQueue';
import { Scrollbar } from 'src/components/scrollbar';
import moment from 'moment';
import InvoiceAction from './ContactInvoceListAction';

interface InvoiceListTableProps {
  contactInvoices: ContactInvoice[];
  isActive: boolean;
  contactId: number;
}

type OrderBy = 'total' | 'invoiceNo' | 'sendDate' | 'technician' | 'jobTemplateName';

interface InvoiceFormatted {
  id: number;
  invoiceNo: string;
  sendDate: string;
  sendDateText: string;
  technician: string;
  jobTemplateName: string;
  total: number;
  totalText: string;
}

const CheckboxStyled = styled(Checkbox)(({ theme }) => ({
  '& .MuiIconButton-label': {
    color: theme.palette.primary.light
  },
}));

const ContactInvoicesListTable: FC<InvoiceListTableProps> = ({
  contactId,
  contactInvoices,
  isActive,
}) => {
  const [selectedInvoiceIds, setSelectedInvoices] = useState<number[]>([]);
  const [orderBy, setOrderBy] = useState<OrderBy>('invoiceNo');
  const [order, setOrder] = useState<SortDirection>('asc');
  const router = useRouter();

  const invoicesFormatted = useMemo<InvoiceFormatted[]>(
    () => contactInvoices.map((i) => ({
      id: i.id,
      invoiceNo: i.invoice_no,
      sendDate: i.send_date,
      sendDateText: moment(i.send_date).format('DD MMM YYYY'),
      technician: i.technician,
      jobTemplateName: i.job_template_name,
      total: i.total,
      totalText: numeral(i.total).format('$0,0.00'),
    })),
    [contactInvoices]
  );

  const invoicesSorted = useMemo<InvoiceFormatted[]>(
    () => lodashOrderBy(invoicesFormatted, [orderBy], [order]),
    [order, orderBy, invoicesFormatted]
  );

  const handleSortChange = useCallback(
    (orderBy: OrderBy, order: SortDirection) => {
      setOrder(order);
      setOrderBy(orderBy);
    },
    []
  );

  const handleSelectAllInvoices = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedInvoices(
        event.target.checked ? contactInvoices.map((contact) => contact.id) : []
      );
    },
    []
  );

  const handleSelectOneInvoice = useCallback(
    (invoiceId: number) => {
      if (!selectedInvoiceIds.includes(invoiceId)) {
        setSelectedInvoices((prevSelected) => [...prevSelected, invoiceId]);
      } else {
        setSelectedInvoices((prevSelected) => prevSelected.filter((id) => id !== invoiceId));
      }
    },
    [selectedInvoiceIds]
  );

  const goToBatchPreviewInvoice = useCallback(() => {
    router.push(
      `/invoices/batch/preview?contact_id=${contactId}&invoices_ids=${selectedInvoiceIds.join(
        ','
      )}`
    );
  }, [contactId, selectedInvoiceIds]);

  const selectedInvoices = useMemo(
    () => contactInvoices.filter(({ id }) => selectedInvoiceIds.includes(id)),
    [selectedInvoiceIds]
  );

  const selectedSomeInvoices = selectedInvoiceIds.length > 0
    && selectedInvoiceIds.length < contactInvoices.length;
  const selectedAllInvoices = selectedInvoiceIds.length === contactInvoices.length;

  const openActionDrawer = selectedInvoiceIds.length > 0 && isActive;

  return (
    <>
      <div>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table
              size="medium"
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <CheckboxStyled
                      checked={selectedAllInvoices}
                      indeterminate={selectedSomeInvoices}
                      onChange={handleSelectAllInvoices}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'invoiceNo'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange(
                        'invoiceNo',
                        order === 'asc' ? 'desc' : 'asc'
                      )}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight="bold"
                      >
                        Invoice no.
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'sendDate'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange(
                        'sendDate',
                        order === 'asc' ? 'desc' : 'asc'
                      )}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight="bold"
                      >
                        Date of service
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'jobTemplateName'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange(
                        'jobTemplateName',
                        order === 'asc' ? 'desc' : 'asc'
                      )}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight="bold"
                      >
                        Job
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'technician'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange(
                        'technician',
                        order === 'asc' ? 'desc' : 'asc'
                      )}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight="bold"
                      >
                        Technician
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === 'total' ? order : null}
                  >
                    <TableSortLabel
                      active={orderBy === 'total'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange(
                        'total',
                        order === 'asc' ? 'desc' : 'asc'
                      )}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight="bold"
                      >
                        Amount
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoicesSorted.map((invoice) => {
                  const isInvoiceSelected = selectedInvoiceIds.includes(
                    invoice.id
                  );
                  return (
                    <TableRow
                      hover
                      key={invoice.id}
                      selected={isInvoiceSelected}
                      onClick={() => handleSelectOneInvoice(invoice.id)}
                      sx={{
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CheckboxStyled
                          checked={isInvoiceSelected}
                          onChange={() => handleSelectOneInvoice(invoice.id)}
                          value={isInvoiceSelected}
                        />
                      </TableCell>
                      <TableCell>{invoice.invoiceNo}</TableCell>
                      <TableCell>{invoice.sendDateText}</TableCell>
                      <TableCell>{invoice.jobTemplateName}</TableCell>
                      <TableCell>{invoice.technician}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                          fontWeight="bold"
                        >
                          {invoice.totalText}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        {
          openActionDrawer && (
            <InvoiceAction
              selectedInvoices={selectedInvoices}
              onBatchPreviewInvoice={goToBatchPreviewInvoice}
            />
          )
        }
      </div>
    </>
  );
};

ContactInvoicesListTable.propTypes = {
  contactId: PropTypes.number.isRequired,
  contactInvoices: PropTypes.array.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default ContactInvoicesListTable;
