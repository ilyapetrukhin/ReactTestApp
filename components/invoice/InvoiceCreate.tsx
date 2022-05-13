import type { FC, SyntheticEvent } from 'react';
import PropTypes from 'prop-types';
import {
  Autocomplete, Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip, Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import get from 'lodash/get';
import filter from 'lodash/filter';
import find from 'lodash/find';
import moment from 'moment';
import type { Job, Invoice } from 'src/types/job';
import type { InvoiceRecipient as Recipient } from 'src/types/invoice';
import type { Contact } from 'src/types/contact';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { addRecipient as addInvoiceRecipient, deleteRecipient, changeInvoiceRecipient } from 'src/slices/invoiceCreate';
import PlusIcon from 'src/icons/Plus';
import XIcon from 'src/icons/X';
import ChipInput from 'material-ui-chip-input';
import * as Yup from 'yup';
import { getEntityAddress } from 'src/utils/address';
import replaceMessageVariables from 'src/utils/replaceMessageVariables';
import InvoiceRecipient from './InvoiceRecipient';
import JobBrief from '../job/JobBrief';
import JobCustomerInfo from '../job/JobCustomerInfo';
import InvoiceItems from './InvoiceItems';
import { INVOICE_MERGE_TAGS } from '../../constants/invoice';

interface InvoiceCreateProps {
  job: Job;
}

const InvoiceCreate: FC<InvoiceCreateProps> = (props) => {
  const { job, ...other } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const { invoiceSettings, organisation } = useSelector((state) => state.account);
  const { invoices, recipients } = useSelector((state) => state.invoiceCreate);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [ccEmails, setCCEmails] = useState<string[] | []>([]);

  const schema = Yup.string().email();

  const getIntroMessage = useCallback((contact: Contact,): string => {
    const invoiceVariables = {
      [INVOICE_MERGE_TAGS.ORG_NAME]: get(organisation, 'name', ''),
      [INVOICE_MERGE_TAGS.ORG_ADDRESS]: getEntityAddress(organisation, 'company'),
      [INVOICE_MERGE_TAGS.ORG_EMAIL]: get(
        organisation,
        'contact_email',
        get(organisation, 'email', ''),
      ),
      [INVOICE_MERGE_TAGS.ORG_PHONE]: get(organisation, 'company_phone', ''),
      [INVOICE_MERGE_TAGS.ORG_WEBSITE]:
        get(organisation, 'url', '') === null
          ? ''
          : get(organisation, 'url', ''),
      [INVOICE_MERGE_TAGS.TECH_FIRST_NAME]: get(job, 'user.first_name', ''),
      [INVOICE_MERGE_TAGS.TECH_LAST_NAME]: get(job, 'user.last_name', ''),
      [INVOICE_MERGE_TAGS.CONTACT_FIRST_NAME]: get(contact, 'first_name', ''),
      [INVOICE_MERGE_TAGS.CONTACT_LAST_NAME]: get(contact, 'last_name', ''),
      [INVOICE_MERGE_TAGS.CONTACT_ADDRESS]: getEntityAddress(contact, 'contact'),
      [INVOICE_MERGE_TAGS.JOB_TEMPLATE]: get(job, 'job_template.name', ''),
      [INVOICE_MERGE_TAGS.JOB_POOL_TYPE]: get(job, 'pool.pool_type.name', ''),
      [INVOICE_MERGE_TAGS.JOB_POOL_ADDRESS]: getEntityAddress(job.pool, 'pool'),
      [INVOICE_MERGE_TAGS.TOTAL_COST]: 0, // TODO: add total cost calc
      [INVOICE_MERGE_TAGS.DATE_OF_VISIT]: moment(job.start_time).format(
        'DD MMMM YYYY',
      ),
    };

    return replaceMessageVariables(invoiceSettings.intro_message, invoiceVariables);
  }, [job, invoiceSettings, organisation]);

  const addRecipient = useCallback((contact: Contact, invoices: Invoice[] | []) => {
    const recipient: Recipient = {
      contact_id: contact.id,
      job_id: job.id,
      contact,
      subject_message: '{invoice_no}',
      contact_intro: getIntroMessage(contact),
      email: contact.email,
      products: invoices,
      display_invoice: false,
      display_tasks: false,
      display_water_tests: false,
      display_chemical_history: false,
      display_chemical_actions: false,
    };
    dispatch(addInvoiceRecipient(recipient));
  }, [job, recipients]);

  useEffect(() => {
    const contactCCEmails = job.contact?.cc_emails && job.contact?.cc_emails
      .replace(/(?:\r\n|\r|\n)/g, '')
      .split(',');
    if (contactCCEmails && contactCCEmails.length) {
      setCCEmails(contactCCEmails);
    }
    addRecipient(job.contact, job.invoices);
  }, [job]);

  const contacts = useMemo(
    () => job.pool?.contacts,
    [job],
  );

  const handleDeleteRecipient = (recipient: Recipient): void => {
    dispatch(deleteRecipient(recipient.contact_id));
  };

  const handleInvoiceToChange = (event: SyntheticEvent<Element, Event>, value: any): void => {
    setSelectedContact(value);
  };

  const handleRecipientAdd = (): void => {
    addRecipient(selectedContact, []);
    setSelectedContact(null);
  };

  const handleRecipientInvoiceChange = (invoice: Invoice, recipient: Recipient): void => {
    dispatch(changeInvoiceRecipient(invoice, recipient));
  };

  const handleAddCCEmail = (chips): void => {
    setCCEmails(chips);
  };

  const handleValidateCCEmail = (chip): boolean => schema.isValidSync(chip);

  const handleDeleteCCEmail = (index): void => {
    setCCEmails(ccEmails.splice(index, 1));
  };

  return (
    <Grid
      container
      spacing={3}
      {...other}
    >
      <Grid
        item
        lg={8}
        xl={9}
        xs={12}
        order={{ xs: 3, md: 3 }}
      >
        <JobBrief
          job={job}
        />
        <Card
          sx={{
            mt: 3
          }}
        >
          <CardHeader title="Invoice to" />
          <Divider />
          <CardContent>
            {recipients.length > 0 && (
              <Box
                mb={2}
              >
                <List>
                  {recipients.map((recipient) => (
                    <ListItem
                      key={recipient.contact_id}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        '& + &': {
                          mt: 1
                        }
                      }}
                    >
                      {recipients.length > 1 && (
                        <ListItemIcon>
                          <Avatar
                            sx={{
                              fontSize: theme.typography.caption.fontSize,
                              backgroundColor: 'primary.main',
                              height: 22,
                              width: 22
                            }}
                          >
                            {recipient.number}
                          </Avatar>
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={recipient.contact?.full_name}
                        primaryTypographyProps={{
                          color: 'textPrimary',
                          variant: 'subtitle2'
                        }}
                        secondary={(
                          <Box>
                            <Typography
                              color="textSecondary"
                              variant="body2"
                            >
                              {recipient.contact?.full_address}
                            </Typography>
                            <Typography
                              color="textSecondary"
                              variant="caption"
                            >
                              {recipient.contact?.email}
                            </Typography>
                          </Box>
                        )}
                      />
                      {recipients.length > 1 && (
                        <Tooltip title="Remove">
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteRecipient(recipient)}
                          >
                            <XIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <Autocomplete
                getOptionLabel={(option: Contact): string => option.full_name}
                options={contacts}
                filterOptions={(contacts) => filter(contacts, (contact) => !find(recipients, (recipient) => recipient.contact_id === contact.id))}
                fullWidth
                filterSelectedOptions
                onChange={handleInvoiceToChange}
                value={selectedContact}
                renderInput={(params): JSX.Element => (
                  <TextField
                    fullWidth
                    label="Recipient"
                    name="recipient"
                    variant="outlined"
                    {...params}
                  />
                )}
              />
              {selectedContact && (
                <Box
                  ml={1}
                >
                  <Button
                    color="primary"
                    startIcon={<PlusIcon fontSize="small" />}
                    onClick={handleRecipientAdd}
                    size="small"
                    variant="text"
                  >
                    Add
                  </Button>
                </Box>
              )}
            </Box>
            <Box
              mt={2}
            >
              <ChipInput
                fullWidth
                label="CC emails"
                variant="outlined"
                disabled={false}
                placeholder="Enter CC emails"
                value={ccEmails}
                onChange={handleAddCCEmail}
                onBeforeAdd={(chip) => handleValidateCCEmail(chip)}
                onDelete={(chip, index) => handleDeleteCCEmail(index)}
              />
            </Box>
          </CardContent>
        </Card>
        {invoices.length > 0 && recipients.length > 1 && (
          <InvoiceItems
            sx={{
              mt: 3
            }}
            invoices={invoices}
            recipients={recipients}
            onRecipientChange={handleRecipientInvoiceChange}
          />
        )}
        <Card
          sx={{
            mt: 3
          }}
        >
          <CardHeader title="Summary" />
          <Divider />
          <CardContent>
            {recipients.length > 0 && (
              recipients.map((recipient) => (
                <InvoiceRecipient
                  key={recipient.contact_id}
                  recipient={recipient}
                />
              ))
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid
        item
        lg={4}
        xl={3}
        xs={12}
        order={{ xs: 2, md: 2, lg: 3 }}
      >
        <JobCustomerInfo job={job} />
      </Grid>
    </Grid>
  );
};

InvoiceCreate.propTypes = {
  // @ts-ignore
  job: PropTypes.object.isRequired
};

export default InvoiceCreate;
