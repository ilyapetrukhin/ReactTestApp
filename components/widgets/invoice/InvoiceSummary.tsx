import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import type { FC } from 'react';
import {
  Typography,
  Theme,
  Box,
} from '@mui/material';
import type { SxProps } from '@mui/system';
import type { Invoice } from 'src/types/job';
import { styled } from '@mui/material/styles';
import { useSelector } from 'src/store';
import { getGst, getSubTotal, getTotal } from 'src/utils/invoice';

interface InvoiceSummaryProps {
  invoices: Invoice[];
  sx?: SxProps<Theme>;
}

const InvoiceSummaryRoot = styled('div')();

const InvoiceSummary: FC<InvoiceSummaryProps> = (props) => {
  const { invoices, ...rest } = props;
  const { organisation, gst } = useSelector((state) => state.account);

  const subTotalCost = useMemo(
    () => {
      let res = 0;
      if (invoices) {
        res = getSubTotal(invoices, gst);
      }
      return res;
    },
    [invoices, gst],
  );

  const gstCost = useMemo(
    () => {
      let res = 0;
      if (invoices) {
        res = getGst(invoices, gst);
      }
      return res;
    },
    [invoices, gst],
  );

  const totalCost = useMemo(
    () => {
      let res = 0;
      if (invoices) {
        res = getTotal(invoices);
      }
      return res;
    },
    [invoices, gst],
  );

  return (
    <InvoiceSummaryRoot {...rest}>
      {organisation.gst_enabled && (
        <>
          <Box
            mt={1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              color="textPrimary"
              variant="subtitle1"
            >
              Subtotal
            </Typography>
            <Typography
              color="textPrimary"
              variant="subtitle1"
            >
              {numeral(subTotalCost).format('$0,0.00')}
            </Typography>
          </Box>
          <Box
            mt={1}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              color="textPrimary"
              variant="subtitle1"
            >
              Gst
            </Typography>
            <Typography
              color="textPrimary"
              variant="subtitle1"
            >
              {numeral(gstCost).format('$0,0.00')}
            </Typography>
          </Box>
        </>
      )}
      <Box
        mt={1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          color="textPrimary"
          variant="subtitle1"
          sx={{
            fontWeight: 'fontWeightBold'
          }}
        >
          Total
        </Typography>
        <Typography
          color="textPrimary"
          variant="subtitle1"
          sx={{
            fontWeight: 'fontWeightBold'
          }}
        >
          {numeral(totalCost).format('$0,0.00')}
        </Typography>
      </Box>
    </InvoiceSummaryRoot>
  );
};

InvoiceSummary.propTypes = {
  // @ts-ignore
  invoices: PropTypes.array.isRequired,
};

export default memo(InvoiceSummary);
