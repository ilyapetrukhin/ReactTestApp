import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';

import CircularProgress from 'src/components/CircularProgress';

interface SynchronizationProgressCardProps {
  totalCount: number;
  processedCount: number;
  entityName: string;
}

const SynchronizationProgressCard: FC<SynchronizationProgressCardProps> = memo(({ processedCount, totalCount, entityName }) => {
  const value = (100 * processedCount) / totalCount;

  if (totalCount === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader title={`Syncing ${entityName}`} />
      <Divider />
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <CircularProgress value={value} />
          <Typography
            variant="body1"
            color="textPrimary"
            fontWeight="bold"
            sx={{ mt: 3 }}
          >
            {processedCount}
            {' '}
            of
            {' '}
            {totalCount}
            {' '}
            {entityName}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
});

SynchronizationProgressCard.propTypes = {
  totalCount: PropTypes.number.isRequired,
  processedCount: PropTypes.number.isRequired,
  entityName: PropTypes.string.isRequired,
};

export default SynchronizationProgressCard;
