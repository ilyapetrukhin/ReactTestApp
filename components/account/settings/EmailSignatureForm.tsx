import type { FC } from 'react';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  FormHelperText,
  Paper,
  Typography
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'src/store';
import * as Yup from 'yup';
import { QuillEditor } from 'src/components/quill-editor';
import { saveInvoiceSettings } from '../../../slices/account';

const EmailSignatureForm: FC = () => {
  const { organisation, invoiceSettings } = useSelector((state) => state.account);
  const dispatch = useDispatch();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        payment_message: invoiceSettings.payment_message || '',
        disclaimer: invoiceSettings.disclaimer || '',
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            payment_message: Yup.string().max(255).nullable(),
            disclaimer: Yup.string().max(255).nullable()
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            payment_message: values.payment_message,
            disclaimer: values.disclaimer,
            intro_message: invoiceSettings.intro_message ? invoiceSettings.intro_message : '',
            invoice_due_days: invoiceSettings.invoice_due_days ? invoiceSettings.invoice_due_days : '',
            reply_to: invoiceSettings.reply_to ? invoiceSettings.reply_to : '',
            settings: invoiceSettings.settings,
          };

          await dispatch(saveInvoiceSettings(organisation.id, invoiceSettings.id, data));

          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Email signature successfully updated');
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        values
      }): JSX.Element => (
        <form
          noValidate
          onSubmit={handleSubmit}
        >
          <Card sx={{ p: 3 }}>
            <Typography
              color="primary"
              variant="h6"
            >
              EMAIL SIGN-OFF
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              Email signature to appear below invoices and quotes
            </Typography>
            <Paper
              sx={{ mt: 3 }}
              variant="outlined"
            >
              <QuillEditor
                onChange={(value) => setFieldValue('payment_message', value)}
                placeholder="Write something"
                sx={{
                  border: 'none',
                  flexGrow: 1,
                  minHeight: 200
                }}
                value={values.payment_message}
              />
            </Paper>
            <Typography
              color="textPrimary"
              variant="h6"
              sx={{ mt: 3 }}
            >
              JOB SHEET DISCLAIMER
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              Disclaimer to appear below job sheets
            </Typography>
            <Paper
              sx={{ mt: 3 }}
              variant="outlined"
            >
              <QuillEditor
                onChange={(value) => setFieldValue('disclaimer', value)}
                placeholder="Write something"
                sx={{
                  border: 'none',
                  flexGrow: 1,
                  minHeight: 200
                }}
                value={values.disclaimer}
              />
            </Paper>
            {errors.submit && (
              <Box mt={2}>
                <FormHelperText error>
                  {errors.submit}
                </FormHelperText>
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                mt: 6
              }}
            >
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="primary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                Save
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default EmailSignatureForm;
