import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '../../chart';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  colors,
  ButtonGroup,
  Button,
  Box,
  Skeleton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { RangeType } from 'src/types/dashboard';
import { getChartsData, changeRangeType } from 'src/slices/dashboardAnalytics';

interface RangeButton {
  title: string;
  type: RangeType;
}

const rangeButtons: RangeButton[] = [
  {
    title: 'Daily',
    type: 100,
  },
  {
    title: '3 Months',
    type: 200,
  },
  {
    title: '6 Months',
    type: 300,
  },
  {
    title: '1 Year',
    type: 400,
  }
];

const AnalyticsStoreStats: FC = (props) => {
  const theme = useTheme();
  const { organisation } = useSelector((state) => state.account);
  const { chartDataInitialised, chartDataLoading, analyticsChartData, rangeType } = useSelector((state) => state.dashboardAnalytics);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChartsData(organisation.id, rangeType));
  }, [organisation]);

  const handleRangeChange = (rangeType: RangeType): void => {
    if (!chartDataLoading) {
      dispatch(changeRangeType(rangeType));
      dispatch(getChartsData(organisation.id, rangeType));
    }
  };

  if (!chartDataInitialised) {
    return (
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
        >
          <Card {...props}>
            <CardHeader title="Store stats" />
            <CardContent>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={110}
                />
              </Box>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={110}
                />
              </Box>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={110}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 200
        },
        dynamicAnimation: {
          enabled: true,
          speed: 450
        }
      }
    },
    colors: [theme.palette.primary.main, colors.amber[700]],
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient'
    },
    grid: {
      borderColor: theme.palette.divider
    },
    markers: {
      strokeColors: theme.palette.background.paper,
      size: 0,
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      theme: theme.palette.mode
    },
    xaxis: {
      tickAmount: 16,
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true
      },
      categories: [...analyticsChartData.xaxis]
    },
    yaxis: [
      {
        labels: {
          formatter(val) {
            return val.toFixed(0);
          }
        },
      }
    ]
  };

  const chartSeries = [
    {
      name: analyticsChartData.jobs.title,
      data: [...analyticsChartData.jobs.data_set]
    },
    {
      name: analyticsChartData.waterTests.title,
      data: [...analyticsChartData.waterTests.data_set]
    }
  ];

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid item>
        <ButtonGroup size="medium">
          {rangeButtons.map((rangeButton) => (
            <Button
              key={rangeButton.type}
              variant={rangeButton.type === rangeType ? 'contained' : 'outlined'}
              onClick={() => handleRangeChange(rangeButton.type)}
            >
              {rangeButton.title}
            </Button>
          ))}
        </ButtonGroup>
      </Grid>
      <Grid
        item
        md={12}
        sm={12}
        xs={12}
      >
        <Card {...props}>
          <CardHeader title="Store stats" />
          <CardContent>
            <Chart
              height="360"
              type={analyticsChartData.chart_type === 'bar' ? 'bar' : 'area'}
              options={chartOptions}
              series={chartSeries}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AnalyticsStoreStats;
