import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import type { FC } from 'react';
import {
  Theme,
  Box,
} from '@mui/material';
import type { SxProps } from '@mui/system';
import type { Invoice } from 'src/types/contactInvoice';
import Label from '../../Label';
import moment from 'moment/moment';

interface InvoiceStatusLabelProps {
  invoice: Invoice;
  sx?: SxProps<Theme>;
}

const map = {
  overdue: {
    color: 'error',
    text: 'Overdue'
  },
  batch: {
    color: 'secondary',
    text: 'Batch'
  },
  batched: {
    color: 'success',
    text: 'Batched'
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

const InvoiceStatusLabel: FC<InvoiceStatusLabelProps> = (props) => {
  const { invoice, ...rest } = props;

  const { text, color } = useMemo(
    () => {
      let invoiceStatus = invoice.is_invoice_paid ? 'paid' : 'unpaid';
      if (invoice.is_batch) {
        invoiceStatus = invoice.batch_invoice_id ? 'batched' : 'batch';
      } else if (!invoice.is_invoice_paid && moment(invoice.due_date).diff(moment()) < 0) {
        invoiceStatus = 'overdue';
      }

      return map[invoiceStatus];
    },
    [invoice, map],
  );

  return (
    <Box {...rest}>
      <Label color={color}>
        {text}
      </Label>
    </Box>
  );
};

InvoiceStatusLabel.propTypes = {
  // @ts-ignore
  invoice: PropTypes.object.isRequired,
};

export default memo(InvoiceStatusLabel);
