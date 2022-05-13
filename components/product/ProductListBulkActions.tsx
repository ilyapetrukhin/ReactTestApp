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

interface ProductListBulkActionsProps {
  onDelete?: (action:string) => Promise<void>;
  onMarkAsActive?: (action:string) => Promise<void>;
  onMarkAsInactive?: (action:string) => Promise<void>;
  open?: boolean;
  selected: number[];
}

const ProductListBulkActions: FC<ProductListBulkActionsProps> = (props) => {
  const {
    onDelete,
    onMarkAsActive,
    onMarkAsInactive,
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
                onClick={() => onMarkAsActive('visible')}
                startIcon={<CheckIcon fontSize="small" />}
                variant="text"
              >
                Mark as active
              </Button>
              <Button
                color="primary"
                onClick={() => onMarkAsInactive('invisible')}
                startIcon={<XIcon fontSize="small" />}
                variant="text"
              >
                Mark as inactive
              </Button>
              <Button
                sx={{
                  color: 'error.main',
                }}
                onClick={() => onDelete('delete')}
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

ProductListBulkActions.propTypes = {
  onDelete: PropTypes.func,
  onMarkAsActive: PropTypes.func,
  onMarkAsInactive: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.array.isRequired
};

ProductListBulkActions.defaultProps = {
  open: false
};

export default ProductListBulkActions;
