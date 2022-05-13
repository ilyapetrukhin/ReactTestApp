import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import * as Yup from 'yup';
import { TwitterPicker } from 'react-color';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Dialog,
  Divider,
  LinearProgress,
  TextField,
  Typography
} from '@mui/material';
import Label from 'src/components/Label';
import { createColor, updateColor } from 'src/slices/account';
import type { Color } from 'src/types/organisation';
import { useDispatch, useSelector } from 'src/store';

interface ManageColorModalProps {
  color?: Color;
  onAddComplete?: () => void;
  onCancel?: () => void;
  onDeleteComplete?: () => void;
  onEditComplete?: () => void;
  open: boolean;
}

const getInitialValues = (
  tradingColor?: Color
): Color => {
  if (tradingColor) {
    return merge({}, {
      submit: false
    }, tradingColor);
  }

  return {
    color_code: '#0693E3',
    color_desc: '',
    submit: false
  };
};

const ManageColorModal: FC<ManageColorModalProps> = (props) => {
  const {
    color,
    onAddComplete,
    onCancel,
    onDeleteComplete,
    onEditComplete,
    open,
    ...other
  } = props;
  const { organisation } = useSelector((state) => state.account);
  const dispatch = useDispatch();

  const isCreating = !color;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      onClose={onCancel}
      open={open}
      {...other}
    >
      <Formik
        initialValues={getInitialValues(color)}
        validationSchema={
          Yup
            .object()
            .shape({
              color_code: Yup.string().max(255).required('Color code is required'),
              color_desc: Yup.string().max(255),
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
              color_code: values.color_code,
              color_desc: values.color_desc,
            };

            if (color) {
              await dispatch(updateColor(organisation.id, color.id, data));
            } else {
              await dispatch(createColor(organisation.id, data));
            }

            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            toast.success(`Color successfully ${isCreating ? 'created' : 'updated'}`);

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
          setFieldValue,
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
                    ? 'Add color'
                    : 'Edit color'
                }
              </Typography>
            </Box>
            {isSubmitting && <LinearProgress sx={{ mb: 3 }} />}
            <Box sx={{ px: 3 }}>
              <TextField
                error={Boolean(touched.color_desc && errors.color_desc)}
                fullWidth
                helperText={touched.color_desc && errors.color_desc}
                label="Label"
                name="color_desc"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.color_desc}
                variant="outlined"
              />
            </Box>
            <Box
              sx={{ p: 3 }}
            >
              <Label colorCode={values.color_code}>
                Color
              </Label>
            </Box>
            <Box
              sx={{ px: 3 }}
            >
              <TwitterPicker
                color={values.color_code}
                onChangeComplete={(color) => setFieldValue('color_code', color.hex)}
              />
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

ManageColorModal.propTypes = {
  // @ts-ignore
  color: PropTypes.object,
  onAddComplete: PropTypes.func,
  onCancel: PropTypes.func,
  onDeleteComplete: PropTypes.func,
  onEditComplete: PropTypes.func,
  open: PropTypes.bool,
};

export default ManageColorModal;
