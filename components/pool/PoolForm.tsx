import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
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
import type { Contact } from 'src/types/contact';
import React from 'react';
import InformationCircleIcon from 'src/icons/InformationCircle';
import { useSelector } from '../../store';
import GoogleAddressSearch from '../widgets/search-inputs/GoogleAddressSearch';
import { AUSTRALIA_STATES, INITIAL_STATE } from '../../constants/address';
import type { Address } from '../../types/address';
import { FILTERS_LIST } from '../../constants/pool';
import PoolContacts from './PoolContacts';
import { getInitialValues, poolValidationSchema } from './utils/poolFormUtils';
import PoolFormEquipment from './pool-form/PoolFormEquipment';
import { useAddPoolMutation, useEditPoolMutation } from '../../api/pool';
import { useRouter } from 'next/router';
import { Pool } from '../../types/pool';

interface PoolFormProps {
  pool?: Pool;
  contacts?: Contact[];
}

const PoolForm: FC<PoolFormProps> = (props) => {
  const {
    pool,
    contacts,
  } = props;
  const {
    surfaceTypes,
    locations,
    customExceptions,
    groundLevels,
    poolTypes,
    classifications,
    poolSanitisers
  } = useSelector((state) => state.poolSpecifications);
  const { organisation } = useSelector((state) => state.account);
  const [addPoolRequest] = useAddPoolMutation();
  const [editPoolRequest] = useEditPoolMutation();
  const router = useRouter();
  const isCreating = !pool;

  const handleAddressSelect = (selectedAddress: Address, setFieldValue) => {
    setFieldValue('address_street_one', selectedAddress.address_street_one);
    setFieldValue('address_postcode', selectedAddress.address_postcode);
    setFieldValue('address_city', selectedAddress.address_city);
    setFieldValue('address_state', selectedAddress.address_state);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={getInitialValues(organisation, pool)}
      validationSchema={poolValidationSchema}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          const data = {
            name: values.name ? values.name : '',
            pool_volume: values.pool_volume ? values.pool_volume : 0,
            pool_type_id: values.pool_type_id,
            surface_type_id: values.surface_type_id,
            classification_id: values.classification_id ? values.classification_id : '',
            location_id: values.location_id ? values.location_id : '',
            ground_level_id: values.ground_level_id ? values.ground_level_id : '',
            custom_exception_id: values.custom_exception_id ? values.custom_exception_id : '',
            filter: values.filter ? values.filter : '',
            address_street_one: values.address_street_one,
            address_street_two: values.address_street_two ? values.address_street_two : '',
            address_city: values.address_city,
            address_postcode: values.address_postcode,
            address_state: values.address_state,
            visibility: values.visibility,
            technical_specification: values.technical_specification ? values.technical_specification : '',
            notes: values.notes ? values.notes : '',
            keys: values.keys ? values.keys : '',
            contacts: contacts.map((contact) => (
              {
                contact_id: contact.id,
                address_type_id: contact.pivot.address_type_id
              }
            )),
            pool_sanitisers: values.pool_sanitisers.map((sanitiser) => ({ id: sanitiser.id })),
          };
          if (pool) {
            await editPoolRequest({ organisationId: organisation.id, id: parseInt(pool.id.toString(), 10), body: data });
          } else {
            await addPoolRequest({ organisationId: organisation.id, body: data });
          }
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          router.push('/pools');
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
            >
              <Card>
                <CardHeader title="Pool details" />
                <Divider />
                <CardContent>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      sm={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.name && errors.name)}
                        fullWidth
                        helperText={touched.name && errors.name}
                        label="Name"
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
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
                        value={values.address_state || INITIAL_STATE}
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
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <PoolContacts contacts={contacts} />
              <Box
                sx={{
                  mt: 3
                }}
              >
                <Card>
                  <CardHeader title="Pool specifications" />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                      >
                        <Box>
                          <RadioGroup
                            name="pool_type_id"
                            onChange={(event) => setFieldValue('pool_type_id', parseInt(event.target.value, 10))}
                            value={values.pool_type_id}
                            sx={{ flexDirection: 'row' }}
                          >
                            {poolTypes.map((poolType) => (
                              <FormControlLabel
                                control={(
                                  <Radio
                                    color="primary"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                                key={`${poolType.id}poolTypes`}
                                label={(
                                  <Typography
                                    color="textPrimary"
                                    variant="body1"
                                  >
                                    {poolType.name}
                                  </Typography>
                                )}
                                value={poolType.id}
                              />
                            ))}
                          </RadioGroup>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
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
                      </Grid>
                      <Grid
                        item
                        sm={6}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.pool_volume && errors.pool_volume)}
                          fullWidth
                          helperText={touched.pool_volume && errors.pool_volume}
                          label="Pool volume (L)"
                          name="pool_volume"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.pool_volume}
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
                          label="Surface type"
                          name="surface_type_id"
                          onChange={handleChange}
                          select
                          required
                          InputLabelProps={{ shrink: true }}
                          SelectProps={{ native: true, displayEmpty: true }}
                          value={values.surface_type_id}
                          variant="outlined"
                        >
                          <option value="">Select</option>
                          {surfaceTypes.map((surfaceType) => (
                            <option
                              key={surfaceType.id}
                              value={surfaceType.id}
                            >
                              {surfaceType.name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                      >
                        <Autocomplete
                          getOptionLabel={(option): string => option.name}
                          multiple
                          options={poolSanitisers}
                          onChange={(event, value) => setFieldValue('pool_sanitisers', value)}
                          value={values.pool_sanitisers}
                          renderInput={(params): JSX.Element => (
                            <TextField
                              fullWidth
                              label="Sanitiser"
                              name="pool_sanitisers"
                              variant="outlined"
                              {...params}
                            />
                          )}
                        />
                      </Grid>
                      <Grid
                        item
                        sm={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          label="Classification"
                          name="classification_id"
                          onChange={handleChange}
                          select
                          InputLabelProps={{ shrink: true }}
                          SelectProps={{ native: true, displayEmpty: true }}
                          value={values.classification_id || ''}
                          variant="outlined"
                        >
                          <option value="">Select</option>
                          {classifications.map((classification) => (
                            <option
                              key={`${classification.id}classifications`}
                              value={classification.id}
                            >
                              {classification.name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid
                        item
                        sm={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          label="Location"
                          name="location_id"
                          onChange={handleChange}
                          select
                          InputLabelProps={{ shrink: true }}
                          SelectProps={{ native: true, displayEmpty: true }}
                          value={values.location_id || ''}
                          variant="outlined"
                        >
                          <option value="">Select</option>
                          {locations.map((location) => (
                            <option
                              key={location.id}
                              value={location.id}
                            >
                              {location.name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid
                        item
                        sm={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          label="Ground level"
                          name="ground_level_id"
                          onChange={handleChange}
                          select
                          InputLabelProps={{ shrink: true }}
                          SelectProps={{ native: true, displayEmpty: true }}
                          value={values.ground_level_id || ''}
                          variant="outlined"
                        >
                          <option value="">Select</option>
                          {groundLevels.map((groundLevel) => (
                            <option
                              key={groundLevel.id}
                              value={groundLevel.id}
                            >
                              {groundLevel.name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid
                        item
                        sm={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          label="Filter"
                          name="filter"
                          onChange={handleChange}
                          select
                          InputLabelProps={{ shrink: true }}
                          SelectProps={{ native: true, displayEmpty: true }}
                          value={values.filter || ''}
                          variant="outlined"
                        >
                          <option value="">Select</option>
                          {FILTERS_LIST.map((filter) => (
                            <option
                              key={filter.value}
                              value={filter.value}
                            >
                              {filter.label}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid
                        item
                        sm={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          label="Custom exception"
                          name="custom_exception_id"
                          onChange={handleChange}
                          select
                          InputLabelProps={{ shrink: true }}
                          SelectProps={{ native: true, displayEmpty: true }}
                          value={values.custom_exception_id || ''}
                          variant="outlined"
                        >
                          <option value="">Select</option>
                          {customExceptions.map((customException) => (
                            <option
                              key={customException.id}
                              value={customException.id}
                            >
                              {customException.name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                      >
                        <TextField
                          error={Boolean(touched.keys && errors.keys)}
                          fullWidth
                          helperText={touched.keys && errors.keys}
                          label="Key number"
                          name="keys"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.keys}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title="If you use key numbers for house keys/pool gates, enter them here. These will aggregate next to each technician on the left hand side of the day view in the calendar">
                                  <InformationCircleIcon
                                    color="primary"
                                    fontSize="small"
                                  />
                                </Tooltip>
                              </InputAdornment>
                            )
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.notes && errors.notes)}
                          fullWidth
                          helperText={touched.notes && errors.notes}
                          label="Pool notes"
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
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.technical_specification && errors.technical_specification)}
                          fullWidth
                          helperText={touched.technical_specification && errors.technical_specification}
                          label="Technical specs"
                          name="technical_specification"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.technical_specification}
                          multiline
                          rows={2}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <Card>
                <CardHeader title="Pool photos" />
                <Divider />
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <PoolFormEquipment />
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
              justifyContent: 'center',
              display: 'flex',
              py: 2
            }}
          >
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {isCreating ? 'Create pool' : 'Update pool'}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

PoolForm.propTypes = {
  // @ts-ignore
  pool: PropTypes.object,
  contacts: PropTypes.array,
};

PoolForm.defaultProps = {
  contacts: []
};

export default PoolForm;
