import React, { FC, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import {
  Box,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import { ContactMatch } from 'src/types/vendIntegration';
import { getEntityAddress } from 'src/utils/address';
import MatchesSelect from './MatchesSelect';
import { getTitleForContactMatch } from '../../../utils';

interface ContactMatchRowProps {
  contactMatch: ContactMatch;
  selectedVendContactId: string;
  onChange: (vendContactId: string) => void;
}

const ContactMatchRow: FC<ContactMatchRowProps> = memo(
  ({ contactMatch, selectedVendContactId, onChange }) => {
    const address = useMemo(
      () => getEntityAddress(contactMatch, 'contact').trim(),
      [contactMatch]
    );
    const additionalInfo = useMemo(
      () => getTitleForContactMatch(contactMatch),
      [contactMatch]
    );

    const matchesCount = contactMatch.matchable.length;

    const matchesCountText = useMemo(
      () => Pluralize('match', matchesCount, true),
      [matchesCount]
    );
    const toolTipTitle = useMemo(
      () => [contactMatch.full_name, address]
        .filter((item) => item.length !== 0)
        .join(' | '),
      [contactMatch.full_name, address]
    );

    return (
      <TableRow>
        <TableCell sx={{ maxWidth: 500 }}>
          <Tooltip title={toolTipTitle}>
            <Box display="flex">
              {contactMatch.full_name != null && (
                <>
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 500,
                    }}
                  >
                    {contactMatch.full_name}
                  </Typography>
                  {address.length !== 0 && (
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                      sx={{ mx: 1 }}
                    >
                      |
                    </Typography>
                  )}
                </>
              )}
              <Typography
                color="textPrimary"
                variant="body1"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '50%',
                }}
              >
                {address}
              </Typography>
            </Box>
          </Tooltip>
          <Typography
            color="textSecondary"
            variant="subtitle1"
          >
            {additionalInfo}
          </Typography>
        </TableCell>
        <TableCell sx={{ maxWidth: 500 }}>
          <MatchesSelect
            contact={contactMatch}
            selectedVendContactId={selectedVendContactId}
            onChange={onChange}
          />
        </TableCell>
        <TableCell
          align="right"
          sx={{ minWidth: 110 }}
        >
          {matchesCountText}
        </TableCell>
      </TableRow>
    );
  }
);

ContactMatchRow.propTypes = {
  // @ts-ignore
  contactMatch: PropTypes.object.isRequired,
  selectedVendContactId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default ContactMatchRow;
