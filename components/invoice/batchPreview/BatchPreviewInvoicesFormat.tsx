import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  Typography,
} from '@mui/material';

interface BatchPreviewInvoicesFormatProps {
  title: string;
  subtitle: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClickPreview?: () => void;
}

const BatchPreviewInvoicesFormat: FC<BatchPreviewInvoicesFormatProps> = memo(
  ({ title, subtitle, checked, onChange, onClickPreview }) => (
    <Card raised>
      <CardContent sx={{ mx: 2 }}>
        <FormControlLabel
          control={(
            <Radio
              checked={checked}
              onChange={onChange}
              color="primary"
              edge="start"
            />
          )}
          label={(
            <>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {title}
              </Typography>
              <Typography
                color="textPrimary"
                variant="body2"
              >
                {subtitle}
              </Typography>
            </>
          )}
        />
        {
          checked && (
            <Box
              display="flex"
              justifyContent="center"
              mt={2}
            >
              <Button
                variant="contained"
                onClick={onClickPreview}
              >
                PREVIEW INVOICE
              </Button>
            </Box>
          )
        }
      </CardContent>
    </Card>
  )
);

export default BatchPreviewInvoicesFormat;

BatchPreviewInvoicesFormat.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  onClickPreview: PropTypes.func,
};
