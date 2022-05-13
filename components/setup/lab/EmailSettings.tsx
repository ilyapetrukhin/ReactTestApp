import type { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  Switch, TextField,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import React from 'react';
import values from 'lodash/values';
import map from 'lodash/map';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { saveLabSettings } from 'src/slices/account';
import toast from 'react-hot-toast';
import { QuillEditor } from 'src/components/quill-editor';
import { LAB_EMAIL_MERGE_TAGS } from 'src/constants/lab';
import MergeTagsInfo from '../../widgets/info-cards/MergeTagsInfo';

const EmailSettings: FC = (props) => {
  const { organisation, analysisPreferences } = useSelector((state) => state.account);

  const dispatch = useDispatch();

  const invoiceMergeTags = map(values(LAB_EMAIL_MERGE_TAGS), (tag) => ({ name: tag }));

  return (
    <Formik
      enableReinitialize
      initialValues={{
        email_reminder_enabled: analysisPreferences.email_reminder_enabled,
        email_reminder_days: analysisPreferences.email_reminder_days,
        email_reminder_template: analysisPreferences.email_reminder_template || '',
        email_water_test_template: analysisPreferences.email_water_test_template || '',
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            email_reminder_enabled: Yup.boolean(),
            email_reminder_days: Yup
              .number()
              .min(1, 'Due days must be at least 1')
              .max(365, 'Due days must be at most 365')
              .required(),
            email_reminder_template: Yup.string().max(1000, 'Reminder must be at most 1000 characters').nullable(),
            email_water_test_template: Yup.string().max(1000, 'Water test results must be at most 1000 characters').nullable()
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            intro_message: values.email_reminder_template ? values.email_reminder_template : '',
            email_reminder_enabled: values.email_reminder_enabled,
            email_reminder_days: values.email_reminder_days,
            email_water_test_template: values.email_water_test_template ? values.email_water_test_template : '',
          };

          await dispatch(saveLabSettings(organisation.id, data));

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
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    variant="h6"
                  >
                    NEXT TEST REMINDER
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Some descriptive text
                  </Typography>
                  <Box sx={{ mx: 1, mt: 3 }}>
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={values.email_reminder_enabled}
                          color="primary"
                          edge="start"
                          name="email_reminder_enabled"
                          onChange={handleChange}
                          value={values.email_reminder_enabled}
                        />
                      )}
                      label="Enabled"
                    />
                  </Box>
                  {values.email_reminder_enabled && (
                    <Grid
                      item
                      md={2}
                      sm={3}
                      xs={6}
                    >
                      <TextField
                        autoFocus
                        error={Boolean(touched.email_reminder_days && errors.email_reminder_days)}
                        fullWidth
                        helperText={touched.email_reminder_days && errors.email_reminder_days}
                        label="Days before test due"
                        margin="normal"
                        name="email_reminder_days"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email_reminder_days}
                        type="number"
                        required
                        InputProps={{
                          inputProps: {
                            min: 1,
                            max: 365,
                          },
                        }}
                        variant="outlined"
                      />
                    </Grid>
                  )}
                  <Paper
                    sx={{ mt: 1 }}
                    variant="outlined"
                  >
                    <QuillEditor
                      onChange={(value) => setFieldValue('email_reminder_template', value)}
                      placeholder="Write something"
                      name="email_reminder_template"
                      sx={{
                        border: 'none',
                        flexGrow: 1,
                        minHeight: 200
                      }}
                      value={values.email_reminder_template}
                    />
                  </Paper>
                  {errors.email_reminder_template && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {errors.email_reminder_template}
                      </FormHelperText>
                    </Box>
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
                    WATER TEST RESULTS
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Some descriptive text
                  </Typography>
                  <Paper
                    sx={{ mt: 3 }}
                    variant="outlined"
                  >
                    <QuillEditor
                      onChange={(value) => setFieldValue('email_water_test_template', value)}
                      placeholder="Write something"
                      name="email_water_test_template"
                      sx={{
                        border: 'none',
                        flexGrow: 1,
                        minHeight: 200
                      }}
                      value={values.email_water_test_template}
                    />
                  </Paper>
                  {errors.email_water_test_template && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {errors.email_water_test_template}
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
