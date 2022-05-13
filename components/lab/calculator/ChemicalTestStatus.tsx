import React, { memo } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
} from '@mui/material';
import {
  ArrowDownCircle as ArrowDownCircleIcon,
  ArrowUpCircle as ArrowUpCircleIcon,
  Check as CheckIcon,
} from 'react-feather';

interface ChemicalTestStatusProps {
  currentValue: string | number;
  minValue: number;
  maxValue: number;
}

const ChemicalTestStatus: FC<ChemicalTestStatusProps> = (props) => {
  const {
    currentValue,
    minValue,
    maxValue
  } = props;

  if (currentValue === '') {
    return (
      <Box
        sx={{
          minWidth: 22
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: (currentValue <= maxValue && currentValue >= minValue) ? 'success.main' : 'error.main',
      }}
    >
      {currentValue < minValue && (
        <ArrowDownCircleIcon
          fontSize="small"
        />
      )}
      {currentValue > maxValue && (
        <ArrowUpCircleIcon
          fontSize="small"
        />
      )}
      {currentValue <= maxValue && currentValue >= minValue && (
        <CheckIcon
          fontSize="small"
        />
      )}
    </Box>
  );
};

ChemicalTestStatus.propTypes = {
  currentValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
};

export default memo(ChemicalTestStatus);
