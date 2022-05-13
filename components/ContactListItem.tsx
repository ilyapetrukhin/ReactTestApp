import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';

import { ListItem, ListItemText, Box, Typography } from '@mui/material';

interface ContactListItemProps {
  name: string;
  address: string;
  email: string;
}

const ContactListItem : FC<ContactListItemProps> = memo(({ name, address, email }) => (
  <ListItem
    sx={{
      border: 1,
      borderColor: 'divider',
      borderRadius: 1,
      '& + &': {
        mt: 1,
      },
    }}
  >
    <ListItemText
      primary={name}
      primaryTypographyProps={{
        color: 'textPrimary',
        variant: 'subtitle2',
      }}
      secondary={(
        <Box>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {address}
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            {email}
          </Typography>
        </Box>
    )}
    />
  </ListItem>
));

export default ContactListItem;

ContactListItem.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};
