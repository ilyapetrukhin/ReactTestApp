import React, { FC, memo, useCallback, useMemo } from 'react';
import { Typography, Button, Box, Paper, IconButton, Tooltip } from '@mui/material';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { sortBy } from 'lodash';

import { useDispatch, useSelector } from 'src/store';
import { toggleUnscheduledJobsExpand, UNSCHEDULED_COLUMN_ID } from 'src/slices/quickSchedule';

import { DROPPABLE_TYPE_JOB } from './constants';

import { ChevronsLeft as ChevronsLeftIcon, ChevronsRight as ChevronsRightIcon } from 'react-feather';
import JobCard from './JobCard';
import { alpha, useTheme } from '@mui/material/styles';

const COL_WIDTH = 350;

interface JobColumnUnscheduledProps {
}

const JobColumnUnscheduled: FC<JobColumnUnscheduledProps> = memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const expanded = useSelector((state) => state.quickSchedule.unscheduledJobsExpanded);
  const column = useSelector((state) => state.quickSchedule.columns.byId[UNSCHEDULED_COLUMN_ID]);
  const jobIds = useMemo(() => sortBy(column.jobIds), [column.jobIds]);

  const handleExpand = useCallback(() => {
    dispatch(toggleUnscheduledJobsExpand(expanded));
  }, [expanded]);

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'stretch',
        position: 'sticky',
        left: 0,
        mx: 1,
        overflowY: 'auto',
        maxHeight: '100%',
      }}
    >
      <Box sx={{
        p: 1,
        minHeight: '100%',
        backgroundColor: alpha(theme.palette.primary.main, 0.3),
      }}
      >
        <Tooltip title="Unscheduled jobs">
          <IconButton
            color="info"
            onClick={handleExpand}
          >
            { expanded ? <ChevronsLeftIcon fontSize="small" /> : <ChevronsRightIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 300ms ease-in-out',
        width: {
          xs: expanded ? COL_WIDTH : 0,
        },
      }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            p: 1,
            pr: 3,
            minWidth: COL_WIDTH,
          }}
        >
          <Typography
            color="inherit"
            variant="h6"
          >
            Unscheduled jobs
          </Typography>
          <Button variant="text">Filter</Button>
        </Box>

        <Droppable
          droppableId={UNSCHEDULED_COLUMN_ID}
          type={DROPPABLE_TYPE_JOB}
        >
          {(provided) => (
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                px: 3,
                py: 2,
              }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {jobIds.map((jobId, index) => (
                <Draggable
                  key={jobId}
                  draggableId={jobId}
                  index={index}
                >
                  {(_provided, snapshot): JSX.Element => (
                    <JobCard
                      jobId={jobId}
                      dragging={snapshot.isDragging}
                      index={index}
                      key={jobId}
                      column={column}
                      ref={_provided.innerRef}
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
      </Box>
    </Paper>
  );
});

JobColumnUnscheduled.propTypes = {
};

export default JobColumnUnscheduled;
