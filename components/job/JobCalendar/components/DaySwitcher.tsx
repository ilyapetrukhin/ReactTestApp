import React, { FC, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { addDays, subDays } from 'date-fns';

import DaySwitcherButton from './DaySwitcherButton';

interface DaySwitcherProps {
  date: Date;
  onSelectDate: (date: Date) => void;
}

const DaySwitcher: FC<DaySwitcherProps> = memo(({ date, onSelectDate }) => {
  const days = useMemo(() => {
    const startDate = subDays(date, 2);

    const result: Date[] = [startDate];

    for (let i = 1; i < 7; i++) {
      result.push(addDays(startDate, i));
    }

    return result;
  }, [date]);

  return (
    <Box
      display="flex"
      alignItems="center"
    >
      {days.map((day) => (
        <DaySwitcherButton
          key={day.toString()}
          selected={date.getDate() === day.getDate()}
          date={day}
          onSelect={() => onSelectDate(day)}
        />
      ))}
    </Box>
  );
});

DaySwitcher.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onSelectDate: PropTypes.func.isRequired,
};

export default DaySwitcher;
