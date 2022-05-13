import React, { FC, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import over from 'lodash/over';

import EmailIcon from '../../../icons/Email';

interface BatchInvoiceListTableRowMenuProps {
  onEmail: () => void;
}

const BatchInvoiceListTableRowMenu: FC<BatchInvoiceListTableRowMenuProps> = memo(
  ({ onEmail }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = useCallback((event) => {
      setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
      setAnchorEl(null);
    }, []);

    const handleEmailClick: () => void = useMemo(
      () => over([onEmail, handleClose]),
      [onEmail, handleClose]
    );

    return (
      <div>
        <IconButton
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: '20ch',
            },
          }}
        >
          <MenuItem onClick={handleEmailClick}>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            Email
          </MenuItem>
        </Menu>
      </div>
    );
  }
);

export default BatchInvoiceListTableRowMenu;

BatchInvoiceListTableRowMenu.propTypes = {
  onEmail: PropTypes.func.isRequired,
};
