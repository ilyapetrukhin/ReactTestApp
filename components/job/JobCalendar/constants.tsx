import { BusinessHoursInput } from '@fullcalendar/react';

export const UNASSIGNED_RESOURCE_ID = 'UNASSIGNED';

export const FULL_CALENDAR_BUSINESS_HOURS: BusinessHoursInput = [
  {
    daysOfWeek: [1, 2, 3],
    startTime: '08:00',
    endTime: '18:00',
  },
  {
    daysOfWeek: [4, 5],
    startTime: '10:00',
    endTime: '16:00',
  },
];

export const FULL_CALENDAR_VIEWS = {
  resourceTimeline: {
    type: 'resourceTimeline',
    duration: { days: 1 },
    slotDuration: '01:00:00',
    slotMinWidth: 120,
    slotLabelFormat: 'h a',
  },
  resourceTimelineFortnite: {
    type: 'resourceTimeline',
    duration: { weeks: 2 },
    slotLabelInterval: { day: 1 },
    slotLabelFormat: 'ddd D',
  },
  resourceTimelineWeek: {
    type: 'resourceTimelineWeek',
    duration: { weeks: 1 },
    slotLabelInterval: { day: 1 },
    slotLabelFormat: 'ddd D',
    eventDurationEditable: false,
  },
  listWeek: {
    noEventsText: 'No jobs to display',
  },
};

export const MIN_ROW_HEIGHT = 10;

export const LOAD_JOBS_DEBOUNCE_TIMEOUT = 700;
