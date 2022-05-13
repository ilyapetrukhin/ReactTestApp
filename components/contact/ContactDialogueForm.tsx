import type { FC } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import * as Yup from 'yup';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React from 'react';
import ChipInput from 'material-ui-chip-input';
import axios from 'axios';
import type { Contact, Phone } from 'src/types/contact';
import { useSelector } from '../../store';
import GoogleAddressSearch from '../widgets/search-inputs/GoogleAddressSearch';
import { AUSTRALIA_STATES } from '../../constants/address';
import type { Address } from '../../types/address';
import {
  COMPANY_TYPE,
  CONTACT_TYPES,
  INVOICE_PREFERENCES
} from '../../constants/contact';
import InformationCircleIcon from '../../icons/InformationCircle';
import type { Pool } from '../../types/pool';
import { apiConfig } from '../../config';
import ContactPoolsPreview from './ContactPoolsPreview';
import { getInitialValues, contactValidationSchema } from './utils/contactFormUtils';
import { PhoneList } from '../widgets/phone-manager';

interface ContactDialogueFormProps {
  contact?: Contact;
  pools?: Pool[];
  onAddComplete?: (contact: Contact) => void;
  onEditComplete?: (contact: Contact) => void;
  onCancel?: () => void;
}

const ContactDialogueForm: FC<ContactDialogueFormProps> = (props) => {
  const {
    contact,
    pools,
    onAddComplete,
    onEditComplete,
    onCancel
  } = props;
  const { organisation, tradingTerms } = useSelector((state) => state.account);

  const isCreating = !contact;
  const defaultTradingTerm = find(tradingTerms, { is_default: true });

  const schema = Yup.string().email();

  const handleAddressSelect = (selectedAddress: Address, setFieldValue) => {
    setFieldValue('address_street_one', selectedAddress.address_street_one);
    setFieldValue('address_postcode', selectedAddress.address_postcode);
    setFieldValue('address_city', selectedAddress.address_city);
    setFieldValue('address_state', selectedAddress.address_state);
  };

  const handleAddCCEmail = (chip): boolean => schema.isValidSync(chip);

  const handleDeleteCCEmail = (chips, setFieldValue, index): void => {
    chips.splice(index, 1); // remove the chip at index i
    setFieldValue('cc_emails', chips);
  };

  const handleAddPhone = (phone: Phone, phones: Phone[], setFieldValue): void => {
    if (!phone.id) {
      phone.id = phones.length + 1;
    }

    phones.push(phone);

    if (phone) {
      setFieldValue('phones', phones);
    }
  };

  const handleUpdatePhone = (phone: Phone, phones: Phone[], setFieldValue): void => {
    const updatedPhones = phones.map((_phone) => {
      if (_phone.id === phone.id) {
        return phone;
      }

      return _phone;
    });

    if (phone) {
      setFieldValue('phones', updatedPhones);
    }
  };

  const handleDeletePhone = (phoneId: number, phones: Phone[], setFieldValue): void => {
    if (phoneId) {
      setFieldValue('phones', phones.filter((phone) => phone.id !== phoneId));
    }
  };

  return (
    <Formik
      initialValues={getInitialValues(organisation, defaultTradingTerm, contact)}
      validationSchema={contactValidationSchema}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            type: values.type,
            invoice_pref: values.invoice_pref,
            trading_term_id: values.trading_term_id,
            address_street_one: values.address_street_one,
            address_street_two: values.address_street_two ? values.address_street_two : '',
            address_city: values.address_city,
            address_postcode: values.address_postcode,
            address_state: values.address_state,
            address_country: values.address_country,
            email: values.email ? values.email : '',
            visibility: +values.visibility,
            is_batch: +values.is_batch,
            cc_emails: values.cc_emails.length ? values.cc_emails.join(', ') : '',
            first_name: values.first_name ? values.first_name : '',
            last_name: values.last_name ? values.last_name : '',
            contact_name: values.contact_name ? values.contact_name : '',
            company_name: values.company_name ? values.company_name : '',
            notes: values.notes ? values.notes : '',
            bgw_comms_pref: values.bgw_comms_pref,
            phones: values.phones ? values.phones.map((phone: Phone) => (
              {
                phone_type_id: phone.phone_type_id,
                phone_number: phone.phone_number,
                label: phone.label,
              }
            )) : [],
            without_pools: 1,
          };

          let response;

          if (contact) {
            response = await axios.put(`${apiConfig.apiV1Url}/organisations/${organisation.id}/contacts/${contact.id}`, data);
          } else {
            response = await axios.post(`${apiConfig.apiV1Url}/organisations/${organisation.id}/contacts`, data);
          }

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          toast.success(`Contact successfully ${isCreating ? 'created' : 'updated'}`);

          if (isCreating && onAddComplete) {
            onAddComplete(response.data);
          }

          if (!isCreating && onEditComplete) {
            onEditComplete(response.data);
          }
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.response.data });
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
        setFieldValue,
        touched,
        values
      }): JSX.Element => (
        <form
          noValidate
          onSubmit={handleSubmit}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              lg={6}
            >
              <Card>
                <CardHeader title="Contact details" />
                <Divider />
                <CardContent>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      <RadioGroup
                        name="type"
                        onChange={(event) => setFieldValue('type', parseInt(event.target.value, 10))}
                        value={values.type}
                        sx={{ flexDirection: 'row' }}
                      >
                        {CONTACT_TYPES.map((contactType) => (
                          <FormControlLabel
                            control={(
                              <Radio
                                color="primary"
                                sx={{ ml: 1 }}
                              />
                            )}
                            key={contactType.value}
                            label={(
                              <Typography
                                color="textPrimary"
                                variant="body1"
                              >
                                {contactType.label}
                              </Typography>
                            )}
                            value={contactType.value}
                          />
                        ))}
                      </RadioGroup>
                    </Grid>
                    {values.type !== COMPANY_TYPE && <Grid item />}
                    {values.type === COMPANY_TYPE && (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                      >
                        <TextField
                          error={Boolean(touched.company_name && errors.company_name)}
                          fullWidth
                          helperText={touched.company_name && errors.company_name}
                          label="Company name"
                          required
                          name="company_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.company_name}
                          variant="outlined"
                        />
                      </Grid>
                    )}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                    >
                      <TextField
                        error={Boolean(touched.first_name && errors.first_name)}
                        fullWidth
                        helperText={touched.first_name && errors.first_name}
                        label="First name"
                        required
                        name="first_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.first_name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                    >
                      <TextField
                        error={Boolean(touched.last_name && errors.last_name)}
                        fullWidth
                        helperText={touched.last_name && errors.last_name}
                        label="Last name"
                        name="last_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.last_name}
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
                      sm={6}
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
                      sm={6}
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
                      md={6}
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
                      md={3}
                      sm={3}
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
                    <Grid
                      item
                      md={3}
                      sm={3}
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
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        label="Email"
                        name="email"
                        type="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                    >
                      <ChipInput
                        fullWidth
                        variant="outlined"
                        disabled={false}
                        placeholder="Enter CC emails"
                        value={values.cc_emails}
                        onChange={(chips) => setFieldValue('cc_emails', chips)}
                        onBeforeAdd={(chip) => handleAddCCEmail(chip)}
                        onDelete={(chip, index) => handleDeleteCCEmail(values.cc_emails, setFieldValue, index)}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                    >
                      <PhoneList
                        phones={values.phones}
                        onAdd={(phone) => handleAddPhone(phone, values.phones, setFieldValue)}
                        onEdit={(phone) => handleUpdatePhone(phone, values.phones, setFieldValue)}
                        onDelete={(phoneId) => handleDeletePhone(phoneId, values.phones, setFieldValue)}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                    >
                      <TextField
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        label="Email"
                        name="email"
                        type="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                    >
                      <ChipInput
                        fullWidth
                        label="CC emails"
                        variant="outlined"
                        disabled={false}
                        placeholder="Enter CC emails"
                        value={values.cc_emails}
                        onChange={(chips) => setFieldValue('cc_emails', chips)}
                        onBeforeAdd={(chip) => handleAddCCEmail(chip)}
                        onDelete={(chip, index) => handleDeleteCCEmail(values.cc_emails, setFieldValue, index)}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={12}
                    >
                      <TextField
                        error={Boolean(touched.contact_name && errors.contact_name)}
                        fullWidth
                        helperText={touched.contact_name && errors.contact_name}
                        label="Contact name"
                        name="contact_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.contact_name}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="This field is mandatory for Xero sync to work">
                                <InformationCircleIcon
                                  color="primary"
                                  fontSize="small"
                                />
                              </Tooltip>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              lg={6}
            >
              <ContactPoolsPreview pools={pools} />
              <Box
                mt={3}
              >
                <Card>
                  <CardHeader title="Other details" />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={6}
                      >
                        <TextField
                          fullWidth
                          label="Trading term"
                          name="trading_term_id"
                          onChange={handleChange}
                          select
                          required
                          InputLabelProps={{ shrink: true }}
                          SelectProps={{ native: true, displayEmpty: true }}
                          value={values.trading_term_id}
                          variant="outlined"
                        >
                          {tradingTerms.map((tradingTerm) => (
                            <option
                              key={tradingTerm.id}
                              value={tradingTerm.id}
                            >
                              {tradingTerm.descriptive_name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.notes && errors.notes)}
                          fullWidth
                          helperText={touched.notes && errors.notes}
                          label="Contact notes"
                          name="notes"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.notes}
                          multiline
                          rows={2}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        sm={6}
                        xs={12}
                      >
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <Typography
                            color="textPrimary"
                            gutterBottom
                            variant="subtitle2"
                            sx={{
                              mr: 1
                            }}
                          >
                            Comms preference
                          </Typography>
                          <Tooltip
                            title={(
                              <>
                                <Typography
                                  variant="inherit"
                                  gutterBottom
                                >
                                  Do not send means the invoice will not be emailed to the customer, and will instead go to the ‘Invoices ready to send’ section. From here you can print it, download it, mark it as sent or mark it as entered. We recommend using this option.
                                </Typography>
                                <Typography
                                  variant="inherit"
                                >
                                  1. If you want to print invoices.
                                </Typography>
                                <Typography
                                  variant="inherit"
                                >
                                  2. If you want to send invoices from another platform.
                                </Typography>
                                <Typography
                                  variant="inherit"
                                >
                                  3. If you want to batch invoices in another platform at the end of the billing period.
                                </Typography>
                              </>
                            )}
                          >
                            <InformationCircleIcon
                              color="primary"
                              fontSize="small"
                            />
                          </Tooltip>
                        </Box>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <RadioGroup
                            name="invoice_pref"
                            onChange={(event) => setFieldValue('invoice_pref', parseInt(event.target.value, 10))}
                            value={values.invoice_pref}
                            sx={{ flexDirection: 'row' }}
                          >
                            {INVOICE_PREFERENCES.map((invoicePreference) => (
                              <FormControlLabel
                                control={(
                                  <Radio
                                    color="primary"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                                key={invoicePreference.value}
                                label={(
                                  <Typography
                                    color="textPrimary"
                                    variant="body1"
                                  >
                                    {invoicePreference.label}
                                  </Typography>
                                )}
                                value={invoicePreference.value}
                              />
                            ))}
                          </RadioGroup>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        sm={6}
                        xs={12}
                      >
                        <Typography
                          color="textPrimary"
                          gutterBottom
                          variant="subtitle2"
                          sx={{
                            ml: 1
                          }}
                        >
                          Water test reminder preference
                        </Typography>
                        <Box
                          sx={{
                            ml: 1,
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          {values.bgw_comms_pref.map((commPref) => (
                            <FormControlLabel
                              key={commPref.id}
                              control={(
                                <Checkbox
                                  color="primary"
                                  value={commPref.value}
                                />
                              )}
                              label={commPref.name}
                            />
                          ))}
                        </Box>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                        xs={12}
                      >
                        <Box sx={{ mx: 2 }}>
                          <FormControlLabel
                            control={(
                              <Switch
                                checked={values.visibility}
                                edge="start"
                                name="visibility"
                                onChange={handleChange}
                                value={values.visibility}
                              />
                            )}
                            label="Active"
                          />
                        </Box>
                        <Box sx={{ mx: 2 }}>
                          <FormControlLabel
                            control={(
                              <Switch
                                checked={values.is_batch}
                                edge="start"
                                name="is_batch"
                                onChange={handleChange}
                                value={values.is_batch}
                              />
                            )}
                            label="Batch invoices"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              pt: 2
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
              color="secondary"
              disabled={isSubmitting}
              sx={{ ml: 1 }}
              type="submit"
              variant="contained"
            >
              {isCreating ? 'Create contact' : 'Update contact'}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

ContactDialogueForm.propTypes = {
  // @ts-ignore
  contact: PropTypes.object,
  pools: PropTypes.array,
  onAddComplete: PropTypes.func,
  onEditComplete: PropTypes.func,
  onCancel: PropTypes.func,
};

ContactDialogueForm.defaultProps = {
  pools: []
};

export default ContactDialogueForm;
