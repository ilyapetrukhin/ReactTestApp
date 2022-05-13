import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Dialog,
  Divider,
  TextField,
  Typography
} from '@mui/material';
import type { Invoice } from 'src/types/job';
import { Formik } from 'formik';

interface ManageInvoiceModalProps {
  onClose?: (invoice: Invoice | null) => void;
  onSubmit: (invoice: Invoice) => void;
  open: boolean;
}

const ManageInvoiceModal: FC<ManageInvoiceModalProps> = (props) => {
  const {
    onClose,
    onSubmit,
    open,
    ...other
  } = props;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      open={open}
      {...other}
    >
      <Formik
        initialValues={{
          name: '',
          cost: 0,
          submit: null
        }}
        validationSchema={
          Yup
            .object()
            .shape({
              name: Yup.string().max(255).required('Name is required'),
              cost: Yup.number().required('Cost is required'),
            })
        }
        onSubmit={async (values, {
          resetForm,
          setErrors,
          setStatus,
          setSubmitting
        }): Promise<void> => {
          try {
            const customProduct = {
              name: values.name,
              cost: values.cost,
              gst_cost: values.cost,
              quantity: 1,
            };
            onSubmit(customProduct);
            if (onClose) {
              onClose(customProduct);
            }

            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
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
          >
            <Box sx={{ p: 3 }}>
              <Typography
                align="center"
                color="textPrimary"
                gutterBottom
                variant="h5"
              >
                Custom product
              </Typography>
            </Box>
            <Box sx={{ px: 3 }}>
              <TextField
                autoFocus
                error={Boolean(touched.name && errors.name)}
                fullWidth
                helperText={touched.name && errors.name}
                label="Name"
                name="name"
                required
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                variant="outlined"
              />
              <Box sx={{ mt: 2 }}>
                <TextField
                  error={Boolean(touched.cost && errors.cost)}
                  fullWidth
                  helperText={touched.cost && errors.cost}
                  label="Price"
                  name="cost"
                  required
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.cost}
                  variant="outlined"
                />
              </Box>
            </Box>
            <Divider sx={{ mt: 2 }} />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                p: 2
              }}
            >
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="primary"
                onClick={() => onClose && onClose(null)}
                variant="text"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={isSubmitting}
                sx={{ ml: 1 }}
                type="submit"
                variant="contained"
              >
                Save
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

ManageInvoiceModal.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default ManageInvoiceModal;
