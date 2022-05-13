import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Drawer,
  Grid,
  Typography
} from '@mui/material';
import { Trash as TrashIcon } from 'react-feather';

interface ObservationGroupListBulkActionsProps {
  onDelete?: () => void;
  open?: boolean;
  selected: number[];
}

const ObservationGroupListBulkActions: FC<ObservationGroupListBulkActionsProps> = (props) => {
  const {
    onDelete,
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

ObservationGroupListBulkActions.propTypes = {
  onDelete: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.array.isRequired
};

ObservationGroupListBulkActions.defaultProps = {
  open: false
};

export default ObservationGroupListBulkActions;
