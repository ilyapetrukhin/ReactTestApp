import React, { FC, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ButtonGroup,
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import ChevronLeftIcon from 'src/icons/ChevronLeft';
import ChevronRightIcon from 'src/icons/ChevronRight';

import { useDispatch, useSelector } from 'src/store';
import { setShowMap } from 'src/slices/jobCalendar';
import DaySwitcher from './DaySwitcher';
import { FilterList } from '@mui/icons-material';

interface CalendarToolbarProps {
  title: string;
  date: Date;
  onAddClick?: () => void;
  onDateNext?: () => void;
  onDatePrev?: () => void;
  onDateChange: (date: Date) => void;
}

const CalendarToolbar: FC<CalendarToolbarProps> = (props) => {
  const { showMap, view } = useSelector((state) => state.jobCalendar);
  const dispatch = useDispatch();

  const { title, date, onDateNext, onDatePrev, onDateChange, ...other } = props;

  const handleShowMap = useCallback((showMap: boolean): void => {
    dispatch(setShowMap(showMap));
  }, []);

  const showDaySwitcher = useMemo(
    () => view === 'quickSchedule' || view === 'resourceTimeline',
    [view]
  );

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
      alignItems="center"
      flexWrap="wrap"
      {...other}
    >
      <Box display="flex">
        {showDaySwitcher && date != null && (
          <DaySwitcher
            date={date}
            onSelectDate={onDateChange}
          />
        )}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <ButtonGroup>
            <IconButton onClick={onDatePrev}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={onDateNext}>
              <ChevronRightIcon />
            </IconButton>
          </ButtonGroup>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
      >
        <Typography
          sx={{
            ml: 1,
          }}
          color="textPrimary"
          variant="h5"
        >
          {title}
        </Typography>
        <FormControlLabel
          sx={{
            ml: 1,
            // minWidth: 150,
          }}
          control={(
            <Switch
              checked={showMap}
              color="primary"
              name="mapView"
              disabled={view !== 'resourceTimeline'}
              onChange={(event) => handleShowMap(event.target.checked)}
            />
          )}
          label="Map view"
        />
        <Button variant="outlined">
          <FilterList sx={{ mr: 1 }} />
          <Typography
            color="inherit"
            variant="body1"
            sx={{ textTransform: 'uppercase' }}
          >
            Filter
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

CalendarToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  onAddClick: PropTypes.func,
  onDateNext: PropTypes.func,
  onDatePrev: PropTypes.func,
  onDateChange: PropTypes.func,
};

export default CalendarToolbar;
