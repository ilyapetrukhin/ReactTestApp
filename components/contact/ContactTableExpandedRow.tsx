import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Box, Button, FormControlLabel, Grid, Link, Switch, Typography } from '@mui/material';
import type { Contact } from '../../types/contact';
import Collapse from '@mui/material/Collapse';
import ContactPoolsInfo from './ContactPoolsInfo';
import { getCommaSeparatedPhones } from '../../utils/contact';

interface ContactTableExpandedRowProps {
  contact: Contact;
  isExpanded: boolean;
  onChangeVisibility?: (contact: Contact) => void;
}

const ContactTableExpandedRow: FC<ContactTableExpandedRowProps> = (props) => {
  const { contact, isExpanded, onChangeVisibility, ...other } = props;

  const handleChangeVisibility = (contact: Contact): void => {
    if (onChangeVisibility) {
      onChangeVisibility(contact);
    }
  };

  return (
    <Collapse
      in={isExpanded}
      timeout="auto"
      unmountOnExit
      {...other}
    >
      <Grid
        sx={{
          p: 2
        }}
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          xl={4}
          sx={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Typography
            sx={{ fontWeight: 'fontWeightBold' }}
            color="textSecondary"
            variant="subtitle2"
          >
            Details
          </Typography>
          <Typography
            color="textPrimary"
            ml={3}
            variant="body2"
          >
            {contact.full_name}
            <br />
            {contact.company_name}
            <br />
            {contact.address_street_one}
            <br />
            {contact.address_city}
            <br />
            {contact.address_state}
            {' '}
            {contact.address_postcode}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          xl={4}
          sx={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Typography
            sx={{ fontWeight: 'fontWeightBold', minWidth: '45px' }}
            color="textSecondary"
            variant="subtitle2"
            mr={3}
          >
            Pools
          </Typography>
          <ContactPoolsInfo pools={contact.pools} />
        </Grid>
        <Grid
          item
          xs={6}
          lg={3}
          xl={2}
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <Typography
              sx={{ fontWeight: 'fontWeightBold', minWidth: '45px' }}
              color="textSecondary"
              variant="subtitle2"
              mr={3}
            >
              Phone
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              {contact.phones.length ? getCommaSeparatedPhones(contact.phones) : '-'}
            </Typography>
          </Box>
          <Box
            pt={2}
            sx={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <Typography
              sx={{ fontWeight: 'fontWeightBold', minWidth: '45px' }}
              color="textSecondary"
              variant="subtitle2"
              mr={3}
            >
              Email
            </Typography>
            <Link
              color="primary"
              variant="body2"
            >
              {contact.email}
            </Link>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          lg={3}
          xl={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box>
            <NextLink
              href={`/contacts/${contact.id}/details`}
              passHref
            >
              <Button
                color="primary"
                sx={{ m: 1 }}
                variant="contained"
              >
                View details
              </Button>
            </NextLink>
          </Box>
          <FormControlLabel
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
            }}
            control={(
              <Switch
                checked={!!contact.visibility}
                edge="start"
                name="visibility"
                onChange={() => handleChangeVisibility(contact)}
                value={contact.visibility}
              />
            )}
            label="Active"
          />
        </Grid>
      </Grid>
    </Collapse>
  );
};

ContactTableExpandedRow.propTypes = {
  // @ts-ignore
  contact: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onChangeVisibility: PropTypes.func,
};

export default ContactTableExpandedRow;
