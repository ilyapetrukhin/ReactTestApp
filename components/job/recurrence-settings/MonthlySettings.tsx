import React, {
  FC,
  memo,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  capitalize,
  Grid,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import {
  Frequency,
  RRule,
  Weekday as RRuleWeekday,
  WeekdayStr,
} from 'rrule';
import { getWeekOfMonth } from 'date-fns';

import EndDaySelector, { EndDaySettings, EndDayType } from './EndDaySelector';
import UnitSelector from './UnitSelector';

interface MonthlySettingsProps {
  date: Date;
  onChange: (rRule: RRule) => void;
}

type DayOfMonth = 'DAY_OF_THE_WEEK' | 'DAY_OF_THE_MONTH' | 'CUSTOM';
type NumberOfWeek = 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH';

interface Weekday {
  text: string;
  rruleValue: RRuleWeekday;
}

interface HandleIntervalHook {
  intervals: number[],
  interval: number;
  handleChangeInterval: (
    event: SelectChangeEvent
  ) => void;
}

interface HandleDayOfMonthHook {
  dayOfMonth: DayOfMonth,
  handleChangeDayOfMonth: (event: React.ChangeEvent<HTMLInputElement>, newDayOfMont: DayOfMonth) => void;
}

interface HandleNumberOfWeekHook {
  selectedNumberOfWeek: number,
  handleChangeNumberOfWeek: (
    event: SelectChangeEvent
  ) => void,
}

interface HandleWeekdayHook {
  selectedWeekDay: RRuleWeekday;
  handleChangeWeekday: (
    event: SelectChangeEvent
  ) => void,
}

const WEEKDAYS: Weekday[] = [
  {
    text: 'Sunday',
    rruleValue: RRule.SU,
  },
  {
    text: 'Monday',
    rruleValue: RRule.MO,
  },
  {
    text: 'Tuesday',
    rruleValue: RRule.TU,
  },
  {
    text: 'Wednesday',
    rruleValue: RRule.WE,
  },
  {
    text: 'Thursday',
    rruleValue: RRule.TH,
  },
  {
    text: 'Friday',
    rruleValue: RRule.FR,
  },
  {
    text: 'Saturday',
    rruleValue: RRule.SA,
  },
];

const WEEK_NUMBERS: NumberOfWeek[] = ['FIRST', 'SECOND', 'THIRD', 'FOURTH'];

const getCurrentRRuleWeekdayByDate = (date: Date): RRuleWeekday => {
  const week = date.getDay();
  return WEEKDAYS[week].rruleValue;
};
const getWeekdayByText = (weekdayText: WeekdayStr): RRuleWeekday | null => WEEKDAYS.find((w) => w.rruleValue.toString() === weekdayText)?.rruleValue;

function useHandleInterval(): HandleIntervalHook {
  const intervals = useMemo<number[]>(
    () => new Array(30).fill(null).map((_, i: number) => i + 1),
    []
  );
  const [interval, setInter] = useState<number>(intervals[0]);
  const handleChangeInterval = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      setInter(parseInt(event.target.value, 10));
    },
    []
  );

  return {
    intervals,
    interval,
    handleChangeInterval,
  };
}

function useHandleDayOfMonth(): HandleDayOfMonthHook {
  const [dayOfMonth, setDayOfMonth] = useState<DayOfMonth>('DAY_OF_THE_WEEK');

  const handleChangeDayOfMonth = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, newDayOfMont: DayOfMonth) => {
      setDayOfMonth(newDayOfMont);
    },
    []
  );

  return {
    dayOfMonth,
    handleChangeDayOfMonth,
  };
}

function useHandleNumberOfWeek(initialNumberOfWeek: number): HandleNumberOfWeekHook {
  const [selectedNumberOfWeek, setSelectedNumberOfWeek] = useState<number>(initialNumberOfWeek);

  const handleChangeNumberOfWeek = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      setSelectedNumberOfWeek(parseInt(event.target.value, 10));
    },
    []
  );

  return {
    selectedNumberOfWeek,
    handleChangeNumberOfWeek,
  };
}

function useHandleWeekday(initialWeekday: RRuleWeekday): HandleWeekdayHook {
  const [selectedWeekDay, setSelectedWeekday] = useState<RRuleWeekday>(initialWeekday);

  const handleChangeWeekday = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      setSelectedWeekday(getWeekdayByText(event.target.value as WeekdayStr));
    },
    []
  );

  return {
    selectedWeekDay,
    handleChangeWeekday,
  };
}

const MonthlySettings: FC<MonthlySettingsProps> = memo(({ date, onChange }) => {
  const weekNumberOfDate = useMemo(
    () => getWeekOfMonth(date, { weekStartsOn: 0 }),
    [date]
  );
  const rRuleWeekdayOfDate = useMemo<RRuleWeekday>(
    () => getCurrentRRuleWeekdayByDate(date),
    [date]
  );

  const [endDateSettings, setEndDateSettings] = useState<EndDaySettings | null>(null);

  const { intervals, interval, handleChangeInterval } = useHandleInterval();
  const { dayOfMonth, handleChangeDayOfMonth } = useHandleDayOfMonth();
  const { selectedNumberOfWeek, handleChangeNumberOfWeek } = useHandleNumberOfWeek(Math.min(weekNumberOfDate, 4));
  const { selectedWeekDay, handleChangeWeekday } = useHandleWeekday(rRuleWeekdayOfDate);

  const byweekday = useMemo<RRuleWeekday | null>(() => {
    if (dayOfMonth === 'DAY_OF_THE_WEEK') {
      return rRuleWeekdayOfDate.nth(weekNumberOfDate);
    }

    if (dayOfMonth === 'DAY_OF_THE_MONTH') {
      return null;
    }

    if (dayOfMonth === 'CUSTOM') {
      return selectedWeekDay.nth(selectedNumberOfWeek);
    }

    return null;
  }, [
    dayOfMonth,
    weekNumberOfDate,
    rRuleWeekdayOfDate,
    selectedWeekDay,
    selectedNumberOfWeek,
  ]);

  const rRule = useMemo<RRule | null>(() => {
    if (endDateSettings == null) {
      return null;
    }

    if (endDateSettings.endType === EndDayType.neverEnd) {
      return new RRule({
        freq: Frequency.MONTHLY,
        interval,
        byweekday,
      });
    }
    if (endDateSettings.endType === EndDayType.afterOccurrences) {
      return new RRule({
        freq: Frequency.MONTHLY,
        interval,
        count: endDateSettings.occurrences,
        byweekday,
      });
    }
    if (endDateSettings.endType === EndDayType.endDate) {
      return new RRule({
        freq: Frequency.MONTHLY,
        interval,
        until: endDateSettings.date,
        byweekday,
      });
    }

    return null;
  }, [endDateSettings, interval, byweekday]);

  useEffect(() => onChange(rRule), [rRule]);

  return (
    <>
      <UnitSelector
        prefix="Repeat every"
        suffix={interval === 1 ? 'month' : 'months'}
        values={intervals}
        value={interval}
        onChange={handleChangeInterval}
      />

      <Box minWidth="100%">
        <FormControl variant="outlined">
          <FormLabel>On</FormLabel>
          <RadioGroup
            value={dayOfMonth}
            onChange={handleChangeDayOfMonth}
          >
            <FormControlLabel
              value="DAY_OF_THE_WEEK"
              control={<Radio />}
              label="Day of the week"
            />
            <FormControlLabel
              value="DAY_OF_THE_MONTH"
              control={<Radio />}
              label="Day of the month"
            />
            <FormControlLabel
              value="CUSTOM"
              control={<Radio />}
              label="Custom"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {dayOfMonth === 'CUSTOM' && (
        <Grid
          container
          spacing={1}
          marginTop={1}
          marginBottom={1}
        >
          <Grid
            item
            xs={6}
          >
            <FormControl
              variant="outlined"
              sx={{
                minWidth: '100%'
              }}
            >
              <Select
                onChange={handleChangeNumberOfWeek}
                value={selectedNumberOfWeek.toString(10)}
                size="small"
              >
                {WEEK_NUMBERS.map((w, i) => (
                  <MenuItem
                    value={i + 1}
                    key={w}
                  >
                    {capitalize(w.toLowerCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid
            item
            xs={6}
          >
            <FormControl
              variant="outlined"
              sx={{
                minWidth: '100%'
              }}
            >
              <Select
                onChange={handleChangeWeekday}
                value={selectedWeekDay.toString()}
                size="small"
              >
                {WEEKDAYS.map((w) => (
                  <MenuItem
                    key={w.text}
                    value={w.rruleValue.toString()}
                  >
                    {w.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}

      <EndDaySelector
        initialEndDayType={EndDayType.neverEnd}
        endTypes={[EndDayType.afterOccurrences, EndDayType.endDate, EndDayType.neverEnd]}
        date={date}
        onChange={setEndDateSettings}
      />
    </>
  );
});

export default MonthlySettings;

MonthlySettings.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};
