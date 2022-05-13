import React, { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import map from 'lodash/map';
import {
  Box,
  ListItem,
  List,
  ListItemIcon,
  ListItemSecondaryAction, Collapse,
} from '@mui/material';
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from 'react-sortable-hoc';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { styled } from '@mui/material/styles';
import type { Task } from 'src/types/jobTemplate';
import TaskAdd from './TaskAdd';
import TaskItem from './Task';
import { TransitionGroup } from 'react-transition-group';

interface TasksListProps {
  tasks: Task[];
  onAdd?: (task: Task | null) => void;
  onEdit?: (task: Task | null) => void;
  onDelete?: (taskId: number) => void;
  onReorder?: (tasks: Task[] | []) => void;
}

const TasksListRoot = styled('div')();

const TaskList: FC<TasksListProps> = (props) => {
  const { tasks, onAdd, onDelete, onEdit, onReorder } = props;
  const [editingTask, setEditingTask] = useState<number | null>(null);

  const handleTaskEditInit = (taskId: number): void => {
    setEditingTask(taskId);
  };

  const handleTaskEditCancel = (): void => {
    setEditingTask(null);
  };

  const handleTaskEditComplete = (task: Task): void => {
    setEditingTask(null);
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleAddTask = (task: Task): void => {
    if (onAdd) {
      onAdd(task);
    }
  };

  const handleDeleteTask = (taskId: number): void => {
    if (onDelete) {
      onDelete(taskId);
    }
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (onReorder) {
      const orderedTasks = map(arrayMove(tasks, oldIndex, newIndex), (orderedTask, index) => ({ ...orderedTask, order: index }));
      onReorder(orderedTasks);
    }
  };

  const DragHandle = SortableHandle(() => (
    <ListItemIcon>
      <DragHandleIcon sx={{ cursor: 'pointer' }} />
    </ListItemIcon>
  ));

  const SortableItem = SortableElement(({ task }) => (
    <ListItem
      ContainerComponent="div"
      disableGutters
      divider
    >
      <TaskItem
        task={task}
        sx={{
          display: 'flex',
          width: '100%'
        }}
        editing={editingTask === task.id}
        onEditCancel={handleTaskEditCancel}
        onEditComplete={handleTaskEditComplete}
        onEditInit={(): void => handleTaskEditInit(task.id)}
        onDelete={handleDeleteTask}
      />
      {!editingTask && (
        <ListItemSecondaryAction>
          <DragHandle />
        </ListItemSecondaryAction>
      )}
    </ListItem>
  ));

  const SortableListContainer = SortableContainer(({ tasks }) => (
    <List component="div">
      <TransitionGroup>
        {tasks.map((task, index) => (
          <Collapse key={task.id}>
            <SortableItem
              index={index}
              task={task}
            />
          </Collapse>
        ))}
      </TransitionGroup>
    </List>
  ));

  return (
    <TasksListRoot>
      <SortableListContainer
        tasks={tasks}
        onSortEnd={onSortEnd}
        useDragHandle
        lockAxis="y"
      />
      <Box
        sx={{
          mt: 1
        }}
      >
        <TaskAdd onAdd={handleAddTask} />
      </Box>
    </TasksListRoot>
  );
};

TaskList.propTypes = {
  // @ts-ignore
  tasks: PropTypes.array.isRequired,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReorder: PropTypes.func,
};

export default TaskList;
