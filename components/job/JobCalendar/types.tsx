import { EventContentArg, EventApi } from '@fullcalendar/react';

export interface JobExtendedProps {
  contactName: string;
  fullAddress: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  phones: string[];
  recurrenceIc: boolean;
  messageIc: boolean;
  notes: string | null;
  color: string | null;
}

type JobEvent = EventApi & { extendedProps: JobExtendedProps };

export interface JobEventContentArg extends EventContentArg {
  event: JobEvent,
}

export interface SlotLabelContentData {
  date: string;
  text: string;
  view: {
    dateEnv: {
      timeZone: string;
    },
  },
}
