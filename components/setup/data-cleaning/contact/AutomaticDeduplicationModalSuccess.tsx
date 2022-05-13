import React, { FC, memo, useCallback } from 'react';
import {
  Dialog,
  Card,
  CardHeader,
  CardContent,
  Divider,
  CircularProgress,
  Box,
  Alert,
  Button,
} from '@mui/material';
import { useSelector, useDispatch } from 'src/store';
import { closeSuccessModal } from 'src/slices/deduplicateContactToolAutomatic';

interface AutomaticDeduplicationModalSuccessProps {}

const AutomaticDeduplicationModalSuccess: FC<AutomaticDeduplicationModalSuccessProps> = memo(() => {
  const dispatch = useDispatch();
  const {
    isSuccessModalOpen,
    isSubmitting,
    isMergeError,
    mergedCountSuccessfully,
  } = useSelector((state) => state.deduplicateContactToolAutomatic);

  const handleOk = useCallback(() => {
    if (!isSubmitting) {
      dispatch(closeSuccessModal());
    }
  }, [isSubmitting]);

  return (
    <Dialog
      open={isSuccessModalOpen}
      maxWidth="md"
      onClose={handleOk}
    >
      {isSuccessModalOpen && (
      <Card>
        <CardHeader title="Auto merge proccess" />
        <Divider />
        <CardContent>
          {isSubmitting && (
          <Box
            display="flex"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
          )}
          {!isSubmitting
                && !isMergeError
                && mergedCountSuccessfully !== 0 && (
                  <Alert severity="success">
                    Process complete.
                    {' '}
                    {mergedCountSuccessfully}
                    {' '}
                    duplicates
                    merged. We recommend you now do the manual de-duplication
                    below, and then proceed to the pool de-duplication tool.
                  </Alert>
          )}
          {!isSubmitting
                && !isMergeError
                && mergedCountSuccessfully === 0 && (
                  <Alert severity="info">There are no duplicates</Alert>
          )}
          {!isSubmitting && isMergeError && (
          <Alert severity="error">Something went wrong</Alert>
          )}
          {!isSubmitting && (
          <Box
            display="flex"
            justifyContent="center"
            mt={2}
          >
            <Button
              color="primary"
              size="small"
              sx={{ ml: 2 }}
              type="button"
              variant="contained"
              onClick={handleOk}
            >
              OK
            </Button>
          </Box>
          )}
        </CardContent>
      </Card>
      )}
    </Dialog>
  );
});

AutomaticDeduplicationModalSuccess.propTypes = {};

export default AutomaticDeduplicationModalSuccess;
