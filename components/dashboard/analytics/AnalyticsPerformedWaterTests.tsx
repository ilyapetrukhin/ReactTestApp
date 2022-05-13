import type { FC } from 'react';
import { Chart } from '../../chart';
import type { ApexOptions } from 'apexcharts';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Tooltip,
  Typography,
  colors
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InformationCircleIcon from '../../../icons/InformationCircle';

const AnalyticsPerformedWaterTests: FC = () => {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: [
      'rgba(86, 100, 210, 0.5)',
      '#FFB547',
      '#7BC67E',
      '#64B6F7',
      colors.blueGrey[700]
    ],
    dataLabels: {
      enabled: false
    },
    labels: ['pH', 'Total Alkalinity', 'Free Chlorine', 'Total Hardness', 'Other'],
    legend: {
      fontSize: '14',
      fontFamily: theme.typography.fontFamily,
      fontWeight: theme.typography.subtitle2.fontWeight,
      itemMargin: {
        vertical: 8
      },
      labels: {
        colors: theme.palette.text.primary
      },
      markers: {
        width: 8,
        height: 8
      },
      show: true
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const chartSeries = [25, 20, 25, 20, 10];

  return (
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
              Performed water tests
            </Typography>
            <Tooltip
              title="Water tests performed for the last 30 days"
            >
              <InformationCircleIcon fontSize="small" />
            </Tooltip>
          </Box>
        )}
      />
      <CardContent>
        <Chart
          height={300}
          type="donut"
          options={chartOptions}
          series={chartSeries}
        />
      </CardContent>
    </Card>
  );
};

export default AnalyticsPerformedWaterTests;
