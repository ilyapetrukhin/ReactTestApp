import type { FC } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  TextField
} from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMounted } from '../../hooks/use-mounted';
import useAuth from 'src/hooks/useAuth';

export const JWTLogin: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { login } = useAuth() as any;

  return (
    <Formik
      initialValues={{
        email: 'vk@brainsdesign.com',
        password: '123456',
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
              .required('Email is required'),
            password: Yup
              .string()
              .max(255)
              .required('Password is required')
          })
      }
      onSubmit={async (values, helpers): Promise<void> => {
        try {
          await login(values.email, values.password);

          router.push('/dashboard/overview');

          if (isMounted()) {
            helpers.setStatus({ success: true });
            helpers.setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          if (isMounted()) {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: err.message });
            helpers.setSubmitting(false);
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
          {...props}
        >
          <TextField
            autoFocus
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
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Log In
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <NextLink
              href="/authentication/password-recovery"
              passHref
            >
              <Button
                color="primary"
                disabled={isSubmitting}
                variant="text"
              >
                Forgot password
              </Button>
            </NextLink>
          </Box>
        </form>
      )}
    </Formik>
  );
};
