import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import { XCircle as XCircleIcon } from 'react-feather';
import PropTypes from 'prop-types';

import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  OutlinedInputProps,
  Paper,
  Popper,
  TextField,
  Theme,
} from '@mui/material';
import { SxProps } from '@mui/system';

import debounce from 'lodash/debounce';

interface MultipleValuesInputProps {
  values: string[];
  label: string;
  hintText: string;
  onAdd: (value: string) => void;
  onDelete: (value: string) => void;
  sx?: SxProps<Theme>;
  popperContentSx?: SxProps<Theme>;
  InputProps?: Partial<OutlinedInputProps>;
}

const BLUR_DEBOUNCE_TIME = 100;

const MultipleValuesInput: FC<MultipleValuesInputProps> = memo(
  ({ values, label, hintText, onAdd, onDelete, popperContentSx, InputProps }) => {
    const textFieldRef = useRef<HTMLInputElement | null>();
    const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);
    const open = anchorEl != null;
    const isFocused = open;

    const [value, setValue] = useState('');

    const selectedValuesStr = useMemo(() => values.join(', '), [values]);

    const placeholder = useMemo(() => {
      if (selectedValuesStr.length === 0 || isFocused) {
        return hintText;
      }

      return selectedValuesStr;
    }, [isFocused, selectedValuesStr, hintText]);

    const inputColor: string | undefined = useMemo(() => {
      if ((!isFocused && values.length === 0) || (isFocused && value.length === 0)) {
        return 'text.secondary';
      }

      return undefined;
    }, [isFocused, value, values]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setAnchorEl(e.target);
    }, []);
    const handleBlur = useCallback(
      debounce(() => setAnchorEl(null), BLUR_DEBOUNCE_TIME),
      []
    );

    const handleChangeValue = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      },
      []
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          value
            .split(',')
            .map((v) => v.trim())
            .forEach(onAdd);
          setValue('');
        }
      },
      [onAdd, value]
    );

    const handleDelete = useCallback(
      (value: string) => {
        onDelete(value);
        setAnchorEl(textFieldRef.current);

        setTimeout(() => {
          textFieldRef.current?.querySelector('input')?.focus();
        }, BLUR_DEBOUNCE_TIME + 1);
      },
      [onDelete]
    );

    return (
      <>
        <TextField
          focused={isFocused}
          ref={textFieldRef}
          autoFocus={false}
          InputProps={{ ...InputProps, sx: Object.assign(InputProps.sx || {}, { color: inputColor }) }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{ style: { textOverflow: 'ellipsis' } }}
          variant="outlined"
          label={label}
          placeholder={hintText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={isFocused ? value : placeholder}
          onChange={handleChangeValue}
          onKeyDown={handleKeyDown}
        />
        <Popper
          open={open}
          anchorEl={anchorEl}
        >
          {values.length > 0 && (
            <Paper sx={{ mt: 1, mb: 1, ...popperContentSx }}>
              <List>
                {values.map((value, index) => (
                  <ListItem
                    key={value}
                    divider={index !== values.length - 1}
                  >
                    <ListItemText primary={value} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(value)}
                      >
                        <XCircleIcon size={24} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Popper>
      </>
    );
  }
);

MultipleValuesInput.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
  hintText: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  popperContentSx: PropTypes.object,
  InputProps: PropTypes.object,
};

MultipleValuesInput.defaultProps = {
  popperContentSx: {},
};

export default MultipleValuesInput;
