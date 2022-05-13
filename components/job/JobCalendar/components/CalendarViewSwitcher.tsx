import React, { FC, memo, useCallback } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import { CalendarView } from 'src/types/calendar';
import { useDispatch, useSelector } from 'src/store';
import { changeView } from 'src/slices/jobCalendar';

interface ViewOption {
  label: string;
  value: CalendarView;
}

const viewOptions: ViewOption[] = [
  {
    label: 'Agenda',
    value: 'listWeek',
  },
  {
    label: 'Quick',
    value: 'quickSchedule',
  },
  {
    label: 'Day',
    value: 'resourceTimeline',
  },
  {
    label: 'Week',
    value: 'resourceTimelineWeek',
  },
  {
    label: 'Fortnite',
    value: 'resourceTimelineFortnite',
  },
  {
    label: 'Month',
    value: 'dayGridMonth',
  },
];

interface CalendarViewSwitcherProps {
}

const CalendarViewSwitcher: FC<CalendarViewSwitcherProps> = memo(() => {
  const dispatch = useDispatch();
  const view = useSelector((state) => state.jobCalendar.view);

  const handleChangeView = useCallback((v: CalendarView) => {
    dispatch(changeView(v));
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
      flexWrap="wrap"
    >
      <ButtonGroup
        size="medium"
        sx={{ backgroundColor: 'common.white' }}
      >
        {viewOptions.map((viewOption) => (
          <Button
            variant={viewOption.value === view ? 'contained' : 'outlined'}
            key={viewOption.value}
            onClick={() => handleChangeView(viewOption.value)}
          >
            {viewOption.label.toUpperCase()}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
});

CalendarViewSwitcher.propTypes = {};

export default CalendarViewSwitcher;
