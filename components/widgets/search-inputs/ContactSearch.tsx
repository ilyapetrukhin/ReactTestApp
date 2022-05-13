import type { FC } from 'react';
import React, { useEffect, useCallback, useState } from 'react';
import { Autocomplete, Typography, TextField, Grid, InputAdornment } from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import get from 'lodash/get';
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';
import throttle from 'lodash/throttle';
import PropTypes from 'prop-types';
import { useSelector } from 'src/store';
import SearchIcon from 'src/icons/Search';
import ContactIcon from 'src/icons/Contact';
import { Contact } from 'src/types/contact';
import axios from 'axios';
import { apiConfig } from '../../../config';
import { getEntityAddress } from '../../../utils/address';

interface ContactSearchProps {
  onSelect?: (selectedContact: Contact | null) => void;
  poolContacts?: Contact[];
}

const parseContactsResults = (contacts: Contact[]) : Contact[] => map(contacts, (contact) => {
  contact.full_address = `${contact.full_name} ${getEntityAddress(contact, 'contact', true)}`;
  return contact;
});

const filterAlreadyLinked = (contacts: Contact[], poolContacts: Contact[]) : Contact[] => filter(contacts, (contact) => !find(poolContacts, { id: contact.id }));

const ContactSearch: FC<ContactSearchProps> = (props) => {
  const { onSelect, poolContacts } = props;
  const [value, setValue] = useState<Contact | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Contact[]>([]);
  const { organisation } = useSelector((state) => state.account);

  useEffect(() => {
    if (onSelect) {
      onSelect(value);
    }
  }, [value]);

  const fetch = useCallback(
    throttle(async (request: { input: string }, callback: (results?: Contact[]) => void) => {
      const results = await axios.get(`${apiConfig.apiV2Url}/organisations/${organisation.id}/contacts?filter=${request.input}&limit=100&order=first_name&include=pools`);
      callback(parseContactsResults(filterAlreadyLinked(results.data.data, poolContacts)));
    }, 1000),
    [poolContacts],
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '' || inputValue.length < 3) {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: Contact[]) => {
      if (active) {
        let newOptions = [] as Contact[];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.full_address)}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      noOptionsText="No contacts"
      value={value}
      onChange={(event: any, newValue: Contact | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params): JSX.Element => (
        <TextField
          {...params}
          label="Search contact"
          variant="outlined"
          name="search_contact"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          fullWidth
        />
      )}
      renderOption={(props, option: Contact) => {
        const matches = match(option.full_address, inputValue);
        const parts = parse(
          option.full_address,
          matches,
        );

        return (
          <li {...props}>
            <Grid
              container
              alignItems="center"
            >
              <Grid item>
                <ContactIcon sx={{ color: 'primary.main', mr: 2 }} />
              </Grid>
              <Grid
                item
                xs
              >
                {parts.map((part, index) => (
                  <span
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${option.id}_${index}`}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                  {get(option, 'contact.email', '')}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

ContactSearch.propTypes = {
  onSelect: PropTypes.func,
  poolContacts: PropTypes.array,
};

export default ContactSearch;
