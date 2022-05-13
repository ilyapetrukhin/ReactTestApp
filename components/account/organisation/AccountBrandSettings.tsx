import type { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  Paper,
  Switch,
  Typography
} from '@mui/material';
import { TwitterPicker } from 'react-color';
import { useDispatch, useSelector } from 'src/store';
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { saveInvoiceSettings } from 'src/slices/account';
import toast from 'react-hot-toast';
import { QuillEditor } from '../../quill-editor';

const AccountBrandSettings: FC = (props) => {
  const { organisation, invoiceSettings } = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const [customBrandColour, setCustomBrandColour] = useState<boolean>(false);

  useEffect(() => {
    if (invoiceSettings.theme_color) {
      setCustomBrandColour(true);
    }
  }, [invoiceSettings]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        email_signature: invoiceSettings.email_signature || '',
        theme_color: invoiceSettings.theme_color || '',
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            email_signature: Yup.string().max(1000, 'Email signature must be at most 1000 characters').nullable(),
            theme_color: Yup.string().nullable(),
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            email_signature: values.email_signature,
            theme_color: customBrandColour ? values.theme_color : '',
            payment_message: invoiceSettings.payment_message ? invoiceSettings.payment_message : '',
            invoice_prefix: invoiceSettings.invoice_prefix ? invoiceSettings.invoice_prefix : '',
            disclaimer: invoiceSettings.disclaimer ? invoiceSettings.disclaimer : '',
            intro_message: invoiceSettings.intro_message ? invoiceSettings.intro_message : '',
            invoice_due_days: invoiceSettings.invoice_due_days ? invoiceSettings.invoice_due_days : '',
            reply_to: invoiceSettings.reply_to ? invoiceSettings.reply_to : '',
            settings: invoiceSettings.settings
          };

          await dispatch(saveInvoiceSettings(organisation.id, invoiceSettings.id, data));

          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Brand settings successfully updated!');
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        handleSubmit,
        handleBlur,
        isSubmitting,
        setFieldValue,
        errors,
        values
      }): JSX.Element => (
        <form
          noValidate
          onSubmit={handleSubmit}
        >
          <Card {...props}>
            <CardHeader title="Manage your brand" />
            <Divider />
            <CardContent>
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
                    gutterBottom
                    variant="subtitle2"
                  >
                    Choose a custom brand color
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    This will change the heading text, accent and button colours across your invoices, job sheets and quotes. Click Preview email and Preview PDF to see your changes. Turn off the switch to revert to the default colour
                  </Typography>
                  <Switch
                    color="secondary"
                    onChange={(event) => setCustomBrandColour(event.target.checked)}
                    checked={customBrandColour}
                    edge="start"
                    name="custom_brand_color"
                  />
                  {customBrandColour && (
                    <TwitterPicker
                      color={values.theme_color}
                      onChangeComplete={(color) => setFieldValue('theme_color', color.hex)}
                    />
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
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
                      onChange={(value) => setFieldValue('email_signature', value)}
                      onBlur={handleBlur}
                      placeholder="Write something"
                      name="email_signature"
                      sx={{
                        border: 'none',
                        flexGrow: 1,
                        minHeight: 200
                      }}
                      value={values.email_signature}
                    />
                  </Paper>
                  {errors.email_signature && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {errors.email_signature}
                      </FormHelperText>
                    </Box>
                  )}
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 2
                }}
              >
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Save
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default AccountBrandSettings;
