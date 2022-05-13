import React, { FC, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import numeral from 'numeral';

import { ProductMatch } from 'src/types/vendIntegration';
import { UNSELECTED_VEND_PRODUCT_ID } from 'src/slices/vendIntegrationSyncProducts';
import type { SelectChangeEvent } from '@mui/material/Select';

interface MatchesSelectProps {
  product: ProductMatch;
  selectedVendContactId: string,
  onChange: (vendContactId: string) => void;
}

const MatchesSelect: FC<MatchesSelectProps> = memo(
  ({ product, selectedVendContactId, onChange }) => {
    const handleChange = useCallback((event: SelectChangeEvent) => {
      const { value } = event.target;
      onChange(value);
    }, [onChange]);

    return (
      <FormControl fullWidth>
        <InputLabel>Vend product</InputLabel>
        <Select
          label="Vend product"
          fullWidth
          value={selectedVendContactId}
          onChange={handleChange}
        >
          <MenuItem value={UNSELECTED_VEND_PRODUCT_ID}>Skip</MenuItem>
          {product.matchable.map((matchable) => (
            <MenuItem
              value={matchable.match.vend_product_id}
              key={matchable.match.vend_product_id}
            >
              <Typography
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {[
                  matchable.match.name,
                  matchable.match.sku,
                  numeral(matchable.match.price_including_tax).format('($0.00a)'),
                ]
                  .filter((item) => item != null && item.trim().length !== 0)
                  .join(' | ')}
              </Typography>

            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

MatchesSelect.propTypes = {
  // @ts-ignore
  product: PropTypes.object.isRequired,
  selectedVendContactId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default MatchesSelect;
