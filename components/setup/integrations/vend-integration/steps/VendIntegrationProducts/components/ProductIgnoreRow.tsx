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
import numeral from 'numeral';

import { VendProduct } from 'src/types/product';

interface ContactIgnoreRowProps {
  product: VendProduct;
  ignored: boolean;
  onChangeIgnore: (ignored: boolean) => void;
}

const ContactIgnoreRow: FC<ContactIgnoreRowProps> = memo(
  ({ product, ignored, onChangeIgnore }) => {
    const { name } = product;
    const additionalInfo = useMemo(
      () => [product.sku, numeral(product.price_including_tax).format('$0,0.00')].join(' | '),
      [product]
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
                {' '}
                |
                {' '}
              </Typography>
            )}
            <Typography
              color="textPrimary"
              variant="body1"
            >
              {additionalInfo}
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
                  Ignore product
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
  product: PropTypes.object.isRequired,
  ignored: PropTypes.bool.isRequired,
  onChangeIgnore: PropTypes.func.isRequired,
};

export default ContactIgnoreRow;
