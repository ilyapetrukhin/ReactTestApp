/* eslint-disable */
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import type { FC } from 'react';
import find from 'lodash/find';
import RRule from 'rrule';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {useDispatch, useSelector} from "../../store";
import {
  updateJobTemplate,
  updateUser,
  updateColor,
  addTask,
  updateTask,
  deleteTask,
  reorderTasks,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} from "../../slices/jobDetail";
import JobTemplateSearch from "../widgets/search-inputs/JobTemplateSearch";
import {JobTemplate} from "../../types/jobTemplate";
import type { Task, Invoice } from 'src/types/job';
import type { Color } from 'src/types/organisation';
import {Formik} from "formik";
import * as Yup from "yup";
import {TaskList} from "./task";
import {InvoiceList} from "./invoice";
import XIcon from "../../icons/X";
import RecurrenceSettings from './recurrence-settings/index';

interface JobNewFormProps {
  onChangeRecurrence: (rRule?: RRule) => void;
}

const JobNewForm: FC<JobNewFormProps> = (props) => {
  const { onChangeRecurrence, ...rest} = props;
  const { colors } = useSelector((state) => state.account);
  const { technicians } = useSelector((state) => state.user);
  const { job, tasks, invoices, scrollPosition } = useSelector((state) => state.jobDetail);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecurrenceDialogueOpen, setIsRecurrenceDialogueOpen] = useState<boolean>(false);
  const invoiceRef = useRef<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrollPosition === 'invoice') {
      invoiceRef?.current?.scrollIntoView();
    }
  }, [scrollPosition]);

  const handleTechChange = (techId: number): void => {
    const tech = find(technicians, { id: techId })
    dispatch(updateUser(tech))
  };

  const handleTemplateChange = (jobTemplate: JobTemplate): void => {
    if (jobTemplate) {
      dispatch(updateJobTemplate(jobTemplate));
      setShowSearch(false);
    }
  };

  const handleAddInvoice = (invoice: Invoice): void => {
    dispatch(addInvoice(invoice));
  };

  const handleUpdateInvoice = (invoice: Invoice): void => {
    dispatch(updateInvoice(invoice));
  };

  const handleDeleteInvoice = (invoiceId: number): void => {
    if (invoiceId) {
      dispatch(deleteInvoice(invoiceId));
    }
  };

  const handleAddTask = (task: Task): void => {
    dispatch(addTask(task));
  };

  const handleUpdateTask = (task: Task): void => {
    dispatch(updateTask(task));
  };

  const handleDeleteTask = (taskId: number): void => {
    if (taskId) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleReorderTasks = (tasks: Task[]): void => {
    if (tasks) {
      dispatch(reorderTasks(tasks));
    }
  };

  const handleUpdateColor = (color: Color | null): void => {
    dispatch(updateColor(color));
  };

  const handleChangeIsRecurrenceDialogOpen = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsRecurrenceDialogueOpen(event.target.checked);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto'
        }}
      >
        <Formik
          enableReinitialize
          initialValues={{
            users: [],
            tasks: tasks,
            invoices: invoices,
            is_unscheduled: false,
            colorcode_id: job.colorcode_id || null,
            job_notes: job.job_notes || '',
            // email_signature: invoiceSettings.email_signature || '',
            submit: null,
          }}
          validationSchema={
            Yup
              .object()
              .shape({
                // email_signature: Yup.string().max(1000, 'Email signature must be at most 1000 characters').nullable(),
                // theme_color: Yup.string().nullable(),
              })
          }
          onSubmit={async (values, {
            setErrors,
            setStatus,
            setSubmitting
          }): Promise<void> => {
            try {
              // const data = {
              //   email_signature: values.email_signature,
              // };

              // await dispatch(saveInvoiceSettings(organisation.id, invoiceSettings.id, data));

              setStatus({ success: true });
              setSubmitting(false);
            } catch (err) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
              isSubmitting,
              setFieldValue,
              errors,
              values
            }): JSX.Element => (
            <form
              noValidate
              onSubmit={handleSubmit}
              {...rest}
            >
              <Card>
                <CardHeader title="Customer details" />
                <Divider />
                <CardContent>
                  <Autocomplete
                    getOptionLabel={(technician): string => `${technician.first_name} ${technician.last_name} (${technician.email})`}
                    multiple
                    options={technicians}
                    onChange={(event, value) => setFieldValue('users', value)}
                    value={values.users}
                    renderInput={(params): JSX.Element => (
                      <TextField
                        fullWidth
                        label="Technician"
                        name="technicians"
                        variant="outlined"
                        {...params}
                      />
                    )}
                  />
                </CardContent>
              </Card>
              <Card
                sx={{
                  mt: 3
                }}
              >
                <CardHeader title="Job type" />
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
                      <JobTemplateSearch onSelect={handleTemplateChange} hideLabel />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card
                sx={{
                  mt: 3
                }}
              >
                <CardHeader title="Tasks" />
                <Divider />
                <CardContent>
                  <TaskList
                    tasks={values.tasks}
                    onAdd={(task) => handleAddTask(task)}
                    onEdit={(task) => handleUpdateTask(task)}
                    onDelete={(taskId) => handleDeleteTask(taskId)}
                    onReorder={(tasks) => handleReorderTasks(tasks)}
                  />
                </CardContent>
              </Card>
              <Card
                sx={{
                  mt: 3
                }}
              >
                <CardHeader title="Job notes" />
                <Divider />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex'
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Color"
                      name="colorcode_id"
                      onChange={(event) => handleUpdateColor(find(colors, { id: parseInt(event.target.value, 10) }))}
                      select
                      value={values.colorcode_id}
                      variant="outlined"
                    >
                      {colors.map((color) => (
                        <MenuItem
                          key={color.id}
                          value={color.id}
                          selected={values.colorcode_id === color.id}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Box
                              width={21}
                              height={21}
                              bgcolor={color.color_code}
                            />
                            <Typography
                              color="textSecondary"
                              variant="body1"
                              sx={{
                                ml: 2
                              }}
                            >
                              {color.color_desc ? color.color_desc : 'No label'}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                    {values.colorcode_id && (
                      <Box
                        sx={{
                          pl: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconButton onClick={() => setFieldValue('colorcode_id', null)}>
                          <XIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Box
                    mt={2}
                  >
                    <TextField
                      error={Boolean(touched.job_notes && errors.job_notes)}
                      fullWidth
                      helperText={touched.job_notes && errors.job_notes}
                      label="Job notes"
                      name="job_notes"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.job_notes}
                      multiline
                      rows={2}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
              <Box
                ref={invoiceRef}
              >
                <Card
                  sx={{
                    mt: 3
                  }}
                >
                  <CardHeader title="Invoice" />
                  <Divider />
                  <CardContent>
                    <InvoiceList
                      invoices={values.invoices}
                      onAdd={(invoice) => handleAddInvoice(invoice)}
                      onEdit={(invoice) => handleUpdateInvoice(invoice)}
                      onDelete={(invoiceId) => handleDeleteInvoice(invoiceId)}
                    />
                  </CardContent>
                </Card>
              </Box>
              <Card
                sx={{
                  mt: 3
                }}
              >
                <CardHeader title="Schedule" />
                <Divider />
                <CardContent>
                  <Box
                    sx={{
                      mt: 2,
                      px: 1.5
                    }}
                    display="flex"
                    flexDirection="row"
                  >
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={values.is_unscheduled}
                          color="primary"
                          edge="start"
                          name="is_unscheduled"
                          onChange={handleChange}
                        />
                      )}
                      label={(
                        <div>
                          Save as unscheduled
                          <Typography
                            color="textSecondary"
                            component="p"
                            variant="caption"
                          >
                            Useful description
                          </Typography>
                        </div>
                      )}
                    />
                    <FormControlLabel
                      sx={{
                        ml: 2
                      }}
                      control={(
                        <Switch
                          checked={isRecurrenceDialogueOpen}
                          color="primary"
                          edge="start"
                          onChange={handleChangeIsRecurrenceDialogOpen}
                        />
                      )}
                      label={(
                        <div>
                          Make recurring
                          <Typography
                            color="textSecondary"
                            component="p"
                            variant="caption"
                          >
                            Useful description
                          </Typography>
                        </div>
                      )}
                    />
                  </Box>
                  {
                    isRecurrenceDialogueOpen && (
                      <Box paddingY={2}>
                        <RecurrenceSettings date={new Date()} onChange={onChangeRecurrence} />
                      </Box>
                    )
                  }
                </CardContent>
              </Card>
              <Card
                sx={{
                  mt: 3
                }}
              >
                <CardHeader title="SMS notifications" />
                <Divider />
                <CardContent>
                </CardContent>
              </Card>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2
                }}
              >
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  SAVE JOB
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

JobNewForm.propTypes = {};

export default JobNewForm;
