import type { FC } from 'react';
import type { Address } from 'src/types/address';
import * as Yup from 'yup';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
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
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AUSTRALIA_STATES } from '../../../constants/address';
import { getOrganisation, updateOrganisation, updateOrganisationLogo } from '../../../slices/account';
import { useDispatch, useSelector } from '../../../store';
import GoogleAddressSearch from '../../widgets/search-inputs/GoogleAddressSearch';
import FileDropzone from '../../FileDropzone';

const OrganisationGeneralSettings: FC = (props) => {
  const { organisation, logo } = useSelector((state) => state.account);
  const [changeLogo, setChangeLogo] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrganisation(organisation.id));
  }, [dispatch]);

  const handleDropLogo = async ([file]: File[]) => {
    await dispatch(updateOrganisationLogo(organisation.id, file));
    setChangeLogo(false);
  };

  const handleCancelChangeLogo = (): void => {
    setChangeLogo(false);
  };

  const handleChangeLogo = (): void => {
    setChangeLogo(true);
  };

  if (!organisation) {
    return null;
  }

  const handleAddressSelect = (selectedAddress: Address, setFieldValue) => {
    setFieldValue('address_street_one', selectedAddress.address_street_one);
    setFieldValue('address_postcode', selectedAddress.address_postcode);
    setFieldValue('address_city', selectedAddress.address_city);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: organisation.name || '',
        email: organisation.email || '',
        company_abn: organisation.company_abn || '',
        url: organisation.url || '',
        gst_enabled: organisation.gst_enabled || false,
        first_name: organisation.first_name || '',
        last_name: organisation.last_name || '',
        company_phone: organisation.company_phone || '',
        address_street_one: organisation.company_address_street_one || '',
        address_street_two: organisation.company_address_street_two || '',
        address_postcode: organisation.company_address_postcode || '',
        address_city: organisation.company_address_city || '',
        address_state: organisation.company_address_state || 'NSW',
        address_country: organisation.company_address_country || '',
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            name: Yup
              .string()
              .max(255)
              .required('Name is required'),
            email: Yup
              .string()
              .email('Must be a valid email')
              .max(255),
            company_abn: Yup.string().max(255),
            url: Yup.string().url().max(255),
            gst_enabled: Yup.bool(),
            first_name: Yup
              .string()
              .max(255)
              .required('First name is required'),
            last_name: Yup
              .string()
              .max(255)
              .required('Last name is required'),
            company_phone: Yup
              .string()
              .max(255)
              .required('Phone is required'),
            address_street_one: Yup
              .string()
              .max(255)
              .required('Address street one is required'),
            address_street_two: Yup
              .string()
              .max(255),
            address_postcode: Yup
              .string()
              .max(255)
              .required('Postcode is required'),
            address_city: Yup
              .string()
              .max(255)
              .required('Town/Suburb/City is required'),
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
            first_name: values.first_name,
            last_name: values.last_name,
            name: values.name,
            email: values.email,
            gst_enabled: +values.gst_enabled,
            url: values.url,
            is_registered: 1,
            on_board: 0, // TODO: change dynamically while onboarding
            company_address_street_one: values.address_street_one,
            company_address_street_two: values.address_street_two,
            company_address_postcode: values.address_postcode,
            company_address_city: values.address_city,
            company_address_state: values.address_state,
            company_address_country: values.address_country,
            timezone: 'Australia/Sydney',
          };
          await dispatch(updateOrganisation(organisation.id, data));

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          toast.success('Organisation successfully updated');
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
        values,
        setFieldValue
      }): JSX.Element => (
        <form
          noValidate
          onSubmit={handleSubmit}
        >
          <Grid
            container
            spacing={3}
            {...props}
          >
            <Grid
              item
              lg={8}
              md={8}
              xl={9}
              xs={12}
              order={{ xs: 3, md: 3 }}
            >
              <Card>
                <CardHeader title="Details" />
                <Divider />
                <CardContent>
                  <Grid
                    container
                    spacing={4}
                  >
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        helperText={touched.name && errors.name}
                        label="Organisation name"
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={
                          touched.email && errors.email
                            ? errors.email
                            : 'We will use this email to contact you'
                        }
                        label="Contact email"
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        required
                        type="email"
                        value={values.email}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.company_abn && errors.company_abn)}
                        fullWidth
                        helperText={touched.company_abn && errors.company_abn}
                        label="Organisation ABN"
                        name="company_abn"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.company_abn}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.url && errors.url)}
                        fullWidth
                        helperText={touched.url && errors.url}
                        label="Organisation website"
                        name="url"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.url}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                    >
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                      >
                        Registered for GST
                      </Typography>
                      <Switch
                        checked={values.gst_enabled}
                        color="primary"
                        edge="start"
                        name="gst_enabled"
                        onChange={handleChange}
                        value={values.gst_enabled}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card sx={{ mt: 3 }}>
                <CardHeader title="Organisation contact" />
                <Divider />
                <CardContent>
                  <Grid
                    container
                    spacing={4}
                  >
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.first_name && errors.first_name)}
                        fullWidth
                        helperText={touched.first_name && errors.first_name}
                        label="First name"
                        name="first_name"
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.first_name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.last_name && errors.last_name)}
                        fullWidth
                        helperText={touched.last_name && errors.last_name}
                        label="Last name"
                        name="last_name"
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.last_name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.company_phone && errors.company_phone)}
                        fullWidth
                        helperText={touched.company_phone && errors.company_phone}
                        label="Company phone"
                        name="company_phone"
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.company_phone}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                    >
                      <GoogleAddressSearch onSelect={(selectedAddress) => handleAddressSelect(selectedAddress, setFieldValue)} />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.address_street_one && errors.address_street_one)}
                        fullWidth
                        helperText={touched.address_street_one && errors.address_street_one}
                        label="Address line 1"
                        name="address_street_one"
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.address_street_one}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.address_street_two && errors.address_street_two)}
                        fullWidth
                        helperText={touched.address_street_two && errors.address_street_two}
                        label="Address line 2"
                        name="address_street_two"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.address_street_two}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      sm={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.address_postcode && errors.address_postcode)}
                        fullWidth
                        helperText={touched.address_postcode && errors.address_postcode}
                        label="Postcode"
                        name="address_postcode"
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.address_postcode}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      sm={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.address_city && errors.address_city)}
                        fullWidth
                        helperText={touched.address_city && errors.address_city}
                        label="Town/Suburb/City"
                        name="address_city"
                        required
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.address_city}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      sm={6}
                      xs={12}
                    >
                      <TextField
                        fullWidth
                        label="State"
                        name="address_state"
                        onChange={handleChange}
                        select
                        required
                        SelectProps={{ native: true }}
                        value={values.address_state}
                        variant="outlined"
                      >
                        {AUSTRALIA_STATES.map((state) => (
                          <option
                            key={state.value}
                            value={state.value}
                          >
                            {state.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              lg={4}
              md={4}
              xl={3}
              xs={12}
              order={{ xs: 2, md: 3, lg: 3 }}
            >
              <Card>
                <CardHeader title="Logo" />
                <Divider />
                <CardContent>
                  {
                    logo && !changeLogo
                      ? (
                        <Box
                          sx={{
                            '& img': {
                              width: '100%'
                            }
                          }}
                        >
                          <img
                            alt="Organisation logo"
                            src={logo.medium_url}
                          />
                        </Box>
                      )
                      : (
                        <div>
                          <FileDropzone
                            accept="image/*"
                            maxFiles={1}
                            onDrop={handleDropLogo}
                          />
                        </div>
                      )
                  }
                </CardContent>
                {logo && (
                  <CardActions
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {changeLogo
                      ? (
                        <Button
                          color="primary"
                          type="button"
                          onClick={handleCancelChangeLogo}
                          variant="text"
                        >
                          Cancel
                        </Button>
                      )
                      : (
                        <Button
                          color="primary"
                          type="button"
                          onClick={handleChangeLogo}
                          variant="text"
                        >
                          Change logo
                        </Button>
                      )}
                  </CardActions>
                )}
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
              Save changes
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default OrganisationGeneralSettings;
