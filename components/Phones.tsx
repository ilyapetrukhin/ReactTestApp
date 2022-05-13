import React, {
  useRef,
  useState,
} from 'react';
import type { FC } from 'react';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Tooltip,
} from '@mui/material';
import { Phone as PhonesIcon } from 'react-feather';
import PropTypes from 'prop-types';
import type { Phone } from '../types/contact';

interface PhonesProps {
  phones: Phone[];
}

const Phones: FC<PhonesProps> = ({ phones }) => {
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
      <Tooltip title="Phones">
        <IconButton
          color="secondary"
          onClick={handleOpen}
          ref={ref}
        >
          <PhonesIcon />
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        PaperProps={{
          sx: { px: 1 },
        }}
      >
        <Box>
          <List disablePadding>
            {phones.map((phone) => (
              <ListItem
                disableGutters
                key={phone.id}
              >
                <ListItemText
                  primary={phone.phone_number}
                  primaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
};

Phones.propTypes = {
  phones: PropTypes.array.isRequired
};

export default Phones;
