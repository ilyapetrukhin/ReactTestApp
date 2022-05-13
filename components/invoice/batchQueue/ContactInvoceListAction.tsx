import { FC, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import numeral from 'numeral';

import { ContactInvoice } from 'src/types/batchQueue';

interface ContactInvoceListActionProps {
  onBatchPreviewInvoice?: () => void;
  selectedInvoices: ContactInvoice[];
}

const ContactInvoceListAction: FC<ContactInvoceListActionProps> = ({
  onBatchPreviewInvoice,
  selectedInvoices,
}) => {
  const totalSelectedAmount = useMemo<number>(
    () => selectedInvoices.reduce((sum, invoice) => sum + invoice.total, 0),
    [selectedInvoices]
  );

  const totalAmountFormatted = useMemo(() => numeral(totalSelectedAmount).format('$0,0.00'), [totalSelectedAmount]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        backgroundColor: 'primary.main',
      }}
    >
      <Typography
        variant="body2"
        fontWeight="bold"
        sx={{ marginRight: 3, color: 'common.white' }}
      >
        {selectedInvoices.length}
        {' '}
        {selectedInvoices.length > 1 ? 'invoices' : 'invoice'}
        {' '}
        selected
        {' '}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
      >
        <Typography
          variant="body2"
          color="textPrimary"
          fontWeight="bold"
          sx={{ marginRight: 3, color: 'common.white' }}
          mr={2}
        >
          {totalAmountFormatted}
        </Typography>
        <Button
          color="secondary"
          onClick={onBatchPreviewInvoice}
          variant="outlined"
          sx={{ borderColor: 'common.white', color: 'common.white' }}
        >
          Preview
        </Button>
      </Box>
    </Box>
  );
};

ContactInvoceListAction.propTypes = {
  onBatchPreviewInvoice: PropTypes.func,
  selectedInvoices: PropTypes.array.isRequired,
};

export default ContactInvoceListAction;
