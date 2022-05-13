import type { FC } from 'react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { Scrollbar } from 'src/components/scrollbar';
import { Edit as EditIcon } from 'react-feather';
import { useTheme } from '@mui/material/styles';
import PlusIcon from '../../icons/Plus';
import { RELATION_TYPES } from '../../constants/poolContact';
import { getEntityAddress } from '../../utils/address';
import type { Contact } from '../../types/contact';
import { addContact, unlinkContact, updateContactRelation, updateContact } from '../../slices/poolDetail';
import { useDispatch } from '../../store';
import ContactSearch from '../widgets/search-inputs/ContactSearch';
import InformationCircleIcon from '../../icons/InformationCircle';
import { COMPANY_LABEL, INDIVIDUAL_LABEL, INDIVIDUAL_TYPE } from '../../constants/contact';
import { ContactDialogueForm } from '../contact';

interface PoolContactsProps {
  contacts: Contact[];
}

const PoolContacts: FC<PoolContactsProps> = (props) => {
  const theme = useTheme();
  const nonDesktopDevice = useMediaQuery(theme.breakpoints.down('lg'));
  const { contacts, ...rest } = props;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const dispatch = useDispatch();

  const handleEditContact = (contact: Contact): void => {
    setEditContact(contact);
    setIsModalOpen(true);
  };

  const handleCreateNewContact = (): void => {
    setEditContact(null);
    setIsModalOpen(true);
  };

  const handleUpdatedContact = (contact: Contact): void => {
    if (contact) {
      dispatch(updateContact(contact));
      setIsModalOpen(false);
    }
  };

  const handleCreatedContact = (contact: Contact): void => {
    if (contact) {
      dispatch(addContact(contact));
      setIsModalOpen(false);
    }
  };

  const handleLinkContact = (contact: Contact): void => {
    if (contact) {
      dispatch(addContact(contact));
    }
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  if (!contacts) {
    return null;
  }

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
      <Box
        sx={{
          m: 2
        }}
      >
        <Grid
          sx={{
            alignItems: 'center'
          }}
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
            sm={9}
            md={8}
          >
            <ContactSearch
              onSelect={handleLinkContact}
              poolContacts={contacts}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            md={4}
          >
            <Button
              type="button"
              startIcon={<PlusIcon fontSize="small" />}
              onClick={handleCreateNewContact}
              variant="text"
            >
              Create new contact
            </Button>
          </Grid>
        </Grid>
      </Box>
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
                  <TableCell
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                    }}
                    align="right"
                  >
                    <TextField
                      label="Relationship to contact"
                      name="contact_link"
                      select
                      onChange={(event) => dispatch(updateContactRelation(contact.id, parseInt(event.target.value, 10)))}
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
                    <IconButton
                      sx={{
                        color: 'primary.main',
                      }}
                      onClick={() => handleEditContact(contact)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: 'primary.main',
                      }}
                      onClick={() => dispatch(unlinkContact(contact.id))}
                    >
                      <LinkOffIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Dialog
        fullWidth
        fullScreen={nonDesktopDevice}
        maxWidth="lg"
        onClose={handleModalClose}
        open={isModalOpen}
      >
        {/* Dialog renders its body even if not open */}
        {isModalOpen && (
          <Box
            sx={{
              backgroundColor: 'background.default',
              p: 3,
            }}
          >
            <ContactDialogueForm
              contact={editContact}
              pools={editContact ? editContact.pools : []}
              onAddComplete={handleCreatedContact}
              onEditComplete={handleUpdatedContact}
              onCancel={handleModalClose}
            />
          </Box>
        )}
      </Dialog>
    </Card>
  );
};

PoolContacts.propTypes = {
  // @ts-ignore
  contacts: PropTypes.array.isRequired,
};

export default PoolContacts;
