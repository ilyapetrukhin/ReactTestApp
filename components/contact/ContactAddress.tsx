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

interface ContactContactDetailsProps {
  contact: Contact;
}

const ContactDetails: FC<ContactContactDetailsProps> = (props) => {
  const { contact, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Contact address" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Address street 1
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
                Address street 2
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
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Postcode
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {contact.address_postcode}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Suburb/Town/City
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {contact.address_city}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                State
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
