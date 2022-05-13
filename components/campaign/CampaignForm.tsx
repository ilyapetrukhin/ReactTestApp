import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment/moment';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import * as Yup from 'yup';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import { useSelector } from 'src/store';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { Campaign } from 'src/types/campaign';
import { apiConfig } from 'src/config';
import { useRouter } from 'next/router';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import XIcon from 'src/icons/X';
import ExternalLinkIcon from 'src/icons/ExternalLink';
import FileDropzone from '../FileDropzone';

interface CampaignFormProps {
  campaign?: Campaign;
  onSave?: () => void;
  onUpdate?: () => void;
}

const getInitialValues = (
  campaign?: Campaign
): Campaign => {
  if (campaign) {
    return merge({}, {
      submit: false
    }, campaign);
  }

  return {
    name: '',
    url: '',
    start_date: moment().format('YYYY-MM-DD'),
    expiry_date: null,
    email_enabled: false,
    invoice_enabled: false,
    job_sheet_enabled: false,
    water_test_enabled: false,
    submit: false
  };
};

const toBase64 = (file: File): Promise<ArrayBuffer | string> => new Promise((
  resolve,
  reject
) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

const CampaignForm: FC<CampaignFormProps> = (props) => {
  const {
    campaign,
    onSave,
    onUpdate,
    ...rest
  } = props;
  const { organisation } = useSelector((state) => state.account);
  const [banner, setBanner] = useState<string>((campaign && campaign.banner_url) ? campaign.banner_url : null);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const isCreating = !campaign;

  const handleDropBanner = async ([file]: File[]) => {
    const data = await toBase64(file) as string;
    setBanner(data);
    setFile(file);
  };

  const handleCancelRemoveBanner = (): void => {
    setBanner(campaign.banner_url);
  };

  const handleRemoveBanner = (): void => {
    setBanner(null);
    setFile(null);
  };

  const handleStartDateChange = (date, setFieldValue): void => {
    setFieldValue('start_date', date);
  };

  const handleExpiryDateChange = (date: string | null, setFieldValue): void => {
    setFieldValue('expiry_date', date);
  };

  return (
    <Formik
      initialValues={getInitialValues(campaign)}
      validationSchema={
        Yup
          .object()
          .shape({
            name: Yup
              .string()
              .max(255)
              .required('Name is required'),
            url: Yup
              .string()
              .url()
              .max(255)
              .nullable(),
            start_date: Yup.date().required('Start date is required').nullable(),
            expiry_date: Yup.date().nullable()
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
            email_enabled: values.email_enabled,
            invoice_enabled: values.invoice_enabled,
            job_sheet_enabled: values.job_sheet_enabled,
            water_test_enabled: values.water_test_enabled,
            start_date: values.start_date,
            url: values.url ? values.url : ''
          };

          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
          const fd = new FormData();

          if (campaign) {
            // TODO: move to the slice
            await axios.put(`${apiConfig.apiV2Url}/organisations/${organisation.id}/campaign/${campaign.id}`, data);
            if (file) {
              fd.append('banner', file);
              await axios.post(`${apiConfig.apiV2Url}/organisations/${organisation.id}/campaign/${campaign.id}/update-banner`, fd, config);
            }
          } else {
            fd.append('banner', file);
            fd.append('name', values.name);
            fd.append('email_enabled', String(+values.email_enabled));
            fd.append('invoice_enabled', String(+values.invoice_enabled));
            fd.append('job_sheet_enabled', String(+values.job_sheet_enabled));
            fd.append('water_test_enabled', String(+values.water_test_enabled));
            fd.append('start_date', values.start_date);
            fd.append('url', values.url);
            await axios.post(`${apiConfig.apiV2Url}/organisations/${organisation.id}/campaign`, fd, config);
          }

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          toast.success(`Campaign successfully ${isCreating ? 'created' : 'updated'}`);

          if (isCreating && onSave) {
            onSave();
          }

          if (!isCreating && onUpdate) {
            onUpdate();
          }

          router.push('/campaigns');
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
          {...rest}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={8}
              md={6}
              xl={9}
              xs={12}
            >
              <Card variant="outlined">
                <CardContent>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Name"
                    required
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                  <Box sx={{ mt: 3 }}>
                    <TextField
                      error={Boolean(touched.url && errors.url)}
                      fullWidth
                      helperText={touched.url && errors.url}
                      label="Url"
                      name="url"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.url}
                      variant="outlined"
                    />
                  </Box>
                  <Typography
                    color="textPrimary"
                    sx={{
                      mb: 2,
                      mt: 3
                    }}
                    variant="h6"
                  >
                    Banner
                  </Typography>
                  {
                    banner
                      ? (
                        <div>
                          <Box
                            sx={{
                              height: 140,
                              width: '100%',
                              '& img': {
                                height: 'auto',
                                width: '100%'
                              }
                            }}
                          >
                            <img
                              alt="Banner"
                              src={banner}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              mt: 2
                            }}
                          >
                            <Button
                              color="primary"
                              type="button"
                              onClick={handleRemoveBanner}
                              variant="text"
                            >
                              Change banner
                            </Button>
                          </Box>
                        </div>
                      )
                      : (
                        <div>
                          <FileDropzone
                            accept="image/*"
                            maxFiles={1}
                            onDrop={handleDropBanner}
                          />
                          {campaign && campaign.banner_url && (
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 2
                              }}
                            >
                              <Button
                                color="primary"
                                type="button"
                                onClick={handleCancelRemoveBanner}
                                variant="text"
                              >
                                Cancel
                              </Button>
                            </Box>
                          )}
                        </div>
                      )
                  }
                  <Divider
                    sx={{
                      my: 3
                    }}
                  />
                  <Typography
                    color="textPrimary"
                    variant="h6"
                  >
                    Create your own in Canva
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    We created some banners in Canva to get you started. Click the link below to start customising
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      color="primary"
                      endIcon={<ExternalLinkIcon fontSize="small" />}
                      href="https://www.canva.com/design/DAEGsbJ9iwM/BRv9hSlplG7pDV6cKQ3B8A/view?utm_content=DAEGsbJ9iwM&utm_campaign=designshare&utm_medium=link&utm_source=sharebutton&mode=preview"
                      target="_blank"
                      variant="text"
                    >
                      Default template
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ mt: 3 }}>
                    <MobileDatePicker
                      label="Start date"
                      renderInput={(props) => (
                        <TextField
                          fullWidth
                          required
                          variant="outlined"
                          {...props}
                        />
                      )}
                      mask="YYYY-MM-DD"
                      disableCloseOnSelect={false}
                      showToolbar={false}
                      disableMaskedInput
                      inputFormat="dd MMM yyyy"
                      onChange={(value) => handleStartDateChange(value, setFieldValue)}
                      maxDate={values.expiry_date}
                      value={values.start_date}
                    />
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <MobileDatePicker
                      label="Expiry date"
                      renderInput={(props) => (
                        <TextField
                          fullWidth
                          variant="outlined"
                          {...props}
                        />
                      )}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => handleExpiryDateChange(null, setFieldValue)}>
                            <XIcon fontSize="small" />
                          </IconButton>
                        )
                      }}
                      disableCloseOnSelect={false}
                      showToolbar={false}
                      disableMaskedInput
                      inputFormat="dd MMM yyyy"
                      onChange={(value) => handleExpiryDateChange(value, setFieldValue)}
                      minDate={values.start_date}
                      value={values.expiry_date}
                    />
                  </Box>
                  <Grid
                    container
                    spacing={3}
                    sx={{ pt: 3 }}
                  >
                    <Grid
                      item
                      xs={6}
                    >
                      <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="subtitle2"
                      >
                        Email footer
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Some descriptive text
                      </Typography>
                      <Switch
                        checked={values.email_enabled}
                        color="primary"
                        onChange={handleChange}
                        edge="start"
                        name="email_enabled"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                    >
                      <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="subtitle2"
                      >
                        Job sheet
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Some descriptive text
                      </Typography>
                      <Switch
                        checked={values.job_sheet_enabled}
                        color="primary"
                        onChange={handleChange}
                        edge="start"
                        name="job_sheet_enabled"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                    >
                      <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="subtitle2"
                      >
                        Invoice
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Some descriptive text
                      </Typography>
                      <Switch
                        checked={values.invoice_enabled}
                        color="primary"
                        onChange={handleChange}
                        edge="start"
                        name="invoice_enabled"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                    >
                      <Typography
                        color="textPrimary"
                        gutterBottom
                        variant="subtitle2"
                      >
                        Water test
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        Some descriptive text
                      </Typography>
                      <Switch
                        checked={values.water_test_enabled}
                        color="primary"
                        onChange={handleChange}
                        edge="start"
                        name="water_test_enabled"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
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
              {isCreating ? 'Create' : 'Update'}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

CampaignForm.propTypes = {
  // @ts-ignore
  campaign: PropTypes.object,
  onUpdate: PropTypes.func,
  onSave: PropTypes.func,
};

export default CampaignForm;
