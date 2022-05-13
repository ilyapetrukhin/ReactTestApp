import React, { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Theme,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import { Trash as TrashIcon } from 'react-feather';
import { Task as TaskType } from 'src/types/jobTemplate';

interface TaskProps {
  task: TaskType;
  editing?: boolean;
  onEditCancel?: () => void;
  onEditComplete?: (task: TaskType) => void;
  onEditInit?: () => void;
  onDelete?: (taskId: number) => void;
  sx?: SxProps<Theme>;
}

const TaskRoot = styled('div')(
  ({ theme }) => (
    {
      alignItems: 'flex-start',
      borderRadius: theme.shape.borderRadius,
      display: 'flex',
      padding: theme.spacing(1),
      '&:hover': {
        backgroundColor: theme.palette.background.default,
        '& button': {
          visibility: 'visible'
        }
      }
    }
  )
);

const Task: FC<TaskProps> = (props) => {
  const {
    task,
    editing,
    onEditCancel,
    onEditComplete,
    onEditInit,
    onDelete,
    ...other
  } = props;

  const [name, setName] = useState<string>(task.name);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleSave = async (): Promise<void> => {
    try {
      if (onEditComplete) {
        onEditComplete({
          ...task,
          name
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleCancel = (): void => {
    setName(task.name);

    if (onEditCancel) {
      onEditCancel();
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      if (onDelete) {
        onDelete(task.id);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <TaskRoot {...other}>
      {
        editing
          ? (
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                onChange={handleNameChange}
                value={name}
                variant="outlined"
              />
              <Box sx={{ mt: 1 }}>
                <Button
                  color="primary"
                  onClick={handleSave}
                  size="small"
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  color="primary"
                  onClick={handleCancel}
                  size="small"
                  variant="text"
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )
          : (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexGrow: 1
              }}
            >
              <Typography
                color="textPrimary"
                onClick={onEditInit}
                sx={{
                  flexGrow: 1,
                  cursor: 'pointer',
                  minHeight: 32
                }}
                variant="body1"
              >
                {task.name}
              </Typography>
              <IconButton
                onClick={handleDelete}
                sx={{
                  color: 'error.main',
                  visibility: 'hidden'
                }}
              >
                <TrashIcon fontSize="small" />
              </IconButton>
            </Box>
          )
      }
    </TaskRoot>
  );
};

Task.propTypes = {
  // @ts-ignore
  task: PropTypes.object.isRequired,
  editing: PropTypes.bool,
  onEditCancel: PropTypes.func,
  onEditComplete: PropTypes.func,
  onEditInit: PropTypes.func,
  onDelete: PropTypes.func,
  sx: PropTypes.object
};

Task.defaultProps = {
  editing: false
};

export default Task;
