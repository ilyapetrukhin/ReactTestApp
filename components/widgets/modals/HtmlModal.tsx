import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Dialog,
  Typography
} from '@mui/material';

interface HtmlModalProps {
  content: string;
  onClose?: () => void;
  open: boolean;
}

const HtmlModal: FC<HtmlModalProps> = (props) => {
  const {
    content,
    onClose,
    open,
    ...other
  } = props;

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          color="textSecondary"
          variant="body2"
          sx={{
            display: 'contents'
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Box>
    </Dialog>
  );
};

HtmlModal.propTypes = {
  content: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default HtmlModal;
