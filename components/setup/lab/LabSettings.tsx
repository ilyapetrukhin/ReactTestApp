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
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { saveLabSettings } from 'src/slices/account';
import toast from 'react-hot-toast';

const LabSettings: FC = (props) => {
  const { organisation, analysisPreferences } = useSelector((state) => state.account);

  const dispatch = useDispatch();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        pool_reminder: analysisPreferences.pool_reminder,
        spa_reminder: analysisPreferences.spa_reminder,
        swim_spa_reminder: analysisPreferences.swim_spa_reminder,
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            pool_reminder: Yup
              .number()
              .min(0, 'Reminder weeks must be at least 0')
              .max(50, 'Reminder weeks must be at most 50')
              .required(),
            spa_reminder: Yup
              .number()
              .min(0, 'Reminder weeks must be at least 0')
              .max(50, 'Reminder weeks must be at most 50')
              .required(),
            swim_spa_reminder: Yup
              .number()
              .min(0, 'Reminder weeks must be at least 0')
              .max(50, 'Reminder weeks must be at most 50')
              .required(),
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            pool_reminder: values.pool_reminder,
            spa_reminder: values.spa_reminder,
            swim_spa_reminder: values.swim_spa_reminder,
          };

          await dispatch(saveLabSettings(organisation.id, data));

          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Lab settings successfully updated');
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
            <CardHeader title="Settings" />
            <Divider />
            <CardContent>
              <Typography
                color="textPrimary"
                gutterBottom
                variant="subtitle2"
              >
                Next test date reminder
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                Some descriptive text
              </Typography>
              <Grid
                container
                spacing={6}
                sx={{
                  pt: 2
                }}
              >
                <Grid
                  item
                  sm={3}
                  xs={6}
                >
                  <TextField
                    autoFocus
                    error={Boolean(touched.pool_reminder && errors.pool_reminder)}
                    fullWidth
                    helperText={touched.pool_reminder && errors.pool_reminder}
                    margin="normal"
                    label="Pool"
                    name="pool_reminder"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.pool_reminder}
                    type="number"
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: 50,
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography
                            color="textSecondary"
                            variant="body2"
                          >
                            {values.pool_reminder === 1 ? 'week' : 'weeks'}
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
                    error={Boolean(touched.spa_reminder && errors.spa_reminder)}
                    fullWidth
                    helperText={touched.spa_reminder && errors.spa_reminder}
                    margin="normal"
                    label="Spa"
                    name="spa_reminder"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.spa_reminder}
                    type="number"
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: 50,
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography
                            color="textSecondary"
                            variant="body2"
                          >
                            {values.spa_reminder === 1 ? 'week' : 'weeks'}
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
                    error={Boolean(touched.swim_spa_reminder && errors.swim_spa_reminder)}
                    fullWidth
                    helperText={touched.swim_spa_reminder && errors.swim_spa_reminder}
                    margin="normal"
                    label="Swim Spa"
                    name="swim_spa_reminder"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.swim_spa_reminder}
                    type="number"
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: 50,
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography
                            color="textSecondary"
                            variant="body2"
                          >
                            {values.swim_spa_reminder === 1 ? 'week' : 'weeks'}
                          </Typography>
                        </InputAdornment>
                      )
                    }}
                    variant="outlined"
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

export default LabSettings;
