import React, { FC, ReactNode, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  alpha,
  Card,
  CardContent,
  styled,
} from '@mui/material';
import { CalendarView } from 'src/types/calendar';

const getStyled = (minRowHeight: number) => styled('div')(
  ({ theme }) => (
    {
      '& .fc': {
        '--fc-bg-event-opacity': 1,
        '--fc-border-color': theme.palette.divider,
        '--fc-daygrid-event-dot-width': '10px',
        '--fc-list-event-hover-bg-color': theme.palette.background.default,
        '--fc-neutral-bg-color': theme.palette.background.default,
        '--fc-page-bg-color': theme.palette.background.default,
        '--fc-today-bg-color': alpha(theme.palette.primary.main, 0.25),
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily
      },
      '& .fc .fc-col-header-cell-cushion': {
        paddingBottom: '10px',
        paddingTop: '10px'
      },
      '& .fc .fc-day-other .fc-daygrid-day-top': {
        color: theme.palette.text.secondary
      },
      '& .fc-event': {
        borderRadius: theme.spacing(0.6),
        overflow: 'hidden',
        padding: 0,
        borderWidth: 0,

        marginTop: theme.spacing(0.5),
        backgroundColor: theme.palette.primary.main,
        whiteSpace: 'normal',
        '&:hover': {
          cursor: 'pointer'
        },
      },
      '& td > .fc-datagrid-cell-frame': {
        position: 'relative',
        minHeight: theme.spacing(minRowHeight),
      },
      '& .fc .fc-resource .fc-datagrid-cell-cushion': {
        minHeight: theme.spacing(minRowHeight),
      },
      '& .fc-theme-standard td, .fc-theme-standard th': {
        borderWidth: theme.spacing(0.05),
        borderBottomWidth: 0,
      },
      '& .fc .fc-scrollgrid': {
        borderWidth: 0,
      },
    }
  )
);

const getStyledAgenda = () => styled('div')(
  ({ theme }) => (
    {
      '& .fc': {
        '--fc-bg-event-opacity': 1,
        '--fc-border-color': theme.palette.divider,
        '--fc-daygrid-event-dot-width': '10px',
        '--fc-list-event-hover-bg-color': theme.palette.background.default,
        '--fc-neutral-bg-color': theme.palette.background.default,
        '--fc-page-bg-color': theme.palette.background.default,
        '--fc-today-bg-color': alpha(theme.palette.primary.main, 0.25),
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily
      },
      '& .fc-event': {
        borderRadius: '4px',
        '&:hover': {
          cursor: 'pointer'
        }
      },

    }
  )
);

const StyledWithNowIndicator = styled('div')(
  ({ theme }) => (
    {
      '& .fc .fc-resource-timeline-divider': {
        width: 2,
        borderWidth: 0,
      },
      // Add space for time of indicator
      '& .fc .fc-scrollgrid-section-header .fc-resource-timeline-divider + td .fc-scroller': {
        paddingTop: theme.spacing(5),
      },
      // Change color of the line indicator
      '& .fc .fc-timeline-now-indicator-line': {
        borderLeftWidth: theme.spacing(0.5),
        borderColor: alpha(theme.palette.secondary.light, 0.8),
      },
      // hide extra line below "Resources" header
      '& .fc .fc-datagrid-header .fc-datagrid-cell': {
        borderBottomWidth: 0,
      },
      // add top border aboive cells with time
      '& .fc .fc-timeline-header .fc-scrollgrid-sync-table': {
        borderTopWidth: theme.spacing(0.1),
        borderTopColor: theme.palette.divider,
        borderTopStyle: 'solid',
      },
      '& .fc .fc-scrollgrid': {
        borderTopWidth: 0,
      },
      '& .fc .fc-scrollgrid-section.fc-scrollgrid-section-header > td': {
        borderBottomWidth: 0,
        borderBottomColor: theme.palette.divider,
        borderBottomStyle: 'solid',

        borderTopWidth: 0,
        borderTopColor: theme.palette.divider,
        borderTopStyle: 'solid',

        verticalAlign: 'middle',
      },
      '& .fc .fc-timeline-now-indicator-arrow': {
        top: '-6px',
      },
      '& .fc-resource.fc-datagrid-cell': {
        borderWidth: 0,
      },
      '& .fc .fc-scrollgrid-section.fc-scrollgrid-section-header > td:first-of-type': {
        borderWidth: 0,
      },
      '& .fc-scrollgrid-section.fc-scrollgrid-section-body > td:first-of-type': {
        borderWidth: 0,
      },
    }
  )
);

interface FullCalendarStyledProps {
  nowIndicator: boolean;
  minRowHeight: number;
  view: CalendarView;
  children: ReactNode,
}

const FullCalendarStyled : FC<FullCalendarStyledProps> = ({ nowIndicator, minRowHeight, view, children }) => {
  const isAgenda = view === 'listWeek';

  const Styled = useMemo(() => {
    if (isAgenda) {
      return getStyledAgenda();
    }

    return getStyled(minRowHeight);
  }, [minRowHeight, isAgenda]);

  if (isAgenda) {
    return (
      <Card>
        <CardContent>
          <Styled>
            {children}
          </Styled>
        </CardContent>
      </Card>
    );
  }

  if (nowIndicator) {
    return (
      <Styled>
        <StyledWithNowIndicator>{children}</StyledWithNowIndicator>
      </Styled>
    );
  }

  return <Styled>{children}</Styled>;
};

export default memo(FullCalendarStyled);

FullCalendarStyled.propTypes = {
  nowIndicator: PropTypes.bool.isRequired,
  minRowHeight: PropTypes.number.isRequired,
  // @ts-ignore
  view: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
