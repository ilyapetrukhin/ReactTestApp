import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

interface DialogBatchPreviewEmailProps {
  loading: boolean;
  open: boolean;
  html?: string;
  onClose?: () => void;
}

const DialogBatchPreviewEmail: FC<DialogBatchPreviewEmailProps> = memo(
  ({ open, html, loading, onClose }) => {
    const theme = useTheme();

    return (
      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
        onClose={onClose}
      >
        {open && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
              Email preview
              <IconButton
                aria-label="close"
                sx={{
                  position: 'absolute',
                  right: theme.spacing(1),
                  top: theme.spacing(1),
                  color: 'palette.grey[500]',
                }}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            {loading && (
              <DialogContent>
                <LinearProgress />
              </DialogContent>
            )}
            {!loading && html != null && (
              <DialogContent
                dividers
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
          </>
        )}
      </Dialog>
    );
  }
);

export default DialogBatchPreviewEmail;

DialogBatchPreviewEmail.propTypes = {
  loading: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  html: PropTypes.string,
  onClose: PropTypes.func,
};
