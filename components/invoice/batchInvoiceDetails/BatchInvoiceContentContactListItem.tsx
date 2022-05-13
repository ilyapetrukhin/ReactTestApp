/* eslint-disable react/prop-types */
import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';

import {
  Box,
  IconButton,
  ListItem,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import over from 'lodash/over';
import moment from 'moment';
import numeral from 'numeral';

import DotsVerticalIcon from 'src/icons/DotsVertical';
import { ContactInvoice } from 'src/types/batchQueue';

interface BatchInvoiceContentContactListItemProps {
  contactInvoice: ContactInvoice;
  onViewJob?: () => void;
  onViewJobSheetPDF?: () => void;
  onViewInvoicePDF?: () => void;
  onResendInvoice?: () => void;
}

const BatchInvoiceContentContactListItem: FC<BatchInvoiceContentContactListItemProps> = memo(
  ({
    contactInvoice,
    onViewJob,
    onViewJobSheetPDF,
    onViewInvoicePDF,
    onResendInvoice,
  }) => {
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const handleMenuOpen = useCallback(() => {
      setOpenMenu(true);
    }, []);

    const handleMenuClose = useCallback(() => {
      setOpenMenu(false);
    }, []);

    const onClickViewJob = useMemo(
      () => over([handleMenuClose, onViewJob]),
      [handleMenuClose, onViewJob]
    );
    const onClickViewJobSheetPDF = useMemo(
      () => over([handleMenuClose, onViewJobSheetPDF]),
      [handleMenuClose, onViewJobSheetPDF]
    );
    const onClickViewInvoicePDF = useMemo(
      () => over([handleMenuClose, onViewInvoicePDF]),
      [handleMenuClose, onViewInvoicePDF]
    );
    const onClickResendInvoice = useMemo(
      () => over([handleMenuClose, onResendInvoice]),
      [handleMenuClose, onResendInvoice]
    );

    const timeFormatted = moment(contactInvoice.send_date).format(
      'DD MMM YYYY'
    );
    const totalText = useMemo(
      () => numeral(contactInvoice.total_amount).format('$0,0.00'),
      [contactInvoice.total_amount]
    );

    return (
      <>
        <ListItem
          disableGutters
          divider
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Typography>
              {contactInvoice.job_template_name}
              {' '}
              on
              {' '}
              {timeFormatted}
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              ml={2}
            >
              <Typography sx={{ mr: 2 }}>{totalText}</Typography>
              <IconButton
                onClick={handleMenuOpen}
                ref={anchorRef}
              >
                <DotsVerticalIcon
                  fontSize="small"
                  color="primary"
                />
              </IconButton>
            </Box>
          </Box>
        </ListItem>
        <Menu
          anchorEl={anchorRef.current}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'top',
          }}
          onClose={handleMenuClose}
          open={openMenu}
          PaperProps={{
            sx: {
              maxWidth: '100%',
              width: 256,
            },
          }}
          transformOrigin={{
            horizontal: 'left',
            vertical: 'top',
          }}
        >
          <MenuItem onClick={onClickViewJob}>View job</MenuItem>
          <MenuItem onClick={onClickViewJobSheetPDF}>
            View job sheet PDF
          </MenuItem>
          <MenuItem onClick={onClickViewInvoicePDF}>
            View invoice PDF
          </MenuItem>
          <MenuItem onClick={onClickResendInvoice}>Resend invoice</MenuItem>
        </Menu>
      </>
    );
  }
);

export default BatchInvoiceContentContactListItem;
