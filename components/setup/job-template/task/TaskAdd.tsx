import React, { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Box, Button, Grow, TextField } from '@mui/material';
import type { Task } from 'src/types/jobTemplate';
import { TransitionGroup } from 'react-transition-group';

interface TaskAddProps {
  onAdd?: (task: Task | null) => void;
}

const TaskAdd: FC<TaskAddProps> = (props) => {
  const { onAdd, ...other } = props;

  const [name, setName] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleAdd = (): void => {
    setIsExpanded(true);
  };

  const handleCancel = (): void => {
    setIsExpanded(false);
    setName('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleSave = async (): Promise<void> => {
    try {
      if (!name) {
        return;
      }

      if (onAdd) {
        onAdd({
          name,
          order: 0,
        });
      }
      setIsExpanded(false);
      setName('');
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div {...other}>
      {
        isExpanded
          ? (
            <TransitionGroup>
              <Grow>
                <div>
                  <TextField
                    fullWidth
                    onChange={handleChange}
                    placeholder="Add a task"
                    value={name}
                    variant="outlined"
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mt: 2
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={handleCancel}
                      size="small"
                      variant="text"
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleSave}
                      size="small"
                      sx={{ ml: 2 }}
                      variant="contained"
                    >
                      Save
                    </Button>
                  </Box>
                </div>
              </Grow>
            </TransitionGroup>
          )
          : (
            <Button
              color="primary"
              onClick={handleAdd}
              size="small"
              variant="outlined"
            >
              Add task
            </Button>
          )
      }
    </div>
  );
};

TaskAdd.propTypes = {
  onAdd: PropTypes.func,
};

export default TaskAdd;
