import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import * as Yup from 'yup';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'src/store';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { ChemicalTest } from 'src/types/chemical';
import { useRouter } from 'next/router';
import { ExceptionList } from './chemical-test-exception';
import { updateChemicalTest } from 'src/slices/chemicalTest';

interface ChemicalTestFormProps {
  chemicalTest: ChemicalTest;
}

const getInitialValues = (
  chemicalTest?: ChemicalTest
): ChemicalTest => merge({}, {
  submit: false
}, chemicalTest);

const ChemicalTestForm: FC<ChemicalTestFormProps> = (props) => {
  const {
    chemicalTest,
    ...rest
  } = props;
  const { organisation } = useSelector((state) => state.account);
  const { chemicalTestExceptions } = useSelector((state) => state.chemicalTest);
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Formik
      enableReinitialize
      initialValues={getInitialValues(chemicalTest)}
      validationSchema={
        Yup
          .object()
          .shape({
            minimum_value: Yup
              .number()
              .required('Minimum is required'),
            maximum_value: Yup
              .number()
              .required('Maximum is required'),
            target_value: Yup
              .number()
              .required('Target is required'),
            low_pdf_msg: Yup
              .string()
              .max(500),
            high_pdf_msg: Yup
              .string()
              .max(500),
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
            name: chemicalTest.name,
            is_default: values.is_default,
            minimum_value: values.minimum_value,
            maximum_value: values.maximum_value,
            target_value: values.target_value,
            low_pdf_msg: values.low_pdf_msg,
            high_pdf_msg: values.high_pdf_msg,
            exceptions: chemicalTestExceptions.map((chemicalTestException) => {
              const exception = {
                ...chemicalTestException
              };
              if (exception.id?.toString().includes('virtual')) {
                delete exception.id;
              }
              return exception;
            }),
          };

          await dispatch(updateChemicalTest(organisation.id, chemicalTest.id, data));

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Chemical test successfully updated');

          router.push('/setup/water-testing/chemical-tests');
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
              <Card variant="outlined">
                <CardHeader title="Details" />
                <Divider />
                <CardContent>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Name"
                    disabled
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
                  <Grid
                    container
                    spacing={3}
                    sx={{ pt: 3 }}
                  >
                    <Grid
                      item
                      sm={4}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.minimum_value && errors.minimum_value)}
                        fullWidth
                        helperText={touched.minimum_value && errors.minimum_value}
                        type="number"
                        label="Minimum"
                        name="minimum_value"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.minimum_value}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      sm={4}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.maximum_value && errors.maximum_value)}
                        fullWidth
                        helperText={touched.maximum_value && errors.maximum_value}
                        type="number"
                        label="Maximum"
                        name="maximum_value"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.maximum_value}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      sm={4}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.target_value && errors.target_value)}
                        fullWidth
                        helperText={touched.target_value && errors.target_value}
                        type="number"
                        label="Target"
                        name="target_value"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.target_value}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3 }}>
                    <TextField
                      error={Boolean(touched.low_pdf_msg && errors.low_pdf_msg)}
                      fullWidth
                      helperText={`${500 - (values.low_pdf_msg ? values.low_pdf_msg.length : 0)} characters left`}
                      multiline
                      rows={4}
                      label="Report low message"
                      name="low_pdf_msg"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.low_pdf_msg}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <TextField
                      error={Boolean(touched.high_pdf_msg && errors.high_pdf_msg)}
                      fullWidth
                      helperText={`${500 - (values.high_pdf_msg ? values.high_pdf_msg.length : 0)} characters left`}
                      multiline
                      rows={4}
                      label="Report high message"
                      name="high_pdf_msg"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.high_pdf_msg}
                      variant="outlined"
                    />
                  </Box>
                  {errors.submit && (
                    <Box mt={3}>
                      <FormHelperText error>
                        {errors.submit}
                      </FormHelperText>
                    </Box>
                  )}
                </CardContent>
                <CardActions
                  sx={{
                    justifyContent: 'flex-end',
                    p: 2
                  }}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Update
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <Card>
                <CardHeader title="Exceptions" />
                <Divider />
                <CardContent>
                  <ExceptionList />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

ChemicalTestForm.propTypes = {
  // @ts-ignore
  chemicalTest: PropTypes.object.isRequired,
};

export default ChemicalTestForm;
