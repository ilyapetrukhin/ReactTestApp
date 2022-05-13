import React from 'react';
import axios from 'axios';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';
import * as Yup from 'yup';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import { useSelector } from 'src/store';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
} from '@mui/material';
import type { JobTemplate, JobType } from 'src/types/jobTemplate';
import type { Product } from 'src/types/product';
import { apiConfig } from 'src/config';
import { useRouter } from 'next/router';
import { Task } from 'src/types/jobTemplate';
import { TaskList } from './task';
import { ProductList } from './product';

interface JobTemplateFormProps {
  jobTemplate?: JobTemplate;
  onSave?: () => void;
  onUpdate?: () => void;
}

const getInitialValues = (
  jobTemplate?: JobTemplate,
  defaultJobType?: JobType,
): JobTemplate => {
  if (jobTemplate) {
    return merge({}, {
      submit: false
    }, jobTemplate);
  }

  return {
    name: '',
    total_hours: defaultJobType ? defaultJobType.job_hours : 0,
    job_type_id: defaultJobType ? defaultJobType.id : null,
    tasks: [],
    products: [],
    submit: null
  };
};

const JobTemplateForm: FC<JobTemplateFormProps> = (props) => {
  const {
    jobTemplate,
    onSave,
    onUpdate,
    ...rest
  } = props;
  const { organisation } = useSelector((state) => state.account);
  const { jobTypes } = useSelector((state) => state.jobTemplate);
  const router = useRouter();

  const isCreating = !jobTemplate;
  const defaultJobType = jobTypes[0];

  const handleAddTask = (task: Task, tasks: Task[], setFieldValue): void => {
    if (!task.id) {
      task.id = tasks.length + 1;
    }

    tasks.push(task);

    if (task) {
      setFieldValue('tasks', tasks);
    }
  };

  const handleUpdateTask = (task: Task, tasks: Task[], setFieldValue): void => {
    const updatedTasks = tasks.map((_task) => {
      if (_task.id === task.id) {
        return task;
      }

      return _task;
    });

    if (task) {
      setFieldValue('tasks', updatedTasks);
    }
  };

  const handleDeleteTask = (taskId: number, tasks: Task[], setFieldValue): void => {
    if (taskId) {
      setFieldValue('tasks', tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleReorderTasks = (tasks: Task[], setFieldValue): void => {
    if (tasks) {
      setFieldValue('tasks', tasks);
    }
  };

  const handleAddProduct = (product: Product, products: Product[], setFieldValue): void => {
    products.push(product);

    if (product) {
      setFieldValue('products', uniqBy(products, 'id'));
    }
  };

  const handleDeleteProduct = (productId: number, products: Product[], setFieldValue): void => {
    if (productId) {
      setFieldValue('products', products.filter((product) => product.id !== productId));
    }
  };

  const handleJobTypeUpdate = (jobTypeId: number, setFieldValue): void => {
    const selectedJobType = find(jobTypes, { id: jobTypeId });

    setFieldValue('job_type_id', jobTypeId);
    setFieldValue('total_hours', selectedJobType.job_hours);
  };

  return (
    <Formik
      initialValues={getInitialValues(jobTemplate, defaultJobType)}
      validationSchema={
        Yup
          .object()
          .shape({
            total_hours: Yup.number().max(100).required('Total hours is required'),
            name: Yup
              .string()
              .max(255)
              .required('Name is required')
          })
      }
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            name: values.name,
            job_type_id: values.job_type_id,
            total_hours: values.total_hours,
            tasks: values.tasks ? values.tasks.map((task) => (
              {
                name: task.name,
                order: task.order,
              }
            )) : [],
            products: values.products ? values.products.map((product) => (
              {
                product_id: product.id
              }
            )) : [],
          };

          if (jobTemplate) {
            await axios.put(`${apiConfig.apiV2Url}/organisations/${organisation.id}/job-template/${jobTemplate.id}`, data);
          } else {
            await axios.post(`${apiConfig.apiV2Url}/organisations/${organisation.id}/job-template`, data);
          }

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          toast.success(`Job template ${isCreating ? 'created' : 'updated'}`);

          if (isCreating && onSave) {
            onSave();
          }

          if (!isCreating && onUpdate) {
            onUpdate();
          }

          router.push('/setup/jobs/job-templates');
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }): JSX.Element => (
        <form
          noValidate
          onSubmit={handleSubmit}
          {...rest}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <Card>
                <CardContent>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Job template name"
                    required
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                  <Box mt={2}>
                    <Grid
                      container
                      alignItems="center"
                      spacing={3}
                    >
                      <Grid
                        item
                        xs={6}
                      >
                        <TextField
                          fullWidth
                          label="Job type"
                          name="job_type_id"
                          onChange={(event) => handleJobTypeUpdate(parseInt(event.target.value, 10), setFieldValue)}
                          select
                          SelectProps={{ native: true }}
                          value={values.job_type_id}
                          variant="outlined"
                        >
                          {jobTypes.map((jobType) => (
                            <option
                              key={jobType.id}
                              value={jobType.id}
                            >
                              {jobType.name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                      >
                        <TextField
                          error={Boolean(touched.total_hours && errors.total_hours)}
                          fullWidth
                          helperText={touched.total_hours && errors.total_hours}
                          label="Total hours"
                          required
                          name="total_hours"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.total_hours}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex'
                }
              }}
            />
            <Grid
              item
              md={6}
              xs={12}
            >
              <Card>
                <CardHeader title="Tasks" />
                <Divider />
                <CardContent>
                  <TaskList
                    tasks={values.tasks}
                    onAdd={(task) => handleAddTask(task, values.tasks, setFieldValue)}
                    onEdit={(task) => handleUpdateTask(task, values.tasks, setFieldValue)}
                    onDelete={(taskId) => handleDeleteTask(taskId, values.tasks, setFieldValue)}
                    onReorder={(tasks) => handleReorderTasks(tasks, setFieldValue)}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <Card>
                <CardHeader title="Products" />
                <Divider />
                <CardContent>
                  <ProductList
                    products={values.products}
                    onAdd={(product) => handleAddProduct(product, values.products, setFieldValue)}
                    onDelete={(productId) => handleDeleteProduct(productId, values.products, setFieldValue)}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {isCreating ? 'Create' : 'Update'}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

JobTemplateForm.propTypes = {
  // @ts-ignore
  jobTemplate: PropTypes.object,
  onUpdate: PropTypes.func,
  onSave: PropTypes.func,
};

export default JobTemplateForm;
