import React, {
  useRef,
  useState,
} from 'react';
import type { FC } from 'react';
import NextLink from 'next/link';
import {
  Box,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Tooltip,
} from '@mui/material';
import { Users as UsersIcon } from 'react-feather';
import PropTypes from 'prop-types';
import ContactIcon from 'src/icons/Contact';
import type { Contact } from '../types/contact';

interface ContactsProps {
  contacts: Contact[];
}

const Contacts: FC<ContactsProps> = ({ contacts }) => {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Contacts">
        <IconButton
          color="secondary"
          onClick={handleOpen}
          ref={ref}
        >
          <UsersIcon />
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        PaperProps={{
          sx: { p: 1 },
        }}
      >
        <Box>
          <MenuList>
            {contacts.map((contact) => (
              <MenuItem
                disableGutters
                key={contact.id}
              >
                <ListItemIcon>
                  <ContactIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={(
                    <NextLink
                      href={`/contacts/${contact.id}`}
                      passHref
                    >
                      <Link
                        color="textPrimary"
                        display="block"
                        underline="none"
                        noWrap
                        variant="subtitle2"
                      >
                        {contact.full_name}
                        {' '}
                        {contact.full_address}
                      </Link>
                    </NextLink>
                    )}
                />
              </MenuItem>
            ))}
          </MenuList>
        </Box>
      </Popover>
    </>
  );
};

Contacts.propTypes = {
  contacts: PropTypes.array.isRequired
};

export default Contacts;
