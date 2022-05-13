import React, {
  FC,
  memo,
  useCallback,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { RRule, Frequency } from 'rrule';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import DailySettings from './DailySettings';
import WeeklySettings from './WeeklySettings';
import MonthlySettings from './MonthlySettings';
import YearlySettings from './YearlySettings';

interface CustomRecurrenceSettingsProps {
  date: Date;
  onChange: (rRule?: RRule) => void;
}

interface FrequencyOption {
  label: string;
  value: Frequency;
}

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  {
    label: 'Daily',
    value: Frequency.DAILY,
  },
  {
    label: 'Weekly',
    value: Frequency.WEEKLY,
  },
  {
    label: 'Monthly',
    value: Frequency.MONTHLY,
  },
  {
    label: 'Yearly',
    value: Frequency.YEARLY,
  },
];

const CustomRecurrenceSettings: FC<CustomRecurrenceSettingsProps> = memo(({ date, onChange }) => {
  const [freq, setFreq] = useState<Frequency>(Frequency.WEEKLY);

  const handleChangeFreq = useCallback(
    (event: SelectChangeEvent) => {
      setFreq(parseInt(event.target.value, 10));
    },
    []
  );

  return (
    <>
      <FormControl
        variant="outlined"
        sx={{
          minWidth: '100%',
        }}
      >
        <InputLabel>Frequency</InputLabel>
        <Select
          value={freq.toString(10)}
          onChange={handleChangeFreq}
          size="small"
          label="Frequency"
        >
          {FREQUENCY_OPTIONS.map((freq) => (
            <MenuItem
              key={freq.value}
              value={freq.value}
            >
              {freq.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box paddingTop={3}>
        {freq === Frequency.DAILY && (
        <DailySettings
          date={date}
          onChange={onChange}
        />
        )}
        {freq === Frequency.WEEKLY && (
        <WeeklySettings
          date={date}
          onChange={onChange}
        />
        )}
        {freq === Frequency.MONTHLY && (
        <MonthlySettings
          date={date}
          onChange={onChange}
        />
        )}
        {freq === Frequency.YEARLY && (
        <YearlySettings
          date={date}
          onChange={onChange}
        />
        )}
      </Box>
    </>
  );
});

export default memo(CustomRecurrenceSettings);

CustomRecurrenceSettings.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};
