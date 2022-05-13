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
  Tooltip,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { saveBatchSettings } from 'src/slices/account';
import toast from 'react-hot-toast';
import InformationCircleIcon from 'src/icons/InformationCircle';

const BatchSettings: FC = (props) => {
  const { organisation, batchSettings } = useSelector((state) => state.account);

  const dispatch = useDispatch();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        prefix: batchSettings.prefix || '',
        send_job_sheet_on_complete: batchSettings.send_job_sheet_on_complete,
        attach_job_sheets: batchSettings.attach_job_sheets,
        attach_individual_invoices: batchSettings.attach_individual_invoices,
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            prefix: Yup.string().max(3, 'Invoice prefix must be at most 3 characters').nullable(),
            send_job_sheet_on_complete: Yup.boolean(),
            attach_job_sheets: Yup.boolean(),
            attach_individual_invoices: Yup.boolean(),
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            prefix: values.prefix ? values.prefix : '',
            reply_to: batchSettings.reply_to ? batchSettings.reply_to : '',
            intro_message: batchSettings.intro_message ? batchSettings.intro_message : '',
            subject_message: batchSettings.subject_message ? batchSettings.subject_message : '',
            cc_emails: batchSettings.cc_emails ? batchSettings.cc_emails : '',
            send_job_sheet_on_complete: values.send_job_sheet_on_complete,
            attach_job_sheets: values.attach_job_sheets,
            attach_individual_invoices: values.attach_individual_invoices,
          };

          await dispatch(saveBatchSettings(organisation.id, data));

          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Batch settings successfully updated');
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
            <CardHeader title="Batch settings" />
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
                    Attach individual invoices to batch invoice
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
                    defaultChecked={values.attach_individual_invoices}
                    edge="start"
                    name="attach_individual_invoices"
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
                    error={Boolean(touched.prefix && errors.prefix)}
                    fullWidth
                    helperText={touched.prefix && errors.prefix}
                    label="Prefix"
                    margin="normal"
                    name="prefix"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.prefix}
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
                  lg={3}
                  sm={6}
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="subtitle2"
                  >
                    Send job sheet on job completion
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Some descriptive text
                  </Typography>
                  <Switch
                    checked={values.send_job_sheet_on_complete}
                    color="primary"
                    edge="start"
                    name="send_job_sheet_on_complete"
                    onChange={handleChange}
                    value={values.send_job_sheet_on_complete}
                  />
                </Grid>
                <Grid
                  item
                  lg={3}
                  sm={6}
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="subtitle2"
                  >
                    Attach job sheets to batch invoice
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Some descriptive text
                  </Typography>
                  <Switch
                    checked={values.attach_job_sheets}
                    color="primary"
                    edge="start"
                    name="attach_job_sheets"
                    onChange={handleChange}
                    value={values.attach_job_sheets}
                  />
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

export default BatchSettings;
