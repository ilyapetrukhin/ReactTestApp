import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '../../chart';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ArrowRightIcon from '../../../icons/ArrowRight';
import ChevronUpIcon from '../../../icons/ChevronUp';

const OverviewWeeklyEarnings: FC = (props) => {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: ['#27c6db'],
    labels: [''],
    plotOptions: {
      radialBar: {
        dataLabels: {
          value: {
            show: false
          }
        },
        hollow: {
          size: '60%'
        },
        track: {
          background: theme.palette.background.default
        }
      }
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const chartSeries = [83];

  return (
    <Card {...props}>
      <CardContent
        sx={{
          alignItems: 'center',
          display: 'flex'
        }}
      >
        <Chart
          height="160"
          options={chartOptions}
          series={chartSeries}
          type="radialBar"
          width="160"
        />
        <Box
          sx={{
            display: 'flex',
            flex: 1
          }}
        >
          <div>
            <Typography
              color="primary"
              variant="h4"
            >
              0.299 BTC
            </Typography>
            <Typography
              color="textPrimary"
              sx={{ mt: 1 }}
              variant="subtitle2"
            >
              Weekly earnings
            </Typography>
          </div>
          <Box sx={{ flexGrow: 1 }} />
          <Avatar
            sx={{
              backgroundColor: alpha(theme.palette.success.main, 0.08),
              color: 'success.main'
            }}
            variant="rounded"
          >
            <ChevronUpIcon fontSize="small" />
          </Avatar>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          variant="text"
        >
          See all activity
        </Button>
      </CardActions>
    </Card>
  );
};

export default OverviewWeeklyEarnings;
