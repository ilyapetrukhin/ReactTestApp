import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';
import map from 'lodash/map';
import values from 'lodash/values';

import { MergeTagsInfo } from 'src/components/widgets/info-cards';
import { SMS_MERGE_TAGS } from 'src/constants/invoice';
import { saveJobMessagingSettings } from 'src/slices/account';
import { useDispatch, useSelector } from 'src/store';

import ApplyToActiveJobsDialogue from './ApplyToActiveJobsDialogue';
import CardHeaderRemainingSms from '../CardHeaderRemainingSms';

interface SmsManagementConfigureProps {}

const MIN_HOURS_BEFORE_SCHEDULE_TIME = 1;
const MAX_HOURS_BEFORE_SCHEDULE_TIME = 1000;

const SMS_MESSAGE_MIN_CHARACTERS = 1;
const SMS_MESSAGE_MAX_CHARACTERS = 130;

const SmsManagementConfigure: FC<SmsManagementConfigureProps> = memo(() => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    id: organisationId,
    messaging_settings: messagingSettings,
    analysis_preferences: analyticsPreferences,
  } = useSelector((state) => state.account.organisation);

  const smsMergeTags = useMemo(
    () => map(values(SMS_MERGE_TAGS), (tag) => ({ name: tag })),
    []
  );

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const handleSave = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      handleOpenModal();
    },
    [handleOpenModal]
  );

  return (
    <Card>
      <CardHeaderRemainingSms />
      <Divider />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <MergeTagsInfo
            mergeTags={smsMergeTags}
            tagsPerColumn={3}
          />
        </Box>
        <Formik
          enableReinitialize
          initialValues={{
            booking_reminder_sms_before_hours:
              messagingSettings.booking_reminder_sms_before_hours,
            booking_reminder_sms_enabled:
              messagingSettings.booking_reminder_sms_enabled,
            booking_reminder_sms_message:
              messagingSettings.booking_reminder_sms_message,

            booking_sms_enabled: messagingSettings.booking_reminder_sms_enabled,
            booking_sms_message: messagingSettings.booking_sms_message,

            job_complete_sms_enabled:
              messagingSettings.job_complete_sms_enabled,
            job_complete_sms_message:
              messagingSettings.job_complete_sms_message,

            sms_tech_on_way_template:
              analyticsPreferences.sms_tech_on_way_template,

            update_active_jobs: false,
            update_options: [],

            submitErr: null,

          }}
          validationSchema={Yup.object().shape({
            booking_reminder_sms_enabled: Yup.boolean(),
            booking_reminder_sms_before_hours: Yup.number()
              .min(
                MIN_HOURS_BEFORE_SCHEDULE_TIME,
                `Hours must be in range ${MIN_HOURS_BEFORE_SCHEDULE_TIME} - ${MAX_HOURS_BEFORE_SCHEDULE_TIME}`
              )
              .max(MAX_HOURS_BEFORE_SCHEDULE_TIME)
              .required('This field is required'),
            booking_reminder_sms_message: Yup.string()
              .min(SMS_MESSAGE_MIN_CHARACTERS)
              .max(
                SMS_MESSAGE_MAX_CHARACTERS,
                `Reminder must be at most ${SMS_MESSAGE_MAX_CHARACTERS} characters`
              ),

            booking_sms_enabled: Yup.boolean(),
            booking_sms_message: Yup.string()
              .min(SMS_MESSAGE_MIN_CHARACTERS)
              .max(
                130,
                `Booking message must be at most ${SMS_MESSAGE_MAX_CHARACTERS} characters`
              ),

            job_complete_sms_enabled: Yup.boolean(),
            job_complete_sms_message: Yup.string()
              .min(SMS_MESSAGE_MIN_CHARACTERS)
              .max(
                130,
                `Jobe complete message must be at most ${SMS_MESSAGE_MAX_CHARACTERS} characters`
              ),
          })}
          onSubmit={async (values, { setSubmitting, setStatus, setErrors }) => {
            const data = {
              booking_reminder_sms_before_hours:
                values.booking_reminder_sms_before_hours,
              booking_reminder_sms_enabled: values.booking_reminder_sms_enabled,
              booking_reminder_sms_message:
                values.booking_reminder_sms_message || '',

              booking_sms_enabled: values.booking_sms_enabled,
              booking_sms_message: values.booking_sms_message || '',

              job_complete_sms_enabled: values.job_complete_sms_enabled,
              job_complete_sms_message: values.job_complete_sms_message || '',

              sms_tech_on_way_template: values.sms_tech_on_way_template || '',

              update_active_jobs: values.update_active_jobs,

              update_options: values.update_options,
            };

            try {
              setStatus({ success: true });
              await dispatch(saveJobMessagingSettings(organisationId, data));
              handleCloseModal();
              toast.success('SMS settings successfully updated');
            } catch (err) {
              setStatus({ success: false });
              setErrors({ submitErr: err.message });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <form
              noValidate
              onSubmit={handleSubmit}
            >
              <Grid
                container
                spacing={2}
                sx={{ pt: 2 }}
              >
                <Grid
                  item
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    variant="h6"
                  >
                    BOOKING REMINDER
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
                          checked={values.booking_reminder_sms_enabled}
                          color="primary"
                          edge="start"
                          name="booking_reminder_sms_enabled"
                          onChange={handleChange}
                          value={values.booking_reminder_sms_enabled}
                        />
                      )}
                      label="SMS"
                    />
                  </Box>
                  <Grid
                    item
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <TextField
                      autoFocus
                      error={Boolean(
                        touched.booking_reminder_sms_before_hours
                          && errors.booking_reminder_sms_before_hours
                      )}
                      fullWidth
                      helperText={
                        touched.booking_reminder_sms_before_hours
                        && errors.booking_reminder_sms_before_hours
                      }
                      label="Hours before schedule time"
                      margin="normal"
                      name="booking_reminder_sms_before_hours"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.booking_reminder_sms_before_hours}
                      type="number"
                      required
                      InputProps={{
                        inputProps: {
                          min: MIN_HOURS_BEFORE_SCHEDULE_TIME,
                          max: MAX_HOURS_BEFORE_SCHEDULE_TIME,
                        },
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      error={Boolean(
                        touched.booking_reminder_sms_message
                          && errors.booking_reminder_sms_message
                      )}
                      fullWidth
                      helperText={
                        touched.booking_reminder_sms_message
                        && errors.booking_reminder_sms_message
                          ? errors.booking_reminder_sms_message
                          : `${values.booking_reminder_sms_message.length}/${SMS_MESSAGE_MAX_CHARACTERS}`
                      }
                      name="booking_reminder_sms_message"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.booking_reminder_sms_message}
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
                    BOOKING CHANGED
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
                          checked={values.booking_sms_enabled}
                          color="primary"
                          edge="start"
                          name="booking_sms_enabled"
                          onChange={handleChange}
                          value={values.booking_sms_enabled}
                        />
                      )}
                      label="SMS"
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      error={Boolean(
                        touched.booking_sms_message
                          && errors.booking_sms_message
                      )}
                      fullWidth
                      helperText={
                        touched.booking_sms_message
                        && errors.booking_sms_message
                          ? errors.booking_sms_message
                          : `${values.booking_sms_message.length}/${SMS_MESSAGE_MAX_CHARACTERS}`
                      }
                      name="booking_sms_message"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.booking_sms_message}
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
                    JOB COMPLETE NOTIFICATION
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
                          checked={values.job_complete_sms_enabled}
                          color="primary"
                          edge="start"
                          name="job_complete_sms_enabled"
                          onChange={handleChange}
                          value={values.job_complete_sms_enabled}
                        />
                      )}
                      label="SMS"
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      error={Boolean(
                        touched.job_complete_sms_message
                          && errors.job_complete_sms_message
                      )}
                      fullWidth
                      helperText={
                        touched.job_complete_sms_message
                        && errors.job_complete_sms_message
                          ? errors.job_complete_sms_message
                          : `${values.job_complete_sms_message.length}/${SMS_MESSAGE_MAX_CHARACTERS}`
                      }
                      name="job_complete_sms_message"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.job_complete_sms_message}
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
                    TECHNICIAN ON THE WAY
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Some descriptive text
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <TextField
                      error={Boolean(
                        touched.sms_tech_on_way_template
                          && errors.sms_tech_on_way_template
                      )}
                      fullWidth
                      helperText={
                        touched.sms_tech_on_way_template
                        && errors.sms_tech_on_way_template
                          ? errors.sms_tech_on_way_template
                          : `${values.sms_tech_on_way_template.length}/${SMS_MESSAGE_MAX_CHARACTERS}`
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
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 2,
                }}
              >
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Box>
              <Dialog
                fullWidth
                maxWidth="sm"
                scroll="body"
                onClose={handleCloseModal}
                open={isModalOpen}
              >
                {isModalOpen && (
                  <ApplyToActiveJobsDialogue
                    options={values.update_options}
                    onChangeOptions={(options) => {
                      setFieldValue('update_options', options);
                    }}
                    isSubmitting={isSubmitting}
                    onClose={handleCloseModal}
                    onSubmit={(updateActiveJobs) => {
                      setFieldValue('update_active_jobs', updateActiveJobs);
                      handleSubmit();
                    }}
                  />
                )}
              </Dialog>
            </form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
});

SmsManagementConfigure.propTypes = {};

export default SmsManagementConfigure;
