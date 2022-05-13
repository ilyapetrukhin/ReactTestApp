import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
  SelectChangeEvent,
} from '@mui/material';
import { RRule, Weekday, Frequency, WeekdayStr } from 'rrule';
import toast from 'react-hot-toast';

import EndDaySelector, { EndDaySettings, EndDayType } from './EndDaySelector';
import UnitSelector from './UnitSelector';

interface WeeklySettingsProps {
  date: Date;
  onChange: (rRule: RRule) => void;
}

interface HandleIntervalHook {
  intervals: number[],
  interval: number;
  handleChangeInterval: (
    event: SelectChangeEvent
  ) => void;
}

interface HandleChangeWeekdaysHook {
  selectedWeekdays: WeekdayStr[];
  handleChangeWeekdays: (
    event: React.MouseEvent<HTMLElement>, newWeekdays: string[]
  ) => void;
}

const WEEKDAYS: Weekday[] = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];

function useNotifyImpactStartDate(
  selectedWeekdays: WeekdayStr[],
  currentWeekday: Weekday,
) {
  const isImpactingStartDate = useMemo(
    () => selectedWeekdays.length !== 0 && !selectedWeekdays.includes(currentWeekday.toString() as WeekdayStr),
    [selectedWeekdays, currentWeekday]
  );
  const [isImpactingPreviousTime, setIsImpactingPreviousTime] = useState(isImpactingStartDate);

  useEffect(() => {
    if (isImpactingStartDate && !isImpactingPreviousTime) {
      toast.error('The selected options impacts your selected start date');
    }
    setIsImpactingPreviousTime(isImpactingStartDate);
  }, [isImpactingStartDate, isImpactingPreviousTime]);
}

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

function useHandleWeekdays(currentWeekday: WeekdayStr): HandleChangeWeekdaysHook {
  const [selectedWeekdays, setSelectedWeekdays] = useState<WeekdayStr[]>([
    currentWeekday,
  ]);
  const handleChangeWeekdays = useCallback(
    (
      _: React.MouseEvent<HTMLElement>, newWeekdays: string[]
    ) => {
      setSelectedWeekdays(newWeekdays as WeekdayStr[]);
    },
    []
  );
  return {
    selectedWeekdays,
    handleChangeWeekdays,
  };
}

const getWeekdayByText = (weekdayText: WeekdayStr): Weekday | null => WEEKDAYS.find((w) => w.toString() === weekdayText);
const mapWeekDayStringsToWeekday = (weekdays: WeekdayStr[]): Weekday[] => weekdays.map(getWeekdayByText).filter((w) => w != null);
const getCurrentRRuleWeekdayByDate = (date: Date): Weekday => {
  const week = date.getDay();
  return WEEKDAYS[week];
};

const WeeklySettings: FC<WeeklySettingsProps> = memo(({ date, onChange }) => {
  const [endDateSettings, setEndDateSettings] = useState<EndDaySettings | null>(null);
  const currentWeekday = useMemo<Weekday>(
    () => getCurrentRRuleWeekdayByDate(date),
    [date]
  );

  const { intervals, interval, handleChangeInterval } = useHandleInterval();
  const { selectedWeekdays, handleChangeWeekdays } = useHandleWeekdays(currentWeekday.toString() as WeekdayStr);
  useNotifyImpactStartDate(selectedWeekdays, currentWeekday);

  const rRule = useMemo<RRule | null>(() => {
    if (endDateSettings == null) {
      return null;
    }

    const byweekday = mapWeekDayStringsToWeekday(selectedWeekdays);

    if (endDateSettings.endType === EndDayType.neverEnd) {
      return new RRule({
        freq: Frequency.WEEKLY,
        interval,
        byweekday,
      });
    }
    if (endDateSettings.endType === EndDayType.afterOccurrences) {
      return new RRule({
        freq: Frequency.WEEKLY,
        interval,
        count: endDateSettings.occurrences,
        byweekday,
      });
    }
    if (endDateSettings.endType === EndDayType.endDate) {
      return new RRule({
        freq: Frequency.WEEKLY,
        interval,
        until: endDateSettings.date,
        byweekday,
      });
    }

    return null;
  }, [endDateSettings, interval, selectedWeekdays, currentWeekday]);

  useEffect(() => onChange(rRule), [rRule]);

  return (
    <>
      <UnitSelector
        prefix="Repeat every"
        suffix={interval === 1 ? 'week' : 'weeks'}
        values={intervals}
        value={interval}
        onChange={handleChangeInterval}
      />
      <FormControl
        sx={{
          display: 'flex'
        }}
      >
        <FormLabel>On</FormLabel>
        <ToggleButtonGroup
          value={selectedWeekdays}
          onChange={handleChangeWeekdays}
          sx={{
            minWidth: '100%',
            py: 1
          }}
        >
          {WEEKDAYS.map((w) => (
            <ToggleButton
              key={w.toString()}
              value={w.toString()}
              sx={{
                px: 1.5
              }}
              size="small"
              color="secondary"
            >
              {w.toString()}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormControl>

      <EndDaySelector
        initialEndDayType={EndDayType.neverEnd}
        endTypes={[EndDayType.afterOccurrences, EndDayType.endDate, EndDayType.neverEnd]}
        date={date}
        onChange={setEndDateSettings}
      />
    </>
  );
});

export default WeeklySettings;

WeeklySettings.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};
