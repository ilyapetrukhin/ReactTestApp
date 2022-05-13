import React, { ChangeEvent, FC, memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Popover,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';

import { Columns as ColumnsIcon } from 'react-feather';

export interface Column {
  id: string;
  label: string;
}

interface ColumnManagementProps {
  title?: string;
  displayShowAll?: boolean;

  columns: Column[];
  selectedColumnIds?: string[];
  onChange?: (selectedColumnIds: string[]) => void;
}

const ColumnManagement: FC<ColumnManagementProps> = memo(
  ({ title, displayShowAll, columns, selectedColumnIds, onChange }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = anchorEl != null;

    const [uncontrolledSelectedColumnIds, setUncontrolledSelectedColumnIds] = useState(selectedColumnIds || []);

    const selectedIds : string[] = selectedColumnIds || uncontrolledSelectedColumnIds;

    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
      setAnchorEl(null);
    }, []);

    const handleChange = useCallback((columnId: string, checked: boolean) => {
      const onChangeCallback = onChange || setUncontrolledSelectedColumnIds;

      if (checked) {
        onChangeCallback([...selectedIds, columnId]);
      } else {
        onChangeCallback(selectedIds.filter((id) => id !== columnId));
      }
    }, [selectedIds, onChange]);

    const triggerShowAll = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      const onChangeCallback = onChange || setUncontrolledSelectedColumnIds;

      if (event.target.checked) {
        onChangeCallback(columns.map(({ id }) => id));
        return;
      }

      if (columns.length !== 0) {
        onChangeCallback([columns[0].id]);
      }
    }, [columns, onChange]);

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Tooltip title={title}>
          <IconButton
            sx={{
              color: 'primary.main',
            }}
            onClick={handleClick}
          >
            <ColumnsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <FormGroup sx={{ p: 2 }}>
            {
              displayShowAll && (
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={selectedIds.length === columns.length}
                      onChange={triggerShowAll}
                      color="primary"
                    />
                )}
                  label="Show all"
                />
              )
            }
            {columns.map((c) => (
              <FormControlLabel
                key={c.id}
                control={(
                  <Checkbox
                    disabled={selectedIds.includes(c.id) && selectedIds.length === 1}
                    checked={selectedIds.includes(c.id)}
                    onChange={(event) => handleChange(c.id, event.target.checked)}
                    color="primary"
                  />
                )}
                label={c.label}
              />
            ))}
          </FormGroup>
        </Popover>
      </Box>
    );
  }
);

ColumnManagement.propTypes = {
  title: PropTypes.string,
  displayShowAll: PropTypes.bool,

  columns: PropTypes.array.isRequired,
  selectedColumnIds: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

ColumnManagement.defaultProps = {
  title: 'Manage columns',
  displayShowAll: true,
};

export default ColumnManagement;
