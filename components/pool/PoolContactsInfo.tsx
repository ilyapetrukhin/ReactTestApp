import React, { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import type { Contact } from '../../types/contact';
import get from 'lodash/get';

interface PoolContactsInfoProps {
  contacts: Contact[];
}

const PoolContactsInfo: FC<PoolContactsInfoProps> = (props) => {
  const { contacts, ...other } = props;
  const [showAll, setShowAll] = useState<boolean>(false);

  return (
    <Box {...other}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {contacts.length > 0 && (
          contacts.slice(0, showAll ? contacts.length : 2).map((contact) => (
            <Box
              mb={1}
              key={contact.id}
            >
              <Typography
                color="textPrimary"
                variant="body2"
              >
                {`${get(contact, 'full_name')}`}
              </Typography>
              <Typography
                color="textPrimary"
                variant="body2"
              >
                {contact.full_address}
              </Typography>
            </Box>
          ))
        )}
        {contacts.length > 2 && (
          <Box
            sx={{
              mt: -1,
              ml: -1
            }}
          >
            <Button
              color="primary"
              onClick={() => setShowAll(!showAll)}
              type="button"
              variant="text"
              disableElevation
            >
              { showAll ? 'show less' : `and ${contacts.length - 2} more` }
            </Button>
          </Box>
        )}
      </Box>
      {contacts.length === 0 && (
        <Typography
          color="textPrimary"
          variant="body2"
        >
          There are no linked contacts
        </Typography>
      )}
    </Box>
  );
};

PoolContactsInfo.propTypes = {
  // @ts-ignore
  contacts: PropTypes.array.isRequired,
};

export default PoolContactsInfo;
