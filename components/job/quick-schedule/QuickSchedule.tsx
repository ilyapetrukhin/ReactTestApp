import React, { FC, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import toast from 'react-hot-toast';

import { useDispatch, useSelector } from 'src/store';
import { moveJob, getBoard, UNSCHEDULED_COLUMN_ID, moveColumn } from 'src/slices/quickSchedule';
import LoadingScreen from 'src/components/LoadingScreen';

import JobColumn from './JobColumn';
import JobColumnUnscheduled from './JobColumnUnscheduled';
import { DROPPABLE_TYPE_JOB, DROPPABLE_TYPE_TECHNICIAN } from './constants';

interface Props {
  currentDate: Date;
}

const QuickSchedule: FC<Props> = ({ currentDate }) => {
  const { organisation } = useSelector((state) => state.account);
  const { technicians, unscheduledJobs, jobs } = useSelector((state) => state.jobCalendar);
  const { columns, isLoaded, jobs: qsJobs } = useSelector((state) => state.quickSchedule);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBoard(technicians, unscheduledJobs, jobs));
  }, [technicians, unscheduledJobs, jobs]);

  const handleDragEnd = useCallback(async ({
    source,
    destination,
    draggableId,
    type
  }: DropResult): Promise<void> => {
    // Dropped outside the column
    if (!destination) {
      return;
    }

    // Card has not been moved
    if (
      source.droppableId === destination.droppableId
            && source.index === destination.index
    ) {
      return;
    }

    if (type === DROPPABLE_TYPE_JOB) {
      try {
        const jobId = Number.parseInt(draggableId, 10);
        const job = qsJobs.byId[jobId];
        const column = columns.byId[destination.droppableId];
        await dispatch(
          moveJob(organisation.id, job, destination.index, column, qsJobs, source.droppableId, destination.droppableId, currentDate)
        );
        if (destination.droppableId === UNSCHEDULED_COLUMN_ID) {
          toast.success('Job successfully set as unscheduled');
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (type === DROPPABLE_TYPE_TECHNICIAN) {
      dispatch(moveColumn(columns.allIds, source.index, destination.index));
    }
  }, [qsJobs, columns.byId, columns.allIds, organisation.id, currentDate]);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'start',
          height: '70vh',
          maxHeight: '70vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'start',
            height: '100%',
          }}
        >
          <JobColumnUnscheduled />
        </Box>
        <Box
          pb={2}
          sx={{
            height: '100%',
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'hidden',
          }}
        >
          <Droppable
            droppableId={DROPPABLE_TYPE_TECHNICIAN}
            type={DROPPABLE_TYPE_TECHNICIAN}
            direction="horizontal"
          >
            {(provided): JSX.Element => (
              <Box
                sx={{ display: 'flex' }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {
                  columns.allIds.filter((id) => id !== UNSCHEDULED_COLUMN_ID).map((columnId: string, index: number) => (
                    <Draggable
                      key={columnId}
                      draggableId={columnId}
                      index={index}
                    >
                      {(_provided, snapshot) => (
                        <JobColumn
                          columnId={columnId}
                          key={columnId}
                          ref={_provided.innerRef}
                          dragHandleProps={_provided.dragHandleProps}
                          style={{ ..._provided.draggableProps.style }}
                          dragging={snapshot.isDragging}
                          {..._provided.draggableProps}
                        />
                      )}
                    </Draggable>
                  ))
                }
              </Box>
            )}
          </Droppable>
        </Box>
      </Box>
    </DragDropContext>
  );
};

QuickSchedule.propTypes = {
  currentDate: PropTypes.instanceOf(Date).isRequired,
};

export default QuickSchedule;
