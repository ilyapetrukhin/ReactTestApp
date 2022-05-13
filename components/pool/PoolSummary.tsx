import type { FC } from 'react';
import {
  Box,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Typography
} from '@mui/material';
import { format } from 'date-fns';

const PoolSummary: FC = (props) => (
  <Card {...props}>
    <CardHeader title="Summary" />
    <Divider />
    <CardContent>
      <Typography
        color="textSecondary"
        variant="overline"
      >
        Active recurring jobs
      </Typography>
      <Typography
        color="primary"
        variant="subtitle2"
      >
        Full service | Every week on Tuesday
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Typography
          color="textSecondary"
          variant="overline"
        >
          Next job
        </Typography>
        <Typography
          color="primary"
          variant="subtitle2"
        >
          Full service |
          {' '}
          {format(new Date(), 'dd MMM yyyy HH:mm')}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default PoolSummary;
