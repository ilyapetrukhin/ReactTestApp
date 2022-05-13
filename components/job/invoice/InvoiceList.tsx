import React, { memo } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  ListItem,
  List,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { Invoice } from 'src/types/job';
import { InvoiceSummary } from 'src/components/widgets/invoice';
import InvoiceAdd from './InvoiceAdd';
import InvoiceItem from './Invoice';

interface InvoicesListProps {
  invoices: Invoice[];
  onAdd?: (invoice: Invoice | null) => void;
  onEdit?: (invoice: Invoice | null) => void;
  onDelete?: (invoiceId: number) => void;
}

const InvoicesListRoot = styled('div')();

const InvoiceList: FC<InvoicesListProps> = (props) => {
  const { invoices, onAdd, onDelete, onEdit } = props;

  const handleInvoiceEdit = (invoice: Invoice): void => {
    if (onEdit) {
      onEdit(invoice);
    }
  };

  const handleAddInvoice = (invoice: Invoice): void => {
    if (onAdd) {
      onAdd(invoice);
    }
  };

  const handleDeleteInvoice = (invoiceId: number): void => {
    if (onDelete) {
      onDelete(invoiceId);
    }
  };

  return (
    <InvoicesListRoot>
      <List component="div">
        {invoices.map((invoice) => (
          <ListItem
            sx={{
              py: 2
            }}
            key={invoice.id}
            disableGutters
            divider
          >
            <InvoiceItem
              invoice={invoice}
              key={invoice.id}
              onEdit={handleInvoiceEdit}
              onDelete={handleDeleteInvoice}
            />
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          mt: 1
        }}
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            sm={8}
            xs={12}
          >
            <InvoiceAdd onAdd={handleAddInvoice} />
          </Grid>
          <Grid
            item
            sm={4}
            xs={12}
          >
            <InvoiceSummary invoices={invoices} />
          </Grid>
        </Grid>
      </Box>
    </InvoicesListRoot>
  );
};

InvoiceList.propTypes = {
  // @ts-ignore
  invoices: PropTypes.array.isRequired,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default memo(InvoiceList);
