import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';

import { Box, Typography, Link } from '@mui/material';

interface BatchPreviewIssueToContactProps {
  name: string;
  address: string;
  email?: string;
}

const BatchPreviewIssueToContact: FC<BatchPreviewIssueToContactProps> = memo(({ name, address, email }) => (
  <Box>
    <Typography
      variant="subtitle2"
      fontWeight="bold"
    >
      {name}
    </Typography>
    <Typography variant="subtitle1">{address}</Typography>
    <Link
      href={`mailto: ${email}`}
      variant="body2"
      fontWeight="bold"
      sx={{
        color: 'palette.primary.dark'
      }}
    >
      {email}
    </Link>
  </Box>
));

export default BatchPreviewIssueToContact;

BatchPreviewIssueToContact.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  email: PropTypes.string,
};
