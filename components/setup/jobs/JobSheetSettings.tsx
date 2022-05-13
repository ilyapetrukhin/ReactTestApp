import type { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider, FormHelperText,
  Grid, Paper,
  Switch,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { saveInvoiceSettings } from 'src/slices/account';
import toast from 'react-hot-toast';
import { QuillEditor } from '../../quill-editor';

const JobSheetSettings: FC = (props) => {
  const { organisation, invoiceSettings } = useSelector((state) => state.account);

  const dispatch = useDispatch();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        show_job_sheet: Boolean(invoiceSettings.settings.tasks_list)
          || Boolean(invoiceSettings.settings.water_result)
          || Boolean(invoiceSettings.settings.chemical_history),
        show_tasks_list: Boolean(invoiceSettings.settings.tasks_list),
        show_water_result: Boolean(invoiceSettings.settings.water_result),
        show_chemical_history: Boolean(invoiceSettings.settings.chemical_history),
        show_chemical_actions: Boolean(invoiceSettings.settings.chemical_actions),
        display_invoice_notes: Boolean(invoiceSettings.settings.display_invoice_notes),
        disclaimer: invoiceSettings.disclaimer || '',
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            show_job_sheet: Yup.boolean(),
            show_tasks_list: Yup.boolean(),
            show_water_result: Yup.boolean(),
            show_chemical_history: Yup.boolean(),
            show_chemical_actions: Yup.boolean(),
            display_invoice_notes: Yup.boolean(),
            disclaimer: Yup.string().max(1000, 'Disclaimer must be at most 1000 characters').nullable(),
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            payment_message: invoiceSettings.payment_message ? invoiceSettings.payment_message : '',
            disclaimer: values.disclaimer ? values.disclaimer : '',
            intro_message: invoiceSettings.intro_message ? invoiceSettings.intro_message : '',
            invoice_due_days: invoiceSettings.invoice_due_days ? invoiceSettings.invoice_due_days : '',
            reply_to: invoiceSettings.reply_to ? invoiceSettings.reply_to : '',
            settings: {
              water_result: values.show_job_sheet ? values.show_water_result : 0,
              tasks_list: values.show_job_sheet ? values.show_tasks_list : 0,
              chemical_history: values.show_job_sheet ? values.show_chemical_history : 0,
              chemical_actions: values.show_job_sheet ? values.show_chemical_actions : 0,
              display_invoice_notes: (values.show_job_sheet && values.display_invoice_notes) ? values.display_invoice_notes : 0,
              use_invoice_sign_off: invoiceSettings.settings.use_invoice_sign_off,
            },
          };

          await dispatch(saveInvoiceSettings(organisation.id, invoiceSettings.id, data));

          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Job sheet settings successfully updated');
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        handleSubmit,
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
            <CardHeader title="Job sheet settings" />
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
                    Show job sheet
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
                    defaultChecked={values.show_job_sheet}
                    edge="start"
                    name="show_job_sheet"
                  />
                </Grid>
                {values.show_job_sheet && (
                  <>
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
                        Show tasks list
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
                        edge="start"
                        name="show_tasks_list"
                        onChange={handleChange}
                        value={values.show_tasks_list}
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
                        Show water test results
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Some descriptive text
                      </Typography>
                      <Switch
                        checked={values.show_water_result}
                        color="primary"
                        edge="start"
                        name="show_water_result"
                        onChange={handleChange}
                        value={values.show_water_result}
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
                        Show chemical history
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Some descriptive text
                      </Typography>
                      <Switch
                        checked={values.show_chemical_history}
                        color="primary"
                        edge="start"
                        name="show_chemical_history"
                        onChange={handleChange}
                        value={values.show_chemical_history}
                      />
                    </Grid>
                    {values.show_chemical_history && (
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
                          Show chemical actions
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="body2"
                        >
                          Some descriptive text
                        </Typography>
                        <Switch
                          checked={values.show_chemical_actions}
                          color="primary"
                          edge="start"
                          name="show_chemical_actions"
                          onChange={handleChange}
                          value={values.show_chemical_actions}
                        />
                      </Grid>
                    )}
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
                        Show invoice notes
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Some descriptive text
                      </Typography>
                      <Switch
                        checked={values.display_invoice_notes}
                        color="primary"
                        edge="start"
                        name="display_invoice_notes"
                        onChange={handleChange}
                        value={values.display_invoice_notes}
                      />
                    </Grid>
                  </>
                )}
                <Grid
                  item
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    variant="h6"
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
                  {errors.disclaimer && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {errors.disclaimer}
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

export default JobSheetSettings;
