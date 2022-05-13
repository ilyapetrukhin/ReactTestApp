import React, { FC, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import Pluralize from 'pluralize';

import { ProductMatch } from 'src/types/vendIntegration';
import MatchesSelect from './MatchesSelect';
import { getTitleForProductMatch } from '../../../utils';

interface ProductMatchRowProps {
  productMatch: ProductMatch;
  selectedVendProductId: string;
  onChange: (vendContactId: string) => void;
}

const ProductMatchRow: FC<ProductMatchRowProps> = memo(
  ({ productMatch, selectedVendProductId, onChange }) => {
    const matchesCount = productMatch.matchable.length;

    const additionalInfo = useMemo(
      () => getTitleForProductMatch(productMatch),
      [productMatch]
    );

    const matchesCountText = useMemo(
      () => Pluralize('match', matchesCount, true),
      [matchesCount]
    );
    const toolTipTitle = useMemo(
      () => [productMatch.name, additionalInfo]
        .filter((item) => item.length !== 0)
        .join('\n'),
      [productMatch.name, additionalInfo]
    );

    return (
      <TableRow>
        <TableCell sx={{ maxWidth: 500 }}>
          <Tooltip title={toolTipTitle}>
            <Box display="flex">
              {productMatch.name != null && (
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
                    {productMatch.name}
                  </Typography>
                </>
              )}
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
            product={productMatch}
            selectedVendContactId={selectedVendProductId}
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

ProductMatchRow.propTypes = {
  // @ts-ignore
  productMatch: PropTypes.object.isRequired,
  selectedVendProductId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ProductMatchRow;
