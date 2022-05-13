import numeral from 'numeral';
import get from 'lodash/get';

import { Contact, VendContact } from 'src/types/contact';
import { ContactMatch, ProductMatch } from 'src/types/vendIntegration';
import { getCommaSeparatedPhones, getFullName } from 'src/utils/contact';

export const getTitleForContactMatch = (contactMatch: ContactMatch) : string => [contactMatch.company_name, contactMatch.email, contactMatch.phones]
  .filter((item) => item != null && item.length !== 0)
  .map((item) => (Array.isArray(item) ? getCommaSeparatedPhones(item) : item))
  .join(' • ');

export const getTitleForContact = (contact: VendContact | Contact, contactType: 'vendContact' | 'contact') : string => {
  let name = '';
  if (contactType === 'vendContact') {
    name = `${get(contact, 'name')} ${get(contact, 'email') ? (`${get(contact, 'email')} | `) : ''} (${contact.customer_code})`;
  } else {
    name = `${getFullName(contact)} | ${get(contact, 'email') ? (`${get(contact, 'email')} | `) : ''}`;
  }

  return name;
};

export const getTitleForProductMatch = (productMatch: ProductMatch): string => [
  'SKU',
  numeral(productMatch.unit_price).format('($0.00a)'),
  productMatch.sku,
]
  .filter((item) => item != null && item.length !== 0)
  .join(' | ');
