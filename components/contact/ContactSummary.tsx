import type { FC } from 'react';
import {
  Box,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Typography
} from '@mui/material';
import numeral from 'numeral';
import { format } from 'date-fns';

const ContactSummary: FC = (props) => (
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
      <Box sx={{ mt: 3 }}>
        <Typography
          color="textSecondary"
          variant="overline"
        >
          Amount owing
        </Typography>
        <Typography
          color="textPrimary"
          variant="subtitle2"
        >
          {numeral(768.99).format('$0,0.00')}
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography
          color="textSecondary"
          variant="overline"
        >
          Ave. monthly spend
        </Typography>
        <Typography
          color="textPrimary"
          variant="subtitle2"
        >
          {numeral(109.15).format('$0,0.00')}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default ContactSummary;
