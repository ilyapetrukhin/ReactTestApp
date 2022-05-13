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
  InputAdornment,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { saveInvoiceSettings } from 'src/slices/account';
import toast from 'react-hot-toast';
import { QuillEditor } from 'src/components/quill-editor';
import InformationCircleIcon from 'src/icons/InformationCircle';

const InvoiceSettings: FC = (props) => {
  const { organisation, invoiceSettings } = useSelector((state) => state.account);

  const dispatch = useDispatch();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        payment_message: invoiceSettings.payment_message || '',
        invoice_prefix: invoiceSettings.invoice_prefix || '',
        use_invoice_sign_off: Boolean(invoiceSettings.settings.use_invoice_sign_off),
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            payment_message: Yup.string().max(1000, 'Payment message must be at most 1000 characters').nullable(),
            invoice_prefix: Yup.string().max(3, 'Invoice prefix must be at most 3 characters').nullable(),
            use_invoice_sign_off: Yup.boolean(),
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
            invoice_prefix: values.invoice_prefix ? values.invoice_prefix : '',
            disclaimer: invoiceSettings.disclaimer ? invoiceSettings.disclaimer : '',
            intro_message: invoiceSettings.intro_message ? invoiceSettings.intro_message : '',
            invoice_due_days: invoiceSettings.invoice_due_days ? invoiceSettings.invoice_due_days : '',
            reply_to: invoiceSettings.reply_to ? invoiceSettings.reply_to : '',
            settings: {
              water_result: invoiceSettings.settings.water_result,
              tasks_list: invoiceSettings.settings.tasks_list,
              chemical_history: invoiceSettings.settings.chemical_history,
              chemical_actions: invoiceSettings.settings.chemical_actions,
              display_invoice_notes: invoiceSettings.settings.display_invoice_notes,
              use_invoice_sign_off: values.use_invoice_sign_off ? values.use_invoice_sign_off : 0,
            },
          };

          await dispatch(saveInvoiceSettings(organisation.id, invoiceSettings.id, data));

          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Invoice settings successfully updated');
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        handleSubmit,
        touched,
        handleBlur,
        isSubmitting,
        setFieldValue,
        handleChange,
        errors,
        values
      }): JSX.Element => (
        <form
          noValidate
          onSubmit={handleSubmit}
        >
          <Card {...props}>
            <CardHeader title="Invoice settings" />
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
                    Show invoice
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Some descriptive text
                  </Typography>
                  <Switch
                    color="primary"
                    onChange={handleChange}
                    defaultChecked={values.use_invoice_sign_off}
                    edge="start"
                    name="use_invoice_sign_off"
                  />
                </Grid>
                <Grid
                  item
                  md={2}
                  sm={3}
                  xs={6}
                >
                  <TextField
                    autoFocus
                    error={Boolean(touched.invoice_prefix && errors.invoice_prefix)}
                    fullWidth
                    helperText={touched.invoice_prefix && errors.invoice_prefix}
                    label="Invoice prefix"
                    margin="normal"
                    name="invoice_prefix"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.invoice_prefix}
                    InputProps={{
                      inputProps: {
                        maxLength: 3,
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="This update will take place with immediate effect. All new invoices will be generated with new prefix.">
                            <InformationCircleIcon
                              color="primary"
                              fontSize="small"
                            />
                          </Tooltip>
                        </InputAdornment>
                      )
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    variant="h6"
                  >
                    RECEIVING PAYMENT FROM CUSTOMERS
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Message to appear below invoice email
                  </Typography>
                  <Paper
                    sx={{ mt: 3 }}
                    variant="outlined"
                  >
                    <QuillEditor
                      onChange={(value) => setFieldValue('payment_message', value)}
                      placeholder="Write something"
                      name="payment_message"
                      sx={{
                        border: 'none',
                        flexGrow: 1,
                        minHeight: 200
                      }}
                      value={values.payment_message}
                    />
                  </Paper>
                  {errors.payment_message && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {errors.payment_message}
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

export default InvoiceSettings;
