import React, { useEffect, useCallback } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  IconButton,
  TextField,
  Theme,
  Grid,
} from '@mui/material';
import * as Yup from 'yup';
import { Formik, Form, useFormikContext } from 'formik';
import { removeException, updateException } from 'src/slices/chemicalTest';
import type { SxProps } from '@mui/system';
import { Trash as TrashIcon } from 'react-feather';
import type { ChemicalTestException } from 'src/types/chemical';
import { useDispatch } from 'src/store';
import {
  EXCEPTION_TYPES,
} from 'src/constants/chemical';
import SelectExceptionType from './SelectExceptionType';

interface ExceptionProps {
  exception: ChemicalTestException;
  sx?: SxProps<Theme>;
}

interface AutoSubmitProps {
  exception: ChemicalTestException;
}

const AutoSubmit: FC<AutoSubmitProps> = (props) => {
  const {
    exception,
  } = props;
  const { values } = useFormikContext();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateException({
      ...exception,
      // @ts-ignore
      exception_name: values.exception_name,
      // @ts-ignore
      exception_type: values.exception_type,
      // @ts-ignore
      exception_id: values.exception_id,
      // @ts-ignore
      min_value: values.min_value,
      // @ts-ignore
      max_value: values.max_value,
      // @ts-ignore
      target_value: values.target_value,
    }));
  }, [values]);
  return null;
};

const ExceptionItem: FC<ExceptionProps> = (props) => {
  const {
    exception,
    ...other
  } = props;
  const dispatch = useDispatch();

  const handleDelete = useCallback(() => {
    dispatch(removeException(exception.id));
  }, [exception, removeException]);

  return (
    <ListItem
      {...other}
      disableGutters
      divider
      sx={{
        py: 2,
      }}
      secondaryAction={(
        <IconButton
          edge="end"
          aria-label="delete"
          title="Delete"
          sx={{
            color: 'error.main',
          }}
          onClick={() => handleDelete()}
        >
          <TrashIcon />
        </IconButton>
      )}
    >
      <Formik
        initialValues={{
          exception_name: exception.exception_name,
          exception_type: exception.exception_type,
          exception_id: exception.exception_id,
          min_value: exception.min_value,
          max_value: exception.max_value,
          target_value: exception.target_value,
          submit: null
        }}
        validationSchema={
          Yup
            .object()
            .shape({
              exception_name: Yup
                .string()
                .required('Type is required'),
              min_value: Yup
                .number()
                .required('Minimum is required'),
              max_value: Yup
                .number()
                .required('Maximum is required'),
              target_value: Yup
                .number()
                .required('Target is required'),
            })
        }
        onSubmit={() => {}}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          setFieldValue,
          touched,
          values
        }): JSX.Element => (
          <Form {...other}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Type"
                      name="exception_name"
                      onChange={handleChange}
                      size="small"
                      select
                      required
                      SelectProps={{ native: true }}
                      value={values.exception_name}
                      variant="outlined"
                    >
                      {EXCEPTION_TYPES.map((exceptionType) => (
                        <option
                          key={exceptionType.value}
                          value={exceptionType.value}
                        >
                          {exceptionType.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <SelectExceptionType
                      exceptionName={values.exception_name}
                      exceptionTypeId={values.exception_id}
                      onUpdate={(selectedOption) => {
                        setFieldValue('exception_type', selectedOption.label);
                        setFieldValue('exception_id', selectedOption.value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <TextField
                  error={Boolean(touched.min_value && errors.min_value)}
                  size="small"
                  fullWidth
                  helperText={touched.min_value && errors.min_value}
                  type="number"
                  label="Minimum"
                  name="min_value"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.min_value}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                sm={4}
                xs={12}
              >
                <TextField
                  error={Boolean(touched.max_value && errors.max_value)}
                  fullWidth
                  helperText={touched.max_value && errors.max_value}
                  size="small"
                  type="number"
                  label="Maximum"
                  name="max_value"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.max_value}
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
                  size="small"
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
            <AutoSubmit exception={exception} />
          </Form>
        )}
      </Formik>
    </ListItem>
  );
};

ExceptionItem.propTypes = {
  // @ts-ignore
  exception: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  sx: PropTypes.object
};

AutoSubmit.propTypes = {
  // @ts-ignore
  exception: PropTypes.object.isRequired,
};

export default ExceptionItem;
