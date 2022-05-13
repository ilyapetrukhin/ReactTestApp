import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import '@fullcalendar/timeline/main.css';
import '@fullcalendar/resource-timeline/main.css';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Collapse,
} from '@mui/material';
import FullCalendar, {
  DatesSetArg,
  NowIndicatorContentArg,
} from '@fullcalendar/react';
import { addDays, subDays, endOfDay, format, startOfDay } from 'date-fns';
import moment from 'moment/moment';
import debounce from 'lodash/debounce';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import rrulePlugin from '@fullcalendar/rrule';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import momentPlugin from '@fullcalendar/moment';

import { JobMap } from 'src/components/job';
import CalendarToolbar from 'src/components/job/JobCalendar/components/CalendarToolbar';
import FullCalendarStyled from 'src/components/job/JobCalendar/components/FullCalendarStyled';
import NowIndicator from 'src/components/job/JobCalendar/components/NowIndicator';
import { getJobs } from 'src/slices/jobCalendar';
import {
  CalendarEvent,
  CalendarResource,
} from 'src/types/calendar';

import { updateEvent } from '../../../slices/calendar';
import { useDispatch, useSelector } from '../../../store';
import { getEntityAddress } from '../../../utils/address';
import { getFullName } from '../../../utils/contact';

import { JobExtendedProps, SlotLabelContentData } from './types';
import {
  FULL_CALENDAR_BUSINESS_HOURS,
  FULL_CALENDAR_VIEWS,
  LOAD_JOBS_DEBOUNCE_TIMEOUT,
  MIN_ROW_HEIGHT,
  UNASSIGNED_RESOURCE_ID,
} from './constants';
import { renderEvent, renderEventAgenda, renderResource, renderSlot } from './renderHooks';
import { QuickSchedule } from 'src/components/job/quick-schedule';

const FULL_CALENDAR_PLUGINS = [
  resourceTimelinePlugin,
  rrulePlugin,
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
  momentPlugin,
  momentTimezonePlugin,
  timeGridPlugin,
  timelinePlugin,
];

const renderNowIndicatorContent = (args: NowIndicatorContentArg) => {
  if (!args.isAxis) {
    return <div />;
  }

  return <NowIndicator date={args.date} />;
};

interface JobCalendarProps {
  nowIndicator?: boolean;
}

const JobCalendar: FC<JobCalendarProps> = ({ nowIndicator }) => {
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // -------------- Redux selectors --------------
  const { organisation } = useSelector((state) => state.account);
  const { jobs, isLoading, showMap, selectedTechnicianId, view } = useSelector(
    (state) => state.jobCalendar
  );
  const technicians = useSelector((state) => state.user.technicians);

  // -------------- Refs --------------
  const calendarRef = useRef<FullCalendar | null>(null);
  const initialDateRef = useRef(new Date());

  // -------------- State --------------
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [resources, setResources] = useState<CalendarResource[]>();

  // a date that contains current date target
  // current displaying day, or current displaying month
  // we need this because the `startDate` could be previous day or previous month
  const date = useMemo(() => {
    if (startDate == null || endDate == null) {
      return null;
    }

    let dateResult : Date;

    switch (view) {
      case 'quickSchedule':
      case 'resourceTimeline':
      case 'resourceTimelineWeek':
      case 'resourceTimelineFortnite':
      default:
        dateResult = new Date(startDate);
        if (startDate.getDate() !== endDate.getDate()) {
          dateResult.setDate(dateResult.getDate() + 1);
        }

        return dateResult;
      case 'dayGridMonth':
        // format to the date, that includes current month for sure
        dateResult = new Date(startDate);
        dateResult.setDate(dateResult.getDate() + 7);
        return dateResult;
    }
  }, [view, startDate, endDate]);

  const title = useMemo(() => {
    if (date == null) {
      return '';
    }

    switch (view) {
      case 'quickSchedule':
      case 'resourceTimeline':
      default:
        return format(date, 'EEEE d MMMM yyyy');
      case 'resourceTimelineWeek':
      case 'resourceTimelineFortnite':
        return `${format(date, 'MMM d')} - ${format(endDate, 'd, yyyy')}`;
      case 'dayGridMonth':
        return format(date, 'MMMM yyyy');
    }
  }, [view, date]);

  // -------------- Callbacks --------------`
  const loadJobs = useCallback(
    debounce(
      (start: Date, end: Date) => {
        const startDate = view === 'quickSchedule' ? start : addDays(start, 1);
        dispatch(
          getJobs(
            organisation.id,
            format(startDate, 'yyyy-MM-dd'),
            format(addDays(end, 1), 'yyyy-MM-dd')
          )
        );
      },
      LOAD_JOBS_DEBOUNCE_TIMEOUT,
    ),
    [organisation.id, view]
  );

  const onChangeDateByCalendar = useCallback(
    (date: DatesSetArg) => {
      setStartDate(date.start);
      setEndDate(date.end);
    },
    [loadJobs]
  );

  const onChangeDay = useCallback(
    (date: Date) => {
      setStartDate(startOfDay(date));
      setEndDate(endOfDay(date));
      calendarRef.current?.getApi().gotoDate(startOfDay(date));
    },
    [loadJobs, view]
  );

  const onDatePrev = useCallback(() => {
    if (view === 'quickSchedule') {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);

      sDate.setDate(sDate.getDate() - 1);
      eDate.setDate(eDate.getDate() - 1);

      setStartDate(sDate);
      setEndDate(eDate);
    } else {
      calendarRef.current?.getApi().prev();
    }
  }, [view, startDate, endDate]);

  const onDateNext = useCallback(() => {
    if (view === 'quickSchedule') {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);

      sDate.setDate(sDate.getDate() + 1);
      eDate.setDate(eDate.getDate() + 1);

      setStartDate(sDate);
      setEndDate(eDate);
    } else {
      calendarRef.current?.getApi().next();
    }
  }, [view, startDate, endDate]);

  const renderSlotContent = useCallback(
    (data: SlotLabelContentData) => renderSlot(data, view),
    [view]
  );

  const handleEventResize = useCallback(async ({ event }: any): Promise<void> => {
    try {
      await dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleEventDrop = useCallback(async ({ event }: any): Promise<void> => {
    try {
      await dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  // set day interval to 1 day, if the view was changed to 1 day
  useEffect(() => {
    if (view === 'quickSchedule') {
      setEndDate(startDate);
    }
  }, [view]);

  // set start date and end dates if initial view is `quickSchedule`
  useEffect(() => {
    if (view === 'quickSchedule' && startDate == null && endDate == null) {
      const date = new Date();
      setStartDate(subDays(date, 1));
      setEndDate(endOfDay(date));
    }
  }, [view, startDate, endDate, onChangeDay]);

  // -------------- Effects --------------`
  useEffect(() => {
    if (startDate != null && endDate != null) {
      loadJobs(startDate, endDate);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const technicianIdToFilterBy = selectedTechnicianId === UNASSIGNED_RESOURCE_ID
      ? null
      : selectedTechnicianId;

    const filteredJobs = selectedTechnicianId == null
      ? jobs
      : jobs.filter((j) => `${j.user_id}` === technicianIdToFilterBy);

    const transformedJobs = filteredJobs.map((job) => {
      const extendedProps: JobExtendedProps = {
        contactName: job.contact ? getFullName(job.contact) : '-',
        fullAddress: job.pool ? getEntityAddress(job.pool, 'pool', true) : '-',
        startTime: moment(job.start_time).toDate(),
        endTime: moment(job.end_time).toDate(),
        timezone: organisation.timezone,
        phones: job.contact?.phones?.map((p) => p.phone_number) || [],
        recurrenceIc: !!job.recurrence_id,
        messageIc:
          job.booking_enabled || job.complete_enabled || job.reminder_enabled || false,
        notes: job.job_notes,
        color: job.org_color?.color_code,
      };

      return {
        id: job.id ? job.id.toString(10) : job.virtual_id,
        allDay: false,
        description: job.job_template?.name,
        start: moment(job.start_time).toDate(),
        end: moment(job.end_time).toDate(),
        title: job.job_template?.name,
        resourceId: `${job.user_id || UNASSIGNED_RESOURCE_ID}`,
        extendedProps,
      };
    });
    setEvents(transformedJobs);
  }, [jobs, selectedTechnicianId]);

  useEffect(() => {
    const transformedTechs = technicians.map((tech) => ({
      id: `${tech.id}`,
      title: `${tech.first_name} ${tech.last_name}`,
    }));
    setResources([
      ...transformedTechs,
      { id: UNASSIGNED_RESOURCE_ID, title: 'Unassigned' },
    ]);
  }, [technicians]);

  return (
    <>
      <Box sx={{ my: 3 }}>
        <CalendarToolbar
          title={title}
          date={date}
          onDateNext={onDateNext}
          onDatePrev={onDatePrev}
          onDateChange={onChangeDay}
        />
      </Box>
      {view === 'quickSchedule' && (
        <QuickSchedule currentDate={date} />
      )}
      <Box sx={{ backgroundColor: 'common.white' }}>
        {view !== 'quickSchedule' && (
          <Box
            sx={{
              position: 'relative',
            }}
          >
            <FullCalendarStyled
              nowIndicator={nowIndicator && view === 'resourceTimeline'}
              minRowHeight={MIN_ROW_HEIGHT}
              view={view}
            >
              {view === 'resourceTimeline' && (
                <Button
                  sx={{
                    position: 'absolute',
                    top: 20,
                    left: 15,
                    zIndex: 1,
                  }}
                  variant="text"
                >
                  View filters
                </Button>
              )}

              <FullCalendar
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                eventDisplay="block"
                dayMaxEventRows={2}
                resources={resources}
                events={events}
                eventClick={() => {}}
                initialDate={startDate || initialDateRef.current}
                initialView={view}
                nowIndicator={nowIndicator && view === 'resourceTimeline'}
                datesSet={onChangeDateByCalendar}
                firstDay={0}
                slotMinWidth={60}
                headerToolbar={false}
                plugins={FULL_CALENDAR_PLUGINS}
                views={FULL_CALENDAR_VIEWS}
                businessHours={FULL_CALENDAR_BUSINESS_HOURS}
                resourceAreaWidth="20%"
                resourceAreaHeaderContent={() => {}}
                slotLabelContent={renderSlotContent}
                resourceLabelContent={renderResource}
                eventContent={view === 'listWeek' ? renderEventAgenda : renderEvent}
                nowIndicatorContent={renderNowIndicatorContent}
                droppable
                editable
                eventDurationEditable={view === 'resourceTimeline'}
                eventDrop={handleEventDrop}
                eventResize={handleEventResize}
                eventResizableFromStart
                timeZone={organisation.timezone}
                ref={calendarRef}
                rerenderDelay={10}
                weekends
                dayHeaders
                contentHeight="auto"
              />
            </FullCalendarStyled>
            {view === 'resourceTimeline' && (
              <Collapse
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '50% !important',
                  height: '100%',
                  zIndex: 1000,
                }}
                orientation="horizontal"
                in={showMap}
                timeout="auto"
                unmountOnExit
              >
                <JobMap
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Collapse>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default memo(JobCalendar);

JobCalendar.propTypes = {
  nowIndicator: PropTypes.bool,
};

JobCalendar.defaultProps = {
  nowIndicator: true,
};
