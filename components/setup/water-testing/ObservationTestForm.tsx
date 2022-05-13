import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import type { FC } from 'react';
import merge from 'lodash/merge';
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
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { ObservationTest, PoolType } from 'src/types/chemical';
import { apiConfig } from 'src/config';
import { useRouter } from 'next/router';
import AffectedPoolTypes from './AffectedPoolTypes';

interface ObservationTestFormProps {
  observationTest?: ObservationTest;
  onSave?: () => void;
  onUpdate?: () => void;
}

const getInitialValues = (
  observationTest?: ObservationTest,
): ObservationTest => {
  if (observationTest) {
    return merge({}, {
      submit: null
    }, observationTest);
  }

  return {
    name: '',
    is_default: false,
    order: 0,
    report_message: '',
    submit: null
  };
};

const ObservationTestForm: FC<ObservationTestFormProps> = (props) => {
  const {
    observationTest,
    onSave,
    onUpdate,
    ...rest
  } = props;
  const { organisation } = useSelector((state) => state.account);
  const router = useRouter();

  const isCreating = !observationTest;

  return (
    <Formik
      initialValues={getInitialValues(observationTest)}
      validationSchema={
        Yup
          .object()
          .shape({
            name: Yup
              .string()
              .max(255)
              .required('Name is required'),
            report_message: Yup
              .string()
              .max(500)
              .nullable()
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
            is_default: values.is_default,
            report_message: values.report_message ? values.report_message : '',
            pool_types: values.pool_types.map((poolType) => poolType.id),
          };

          if (observationTest) {
            await axios.put(`${apiConfig.apiV2Url}/organisations/${organisation.id}/observation-test/${observationTest.id}`, data);
          } else {
            await axios.post(`${apiConfig.apiV2Url}/organisations/${organisation.id}/observation-test`, data);
          }

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          toast.success(`Observation test ${isCreating ? 'created' : 'updated'}`);

          if (isCreating && onSave) {
            onSave();
          }

          if (!isCreating && onUpdate) {
            onUpdate();
          }

          router.push('/setup/water-testing/observation-tests');
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
        setFieldValue,
        isSubmitting,
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
              md={8}
              xs={12}
            >
              <Card>
                <CardContent>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Observation test name"
                    required
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                  <Box
                    sx={{ mt: 3 }}
                  >
                    <Typography
                      color="textPrimary"
                      gutterBottom
                      variant="subtitle2"
                    >
                      Is default
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      If this is ticked, the test will appear by default for the technician on site. If it is unticked, they will need to click ‘Add test’ to test it. We recommend only ticking the tests that are done regularly.
                    </Typography>
                    <Switch
                      checked={values.is_default}
                      color="primary"
                      onChange={handleChange}
                      edge="start"
                      name="is_default"
                    />
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <TextField
                      error={Boolean(touched.report_message && errors.report_message)}
                      fullWidth
                      helperText={`${500 - (values.report_message ? values.report_message.length : 0)} characters left`}
                      multiline
                      rows={4}
                      label="Report message"
                      name="report_message"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.report_message}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <Card>
                <CardHeader title="Affected pool types" />
                <Divider />
                <CardContent>
                  <AffectedPoolTypes
                    sx={{
                      ml: 1
                    }}
                    onUpdate={(poolTypes: PoolType[] | []) => setFieldValue('pool_types', poolTypes)}
                    poolTypes={values.pool_types}
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

ObservationTestForm.propTypes = {
  // @ts-ignore
  observationTest: PropTypes.object,
  onUpdate: PropTypes.func,
  onSave: PropTypes.func,
};

export default ObservationTestForm;
