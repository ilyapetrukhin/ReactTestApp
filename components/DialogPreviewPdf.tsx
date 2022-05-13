import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  LinearProgress,
  DialogContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

interface DialogPreviewPdfProps {
  title: string;
  loading: boolean;
  open: boolean;
  pdfBlob?: string;
  onClose?: () => void;
}

const DialogPreviewPdf: FC<DialogPreviewPdfProps> = memo(
  ({ title, open, pdfBlob, loading, onClose }) => {
    const blobUrl = URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
    const theme = useTheme();

    return (
      <Dialog
        open={open}
        fullWidth
        fullScreen={!loading}
        maxWidth="sm"
        onClose={onClose}
      >
        {open && (
        <>
          <DialogTitle>
            <Typography variant="h6">{title}</Typography>
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
          {loading && <DialogContent><LinearProgress sx={{ my: 2 }} /></DialogContent>}
          {!loading && (
            <iframe
              style={{ minHeight: '70vh' }}
              title="Pdf"
              width="100%"
              height="100%"
              src={blobUrl}
            />
          )}
        </>
        )}
      </Dialog>
    );
  }
);

export default DialogPreviewPdf;

DialogPreviewPdf.propTypes = {
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  pdfBlob: PropTypes.string,
  onClose: PropTypes.func,
};
