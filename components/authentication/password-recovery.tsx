import type { FC } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, FormHelperText, TextField } from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const PasswordRecovery: FC = () => {
  const isMountedRef = useIsMountedRef();
  const { passwordRecovery } = useAuth() as any;
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            email: Yup
              .string()
              .email('Must be a valid email')
              .max(255)
              .required('Email is required')
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          await passwordRecovery(values.email);

          router.push(`/login?email${values.email}`);
        } catch (err) {
          console.error(err);
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
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
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 3 }}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Recover password
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button
              color="primary"
              onClick={() => router.push('/authentication/login')}
              size="small"
              type="button"
              variant="text"
            >
              Cancel
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default PasswordRecovery;
