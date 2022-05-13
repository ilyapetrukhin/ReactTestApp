import React, { FC } from 'react';
import PropTypes from 'prop-types';

import { Grid, ListItem, Typography } from '@mui/material';

interface BatchInvoiceContentInfoListItemProps {
  label: string;
  text?: string;
  children?: React.ReactNode;
}

const BatchInvoiceContentInfoListItem: FC<BatchInvoiceContentInfoListItemProps> = ({ label, text, children }) => (
  <ListItem disableGutters>
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        xs={6}
        sm={2}
      >
        <Typography
          color="textSecondary"
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            flex: 1,
            wordBreak: 'break-word',
          }}
        >
          {label}
        </Typography>
      </Grid>
      <Grid
        item
        xs={6}
        sm={4}
      >
        {text != null && (
        <Typography
          color="textPrimary"
          variant="body2"
          sx={{ wordBreak: 'break-word' }}
        >
          {text}
        </Typography>
        )}
        {children}
      </Grid>
      <Grid
        item
        sm={6}
      />
    </Grid>
  </ListItem>
);

export default BatchInvoiceContentInfoListItem;

BatchInvoiceContentInfoListItem.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  children: PropTypes.node,
};
