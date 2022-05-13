import React, { memo, useMemo } from 'react';

import PropTypes from 'prop-types';

import { Grid, GridProps, Typography } from '@mui/material';

import numeral from 'numeral';
import { useSelector } from 'src/store';
import { ContactInvoice } from 'src/types/batchQueue';
import { getGstByTotalSum } from 'src/utils/invoice';

import type { FC } from 'react';

interface BatchInvoiceTotalCostSummaryProps extends GridProps {
  contactInvoices: ContactInvoice[];
}

function renderSummaryItem(
  title: string,
  amount: string,
  highlight: boolean = false
) {
  return (
    <>
      <Grid
        item
        sm={8}
        sx={{ display: { xs: 'none', sm: 'block' } }}
      />
      <Grid
        xs={6}
        sm={2}
        item
        fontStyle={highlight ? 'bold' : null}
      >
        <Typography
          variant="body1"
          color="textPrimary"
          fontWeight={highlight ? 'bold' : null}
        >
          {title}
        </Typography>
      </Grid>
      <Grid
        xs={6}
        sm={2}
        item
      >
        <Typography
          variant="body1"
          color="textPrimary"
          textAlign="right"
          fontWeight={highlight ? 'bold' : null}
        >
          {amount}
        </Typography>
      </Grid>
    </>
  );
}

const BatchInvoiceTotalCostSummary: FC<BatchInvoiceTotalCostSummaryProps> = (
  props
) => {
  const { contactInvoices, ...rest } = props;
  const { organisation, gst } = useSelector((state) => state.account);

  const totalSumCost = useMemo(
    () => contactInvoices.reduce((sum, invoice) => sum + invoice.total_amount, 0),
    [contactInvoices]
  );

  const gstCost = useMemo(
    () => getGstByTotalSum(totalSumCost, gst),
    [totalSumCost]
  );

  const subtotalCost = useMemo(
    () => totalSumCost - gstCost,
    [totalSumCost, gstCost]
  );

  return (
    <Grid
      container
      sx={{ mt: 3 }}
      spacing={1}
      {...rest}
    >
      {organisation.gst_enabled && (
        <>
          {renderSummaryItem(
            'Subtotal',
            numeral(subtotalCost).format('$0,0.00')
          )}
          {renderSummaryItem('GST', numeral(gstCost).format('$0,0.00'))}
        </>
      )}
      {renderSummaryItem(
        'Total',
        numeral(totalSumCost).format('$0,0.00'),
        true
      )}
    </Grid>
  );
};

BatchInvoiceTotalCostSummary.propTypes = {
  // @ts-ignore
  contactInvoices: PropTypes.array.isRequired,
};

export default memo(BatchInvoiceTotalCostSummary);
