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

interface ContactListBulkActionsProps {
  onDelete?: () => void;
  onMarkAsActive?: () => void;
  onMarkAsInactive?: () => void;
  open?: boolean;
  selected: number[];
}

const ContactListBulkActions: FC<ContactListBulkActionsProps> = (props) => {
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
                sm: 'none',
                md: 'block'
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
                onClick={onMarkAsActive}
                startIcon={<CheckIcon fontSize="small" />}
                variant="text"
              >
                Mark as active
              </Button>
              <Button
                color="primary"
                onClick={onMarkAsInactive}
                startIcon={<XIcon fontSize="small" />}
                variant="text"
              >
                Mark as inactive
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

ContactListBulkActions.propTypes = {
  onDelete: PropTypes.func,
  onMarkAsActive: PropTypes.func,
  onMarkAsInactive: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.array.isRequired
};

ContactListBulkActions.defaultProps = {
  open: false
};

export default ContactListBulkActions;
