import React, { forwardRef, useMemo } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Avatar,
  Box,
  CardProps,
  Paper,
  Typography,
} from '@mui/material';
import { DragHandle as DragHandleIcon } from '@mui/icons-material';

import type {
  QuickScheduleColumn as Column,
} from 'src/types/calendar';
import JobCard from './JobCard';
import { stringToColour } from 'src/utils/string';
import { useSelector } from '../../../store';
import type { RootState } from '../../../store';
import { BoxProps } from '@mui/system';
import { DROPPABLE_TYPE_JOB } from './constants';
import { sortBy } from 'lodash';
import moment from 'moment';

interface JobColumnProps extends CardProps {
  columnId: string;
  dragHandleProps: BoxProps;
  dragging: boolean;
}

const columnSelector = (state: RootState, columnId: string): Column => {
  const { columns } = state.quickSchedule;

  return columns.byId[columnId];
};

const JobColumn: FC<JobColumnProps> = forwardRef<
HTMLDivElement,
JobColumnProps
>((props, ref) => {
  const { columnId, dragHandleProps, dragging, ...other } = props;
  const column = useSelector((state) => columnSelector(state, columnId));
  const jobs = useSelector((state) => state.quickSchedule.jobs);
  const tech = column.technician;

  const techInitials = useMemo(
    () => [tech.first_name, tech.last_name]
      .filter((name) => name != null && name.length !== 0)
      .map((name) => name[0].toUpperCase())
      .join(''),
    [tech.first_name, tech.last_name]
  );

  const color = useMemo(() => stringToColour(techInitials), [techInitials]);

  const jobIdsSorted = useMemo(() => sortBy(column.jobIds, [(id) => (jobs.byId[id] != null ? moment(jobs.byId[id].start_time).toDate() : 0)]), [column.jobIds, jobs]);

  return (
    <Paper
      elevation={dragging ? 3 : 0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'start',
        mx: 1,
        width: {
          xs: 350
        },
        maxHeight: '100%',
        overflowY: 'auto',
      }}
      ref={ref}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          py: 1,
        }}
        {...dragHandleProps}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          pt={1}
        >
          <Avatar
            alt="Unknown"
            sx={{
              backgroundColor: color,
              height: 24,
              width: 24,
              mx: 1
            }}
          >
            <Typography variant="body2">{techInitials}</Typography>
          </Avatar>
          <Typography
            variant="h6"
            color="inherit"
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {column.name}
          </Typography>
        </Box>
        <DragHandleIcon
          sx={{ color: 'grey.400' }}
        />
      </Box>
      <Droppable
        droppableId={column.id}
        type={DROPPABLE_TYPE_JOB}
      >
        {(provided): JSX.Element => (
          <Box
            ref={provided.innerRef}
            sx={{
              overflowY: 'auto',
              px: 3,
              py: 2,
            }}
            {...provided.droppableProps}
          >
            {jobIdsSorted.map((jobId, index) => (
              <Draggable
                draggableId={jobId}
                index={index}
                key={jobId}
              >
                {(_provided, snapshot): JSX.Element => (
                  <JobCard
                    jobId={jobId}
                    dragging={snapshot.isDragging}
                    index={index}
                    key={jobId}
                    column={column}
                    ref={_provided.innerRef}
                    color={color}
                    style={{ ..._provided.draggableProps.style }}
                    {..._provided.draggableProps}
                    {..._provided.dragHandleProps}
                    sx={{
                      mb: 3,
                    }}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
});

JobColumn.propTypes = {
  columnId: PropTypes.string.isRequired,
  dragHandleProps: PropTypes.object.isRequired,
  dragging: PropTypes.bool.isRequired,
};

export default JobColumn;
