import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Slider,
} from '@mui/material';
import {
  Clock as ClockIcon,
} from 'react-feather';
import ChemicalTestStatus from './ChemicalTestStatus';
import HistoryChart from './HistoryChart';
import { ChemicalResult } from 'src/types/waterTest';

interface TemperatureTestInputProps {
  chemicalResult: ChemicalResult;
  onChange?: (chemicalResult: ChemicalResult, value: string) => void;
}

const TemperatureTestInput: FC<TemperatureTestInputProps> = (props) => {
  const {
    chemicalResult,
    onChange,
    ...other
  } = props;

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(0);

  useEffect(() => {
    setSliderValue(parseInt(chemicalResult.value) || 0);
  }, [chemicalResult])
  

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

  const handleCloseHistory = (): void => {
    setOpenHistory(false);
  };

  const valuetext = (value: number) => {
    return `${value}°C`;
  }

  const marks = [
    {
      value: 0,
      label: '0°C',
    },
    {
      value: 15,
      label: '15°C',
    },
    {
      value: 21,
      label: '21°C',
    },
    {
      value: 30,
      label: '30°C',
    },
    {
      value: 40,
      label: '40°C',
    },
    {
      value: 50,
      label: '50°C',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
      }}
      {...other}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 2,
          ml: 3,
          mr: 5,
        }}
      >
        <Slider
          aria-label="Always visible"
          value={sliderValue}
          onChange={(event, value: number): void => setSliderValue(value)}
          onChangeCommitted={(event, value: number): void => onChange(
            chemicalResult,
            value.toString()
          )}
          getAriaValueText={valuetext}
          step={1}
          marks={marks}
          max={50}
          valueLabelDisplay="on"
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flex: 1
        }}
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
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography
                    color="textSecondary"
                    noWrap
                    variant="caption"
                  >
                    °C
                  </Typography>
                </InputAdornment>
              )
            }}
            value={chemicalResult.value}
          />
        </Tooltip>
      </Box>
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

TemperatureTestInput.propTypes = {
  // @ts-ignore
  chemicalResult: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

export default TemperatureTestInput;
