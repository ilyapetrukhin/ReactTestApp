import { FC, useMemo, useState, useCallback, memo, useEffect } from 'react';
import PropTypes from 'prop-types';

import RRule, { Frequency } from 'rrule';
import EndDaySelector, { EndDaySettings, EndDayType } from './EndDaySelector';
import UnitSelector from './UnitSelector';
import { SelectChangeEvent } from '@mui/material';

interface DailySettingsProps {
  date: Date;
  onChange: (rRule?: RRule) => void;
}

const DailySettings: FC<DailySettingsProps> = memo(({ date, onChange }) => {
  const frequencyInterval = useMemo<number[]>(
    () => new Array(30).fill(null).map((_, i: number) => i + 1),
    []
  );

  const [interval, setInter] = useState<number>(frequencyInterval[0]);
  const [endDateSettings, setEndDateSettings] = useState<EndDaySettings | null>(null);

  const rRule = useMemo<RRule | null>(() => {
    if (endDateSettings == null) {
      return null;
    }

    if (endDateSettings.endType === EndDayType.neverEnd) {
      return new RRule({
        freq: Frequency.DAILY,
        interval,
      });
    }
    if (endDateSettings.endType === EndDayType.afterOccurrences) {
      return new RRule({
        freq: Frequency.DAILY,
        interval,
        count: endDateSettings.occurrences,
      });
    }
    if (endDateSettings.endType === EndDayType.endDate) {
      return new RRule({
        freq: Frequency.DAILY,
        interval,
        until: endDateSettings.date,
      });
    }

    return null;
  }, [endDateSettings, interval]);

  const handleChange = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      setInter(parseInt(event.target.value, 10));
    },
    []
  );

  useEffect(() => onChange(rRule), [rRule]);

  return (
    <>
      <UnitSelector
        prefix="Repeat every"
        suffix={interval === 1 ? 'day' : 'days'}
        value={interval}
        values={frequencyInterval}
        onChange={handleChange}
      />

      <EndDaySelector
        date={date}
        initialEndDayType={EndDayType.endDate}
        endTypes={[EndDayType.afterOccurrences, EndDayType.endDate]}
        onChange={setEndDateSettings}
      />
    </>
  );
});

export default DailySettings;

DailySettings.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};
