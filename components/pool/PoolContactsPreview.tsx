import type { FC } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { RELATION_TYPES } from '../../constants/poolContact';
import { getEntityAddress } from '../../utils/address';
import type { Contact } from '../../types/contact';
import InformationCircleIcon from '../../icons/InformationCircle';
import { COMPANY_LABEL, INDIVIDUAL_LABEL, INDIVIDUAL_TYPE } from '../../constants/contact';

interface PoolContactsPreviewProps {
  contacts: Contact[];
}

const PoolContactsPreview: FC<PoolContactsPreviewProps> = (props) => {
  const { contacts, ...rest } = props;

  return (
    <Card {...rest}>
      <CardHeader
        title={(
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Typography
              color="textPrimary"
              sx={{ pr: 1 }}
              variant="h6"
            >
              Linked contacts
            </Typography>
            <Tooltip title="Linking a contact to a pool enables you to send the invoice to that contact. Bills can be split between multiple contacts. If a pool changes hands, just unlink the old contact and link the new one">
              <InformationCircleIcon
                color="primary"
                fontSize="small"
              />
            </Tooltip>
          </Box>
        )}
      />
      <Divider />
      <Scrollbar>
        <Box
          sx={{
            maxHeight: {
              lg: 330
            }
          }}
        >
          <Table>
            <TableBody>
              {!contacts.length && (
                <TableRow
                  sx={{
                    '&:last-child td': {
                      border: 0
                    }
                  }}
                >
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="caption"
                    >
                      There are no attached contacts yet
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {contacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  sx={{
                    '&:last-child td': {
                      border: 0
                    }
                  }}
                >
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      sx={{ cursor: 'pointer' }}
                      variant="subtitle2"
                    >
                      { contact.type === INDIVIDUAL_TYPE ? contact.full_name : contact.company_name }
                    </Typography>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        mt: 1
                      }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        { contact.type === INDIVIDUAL_TYPE ? INDIVIDUAL_LABEL : COMPANY_LABEL }
                      </Typography>
                      <>
                        <Box
                          sx={{
                            height: 4,
                            width: 4,
                            borderRadius: 4,
                            backgroundColor: 'text.secondary',
                            mx: 1
                          }}
                        />
                        <Typography
                          color="textSecondary"
                          variant="body2"
                        >
                          {getEntityAddress(contact, 'contact', true)}
                        </Typography>
                      </>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      label="Relationship to contact"
                      name="contact_link"
                      select
                      disabled
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ native: true, displayEmpty: true }}
                      value={contact.pivot.address_type_id}
                      variant="outlined"
                    >
                      {RELATION_TYPES.map((relationType) => (
                        <option
                          key={relationType.value}
                          value={relationType.value}
                        >
                          {relationType.label}
                        </option>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

PoolContactsPreview.propTypes = {
  // @ts-ignore
  contacts: PropTypes.array.isRequired,
};

export default PoolContactsPreview;
