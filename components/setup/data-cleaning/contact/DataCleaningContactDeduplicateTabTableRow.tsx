/* eslint-disable */
import React, { FC, memo, useCallback, useMemo } from 'react';
import { Edit as EditIcon } from 'react-feather';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';

import StarIcon from 'src/icons/Star';
import { Address } from 'src/types/address';
import { Phone } from 'src/types/contact';
import { CommsPrefType, ContactType } from 'src/types/deduplicateContactTool';
import { getEntityAddress } from 'src/utils/address';
import MultipleValuesInput from 'src/components/MultipleValuesInput';
import { ignoreDuplicationGroup } from 'src/slices/deduplicateContactTool';
import { useDispatch } from 'src/store';

interface DataCleaningContactTableRowProps {
  groupKey: string;
  isPrimary: boolean;
  isMerging: boolean;
  createdAt: string;
  type: ContactType;
  companyName: string;

  firstName: string;
  lastName: string;
  phoneNumbers: Phone[];
  email: string;
  ccEmails: string[];
  addressIndex: number;
  contactName: string;
  commsPref: CommsPrefType;
  active: boolean;
  linkedPools: string[];

  firstNames: string[];
  lastNames: string[];
  allPhoneNumbers: Phone[];
  emails: string[];
  addresses: Address[];
  contactNames: string[];

  handleMarkAsPrimary: () => void;
  handleIgnoreContact: () => void;
  handleMerge: () => void;
  handleChangeType: (
    event: SelectChangeEvent
  ) => void;
  handleChangeCompanyName: React.ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
  >;
  handleChangeFirstName: (
    event: SelectChangeEvent
  ) => void;
  handleChangeLastName: (
    event: SelectChangeEvent
  ) => void;
  handleChangePhoneNumbers: (
    event: SelectChangeEvent<string[]>
  ) => void;
  handleChangeEmail: (
    event: SelectChangeEvent
  ) => void;
  handleAddCCEmail: (email: string) => void;
  handleDeleteCCEmail: (email: string) => void;
  handleChangeAddressIndex: (
    event: SelectChangeEvent
  ) => void;
  handleChangeContactName: (
    event: SelectChangeEvent
  ) => void;
  handleChangeCommsPref: (
    event: SelectChangeEvent
  ) => void;
  handleAddCustomEmail: () => void;
}

const DataCleaningContactTableRow: FC<DataCleaningContactTableRowProps> = memo(
  ({
    groupKey,
    isPrimary,
    isMerging,
    createdAt,
    type,
    companyName,
    firstName,
    lastName,
    phoneNumbers,
    email,
    ccEmails,
    addressIndex,
    contactName,
    commsPref,
    linkedPools,

    firstNames,
    lastNames,
    allPhoneNumbers,
    emails,
    addresses,
    contactNames,
    handleMarkAsPrimary,
    handleIgnoreContact,
    handleMerge,
    handleChangeType,
    handleChangeCompanyName,
    handleChangeFirstName,
    handleChangeLastName,
    handleChangePhoneNumbers,
    handleChangeEmail,
    handleAddCCEmail,
    handleDeleteCCEmail,
    handleChangeAddressIndex,
    handleChangeContactName,
    handleChangeCommsPref,
    handleAddCustomEmail,
  }) => {
    const dispatch = useDispatch();

    const createdAtText = useMemo(
      () => moment(createdAt).format('DD MMM yyyy'),
      [createdAt]
    );
    const phoneNumberPhones = useMemo(
      () => phoneNumbers.map(({ phone_number }) => phone_number),
      [phoneNumbers]
    );

    const handleIgnore = useCallback(
      (event: React.SyntheticEvent) => {
        event.stopPropagation();
        dispatch(ignoreDuplicationGroup({ groupKey }));
      },
      [groupKey]
    );

    return (
      <Box
        display="flex"
        flexWrap="nowrap"
        minWidth={2600}
        p={3}
        pl={0}
        sx={{
          backgroundColor: isPrimary ? 'background.default' : 'common.white',
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          position="sticky"
          left={0}
          width={250}
          p={3}
          zIndex={2}
          sx={{ backgroundColor: isPrimary ? 'background.default' : 'common.white' }}
        >
          <>
            {isPrimary && (
              <>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  onClick={handleMerge}
                  loading={isMerging}
                >
                  MERGE CONTACT
                </LoadingButton>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    mt: 1,
                  }}
                  disabled={isMerging}
                  onClick={handleIgnore}
                >
                  IGNORE ALL
                </Button>
              </>
            )}
            {!isPrimary && (
              <>
                <Button
                  variant="text"
                  color="primary"
                  size="medium"
                  sx={{
                    mt: 1,
                    justifyContent: 'flex-start',
                  }}
                  disabled={isMerging}
                  onClick={handleMarkAsPrimary}
                >
                  <StarIcon
                    fontSize="small"
                    sx={{ mr: 1 }}
                  />
                  Set as primary
                </Button>
                <Button
                  color="primary"
                  size="medium"
                  sx={{
                    mt: 1,
                    justifyContent: 'flex-start',
                    color: 'error.main',
                  }}
                  disabled={isMerging}
                  onClick={handleIgnoreContact}
                >
                  <CloseIcon
                    fontSize="small"
                    sx={{ mr: 1 }}
                  />
                  Ignore contact
                </Button>
              </>
            )}
          </>
        </Box>
        <Box
          pl={4}
          pr={2}
        >
          <Box
            display="flex"
            alignItems="center"
          >
            <Typography
              variant="subtitle2"
              color="textSecondary"
              fontWeight="bold"
              sx={{ width: 100 }}
            >
              Created on
            </Typography>
            <Typography
              variant="body2"
              color="textPrimary"
            >
              {createdAtText}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
          >
            <Typography
              variant="subtitle2"
              color="textSecondary"
              fontWeight="bold"
              sx={{ width: 100 }}
            >
              Linked pools
            </Typography>
            <Typography
              variant="body2"
              color="textPrimary"
            >
              {linkedPools.join(' | ') || '—'}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            mt={4}
          >
            {/* ------ Type -------- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 140,
                  mr: 2,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Type</InputLabel>
                <Select
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                  onChange={handleChangeType}
                  value={type.toString()}
                  label="Type"
                >
                  <MenuItem value={ContactType.individual}>Individual</MenuItem>
                  <MenuItem value={ContactType.company}>Company</MenuItem>
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 140, mr: 2, pr: 1 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {type === ContactType.individual && 'Individual'}
                  {type === ContactType.company && 'Company'}
                </Typography>
              </Box>
            )}

            {/* ------ Company name ------- */}
            {isPrimary && (
              <TextField
                value={companyName}
                fullWidth
                sx={{ width: 180, mr: 2 }}
                label="Company name"
                disabled={!isPrimary}
                inputProps={{
                  sx: { backgroundColor: 'common.white', borderRadius: 1 },
                }}
                onChange={handleChangeCompanyName}
              />
            )}
            {!isPrimary && (
              <Box sx={{ width: 180, mr: 2, px: 1 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {companyName || '—'}
                </Typography>
              </Box>
            )}

            {/* ------ First name ------- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{ width: 150, mr: 2 }}
                disabled={!isPrimary}
              >
                <InputLabel>First name</InputLabel>
                <Select
                  onChange={handleChangeFirstName}
                  value={firstName}
                  label="First name"
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                >
                  {firstNames.map((fName) => (
                    <MenuItem
                      key={fName}
                      value={fName}
                    >
                      {fName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 150, mr: 2, px: 2 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {firstName}
                </Typography>
              </Box>
            )}

            {/* ------- Last name ------- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 150,
                  mr: 2,
                  px: 1,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Last name</InputLabel>
                <Select
                  onChange={handleChangeLastName}
                  value={lastName}
                  label="Last name"
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                >
                  {lastNames.map((lName) => (
                    <MenuItem
                      key={lName}
                      value={lName}
                    >
                      {lName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 150, mr: 2, px: 2 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {lastName}
                </Typography>
              </Box>
            )}
            {/* ----- Phone numbers ---- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 300,
                  mr: 2,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Phones</InputLabel>
                <Select
                  multiple
                  label="Phones"
                  sx={{ backgroundColor: 'common.white' }}
                  onChange={handleChangePhoneNumbers}
                  IconComponent={Box}
                  renderValue={(selectedNumbers) => (
                    <Box
                      display="flex"
                      sx={{ backgroundColor: 'common.white' }}
                    >
                      {selectedNumbers.map((number) => (
                        <Chip
                          key={number}
                          label={number}
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                  value={phoneNumberPhones}
                >
                  {allPhoneNumbers.map((phone) => (
                    <MenuItem
                      key={phone.phone_number}
                      value={phone.phone_number}
                    >
                      {phone.phone_number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 300, mr: 2, px: 2 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {phoneNumberPhones.join(', ') || '—'}
                </Typography>
              </Box>
            )}

            {/* ------ Email ------ */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 230,
                  mr: 2,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Email</InputLabel>
                <Select
                  onChange={handleChangeEmail}
                  value={email}
                  placeholder="Select email address"
                  label="Email"
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                >
                  {emails.map((_email) => (
                    <MenuItem
                      key={_email}
                      value={_email}
                    >
                      {_email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {!isPrimary && (
              <Box sx={{ width: 230, mr: 2, px: 2 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {email || '—'}
                </Typography>
              </Box>
            )}

            <IconButton
              sx={{ mr: 2 }}
              disabled={!isPrimary}
              onClick={handleAddCustomEmail}
            >
              <EditIcon
                size="small"
                width={24}
                height={24}
              />
            </IconButton>

            {/* ---- CC emails ---- */}
            {
              isPrimary && (
                <FormControl
                  variant="outlined"
                  sx={{
                    width: 250,
                    mr: 2,
                  }}
                  disabled={!isPrimary}
                >
                  <MultipleValuesInput
                    popperContentSx={{ width: 250 }}
                    InputProps={{ sx: { backgroundColor: 'common.white' } }}
                    hintText="Enter address and press enter"
                    label="CC emails"
                    values={ccEmails}
                    onAdd={handleAddCCEmail}
                    onDelete={handleDeleteCCEmail}
                  />
                </FormControl>
              )
            }
            {!isPrimary && (
              <Box sx={{ width: 250, mr: 2, px: 2 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {ccEmails.join(', ') || '—'}
                </Typography>
              </Box>
            )}

            {/* ---- Address ----- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 250,
                  mr: 2,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Address</InputLabel>
                <Select
                  onChange={handleChangeAddressIndex}
                  value={addressIndex.toString()}
                  label="Address"
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                >
                  {addresses.map((address, index) => (
                    <MenuItem
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      value={index}
                    >
                      {getEntityAddress(address, 'contact')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 250, mr: 2, px: 2 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {addresses[addressIndex]
                    && getEntityAddress(addresses[addressIndex], 'contact')}
                </Typography>
              </Box>
            )}

            {/* ------- Contat name ------ */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 250,
                  mr: 2,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Contact name</InputLabel>
                <Select
                  onChange={handleChangeContactName}
                  value={contactName}
                  label="Contact name"
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                >
                  {contactNames.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 250, mr: 2, px: 2 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {contactName}
                </Typography>
              </Box>
            )}
            {/* ---- Comms pref --- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 150,
                  mr: 3,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Comms pref</InputLabel>
                <Select
                  label="Comms pref"
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                  value={commsPref.toString()}
                  onChange={handleChangeCommsPref}
                >
                  <MenuItem value={CommsPrefType.email}>Email</MenuItem>
                  <MenuItem value={CommsPrefType.doNotSent}>
                    Do not send
                  </MenuItem>
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 150, mr: 4, px: 2 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {commsPref === CommsPrefType.email && 'Email'}
                  {commsPref === CommsPrefType.doNotSent && 'Do not send'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
);

DataCleaningContactTableRow.propTypes = {
  groupKey: PropTypes.string.isRequired,
  isPrimary: PropTypes.bool.isRequired,
  isMerging: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  companyName: PropTypes.string.isRequired,

  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  phoneNumbers: PropTypes.array.isRequired,
  email: PropTypes.string.isRequired,
  ccEmails: PropTypes.arrayOf(PropTypes.string).isRequired,
  addressIndex: PropTypes.number.isRequired,
  contactName: PropTypes.string.isRequired,
  commsPref: PropTypes.number.isRequired,
  linkedPools: PropTypes.arrayOf(PropTypes.string).isRequired,

  firstNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  lastNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  // @ts-ignore
  allPhoneNumbers: PropTypes.arrayOf(PropTypes.object).isRequired,
  emails: PropTypes.arrayOf(PropTypes.string).isRequired,
  // @ts-ignore
  addresses: PropTypes.arrayOf(PropTypes.object).isRequired,
  contactNames: PropTypes.arrayOf(PropTypes.string).isRequired,

  handleMarkAsPrimary: PropTypes.func.isRequired,
  handleIgnoreContact: PropTypes.func.isRequired,
  handleMerge: PropTypes.func.isRequired,
  handleChangeType: PropTypes.func.isRequired,
  handleChangeCompanyName: PropTypes.func.isRequired,
  handleChangeFirstName: PropTypes.func.isRequired,
  handleChangeLastName: PropTypes.func.isRequired,
  handleChangePhoneNumbers: PropTypes.func.isRequired,
  handleChangeEmail: PropTypes.func.isRequired,
  handleAddCCEmail: PropTypes.func.isRequired,
  handleDeleteCCEmail: PropTypes.func.isRequired,
  handleChangeAddressIndex: PropTypes.func.isRequired,
  handleChangeContactName: PropTypes.func.isRequired,
  handleChangeCommsPref: PropTypes.func.isRequired,
  handleAddCustomEmail: PropTypes.func.isRequired,
};

export default DataCleaningContactTableRow;
