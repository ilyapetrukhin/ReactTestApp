import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Autocomplete, Typography, TextField, Grid, InputAdornment } from '@mui/material';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import PropTypes from 'prop-types';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { googleConfig } from 'src/config';
import { useSelector } from 'src/store';
import { geocodeByPlaceId } from 'react-places-autocomplete';
import parsePlace from 'src/utils/parseGooglePlace';
import SearchIcon from 'src/icons/Search';
import { Address } from 'src/types/address';

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

export interface PlaceType {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      },
    ];
  };
}

interface ComponentRestrictions {
  country: string
}

interface GoogleAddressSearchProps {
  onSelect?: (selectedAddress: Address) => void;
}

const GoogleAddressSearch: FC<GoogleAddressSearchProps> = (props) => {
  const { onSelect } = props;
  const [value, setValue] = useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<PlaceType[]>([]);
  const { organisation } = useSelector((state) => state.account);
  const isMountedRef = useIsMountedRef();

  const setScript = useCallback(async () => {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${googleConfig.apiKey}&libraries=places`,
        document.querySelector('head'),
        'google-maps',
      );
    }
  }, [isMountedRef]);

  useEffect(() => {
    setScript();
  }, [setScript]);

  useEffect(() => {
    if (value) {
      geocodeByPlaceId(value.place_id).then((result) => {
        if (result && result.length && onSelect) {
          onSelect(parsePlace(result[0]));
        }
      });
    }
  }, [value]);

  const fetch = useMemo(
    () => throttle((request: { input: string, componentRestrictions: ComponentRestrictions }, callback: (results?: PlaceType[]) => void) => {
      (autocompleteService.current as any).getPlacePredictions(request, callback);
    }, 1000),
    [],
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue, componentRestrictions: { country: organisation.company_address_country } }, (results?: PlaceType[]) => {
      if (active) {
        let newOptions = [] as PlaceType[];

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
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      noOptionsText="No addresses"
      value={value}
      onChange={(event: any, newValue: PlaceType | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params): JSX.Element => (
        <TextField
          {...params}
          label="Search address"
          variant="outlined"
          name="search_address"
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
      renderOption={(props, option: PlaceType) => {
        const matches = option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: any) => [match.offset, match.offset + match.length]),
        );

        return (
          <li {...props}>
            <Grid
              container
              alignItems="center"
            >
              <Grid item>
                <LocationOnIcon sx={{ color: 'primary.main', mr: 2 }} />
              </Grid>
              <Grid
                item
                xs
              >
                {parts.map((part, index) => (
                  <span
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

GoogleAddressSearch.propTypes = {
  onSelect: PropTypes.func,
};

export default GoogleAddressSearch;
