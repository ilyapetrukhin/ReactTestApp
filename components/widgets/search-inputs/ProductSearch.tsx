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
import { ALL_CAT_FILTER, Product } from 'src/types/product';
import { useGetProductsQuery } from 'src/api/product';

interface ProductSearchProps {
  onSelect?: (selectedProduct: Product | null) => void;
  hideLabel?: boolean;
}

const ProductSearch: FC<ProductSearchProps> = (props) => {
  const { onSelect, hideLabel } = props;
  const [value, setValue] = useState<Product | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Product[]>([]);
  const { limit, page, categoryFilter, order, orderBy } = useSelector((state) => state.product);
  const { organisation } = useSelector((state) => state.account);
  const { data, isLoading } = useGetProductsQuery({
    organisationId: organisation.id,
    limit,
    page,
    catFilter: (Boolean(categoryFilter) && categoryFilter !== ALL_CAT_FILTER) ? categoryFilter : '',
    filter: inputValue,
    sortBy: orderBy ? `${order === 'desc' ? '-' : ''}${orderBy}` : ''
  });

  useEffect(() => {
    if (onSelect) {
      onSelect(value);
    }
  }, [value]);

  const fetch = useCallback(
    throttle(async (request: { input: string }, callback: (results?: Product[]) => void) => {
      if (!isLoading) {
        callback(data.data);
      }
    }, 100),
    [data, isLoading],
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '' || inputValue.length < 3) {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: Product[]) => {
      if (active) {
        let newOptions = [] as Product[];

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
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      noOptionsText="No products"
      value={value}
      onChange={(event: any, newValue: Product | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params): JSX.Element => (
        <TextField
          {...params}
          label={hideLabel ? '' : 'Search product'}
          variant="outlined"
          name="search_product"
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
      renderOption={(props, option: Product) => {
        const matches = match(option.name, inputValue);
        const parts = parse(
          option.name,
          matches,
        );

        return (
          <li {...props}>
            <Grid
              container
              alignItems="center"
            >
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
                  {get(option, 'category.name', 'Unknown type')}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

ProductSearch.propTypes = {
  onSelect: PropTypes.func,
  hideLabel: PropTypes.bool,
};

export default ProductSearch;
