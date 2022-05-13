import React, { memo, useCallback } from 'react';
import {
  Box,
} from '@mui/material';

import { useSelector, useDispatch } from 'src/store';
import { markAsInvoiced } from 'src/slices/batchPreview';
import { INVOICE_PREF_NOT_SEND } from 'src/constants/contact';
import { LoadingButton } from '@mui/lab';

const BatchPreviewActions = memo(() => {
  const dispatch = useDispatch();
  const batchPreview = useSelector((state) => state.batchPreview);

  const organizationId = useSelector((state) => state.account.organisation.id);

  const handleSend = useCallback(() => {
    dispatch(markAsInvoiced(organizationId, batchPreview, true));
  }, [batchPreview, organizationId]);

  const handleMarkAsInvoiced = useCallback(() => {
    dispatch(markAsInvoiced(organizationId, batchPreview, false));
  }, [batchPreview, organizationId]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
      >
        {batchPreview.contact?.invoice_pref !== INVOICE_PREF_NOT_SEND && (
          <LoadingButton
            variant="contained"
            sx={{ mr: 2 }}
            onClick={handleSend}
            loading={batchPreview.isMarkingAsInvoiced}
          >
            SEND BATCH INVOICE
          </LoadingButton>
        )}
        <LoadingButton
          variant="contained"
          onClick={handleMarkAsInvoiced}
          loading={batchPreview.isMarkingAsInvoiced}
        >
          MARK AS INVOICED
        </LoadingButton>
      </Box>
    </>
  );
});

export default BatchPreviewActions;
