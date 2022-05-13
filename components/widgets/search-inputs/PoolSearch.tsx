import type { FC } from 'react';
import React, { useEffect, useCallback, useState } from 'react';
import { Autocomplete, Typography, TextField, Grid, InputAdornment } from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import PropTypes from 'prop-types';
import { useSelector } from 'src/store';
import SearchIcon from 'src/icons/Search';
import PoolIcon from 'src/icons/Pool';
import { Pool } from 'src/types/pool';
import { useGetPoolsQuery } from '../../../api/pool';

interface PoolSearchProps {
  onSelect?: (selectedPool: Pool | null) => void;
  contactPools?: Pool[];
}

const PoolSearch: FC<PoolSearchProps> = (props) => {
  const { onSelect } = props;
  const [value, setValue] = useState<Pool | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Pool[]>([]);
  const { organisation } = useSelector((state) => state.account);
  const { order, orderBy } = useSelector((state) => state.pool);
  const { data, isLoading } = useGetPoolsQuery({
    organisationId: organisation.id,
    limit: 100,
    page: null,
    filter: inputValue,
    sortBy: orderBy ? `${order === 'desc' ? '-' : ''}${orderBy}` : 'address_street_one'
  });

  useEffect(() => {
    if (onSelect) {
      onSelect(value);
    }
  }, [value]);

  const fetch = useCallback(
    throttle(async (request: { input: string }, callback: (results?: Pool[]) => void) => {
      if (!isLoading) {
        callback(data.data);
      }
    }, 100),
    [data, isLoading]
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '' || inputValue.length < 3) {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: Pool[]) => {
      if (active) {
        let newOptions = [] as Pool[];

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
      noOptionsText="No pools"
      value={value}
      onChange={(event: any, newValue: Pool | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params): JSX.Element => (
        <TextField
          {...params}
          label="Search pool"
          variant="outlined"
          name="search_pool"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          fullWidth
        />
      )}
      renderOption={(props, option: Pool) => {
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
                <PoolIcon sx={{ color: 'primary.main', mr: 2 }} />
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
                  {get(option, 'pool_type.name', 'Unknown type')}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

PoolSearch.propTypes = {
  onSelect: PropTypes.func,
  contactPools: PropTypes.array,
};

export default PoolSearch;
