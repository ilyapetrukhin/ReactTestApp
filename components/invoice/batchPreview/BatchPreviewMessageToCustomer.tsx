import React, { memo, useCallback, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Box,
  TextField,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  Grid,
} from '@mui/material';

import { QuillEditor } from 'src/components/quill-editor';
import DialogBatchPreviewEmail from 'src/components/invoice/batchPreview/DialogBatchPreviewEmail';
import { useDispatch, useSelector } from 'src/store';
import {
  loadPreview,
  resetPreview,
  setConfigureServiceReport,
  setIntroMessage,
  setIsIndividualInvoicesAttached,
  setIsJobSheetsAttached,
  setSubjectMessage,
} from 'src/slices/batchPreview';

const BatchPreviewMessageToCustomer = memo(() => {
  const dispatch = useDispatch();
  const {
    contactId,
    contactInvoiceIds,
    dueDate,
    sendDate,

    introMessage,
    subjectMessage,
    isIndividualInvoicesAttached,
    isJobSheetsAttached,

    isLoadingPreview,
    previewHTML,

    configureServiceReport,
  } = useSelector((state) => state.batchPreview);
  const [previewEmailOpened, setPreviewEmailOpened] = useState<boolean>(false);

  const { id: organisationId } = useSelector((state) => state.account.organisation);

  const handleSubjectMessageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSubjectMessage({ message: event.target.value }));
    },
    []
  );

  const handleIntroMessageChange = useCallback((content: string) => {
    dispatch(setIntroMessage({ message: content }));
  }, []);

  const handleChangeConfigureServiceReport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setConfigureServiceReport({ configure: event.target.checked }));
    },
    []
  );

  const handleJobSheetAttached = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setIsJobSheetsAttached({ attached: event.target.checked }));
    },
    []
  );

  const handleInvoiceAttached = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setIsIndividualInvoicesAttached({ attached: event.target.checked }));
    },
    []
  );

  const handleOpenPreviewEmail = useCallback(() => {
    dispatch(loadPreview({
      organisationId,
      contactId,
      contactInvoiceIds,
      dueDate,
      issuedDate: sendDate,
      invoiceMessage: introMessage,
    }));
    setPreviewEmailOpened(true);
  }, [organisationId, contactId, contactInvoiceIds, dueDate, sendDate, introMessage]);

  const handleClosePreviewEmail = useCallback(() => {
    setPreviewEmailOpened(false);
    dispatch(resetPreview());
  }, []);

  return (
    <>
      <Card>
        <CardHeader title="Message to customer" />
        <Divider />
        <CardContent>
          <Box mt={2}>
            <TextField
              fullWidth
              label="Subject line"
              placeholder="Subject line"
              value={subjectMessage}
              onChange={handleSubjectMessageChange}
              variant="outlined"
              helperText="Invoice number is generated after clicking Send/Save invoice button"
            />
            <Paper
              sx={{ mt: 3 }}
              variant="outlined"
            >
              <QuillEditor
                onChange={handleIntroMessageChange}
                placeholder="Description"
                name="intro_message"
                sx={{
                  border: 'none',
                  flexGrow: 1,
                  minHeight: 200,
                }}
                value={introMessage}
              />
            </Paper>
          </Box>
          <Grid
            container
            spacing={3}
            sx={{ mt: 2, px: 2 }}
          >
            <Grid
              item
              xs={12}
            >
              <FormControlLabel
                control={(
                  <Switch
                    checked={configureServiceReport}
                    onChange={handleChangeConfigureServiceReport}
                    color="primary"
                    edge="start"
                  />
                  )}
                label="Configure service report"
              />
            </Grid>
            {
              configureServiceReport && (
                <>
                  <Grid
                    item
                    sm={6}
                    xs={12}
                  >

                    <FormControlLabel
                      control={(
                        <Switch
                          checked={isJobSheetsAttached}
                          onChange={handleJobSheetAttached}
                          color="primary"
                          edge="start"
                        />
                    )}
                      label="Attach individual job sheets"
                    />
                  </Grid>
                  <Grid
                    item
                    sm={6}
                    xs={12}
                  >
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={isIndividualInvoicesAttached}
                          onChange={handleInvoiceAttached}
                          color="primary"
                          edge="start"
                        />
                  )}
                      label="Attach individual invoices"
                    />
                  </Grid>
                </>
              )
            }
          </Grid>
          <Button
            color="primary"
            type="button"
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleOpenPreviewEmail}
          >
            PREVIEW EMAIL
          </Button>
        </CardContent>
      </Card>

      <DialogBatchPreviewEmail
        loading={isLoadingPreview}
        html={previewHTML}
        open={previewEmailOpened}
        onClose={handleClosePreviewEmail}
      />
    </>
  );
});

export default BatchPreviewMessageToCustomer;
