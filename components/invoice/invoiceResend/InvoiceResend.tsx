import React, { memo, useEffect, useCallback, ChangeEvent, FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  List,
  Typography,
  CardHeader,
  Divider,
  TextField,
  InputAdornment,
  Paper,
  Tooltip,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import ChipInput from 'material-ui-chip-input';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import InformationCircleIcon from 'src/icons/InformationCircle';
import { useDispatch, useSelector } from 'src/store';
import { QuillEditor } from 'src/components/quill-editor';
import {
  setCCEmails,
  setChemicalActions,
  setChemicalHistory,
  setDisplayInvoiceNotes,
  setIntroMessage,
  setIsInvoiceSheetAttached,
  setIsJobSheetAttached,
  setSubjectMessage,
  setTasksList,
  setWaterResult,
} from 'src/slices/resendInvoice';
import { AnyAction } from '@reduxjs/toolkit';
import ContactListItem from '../../ContactListItem';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import { useResentInvoiceMutation } from '../../../api/invoice';
import { parseBoolByStr } from '../../../utils/bool';

function useSwitchHandler(
  action: (payload: { value: boolean }) => AnyAction,
  booleanProperty: string
): [boolean, (checked: boolean) => void] {
  const dispatch = useDispatch();
  const value = useSelector(
    (state) => state.resendInvoice[booleanProperty] as boolean
  );
  const handle = useCallback((checked:boolean) => {
    dispatch(action({ value: checked }));
  }, []);
  return [value, handle];
}

interface InvoiceResendProps {
  contactInvoice: any,
  invoiceSettings: any
}

const InvoiceResend:FC<InvoiceResendProps> = memo((props) => {
  const { contactInvoice, invoiceSettings } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { organisation } = useSelector((state) => state.account);
  const { resendInvoice } = useSelector((state) => state);
  const { isSending, isSent, ccEmails, introMessage } = resendInvoice;
  const contact = contactInvoice?.contact;
  const subjectMessage = contactInvoice?.subject_message;
  const [resentInvoiceRequest] = useResentInvoiceMutation();

  useEffect(() => {
    if (contactInvoice && contactInvoice?.contact_intro) {
      dispatch(setIntroMessage({ message: contactInvoice.contact_intro }));
    }
  }, [contactInvoice, invoiceSettings]);

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

  const [tasksLists, handleTasksListsChange] = useSwitchHandler(
    setTasksList,
    'tasksLists'
  );

  const [waterResult, handleWaterResultChange] = useSwitchHandler(
    setWaterResult,
    'waterResult'
  );

  const [chemicalHistory, handleChemicalHistoryChange] = useSwitchHandler(
    setChemicalHistory,
    'chemicalHistory'
  );

  const [chemicalActions, handleChemicalActionsChange] = useSwitchHandler(
    setChemicalActions,
    'chemicalActions'
  );

  const [displayInvoiceNotes, handleDisplayInvoiceNotesChange] = useSwitchHandler(setDisplayInvoiceNotes, 'displayInvoiceNotes');

  const [isJobSheetAttached, handleIsJobSheetAttachedChange] = useSwitchHandler(
    setIsJobSheetAttached,
    'isJobSheetAttached'
  );

  const [isInvoiceSheetAttached, handleIsInvoiceSheetAttachedChange] = useSwitchHandler(setIsInvoiceSheetAttached, 'isInvoiceSheetAttached');

  useEffect(() => {
    if (invoiceSettings && invoiceSettings.settings && contactInvoice) {
      handleWaterResultChange(!!JSON.parse(invoiceSettings.settings?.water_result));
      handleTasksListsChange(!!JSON.parse(invoiceSettings.settings?.tasks_list));
      handleChemicalHistoryChange(!!JSON.parse(invoiceSettings.settings?.chemical_history));
      handleChemicalActionsChange(!!JSON.parse(invoiceSettings.settings?.chemical_actions));
      handleDisplayInvoiceNotesChange(!!JSON.parse(invoiceSettings.settings?.display_invoice_notes));
      handleIsJobSheetAttachedChange(contactInvoice?.is_job_sheet_attached);
      handleIsInvoiceSheetAttachedChange(contactInvoice?.is_invoice_sheet_attached);
    }
  }, [invoiceSettings, contactInvoice]);

  const handleResend = useCallback(async () => {
    const emails = Array.from(new Set([...ccEmails, contactInvoice?.contact.email]));
    const body = {
      recipients: emails.map((email) => ({ email })),
      description: introMessage,
      subject_message: subjectMessage,
      isTaskDisp: parseBoolByStr(
        invoiceSettings?.settings.tasks_list
      ),
      isWatertestDisp: parseBoolByStr(
        invoiceSettings?.settings.water_result
      ),
      isChemicalHistoryDisp: parseBoolByStr(
        invoiceSettings?.settings.chemical_history
      ),
      isChemicalActionsDisp: parseBoolByStr(
        invoiceSettings?.settings.water_result
      ),
      isInvoiceDisp: parseBoolByStr(
        contactInvoice?.is_invoice_sheet_attached
      ),
      job_sheet_invoice_notes_display: parseBoolByStr(
        contactInvoice?.is_job_sheet_attached
      ),
    };
    if (contactInvoice.id) {
      await resentInvoiceRequest({
        organisationId: organisation.id,
        id: contactInvoice.id,
        body
      });
    }
  }, [organisation]);

  useEffect(() => {
    if (isSent) {
      toast.success('The invoice has been successfully sent');
      router.push('/invoices');
    }
  }, [isSent]);

  const buttonResendDisabled = (ccEmails.length === 0 && !contact?.email);

  return (
    <>
      <Card>
        <CardHeader title="Invoice to" />
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
              value={ccEmails}
              placeholder="Enter CC emails"
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Invoice number was generated after invoice submission">
                        <InformationCircleIcon
                          color="primary"
                          fontSize="small"
                        />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
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
                {introMessage ? (
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
                ) : null}
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
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Some descriptive text
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
                  sm={6}
                  xs={6}
                >
                  <Box sx={{ px: 1.5 }}>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={tasksLists}
                          onChange={(e) => handleTasksListsChange(e.target.checked)}
                          color="primary"
                          edge="start"
                        />
                      )}
                      label="Show tasks list"
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  sm={6}
                  xs={6}
                >
                  <Box sx={{ px: 1.5 }}>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={waterResult}
                          onChange={(e) => handleWaterResultChange(e.target.checked)}
                          color="primary"
                          edge="start"
                        />
                      )}
                      label="Show water test results"
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  sm={6}
                  xs={6}
                >
                  <Box sx={{ px: 1.5 }}>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={chemicalHistory}
                          onChange={(e) => handleChemicalHistoryChange(e.target.checked)}
                          color="primary"
                          edge="start"
                        />
                      )}
                      label="Show chemical history"
                    />
                  </Box>
                </Grid>
                {waterResult && (
                  <Grid
                    item
                    sm={6}
                    xs={6}
                  >
                    <Box sx={{ px: 1.5 }}>
                      <FormControlLabel
                        control={(
                          <Switch
                            checked={chemicalActions}
                            onChange={(e) => handleChemicalActionsChange(e.target.checked)}
                            color="primary"
                            edge="start"
                          />
                        )}
                        label="Show chemical actions"
                      />
                    </Box>
                  </Grid>
                )}
                <Grid
                  item
                  sm={6}
                  xs={6}
                >
                  <Box sx={{ px: 1.5 }}>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={displayInvoiceNotes}
                          onChange={(e) => handleDisplayInvoiceNotesChange(e.target.checked)}
                          color="primary"
                          edge="start"
                        />
                      )}
                      label="Show invoice notes"
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  sm={6}
                  xs={6}
                >
                  <Box sx={{ px: 1.5 }}>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={isJobSheetAttached}
                          onChange={(e) => handleIsJobSheetAttachedChange(e.target.checked)}
                          color="primary"
                          edge="start"
                        />
                      )}
                      label="Show job sheet"
                    />
                  </Box>
                </Grid>
              </Grid>
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
                    INVOICE SETTINGS
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Some descriptive text
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
                  xs={12}
                  sm={6}
                >
                  <Box sx={{ px: 1.5 }}>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={isInvoiceSheetAttached}
                          onChange={(e) => handleIsInvoiceSheetAttachedChange(e.target.checked)}
                          color="primary"
                          edge="start"
                        />
                      )}
                      label="Show invoice"
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
            Resend invoice
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
});

export default InvoiceResend;
