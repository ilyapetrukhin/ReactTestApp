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
import { JobTemplate } from 'src/types/jobTemplate';
import axios from 'axios';
import { apiConfig } from '../../../config';

interface JobTemplateSearchProps {
  onSelect?: (selectedJobTemplate: JobTemplate | null) => void;
  hideLabel?: boolean;
}

const JobTemplateSearch: FC<JobTemplateSearchProps> = (props) => {
  const { onSelect, hideLabel } = props;
  const [value, setValue] = useState<JobTemplate | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<JobTemplate[]>([]);
  const { organisation } = useSelector((state) => state.account);

  useEffect(() => {
    if (onSelect) {
      onSelect(value);
    }
  }, [value]);

  const fetch = useCallback(
    throttle(async (request: { input: string }, callback: (results?: JobTemplate[]) => void) => {
      const results = await axios.get(`${apiConfig.apiV2Url}/organisations/${organisation.id}/job-template?filter=${request.input}&limit=100&order=name`);
      callback(results.data.data);
    }, 1000),
    [organisation],
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '' || inputValue.length < 1) {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: JobTemplate[]) => {
      if (active) {
        let newOptions = [] as JobTemplate[];

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
      noOptionsText="No job templates"
      value={value}
      onChange={(event: any, newValue: JobTemplate | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params): JSX.Element => (
        <TextField
          {...params}
          label={hideLabel ? '' : 'Search job template'}
          variant="outlined"
          name="search_job_template"
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
      renderOption={(props, option: JobTemplate) => {
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
                  {get(option, 'job_type.name', 'Unknown type')}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

JobTemplateSearch.propTypes = {
  onSelect: PropTypes.func,
  hideLabel: PropTypes.bool,
};

export default JobTemplateSearch;
