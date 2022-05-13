import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';
import { Edit as EditIcon, Trash as TrashIcon } from 'react-feather';
import { IconButton, TableCell, TableRow, Typography } from '@mui/material';

interface EquipmentRowProps {
  name: string;
  type: string;
  brand: string;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const EquipmentRow: FC<EquipmentRowProps> = memo(
  ({ name, type, brand, isDeleting, onEdit, onDelete }) => (
    <TableRow>
      <TableCell>
        <Typography
          color="textPrimary"
          variant="body2"
        >
          {name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography
          color="textPrimary"
          variant="body2"
        >
          {type}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textPrimary"
          variant="body2"
        >
          {brand}
        </Typography>
      </TableCell>
      <TableCell
        align="right"
        sx={{ pr: 0 }}
      >
        <IconButton
          sx={{
            color: 'primary.main',
          }}
          onClick={onEdit}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          sx={{
            color: 'error.main',
          }}
          disabled={isDeleting}
          onClick={onDelete}
        >
          <TrashIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
);

EquipmentRow.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EquipmentRow;
