import React, { FC, memo } from 'react';
import { Box, Card, CardContent, CardHeader, CircularProgress, Divider } from '@mui/material';

interface StepMatchingProgressProps {
}

const StepMatchingProgress: FC<StepMatchingProgressProps> = memo(() => (
  <Card>
    <CardHeader title="Syncing contacts" />
    <Divider />
    <CardContent>
      <Box
        display="flex"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    </CardContent>
  </Card>

));

export default StepMatchingProgress;
