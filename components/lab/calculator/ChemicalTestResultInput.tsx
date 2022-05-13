import React, { useMemo, useRef, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Popover,
} from '@mui/material';
import {
  Clock as ClockIcon,
  XCircle as XCircleIcon,
} from 'react-feather';
import ChemicalTestStatus from './ChemicalTestStatus';
import { LSI_TEST, PH_TEST, TEMPERATURE_TEST } from './constants';
import HistoryChart from './HistoryChart';
import { ChemicalResult } from 'src/types/waterTest';

interface ChemicalResultInputProps {
  chemicalResult: ChemicalResult;
  onChange?: (chemicalResult: ChemicalResult, value: string) => void;
  onRemove?: (chemicalResult: ChemicalResult, enabled: boolean) => void;
}

const ChemicalResultInput: FC<ChemicalResultInputProps> = (props) => {
  const {
    chemicalResult,
    onChange,
    onRemove,
    ...other
  } = props;

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openHistory, setOpenHistory] = useState<boolean>(false);

  const currentValue = useMemo(
    () => (chemicalResult?.value ? parseFloat(chemicalResult.value) : ''),
    [chemicalResult.value],
  );

  const minValue = useMemo(
    () => chemicalResult.min_value || 0,
    [chemicalResult],
  );

  const maxValue = useMemo(
    () => chemicalResult.max_value || 0,
    [chemicalResult],
  );

  const tooltipInfo = useMemo(
    () => `Min: ${chemicalResult.min_value} | Max: ${chemicalResult.max_value} | Target: ${chemicalResult.target_value}`,
    [chemicalResult],
  );

  const handleOpenHistory = (): void => {
    setOpenHistory(true);
  };

  const handleRemoveTest = (): void => {
    onRemove(chemicalResult, false);
  };

  const handleCloseHistory = (): void => {
    setOpenHistory(false);
  };

  const testMeasurement = useMemo(
    () => {
      let measurement = 'ppm';
      switch (chemicalResult.chemical_test.name) {
        case TEMPERATURE_TEST:
          measurement = '°C';
          break;
        case PH_TEST:
          measurement = 'pH';
          break;
        default:
      }
      return measurement;
    },
    [chemicalResult.chemical_test],
  );

  return (
    <Box
      sx={{
        display: 'flex',
      }}
      {...other}
    >
      <Tooltip title={tooltipInfo}>
        <TextField
          fullWidth
          label={chemicalResult.chemical_test.name}
          name={chemicalResult.chemical_test.name}
          onChange={(event): void => onChange(
            chemicalResult,
            event.target.value
          )}
          disabled={chemicalResult.chemical_test.name === LSI_TEST}
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography
                  color="textSecondary"
                  noWrap
                  variant="caption"
                >
                  {testMeasurement}
                </Typography>
              </InputAdornment>
            )
          }}
          value={chemicalResult.value}
        />
      </Tooltip>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Tooltip title="Test history">
          <IconButton
            sx={{
              color: 'primary.main',
            }}
            ref={anchorRef}
            onClick={handleOpenHistory}
          >
            <ClockIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {!chemicalResult.chemical_test?.is_default && (
          <IconButton
            sx={{
              color: 'error.main',
            }}
            onClick={handleRemoveTest}
          >
            <XCircleIcon fontSize="small" />
          </IconButton>
        )}
        <Popover
          anchorEl={anchorRef.current}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'bottom'
          }}
          onClose={handleCloseHistory}
          open={openHistory}
          PaperProps={{
            sx: { width: 500 }
          }}
        >
          <HistoryChart
            testName={chemicalResult.chemical_test.name}
            historyItems={null}
          />
        </Popover>
      </Box>
      <ChemicalTestStatus
        currentValue={currentValue}
        minValue={minValue}
        maxValue={maxValue}
      />
    </Box>
  );
};

ChemicalResultInput.propTypes = {
  // @ts-ignore
  chemicalResult: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
};

export default ChemicalResultInput;
