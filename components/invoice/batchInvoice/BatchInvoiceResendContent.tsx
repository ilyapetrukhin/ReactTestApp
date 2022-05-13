import React, { memo, useEffect, useCallback, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Card,
  CardContent,
  List,
  Typography,
  CardHeader,
  Divider,
  TextField,
  Paper,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ChipInput from 'material-ui-chip-input';
import * as Yup from 'yup';

import { useDispatch, useSelector } from 'src/store';
import { QuillEditor } from 'src/components/quill-editor';
import {
  resend,
  setCCEmails,
  setIntroMessage,
  setIsIndividualInvoicesAttached,
  setIsJobSheetsAttached,
  setSubjectMessage,
} from 'src/slices/resendBatchInvoice';
import { AnyAction } from '@reduxjs/toolkit';
import ContactListItem from '../../ContactListItem';
import toast from 'react-hot-toast';

function useSwitchHandler(
  action: (payload: { value: boolean }) => AnyAction,
  booleanProperty: string
): [boolean, (event: ChangeEvent<HTMLInputElement>) => void] {
  const dispatch = useDispatch();
  const value = useSelector(
    (state) => state.resendBatchInvoice[booleanProperty] as boolean
  );
  const handle = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    dispatch(action({ value: event.target.checked }));
  }, []);
  return [value, handle];
}

const InvoiceResendCard = memo(() => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const { resendBatchInvoice } = useSelector((state) => state);
  const { isSending, isSent, batchInvoice, contact, ccEmails, subjectMessage, introMessage } = resendBatchInvoice;

  const handleAddCCEmail = useCallback(
    (email: string) => {
      if (Yup.string().email().isValidSync(email)) {
        dispatch(setCCEmails({ emails: [...ccEmails, email] }));
      }
    },
    [ccEmails]
  );

  const handleDeleteCCEmail = useCallback(
    (email: string) => {
      dispatch(setCCEmails({ emails: ccEmails.filter((e) => e !== email) }));
    },
    [ccEmails.length]
  );

  const handleSubjectMessageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(setSubjectMessage({ message: event.target.value }));
    },
    [ccEmails.length]
  );

  const handleIntroMessageChange = useCallback(
    (text: string) => {
      dispatch(setIntroMessage({ message: text }));
    },
    [ccEmails.length]
  );

  const [isIndividualInvoicesAttached, handleIndividualInvoicesAttached] = useSwitchHandler(
    setIsIndividualInvoicesAttached,
    'isIndividualInvoicesAttached'
  );

  const [isJobSheetsAttached, handleIsJobSheetAttached] = useSwitchHandler(
    setIsJobSheetsAttached,
    'isJobSheetsAttached'
  );

  const handleResend = useCallback(() => {
    dispatch(resend(organisationId, resendBatchInvoice));
  }, [organisationId, resendBatchInvoice]);

  useEffect(() => {
    if (isSent) {
      toast.success('Batch invoice has been successfully sent');
      router.push('/invoices/batch');
    }
  }, [isSent]);

  const buttonResendDisabled = (ccEmails.length === 0 && !batchInvoice?.contact?.email);

  return (
    <>
      <Card>
        <CardHeader title="Batch invoice to" />
        <Divider />
        <CardContent>
          <List>
            <ContactListItem
              name={contact?.full_name}
              address={contact?.full_address}
              email={contact?.email}
            />
          </List>
          <Box mt={2}>
            <ChipInput
              fullWidth
              label="CC emails"
              variant="outlined"
              disabled={false}
              placeholder="Enter CC emails"
              value={ccEmails}
              onAdd={handleAddCCEmail}
              onDelete={handleDeleteCCEmail}
            />
          </Box>
        </CardContent>
      </Card>
      <Box mt={3}>
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
              />
            </Box>
            <Box mt={2}>
              <Typography
                color="textPrimary"
                variant="h6"
              >
                INTRO MESSAGE
              </Typography>
              <Typography
                color="textSecondary"
                variant="body1"
              >
                This appears in the email and PDF to customers
              </Typography>
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
            <Box
              mt={3}
            >
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    variant="h6"
                  >
                    JOB SHEET SETTINGS
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Divider />
                </Grid>
                <Grid
                  item
                  sm={5}
                  xs={12}
                >
                  <Box sx={{ px: 1.5 }}>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={isJobSheetsAttached}
                          onChange={handleIsJobSheetAttached}
                          color="primary"
                          edge="start"
                        />
                      )}
                      label="Attach individual job sheets"
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  sm={5}
                  xs={12}
                >
                  <Box sx={{ px: 1.5 }}>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={isIndividualInvoicesAttached}
                          onChange={handleIndividualInvoicesAttached}
                          color="primary"
                          edge="start"
                        />
                      )}
                      label="Attach individual invoices"
                    />
                  </Box>
                </Grid>

              </Grid>
            </Box>
          </CardContent>
        </Card>
        <Box
          mt={3}
          display="flex"
          justifyContent="center"
        >
          <LoadingButton
            variant="contained"
            disabled={buttonResendDisabled}
            loading={isSending}
            onClick={handleResend}
          >
            Resend
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
});

export default InvoiceResendCard;
