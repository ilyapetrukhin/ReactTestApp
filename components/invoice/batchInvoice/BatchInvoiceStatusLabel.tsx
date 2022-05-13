/* eslint-disable react/prop-types */
import React, { FC, memo } from 'react';
import moment from 'moment';
import Label from 'src/components/Label';
import { BatchInvoice } from 'src/types/contactInvoice';

interface BatchInvoiceStatusLabelProps {
  invoice: BatchInvoice
}

const BatchInvoiceStatusLabel: FC<BatchInvoiceStatusLabelProps> = memo(({ invoice }) => {
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
});

export default BatchInvoiceStatusLabel;
