import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Drawer,
  Grid,
  Typography
} from '@mui/material';
import CheckIcon from 'src/icons/Check';
import { Trash as TrashIcon } from 'react-feather';
import XIcon from 'src/icons/X';

interface InvoiceListBulkActionsProps {
  onDelete?: () => void;
  onMarkPaid?: () => void;
  onMarkUnpaid?: () => void;
  open?: boolean;
  selected: number[];
}

const InvoiceListBulkActions: FC<InvoiceListBulkActionsProps> = (props) => {
  const {
    onDelete,
    onMarkPaid,
    onMarkUnpaid,
    open,
    selected,
    ...other
  } = props;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      PaperProps={{ elevation: 1 }}
      variant="persistent"
    >
      <Box
        sx={{ p: 2 }}
        {...other}
      >
        <Grid
          alignItems="center"
          container
          spacing={2}
        >
          <Grid
            item
            md={3}
            sx={{
              display: {
                xs: 'none',
                md: 'flex'
              }
            }}
          >
            <Typography
              color="textSecondary"
              variant="subtitle1"
            >
              {selected.length}
              {' '}
              selected
            </Typography>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                '& > * + *': {
                  ml: 2
                }
              }}
            >
              <Button
                color="primary"
                onClick={onMarkPaid}
                startIcon={<CheckIcon fontSize="small" />}
                variant="text"
              >
                Mark Paid
              </Button>
              <Button
                color="primary"
                onClick={onMarkUnpaid}
                startIcon={<XIcon fontSize="small" />}
                variant="text"
              >
                Mark Unpaid
              </Button>
              <Button
                sx={{
                  color: 'error.main',
                }}
                onClick={onDelete}
                startIcon={<TrashIcon fontSize="small" />}
                variant="text"
              >
                Delete
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

InvoiceListBulkActions.propTypes = {
  onDelete: PropTypes.func,
  onMarkPaid: PropTypes.func,
  onMarkUnpaid: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.array.isRequired
};

InvoiceListBulkActions.defaultProps = {
  open: false
};

export default InvoiceListBulkActions;
