import React, { memo, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Theme,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import { Trash as TrashIcon } from 'react-feather';
import { Invoice as InvoiceType } from 'src/types/job';

interface InvoiceProps {
  invoice: InvoiceType;
  onEdit?: (invoice: InvoiceType) => void;
  onDelete?: (invoiceId: number) => void;
  sx?: SxProps<Theme>;
}

const InvoiceRoot = styled('div')(
  () => (
    {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }
  )
);

const Invoice: FC<InvoiceProps> = (props) => {
  const {
    invoice,
    onEdit,
    onDelete,
    ...other
  } = props;

  const [cost, setCost] = useState<number>(invoice.gst_cost);
  const [quantity, setQuantity] = useState<number>(invoice.quantity);

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let originalCost = invoice.original_cost;
    let gstCost = invoice.gst_cost;
    const qty = parseFloat(event.target.value);

    if (qty !== 0) {
      if (!originalCost) {
        originalCost = invoice.gst_cost;
      }
      gstCost = originalCost
        ? originalCost * qty
        : gstCost * qty;
    }

    setQuantity(qty);
    setCost(gstCost);

    if (onEdit) {
      onEdit({
        ...invoice,
        gst_cost: gstCost,
        original_cost: originalCost,
        quantity: qty
      });
    }
  };

  const handleCostChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let originalCost = parseFloat(event.target.value);
    if (quantity !== 1) {
      originalCost /= quantity;
    }

    setCost(parseFloat(event.target.value));

    if (onEdit) {
      onEdit({
        ...invoice,
        gst_cost: parseFloat(event.target.value),
        original_cost: originalCost
      });
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      if (onDelete) {
        onDelete(invoice.id);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <InvoiceRoot {...other}>
      <Box
        sx={{
          maxWidth: 80
        }}
      >
        <TextField
          size="small"
          label="Quantity"
          name="price"
          onChange={handleQuantityChange}
          type="number"
          value={quantity}
          variant="outlined"
        />
      </Box>
      <Box
        ml={2}
      >
        <Typography
          color="textPrimary"
          variant="body1"
        >
          {invoice.name}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        ml={2}
        sx={{
          maxWidth: 150
        }}
      >
        <TextField
          placeholder="Price"
          size="small"
          label="Price"
          name="price"
          onChange={handleCostChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                $
              </InputAdornment>
            )
          }}
          type="number"
          value={cost}
          variant="outlined"
        />
      </Box>
      <Box
        ml={2}
      >
        <IconButton
          sx={{
            color: 'error.main',
          }}
          onClick={handleDelete}
        >
          <TrashIcon fontSize="small" />
        </IconButton>
      </Box>
    </InvoiceRoot>
  );
};

Invoice.propTypes = {
  // @ts-ignore
  invoice: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  sx: PropTypes.object
};

export default memo(Invoice);
