import React, { FC, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
} from '@mui/material';

import { getEntityAddress } from 'src/utils/address';
import { ContactMatch } from 'src/types/vendIntegration';
import LinearProgress from 'src/components/LinearProgress';
import { UNSELECTED_VEND_CONTACT_ID } from 'src/slices/vendIntegrationSyncContacts';
import type { SelectChangeEvent } from '@mui/material/Select';

interface MatchesSelectProps {
  contact: ContactMatch;
  selectedVendContactId: string,
  onChange: (vendContactId: string) => void;
}

const MatchesSelect: FC<MatchesSelectProps> = memo(
  ({ contact, selectedVendContactId, onChange }) => {
    const handleChange = useCallback((event: SelectChangeEvent) => {
      const { value } = event.target;
      onChange(value);
    }, [onChange]);

    return (
      <FormControl fullWidth>
        <InputLabel>Vend contact</InputLabel>
        <Select
          label="Vend contact"
          value={selectedVendContactId}
          onChange={handleChange}
        >
          <MenuItem value={UNSELECTED_VEND_CONTACT_ID}>Create new contact in Vend</MenuItem>
          {contact.matchable.map((match) => (
            <MenuItem
              value={match.vend_contact.vend_contact_id}
              key={match.vend_contact.vend_contact_id}
            >
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={9}
                  xs={12}
                >
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {[
                      match.vend_contact.email,
                      match.vend_contact.name,
                      getEntityAddress(match.vend_contact, 'vendContact'),
                    ]
                      .filter((item) => item != null && item.trim().length !== 0)
                      .join(' | ')}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={3}
                  xs={12}
                  display="flex"
                  justifyContent="flex-end"
                  sx={{
                    justifyContent: {
                      xs: 'flex-start',
                      md: 'flex-end',
                    },
                  }}
                >
                  <LinearProgress value={match.probability} />
                </Grid>
              </Grid>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

MatchesSelect.propTypes = {
  // @ts-ignore
  contact: PropTypes.object.isRequired,
  selectedVendContactId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default MatchesSelect;
