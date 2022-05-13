/* eslint-disable react/prop-types */
import React, { FC, memo } from 'react';
import moment from 'moment';
import Label, { LabelProps } from 'src/components/Label';
import { BatchInvoice } from 'src/types/contactInvoice';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material';

interface BatchInvoiceStatusLabelProps extends LabelProps {
  invoice: BatchInvoice,
  sx?: SxProps<Theme>;
}

const BatchInvoiceStatusLabel: FC<BatchInvoiceStatusLabelProps> = memo(({ invoice, ...props }) => {
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
    <Label
      color={color}
      {...props}
    >
      {text}
    </Label>
  );
});

export default BatchInvoiceStatusLabel;
