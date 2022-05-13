import React, { memo } from 'react';
import type { FC } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@mui/material';
import type { Invoice } from 'src/types/job';

interface InvoiceRecipientItemsProps {
  invoices: Invoice[];
}

const InvoiceRecipientItems: FC<InvoiceRecipientItemsProps> = (props) => {
  const { invoices, ...other } = props;

  return (
    <Box {...other}>
      <List>
        {invoices.map((invoice) => (
          <ListItem
            disableGutters
            key={invoice.id}
          >
            {invoice.product?.vend_product && (
              <ListItemAvatar sx={{ pr: 2 }}>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    height: 50,
                    justifyContent: 'center',
                    overflow: 'hidden',
                    width: 50,
                    '& img': {
                      width: '100%',
                      height: 'auto'
                    }
                  }}
                >
                  <img
                    alt={invoice.product.vend_product.image_thumbnail_url}
                    src={invoice.product.vend_product.image_thumbnail_url}
                  />
                </Box>
              </ListItemAvatar>
            )}
            <ListItemText
              primary={(
                <Typography
                  color="textPrimary"
                  sx={{ fontWeight: 'fontWeightBold' }}
                  variant="subtitle2"
                >
                  {invoice.name}
                </Typography>
              )}
              secondary={(
                <Typography
                  color="textSecondary"
                  sx={{ mt: 1 }}
                  variant="body1"
                >
                  x 1
                </Typography>
              )}
            />
            <ListItemSecondaryAction>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {numeral(invoice.gst_cost)
                  .format('$0,0.00')}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

InvoiceRecipientItems.propTypes = {
  // @ts-ignore
  invoices: PropTypes.object.isRequired
};

export default memo(InvoiceRecipientItems);
