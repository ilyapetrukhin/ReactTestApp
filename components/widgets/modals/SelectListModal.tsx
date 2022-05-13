/* eslint-disable */
import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import SearchIcon from 'src/icons/Search';
import type { SelectListItem } from 'src/types/common';

export interface SelectListModalProps {
  label: string;
  searchPlaceholder?: string;
  keepMounted: boolean;
  items: any[];
  open: boolean;
  onToggle: (item: any, enabled: boolean) => void;
  onClose?: (value?: any[]) => void;
}

const applyFilters = (
  items: SelectListItem[],
  query: string
): SelectListItem[] => items
  .filter((item) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (item[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });

const SelectListModal: FC<SelectListModalProps> = (props) => {
  const { label, searchPlaceholder, onClose, onToggle, items, open, ...other } = props;
  const [query, setQuery] = useState<string>('');
  const [selectItems, setSelectItems] = useState([]);

  useEffect(() => {
    setSelectItems(items);
  }, [items]);

  const handleOk = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const filteredItems = applyFilters(selectItems, query);

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 500 } }}
      maxWidth="md"
      open={open}
      {...other}
    >
      <DialogTitle
        sx={{
          px: 2,
        }}
      >
        {label}
      </DialogTitle>
      <Divider />
      <DialogContentText
        sx={{
          p: 2
        }}
      >
        <TextField
          sx={{
            width: '50%'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          onChange={handleQueryChange}
          placeholder={searchPlaceholder || 'Search'}
          value={query}
          variant="outlined"
        />
      </DialogContentText>
      <DialogContent
        sx={{
          px: 2,
          py: 0
        }}
        dividers
      >
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {filteredItems.map((item) => {
            const labelId = `checkbox-list-label-${item.id}`;

            return (
              <ListItem
                key={item.id}
                disablePadding
              >
                <ListItemButton
                  role={undefined}
                  onClick={() => onToggle(item, !item.enabled)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={item.enabled}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={item.name}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
          {!filteredItems.length && (
            <ListItem>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                No results found for
                {' '}
                {query}
              </Typography>
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex'
        }}
      >
        <Button
          onClick={handleOk}
          variant="contained"
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SelectListModal.propTypes = {
  label: PropTypes.string.isRequired,
  searchPlaceholder: PropTypes.string,
  keepMounted: PropTypes.bool,
  items: PropTypes.array,
  open: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

export default SelectListModal;
