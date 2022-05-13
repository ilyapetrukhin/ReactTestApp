import React, { memo } from 'react';
import type { FC } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Box,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
  Theme
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Invoice } from 'src/types/job';
import type { InvoiceRecipient } from 'src/types/invoice';
import type { SxProps } from '@mui/system';

interface InvoiceItemsProps {
  recipients: InvoiceRecipient[];
  invoices: Invoice[];
  onRecipientChange: (invoice: Invoice, recipient: InvoiceRecipient) => void;
  sx?: SxProps<Theme>;
}

const InvoiceItems: FC<InvoiceItemsProps> = (props) => {
  const { recipients, invoices, onRecipientChange, ...other } = props;
  const theme = useTheme();

  const handleRecipientChange = (invoice: Invoice, recipient: InvoiceRecipient): void => {
    if (!find(recipient.products, { id: invoice.id })) {
      onRecipientChange(invoice, recipient);
    }
  };

  return (
    <Card {...other}>
      <CardHeader
        title="Invoice"
        subheader={(
          <Box
            mr={3}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'row'
            }}
          >
            {recipients.map((recipient) => (
              <Box
                ml={2.5}
              >
                <Tooltip
                  title={recipient.contact?.full_name}
                  placement="top"
                >
                  <Avatar
                    sx={{
                      fontSize: theme.typography.caption.fontSize,
                      backgroundColor: 'primary.main',
                      height: 22,
                      width: 22
                    }}
                  >
                    {recipient.number}
                  </Avatar>
                </Tooltip>
              </Box>
            ))}
          </Box>
        )}
      />
      <Divider />
      <CardContent>
        <List
          disablePadding
        >
          {invoices.map((invoice) => (
            <ListItem
              key={invoice.id}
            >
              <ListItemText
                primary={invoice.name}
                primaryTypographyProps={{
                  color: 'textPrimary',
                  variant: 'subtitle2'
                }}
                secondary={`x ${invoice.quantity}`}
              />
              <ListItemSecondaryAction
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                >
                  {numeral(invoice.gst_cost)
                    .format('$0,0.00')}
                </Typography>
                <RadioGroup
                  sx={{ flexDirection: 'row' }}
                >
                  {recipients.map((recipient) => (
                    <Radio
                      color="primary"
                      key={recipient.contact_id}
                      checked={Boolean(find(recipient.products, { id: invoice.id }))}
                      onClick={(): void => handleRecipientChange(invoice, recipient)}
                    />
                  ))}
                </RadioGroup>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

InvoiceItems.propTypes = {
  // @ts-ignore
  recipients: PropTypes.array.isRequired,
  // @ts-ignore
  invoices: PropTypes.array.isRequired,
  onRecipientChange: PropTypes.func,
  sx: PropTypes.object
};

export default memo(InvoiceItems);
