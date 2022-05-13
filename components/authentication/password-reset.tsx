import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const PasswordReset: FC = () => {
  const isMountedRef = useIsMountedRef();
  const { passwordReset } = useAuth() as any;
  const router = useRouter();
  const { email, token } = router.query;
  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, 6);
  }, []);

  return (
    <Formik
      initialValues={{
        email: email || '',
        token: token || '',
        password: '',
        passwordConfirm: '',
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
              .min(7, 'Must be at least 7 characters')
              .max(255)
              .required('Required'),
            passwordConfirm: Yup
              .string()
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
              .required('Required')
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          await passwordReset(
            values.email,
            values.token,
            values.password
          );

          router.push('/authentication/login');
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
          {
            !email
              ? (
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
              )
              : (
                <TextField
                  disabled
                  fullWidth
                  margin="normal"
                  value={email}
                  variant="outlined"
                />
              )
          }
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
          <TextField
            error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
            fullWidth
            helperText={touched.passwordConfirm && errors.passwordConfirm}
            label="Password Confirmation"
            margin="normal"
            name="passwordConfirm"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.passwordConfirm}
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
              Reset Password
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            <NextLink
              href="/authentication/login"
              passHref
            >
              <Button
                color="primary"
                size="small"
                type="button"
                variant="text"
              >
                Cancel
              </Button>
            </NextLink>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default PasswordReset;
