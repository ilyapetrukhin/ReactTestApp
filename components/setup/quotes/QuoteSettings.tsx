import type { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { saveQuoteSettings } from 'src/slices/account';
import toast from 'react-hot-toast';

const QuoteSettings: FC = (props) => {
  const { organisation, quoteSettings } = useSelector((state) => state.account);

  const dispatch = useDispatch();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        resend_quote: quoteSettings.resend_quote,
        resend_after: quoteSettings.resend_after,
        resend_days: quoteSettings.resend_days,
        show_invoice_sign_off: Boolean(quoteSettings.settings.invoice_sign_off),
        show_tasks_list: Boolean(quoteSettings.settings.tasks_list),
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            resend_after: Yup
              .number()
              .min(1, 'Resend after must be at least 1')
              .max(30, 'Resend after must be less than or equal to 30')
              .nullable(),
            resend_days: Yup
              .number()
              .min(1, 'Resend after must be at least 1')
              .max(10, 'Resend days must be less than or equal to 10')
              .nullable(),
            resend_quote: Yup.boolean(),
            show_invoice_sign_off: Yup.boolean(),
            show_tasks_list: Yup.boolean(),
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            resend_quote: values.resend_quote,
            resend_after: values.resend_after,
            resend_days: values.resend_days,
            reply_to: quoteSettings.reply_to ? quoteSettings.reply_to : '',
            intro_message: quoteSettings.intro_message ? quoteSettings.intro_message : '',
            subject_message: quoteSettings.subject_message ? quoteSettings.subject_message : '',
            cc_email: quoteSettings.cc_email ? quoteSettings.cc_email : '',
            settings: {
              tasks_list: values.show_tasks_list ? values.show_tasks_list : 0,
              invoice_sign_off: values.show_invoice_sign_off ? values.show_invoice_sign_off : 0,
            },
          };

          await dispatch(saveQuoteSettings(organisation.id, quoteSettings.id, data));

          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Quote settings successfully updated');
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
        handleChange,
        errors,
        values
      }): JSX.Element => (
        <form
          noValidate
          onSubmit={handleSubmit}
        >
          <Card {...props}>
            <CardHeader title="Quote settings" />
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
                    Display tasks list
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Some descriptive text
                  </Typography>
                  <Switch
                    checked={values.show_tasks_list}
                    color="primary"
                    onChange={handleChange}
                    defaultChecked={values.show_tasks_list}
                    edge="start"
                    name="show_tasks_list"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="subtitle2"
                  >
                    Resend quotes
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    This will auto-resend quotes to the customer at the interval indicated, unless the customer clicks approve or you change the status
                  </Typography>
                  <Switch
                    checked={values.resend_quote}
                    color="primary"
                    edge="start"
                    name="resend_quote"
                    onChange={handleChange}
                    value={values.resend_quote}
                  />
                </Grid>
                {values.resend_quote && (
                  <>
                    <Grid
                      item
                      sm={3}
                      xs={6}
                    >
                      <TextField
                        autoFocus
                        error={Boolean(touched.resend_after && errors.resend_after)}
                        fullWidth
                        helperText={touched.resend_after && errors.resend_after}
                        margin="normal"
                        name="resend_after"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.resend_after}
                        type="number"
                        InputProps={{
                          inputProps: {
                            min: 1,
                            max: 30,
                          },
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography
                                color="textSecondary"
                                variant="body2"
                              >
                                Resend after
                              </Typography>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography
                                color="textSecondary"
                                variant="body2"
                              >
                                {values.resend_after === 1 ? 'day' : 'days'}
                              </Typography>
                            </InputAdornment>
                          )
                        }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      sm={3}
                      xs={6}
                    >
                      <TextField
                        autoFocus
                        error={Boolean(touched.resend_days && errors.resend_days)}
                        fullWidth
                        helperText={touched.resend_days && errors.resend_days}
                        margin="normal"
                        name="resend_days"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.resend_days}
                        type="number"
                        InputProps={{
                          inputProps: {
                            min: 1,
                            max: 10,
                          },
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography
                                color="textSecondary"
                                variant="body2"
                              >
                                Only resend
                              </Typography>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography
                                color="textSecondary"
                                variant="body2"
                              >
                                {values.resend_days === 1 ? 'time' : 'times'}
                              </Typography>
                            </InputAdornment>
                          )
                        }}
                        variant="outlined"
                      />
                    </Grid>
                  </>
                )}
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

export default QuoteSettings;
