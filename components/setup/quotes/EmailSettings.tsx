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
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import React from 'react';
import values from 'lodash/values';
import map from 'lodash/map';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { saveQuoteSettings } from 'src/slices/account';
import toast from 'react-hot-toast';
import { QuillEditor } from 'src/components/quill-editor';
import InformationCircleIcon from 'src/icons/InformationCircle';
import { QUOTE_MERGE_TAGS } from 'src/constants/invoice';
import MergeTagsInfo from '../../widgets/info-cards/MergeTagsInfo';

const EmailSettings: FC = (props) => {
  const { organisation, quoteSettings } = useSelector((state) => state.account);

  const dispatch = useDispatch();

  const invoiceMergeTags = map(values(QUOTE_MERGE_TAGS), (tag) => ({ name: tag }));

  return (
    <Formik
      enableReinitialize
      initialValues={{
        reply_to: quoteSettings.reply_to || '',
        cc_email: quoteSettings.cc_email || '',
        subject_message: quoteSettings.subject_message || '',
        intro_message: quoteSettings.intro_message || '',
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            reply_to: Yup.string().email('Must be a valid email').max(255).nullable(),
            cc_email: Yup.string().email('Must be a valid email').max(255).nullable(),
            subject_message: Yup.string().max(255, 'Subject message be at most 255 characters').nullable(),
            intro_message: Yup.string().max(1000, 'Intro message must be at most 1000 characters').nullable()
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            reply_to: values.reply_to,
            intro_message: values.intro_message ? values.intro_message : '',
            subject_message: values.subject_message ? values.subject_message : '',
            cc_email: values.cc_email ? values.cc_email : '',
            resend_quote: quoteSettings.resend_quote,
            resend_after: quoteSettings.resend_after ? quoteSettings.resend_after : 0,
            resend_days: quoteSettings.resend_days ? quoteSettings.resend_days : 0,
            settings: quoteSettings.settings,
          };

          await dispatch(saveQuoteSettings(organisation.id, quoteSettings.id, data));

          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Email settings successfully updated');
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
            <CardHeader title="Email settings" />
            <Divider />
            <CardContent>
              <MergeTagsInfo
                mergeTags={invoiceMergeTags}
                tagsPerColumn={3}
              />
              <Grid
                container
                spacing={2}
                sx={{
                  pt: 2
                }}
              >
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    autoFocus
                    error={Boolean(touched.reply_to && errors.reply_to)}
                    fullWidth
                    helperText={touched.reply_to && errors.reply_to}
                    label="Email address"
                    margin="normal"
                    name="reply_to"
                    required
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.reply_to}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="This should be the email address you want customers to reply to">
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
                  sx={{
                    display: {
                      xs: 'none',
                      lg: 'flex'
                    }
                  }}
                />
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    autoFocus
                    error={Boolean(touched.cc_email && errors.cc_email)}
                    fullWidth
                    helperText={touched.cc_email && errors.cc_email}
                    label="Email CC"
                    margin="normal"
                    name="cc_email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.cc_email}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Set an email address if you want to be copied in on invoice emails">
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
                  sx={{
                    display: {
                      xs: 'none',
                      lg: 'flex'
                    }
                  }}
                />
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    autoFocus
                    error={Boolean(touched.subject_message && errors.subject_message)}
                    fullWidth
                    helperText={touched.subject_message && errors.subject_message}
                    label="Intro subject line"
                    margin="normal"
                    name="subject_message"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.subject_message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="This appears in the email and PDF to customers">
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
                      onChange={(value) => setFieldValue('intro_message', value)}
                      placeholder="Write something"
                      name="intro_message"
                      sx={{
                        border: 'none',
                        flexGrow: 1,
                        minHeight: 200
                      }}
                      value={values.intro_message}
                    />
                  </Paper>
                  {errors.intro_message && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {errors.intro_message}
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

export default EmailSettings;
