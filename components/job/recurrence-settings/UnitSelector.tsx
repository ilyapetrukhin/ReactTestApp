import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from '@mui/material';

interface UnitSelectorProps<T> {
  prefix?: string;
  value: T;
  values: T[];
  suffix?: string;
  onChange?: (event: SelectChangeEvent) => void
}

type UnitSelectorI<T = any> = FC<UnitSelectorProps<T>>;

const UnitSelector: UnitSelectorI = memo(({ prefix, value, values, suffix, onChange }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}
  >
    { prefix != null && (
      <Typography
        fontWeight="bold"
        sx={{
          mr: 2
        }}
      >
        {prefix}
      </Typography>
    )}

    <FormControl variant="outlined">
      <Select
        size="small"
        value={value}
        onChange={onChange}
      >
        {values.map((item) => (
          <MenuItem
            key={item}
            value={item}
          >
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {suffix != null && (
      <Typography
        sx={{
          ml: 2
        }}
      >
        {suffix}
      </Typography>
    )}
  </Box>
));

export default UnitSelector;

UnitSelector.propTypes = {
  prefix: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  suffix: PropTypes.string,
  onChange: PropTypes.func,
};
