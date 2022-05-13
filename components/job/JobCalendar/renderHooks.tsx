import { Typography, Box } from '@mui/material';
import { utcToZonedTime, format } from 'date-fns-tz';
import { CalendarView, ResourceLabelContentArg } from 'src/types/calendar';
import EventItem from './components/EventItem';
import EventItemAgenda from './components/EventItemAgenda';
import ResourceItem from './components/ResourceItem';
import { UNASSIGNED_RESOURCE_ID } from './constants';
import { JobEventContentArg, SlotLabelContentData } from './types';

export const renderEvent = ({ event }: JobEventContentArg) => (
  <EventItem
    key={event.id}
    eventId={event.id}
    title={event.title}
    startTime={event.extendedProps.startTime}
    endTime={event.extendedProps.endTime}
    contactName={event.extendedProps.contactName}
    fullAddress={event.extendedProps.fullAddress}
    timezone={event.extendedProps.timezone}
    phones={event.extendedProps.phones}
    recurrenceIc={event.extendedProps.recurrenceIc}
    messageIc={event.extendedProps.messageIc}
    notes={event.extendedProps.notes}
    color={event.extendedProps.color}
  />
);

export const renderEventAgenda = ({ event }: JobEventContentArg) => (
  <EventItemAgenda
    key={event.id}
    eventId={event.id}
    title={event.title}
    startTime={event.extendedProps.startTime}
    endTime={event.extendedProps.endTime}
    contactName={event.extendedProps.contactName}
    fullAddress={event.extendedProps.fullAddress}
    timezone={event.extendedProps.timezone}
    phones={event.extendedProps.phones}
    recurrenceIc={event.extendedProps.recurrenceIc}
    messageIc={event.extendedProps.messageIc}
    notes={event.extendedProps.notes}
    color={event.extendedProps.color}
  />
);

export const renderResource = ({ fieldValue, resource }: ResourceLabelContentArg) => (
  <ResourceItem
    key={resource.id}
    id={resource.id}
    title={fieldValue}
    minHeight={10}
    hideMessageBtn={resource.id === UNASSIGNED_RESOURCE_ID}
    unread
  />
);

export const renderSlot = (data: SlotLabelContentData, view: CalendarView) => {
  if (view === 'resourceTimeline') {
    const date = utcToZonedTime(data.date, data.view.dateEnv.timeZone);

    return (
      <Box py={1}>
        <Typography
          variant="body1"
          color="textPrimary"
          component="span"
          fontWeight="bold"
        >
          {format(date, 'h')}
        </Typography>
        {' '}
        <Typography
          variant="body1"
          color="textPrimary"
          component="span"
        >
          {format(date, 'a').toLowerCase()}
        </Typography>
      </Box>
    );
  }

  return <Typography>{data.text}</Typography>;
};
