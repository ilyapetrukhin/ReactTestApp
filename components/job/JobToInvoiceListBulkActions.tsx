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
import XIcon from 'src/icons/X';

interface JobToInvoiceListBulkActionsProps {
  onHide?: () => void;
  onUnHide?: () => void;
  open?: boolean;
  selected: number[];
}

const JobToInvoiceListBulkActions: FC<JobToInvoiceListBulkActionsProps> = (props) => {
  const {
    onHide,
    onUnHide,
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
                onClick={onHide}
                startIcon={<XIcon fontSize="small" />}
                variant="text"
              >
                Hide
              </Button>
              <Button
                color="primary"
                onClick={onUnHide}
                startIcon={<CheckIcon fontSize="small" />}
                variant="text"
              >
                Unhide
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

JobToInvoiceListBulkActions.propTypes = {
  onHide: PropTypes.func,
  onUnHide: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.array.isRequired
};

JobToInvoiceListBulkActions.defaultProps = {
  open: false
};

export default JobToInvoiceListBulkActions;
