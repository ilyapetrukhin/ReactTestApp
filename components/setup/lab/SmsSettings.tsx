import type { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  Switch, TextField,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { saveLabSettings } from 'src/slices/account';
import toast from 'react-hot-toast';

const SmsSettings: FC = (props) => {
  const { organisation, analysisPreferences } = useSelector((state) => state.account);

  const dispatch = useDispatch();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        sms_reminder_enabled: analysisPreferences.sms_reminder_enabled,
        sms_reminder_days: analysisPreferences.sms_reminder_days,
        sms_tech_on_way_template: analysisPreferences.sms_tech_on_way_template || '',
        sms_water_test_template: analysisPreferences.sms_water_test_template || '',
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            sms_reminder_enabled: Yup.boolean(),
            sms_reminder_days: Yup
              .number()
              .min(1, 'Due days must be at least 1')
              .max(365, 'Due days must be at most 365')
              .required(),
            sms_tech_on_way_template: Yup.string().max(130, 'Reminder must be at most 130 characters').nullable(),
            sms_water_test_template: Yup.string().max(130, 'Water test results must be at most 130 characters').nullable()
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            sms_tech_on_way_template: values.sms_tech_on_way_template ? values.sms_tech_on_way_template : '',
            sms_reminder_enabled: values.sms_reminder_enabled,
            sms_reminder_days: values.sms_reminder_days,
            sms_water_test_template: values.sms_water_test_template ? values.sms_water_test_template : '',
          };

          await dispatch(saveLabSettings(organisation.id, data));

          setStatus({ success: true });
          setSubmitting(false);
          toast.success('SMS settings successfully updated');
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
            <CardHeader title="SMS settings" />
            <Divider />
            <CardContent>
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
                          checked={values.sms_reminder_enabled}
                          color="primary"
                          edge="start"
                          name="sms_reminder_enabled"
                          onChange={handleChange}
                          value={values.sms_reminder_enabled}
                        />
                      )}
                      label="Enabled"
                    />
                  </Box>
                  {values.sms_reminder_enabled && (
                    <Grid
                      item
                      md={2}
                      sm={3}
                      xs={6}
                    >
                      <TextField
                        autoFocus
                        error={Boolean(touched.sms_reminder_days && errors.sms_reminder_days)}
                        fullWidth
                        helperText={touched.sms_reminder_days && errors.sms_reminder_days}
                        label="Days before test due"
                        margin="normal"
                        name="sms_reminder_days"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.sms_reminder_days}
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
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      error={Boolean(touched.sms_tech_on_way_template && errors.sms_tech_on_way_template)}
                      fullWidth
                      helperText={
                        touched.sms_tech_on_way_template && errors.sms_tech_on_way_template
                          ? errors.sms_tech_on_way_template
                          : `${values.sms_tech_on_way_template.length}/130`
                      }
                      name="sms_tech_on_way_template"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.sms_tech_on_way_template}
                      multiline
                      required
                      rows={2}
                      variant="outlined"
                    />
                  </Box>
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
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      error={Boolean(touched.sms_water_test_template && errors.sms_water_test_template)}
                      fullWidth
                      helperText={
                        touched.sms_water_test_template && errors.sms_water_test_template
                          ? errors.sms_water_test_template
                          : `${values.sms_water_test_template.length}/130`
                      }
                      name="sms_water_test_template"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.sms_water_test_template}
                      multiline
                      required
                      rows={2}
                      variant="outlined"
                    />
                  </Box>
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

export default SmsSettings;
