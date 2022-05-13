import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import * as Yup from 'yup';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  LinearProgress,
  TextField,
  Typography
} from '@mui/material';
import { createTradingTerm, deleteTradingTerm, updateTradingTerm } from 'src/slices/account';
import type { TradingTerm, TradingTermType, TradingTermFromType } from 'src/types/contact';
import { useDispatch, useSelector } from 'src/store';
import { Trash as TrashIcon } from 'react-feather';

interface TypeOption {
  label: string;
  value: TradingTermType;
}

const typeOptions: TypeOption[] = [
  {
    label: 'Weeks',
    value: 'weeks'
  },
  {
    label: 'Days',
    value: 'days'
  },
  {
    label: 'Months',
    value: 'months'
  }
];

interface FromOption {
  label: string;
  value: TradingTermFromType;
}

const fromOptions: FromOption[] = [
  {
    label: 'From invoice date',
    value: 'from_invoice'
  },
  {
    label: 'From end of month',
    value: 'from_month'
  }
];

interface ManageTermModalProps {
  tradingTerm?: TradingTerm;
  onAddComplete?: () => void;
  onCancel?: () => void;
  onDeleteComplete?: () => void;
  onEditComplete?: () => void;
  open: boolean;
}

const getInitialValues = (
  tradingTerm?: TradingTerm
): TradingTerm => {
  if (tradingTerm) {
    return merge({}, {
      submit: false
    }, tradingTerm);
  }

  return {
    name: '',
    quantity: 1,
    from_type: fromOptions[0].value,
    type: typeOptions[0].value,
    is_default: false,
    submit: false
  };
};

const ManageTermModal: FC<ManageTermModalProps> = (props) => {
  const {
    tradingTerm,
    onAddComplete,
    onCancel,
    onDeleteComplete,
    onEditComplete,
    open,
    ...other
  } = props;
  const { organisation } = useSelector((state) => state.account);
  const dispatch = useDispatch();

  const handleDelete = async (): Promise<void> => {
    try {
      await dispatch(deleteTradingTerm(organisation.id, tradingTerm.id));

      if (onDeleteComplete) {
        onDeleteComplete();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isCreating = !tradingTerm;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      onClose={onCancel}
      open={open}
      {...other}
    >
      <Formik
        initialValues={getInitialValues(tradingTerm)}
        validationSchema={
          Yup
            .object()
            .shape({
              name: Yup.string().max(255).required('Name is required'),
              quantity: Yup
                .number()
                .min(1)
                .max(365)
                .required('Period is required'),
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
              type: values.type,
              from_type: values.from_type,
              quantity: values.quantity,
              is_default: values.is_default,
            };

            if (tradingTerm) {
              await dispatch(updateTradingTerm(organisation.id, tradingTerm.id, data));
            } else {
              await dispatch(createTradingTerm(organisation.id, data));
            }

            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            toast.success(`Trading term ${isCreating ? 'created' : 'updated'}`);

            if (isCreating && onAddComplete) {
              onAddComplete();
            }

            if (!isCreating && onEditComplete) {
              onEditComplete();
            }
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
                sx={{
                  textTransform: 'capitalize'
                }}
                variant="h5"
              >
                {
                  isCreating
                    ? 'Add trading term'
                    : 'Edit trading term'
                }
              </Typography>
            </Box>
            {isSubmitting && <LinearProgress />}
            <Box sx={{ px: 3 }}>
              <TextField
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
                  error={Boolean(touched.quantity && errors.quantity)}
                  fullWidth
                  helperText={touched.quantity && errors.quantity}
                  label="Period"
                  name="quantity"
                  required
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.quantity}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  name="type"
                  onChange={handleChange}
                  select
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ native: true }}
                  value={values.type}
                  variant="outlined"
                >
                  {typeOptions.map((typeOption) => (
                    <option
                      key={typeOption.value}
                      value={typeOption.value}
                    >
                      {typeOption.label}
                    </option>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  name="from_type"
                  onChange={handleChange}
                  select
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ native: true }}
                  value={values.from_type}
                  variant="outlined"
                >
                  {fromOptions.map((fromOption) => (
                    <option
                      key={fromOption.value}
                      value={fromOption.value}
                    >
                      {fromOption.label}
                    </option>
                  ))}
                </TextField>
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
              {!isCreating && (
                <IconButton
                  sx={{
                    color: 'error.main',
                  }}
                  onClick={(): Promise<void> => handleDelete()}
                >
                  <TrashIcon fontSize="small" />
                </IconButton>
              )}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="primary"
                onClick={onCancel}
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

ManageTermModal.propTypes = {
  // @ts-ignore
  tradingTerm: PropTypes.object,
  onAddComplete: PropTypes.func,
  onCancel: PropTypes.func,
  onDeleteComplete: PropTypes.func,
  onEditComplete: PropTypes.func,
  open: PropTypes.bool,
};

export default ManageTermModal;
