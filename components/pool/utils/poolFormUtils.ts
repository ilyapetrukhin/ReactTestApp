import merge from 'lodash/merge';
import * as Yup from 'yup';
import type { Organisation } from 'src/types/organisation';
import type { Pool } from 'src/types/pool';
import { INITIAL_STATE } from '../../../constants/address';

export const poolValidationSchema = Yup
  .object()
  .shape({
    name: Yup.string().max(255).nullable(),
    pool_volume: Yup.number().nullable(),
    pool_type_id: Yup.number().required(),
    surface_type_id: Yup.number(),
    classification_id: Yup.number().nullable(),
    custom_exception_id: Yup.number().nullable(),
    location_id: Yup.number().nullable(),
    filter: Yup.string().nullable(),
    ground_level_id: Yup.number().nullable(),
    address_street_one: Yup.string().max(255).required().required('Address street one is required'),
    address_street_two: Yup.string().max(255),
    address_city: Yup.string().max(255).required('City is required'),
    address_postcode: Yup.number().required('Postcode is required'),
    address_state: Yup.string().max(255).required('State is required'),
    keys: Yup.string().max(255),
    notes: Yup.string().max(1000),
    technical_specification: Yup.string().max(1000),
    visibility: Yup.bool().required(),
  });

export const getInitialValues = (
  organisation: Organisation,
  pool?: Pool,
): Pool => {
  if (pool) {
    return merge({}, {
      name: '',
      submit: null
    }, pool);
  }

  return {
    name: '',
    pool_volume: '',
    pool_type_id: 1,
    surface_type_id: '',
    pool_surface_type: null,
    filter: '',
    balance_ch: '',
    ph_reducer: '',
    location_id: '',
    custom_exception_id: '',
    classification_id: '',
    ground_level_id: '',
    organisation_id: organisation.id,
    address_street_one: '',
    address_street_two: '',
    address_postcode: '',
    address_state: INITIAL_STATE,
    address_city: '',
    address_country: organisation.company_address_country,
    keys: '',
    notes: '',
    technical_specification: '',
    contacts: [],
    pool_sanitisers: [],
    visibility: true,
    submit: null,
    equipments: [],
  };
};
