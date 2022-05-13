import type { FC } from 'react';
import numeral from 'numeral';
import {
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import type { MostRequestedJob } from 'src/types/dashboard';
import InformationCircleIcon from '../../../icons/InformationCircle';

const mostRequestedJobs: MostRequestedJob[] = [
  {
    job_template_name: 'Pool service',
    count: 16,
    total_hours: 35
  },
  {
    job_template_name: 'Chlorinator cell replacement',
    count: 16,
    total_hours: 35
  },
  {
    job_template_name: 'Green pool',
    count: 16,
    total_hours: 35
  },
  {
    job_template_name: 'Pool check',
    count: 16,
    total_hours: 35
  },
  {
    job_template_name: 'Delivery',
    count: 16,
    total_hours: 35
  },
];

const AnalyticsMostRequestedJobs: FC = () => (
  <Card>
    <CardHeader
      disableTypography
      title={(
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography
            color="textPrimary"
            variant="h6"
          >
            Most requested jobs
          </Typography>
          <Tooltip title="Top 5 jobs for the last 30 days">
            <InformationCircleIcon fontSize="small" />
          </Tooltip>
        </Box>
      )}
    />
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            Job
          </TableCell>
          <TableCell align="center">
            Scheduled
          </TableCell>
          <TableCell align="center">
            Total hours
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {mostRequestedJobs.map((mostRequestedJob) => (
          <TableRow
            key={mostRequestedJob.job_template_name}
            sx={{
              '&:last-child td': {
                border: 0
              }
            }}
          >
            <TableCell>
              {mostRequestedJob.job_template_name}
            </TableCell>
            <TableCell align="center">
              {numeral(mostRequestedJob.count).format('0,0')}
            </TableCell>
            <TableCell align="center">
              {numeral(mostRequestedJob.total_hours).format('0,0')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

export default AnalyticsMostRequestedJobs;
