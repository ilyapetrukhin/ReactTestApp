import React, { FC, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  TableCell,
  TableRow,
  Typography,
  Box,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { getEntityAddress } from 'src/utils/address';
import { Contact, VendContact } from 'src/types/contact';
import { getTitleForContact } from '../../../utils';

interface ContactIgnoreRowProps {
  contact: VendContact | Contact;
  contactType: 'vendContact' | 'contact';
  ignored: boolean;
  onChangeIgnore: (ignored: boolean) => void;
}

const ContactIgnoreRow: FC<ContactIgnoreRowProps> = memo(
  ({ contact, contactType, ignored, onChangeIgnore }) => {
    const address = useMemo(
      () => getEntityAddress(contact, contactType).trim(),
      [contact]
    );

    const name = useMemo(
      () => getTitleForContact(contact, contactType),
      [contact]
    );

    const handleChange = useCallback(
      (event) => {
        onChangeIgnore(event.target.checked);
      },
      [onChangeIgnore]
    );

    return (
      <TableRow>
        <TableCell>
          <Box
            display="flex"
            sx={{ flexDirection: { xs: 'column', md: 'row' } }}
          >
            {name != null && name.trim().length !== 0 && (
              <Typography
                color="textPrimary"
                variant="subtitle2"
                fontWeight="bold"
                sx={{ mr: 1 }}
              >
                {name}
                {address.length !== 0 ? ' | ' : ''}
              </Typography>
            )}
            <Typography
              color="textPrimary"
              variant="body1"
            >
              {address}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="right">
          <FormControlLabel
            onChange={handleChange}
            control={(
              <Switch
                checked={ignored}
                color="primary"
                edge="end"
                name="direction"
              />
            )}
            labelPlacement="start"
            label={(
              <div>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Ignore contact
                </Typography>
              </div>
            )}
          />
        </TableCell>
      </TableRow>
    );
  }
);

ContactIgnoreRow.propTypes = {
  // @ts-ignore
  contact: PropTypes.object.isRequired,
  // @ts-ignore
  contactType: PropTypes.string.isRequired,
  ignored: PropTypes.bool.isRequired,
  onChangeIgnore: PropTypes.func.isRequired,
};

export default ContactIgnoreRow;
