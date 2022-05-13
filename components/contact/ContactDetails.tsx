import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import type { Contact } from 'src/types/contact';
import type { Pool } from 'src/types/pool';
import { getCommaSeparatedPhones } from '../../utils/contact';

interface ContactContactDetailsProps {
  contact: Contact;
  pools?: Pool[];
}

const ContactDetails: FC<ContactContactDetailsProps> = (props) => {
  const { contact, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Contact details" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Email
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {contact.email}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Phone
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {contact.phones.length ? getCommaSeparatedPhones(contact.phones) : '-'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Country
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {contact.address_country}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                State/Region
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {contact.address_state}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Address 1
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {contact.address_street_one}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Address 2
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {contact.address_street_two}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

ContactDetails.propTypes = {
  // @ts-ignore
  contact: PropTypes.object.isRequired,
};

export default ContactDetails;
