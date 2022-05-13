import merge from 'lodash/merge';
import * as Yup from 'yup';
import type { Organisation } from 'src/types/organisation';
import { COMPANY_TYPE, INDIVIDUAL_TYPE, INVOICE_PREF_EMAIL } from 'src/constants/contact';
import { Contact, TradingTerm } from 'src/types/contact';

export const contactValidationSchema = Yup
  .object()
  .shape({
    type: Yup.number().required(),
    trading_term_id: Yup.number().required(),
    invoice_pref: Yup.number().required(),
    address_street_one: Yup.string().max(255).required('Address street one is required'),
    address_street_two: Yup.string().max(255).nullable(),
    address_city: Yup.string().max(255).required('City is required'),
    address_postcode: Yup.number().required('Postcode is required'),
    address_state: Yup.string().max(255).required('State is required'),
    notes: Yup.string().max(1000).nullable(),
    email: Yup.string().email('Must be a valid email').max(255).nullable(),
    visibility: Yup.bool(),
    is_batch: Yup.bool(),
    first_name: Yup.string().max(255).required('First name is required'),
    last_name: Yup.string().max(255).nullable(),
    contact_name: Yup.string().max(255).nullable(),
    company_name: Yup.string().when('type', {
      is: COMPANY_TYPE,
      then: Yup.string().required('Company name is required'),
    })
  });

export const getInitialValues = (
  organisation: Organisation,
  tradingTerm: TradingTerm,
  contact?: Contact,
) => {
  if (contact) {
    return merge({}, contact, {
      cc_emails: contact.cc_emails ? contact.cc_emails.split(',') : [],
      submit: null
    });
  }

  return {
    organisation_id: organisation.id,
    trading_term_id: tradingTerm.id,
    bgw_comms_pref: [
      {
        id: 'email',
        name: 'Email',
        value: false
      },
      {
        id: 'sms',
        name: 'SMS',
        value: false
      }
    ],
    first_name: '',
    last_name: '',
    type: INDIVIDUAL_TYPE,
    invoice_pref: INVOICE_PREF_EMAIL,
    email: '',
    address_street_one: '',
    address_street_two: '',
    address_postcode: '',
    address_state: '',
    address_city: '',
    address_country: organisation.company_address_country,
    contact_name: '',
    company_name: '',
    cc_emails: [],
    notes: '',
    phones: [],
    pools: [],
    is_batch: false,
    visibility: true,
    submit: null
  };
};
