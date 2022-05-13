import React, { FC, memo, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, SelectChangeEvent } from '@mui/material';

import { Frequency, RRule } from 'rrule';
import { getMonth, addDays } from 'date-fns';

import { MONTH_NAMES } from 'src/constants/date';
import EndDaySelector, { EndDaySettings, EndDayType } from './EndDaySelector';
import UnitSelector from './UnitSelector';

interface YearlySettingsProps {
  date: Date;
  onChange: (rRule: RRule) => void;
}

const YearlySettings: FC<YearlySettingsProps> = memo(({ date, onChange }) => {
  const monthOfDate = useMemo<string>(() => MONTH_NAMES[getMonth(date)], [date]);
  const [selectedMonth, setSelectedMonth] = useState<string>(monthOfDate);

  const [endDateSettings, setEndDateSettings] = useState<EndDaySettings | null>(null);

  const handleChange = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      setSelectedMonth(event.target.value);
    },
    []
  );

  const rRule = useMemo<RRule | null>(() => {
    if (endDateSettings == null) {
      return null;
    }

    const selectedMonthIndex = MONTH_NAMES.findIndex((m) => m === selectedMonth);
    const bymonth = selectedMonthIndex + 1;

    if (endDateSettings.endType === EndDayType.neverEnd) {
      return new RRule({
        freq: Frequency.YEARLY,
        bymonth,
      });
    }
    if (endDateSettings.endType === EndDayType.afterOccurrences) {
      return new RRule({
        freq: Frequency.YEARLY,
        count: endDateSettings.occurrences,
        bymonth,
      });
    }
    if (endDateSettings.endType === EndDayType.endDate) {
      return new RRule({
        freq: Frequency.YEARLY,
        until: addDays(endDateSettings.date, 1),
        bymonth,
      });
    }

    return null;
  }, [endDateSettings, selectedMonth]);

  useEffect(() => onChange(rRule), [rRule]);

  return (
    <>
      <Box minWidth="100%">
        <UnitSelector
          prefix="Repeat every"
          values={MONTH_NAMES}
          value={selectedMonth}
          onChange={handleChange}
        />
      </Box>
      <EndDaySelector
        initialEndDayType={EndDayType.afterOccurrences}
        endTypes={[EndDayType.afterOccurrences, EndDayType.neverEnd]}
        date={date}
        onChange={setEndDateSettings}
      />
    </>
  );
});

export default YearlySettings;

YearlySettings.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};
