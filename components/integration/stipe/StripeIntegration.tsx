import type { FC } from 'react';
import moment from 'moment/moment';
import React from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'src/store';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  InputAdornment,
  Link,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import { useConfirm } from 'material-ui-confirm';
import { disconnectStripeAccount, updateStripeConnection } from 'src/slices/account';
import StripeConnect from './StripeConnect';

const StripeIntegration: FC = (props) => {
  const { organisation, isStripeConnected, stripeConnection } = useSelector((state) => state.account);
  const confirm = useConfirm();

  const dispatch = useDispatch();

  if (!isStripeConnected) {
    return <StripeConnect {...props} />;
  }

  const handleDisconnect = () => {
    confirm({ description: 'This will permanently disconnect the Stripe integration' })
      .then(async () => {
        await dispatch(disconnectStripeAccount(organisation.id));
        toast.success('Stripe integration successfully disconnected');
      })
      .catch(() => {});
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        processing_fee: stripeConnection.processing_fee,
        connected_on: stripeConnection.connected_on,
        charge_processing_fees: stripeConnection.charge_processing_fees,
        pay_now_payments_enabled: stripeConnection.pay_now_payments_enabled,
        tech_payments_enabled: stripeConnection.tech_payments_enabled,
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            processing_fee: Yup.number().when('charge_processing_fees', {
              is: true,
              then: Yup
                .number()
                .min(0.1)
                .max(100)
                .required('Required')
            })
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
            charge_processing_fees: values.charge_processing_fees,
            pay_now_payments_enabled: values.pay_now_payments_enabled,
            tech_payments_enabled: values.tech_payments_enabled,
            processing_fee: values.processing_fee,
            automate_fees: stripeConnection.automate_fees,
          };
          await dispatch(updateStripeConnection(organisation.id, data));

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Stripe connection settings updated');
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
          onSubmit={handleSubmit}
          {...props}
        >
          <Card>
            <CardHeader title="Stripe connection details" />
            <Divider />
            <CardContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <Typography
                    color="textSecondary"
                    variant="overline"
                  >
                    Connected account
                  </Typography>
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                  >
                    { stripeConnection.account_name }
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <Typography
                    color="textSecondary"
                    variant="overline"
                  >
                    Connected on
                  </Typography>
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                  >
                    { moment(stripeConnection.connected_on).format('DD MMM YYYY') }
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="subtitle2"
                  >
                    Enable technicians to take card payments
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Description
                  </Typography>
                  <Switch
                    checked={values.tech_payments_enabled}
                    color="primary"
                    edge="start"
                    name="tech_payments_enabled"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="subtitle2"
                  >
                    Add Pay Now link to invoices and email
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Description
                  </Typography>
                  <Switch
                    checked={values.pay_now_payments_enabled}
                    color="primary"
                    edge="start"
                    name="pay_now_payments_enabled"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="subtitle2"
                  >
                    Charge my customer a processing fee
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Description
                  </Typography>
                  <Switch
                    checked={values.charge_processing_fees}
                    color="primary"
                    edge="start"
                    name="charge_processing_fees"
                    onChange={handleChange}
                  />
                </Grid>
                {values.charge_processing_fees && (
                  <Grid
                    item
                    xs={12}
                  >
                    <TextField
                      error={Boolean(touched.processing_fee && errors.processing_fee)}
                      helperText={touched.processing_fee && errors.processing_fee}
                      type="number"
                      label="Processing fee"
                      name="processing_fee"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.processing_fee}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              % of invoice total
                            </Typography>
                          </InputAdornment>
                        )
                      }}
                      variant="outlined"
                    />
                  </Grid>
                )}
              </Grid>
              {errors.submit && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.submit}
                  </FormHelperText>
                </Box>
              )}
            </CardContent>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                pt: 2,
                pr: 2,
              }}
            >
              <Button
                color="primary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                Update
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                p: 2
              }}
            >
              <Typography
                color="textSecondary"
                variant="body2"
              >
                Disconnect this integration only if you don&apos;t plan to use it again, otherwise you could lose all saved transactions and customer cards
                {' '}
                <Link
                  sx={{
                    cursor: 'pointer'
                  }}
                  color="error"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Link>
                .
              </Typography>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default StripeIntegration;
