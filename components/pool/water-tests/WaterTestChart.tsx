import type { FC } from 'react';
import { Chart } from '../../chart';
import {
  Card,
  CardContent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import type { ChartData } from 'src/types/type';
import PropTypes from 'prop-types';
import { ApexOptions } from 'apexcharts';

interface WaterTestChartProps {
  chartData: ChartData;
}

const WaterTestChart: FC<WaterTestChartProps> = (props) => {
  const { chartData, ...rest } = props;
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    markers: {
      size: 4,
      strokeColors: theme.palette.background.default,
      strokeWidth: 2
    },
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
        },
        export: {
          csv: {
            filename: chartData.title,
            columnDelimiter: ',',
            headerCategory: 'Date',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString();
            }
          },
          svg: {
            filename: chartData.title,
          },
          png: {
            filename: chartData.title,
          }
        },
      },
      zoom: {
        enabled: false
      }
    },
    colors: [chartData.color],
    dataLabels: {
      enabled: false
    },
    title: {
      text: chartData.title,
      align: 'left',
      style: {
        fontSize: '14px'
      }
    },
    fill: {
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
        shadeIntensity: 1,
        stops: [0, 100],
        type: 'vertical'
      },
      type: 'gradient'
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2
    },
    stroke: {
      curve: 'smooth'
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true
      },
      categories: chartData.labels,
      labels: {
        formatter: (value: string): string => (
          moment(value).format('DD MMM')
        ),
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
  };

  const chartSeries: ApexAxisChartSeries = [{ name: 'Value', data: chartData.series }];

  return (
    <Card {...rest}>
      <CardContent>
        <Chart
          height="250"
          type="area"
          options={chartOptions}
          series={chartSeries}
        />
      </CardContent>
    </Card>
  );
};

WaterTestChart.propTypes = {
  // @ts-ignore
  chartData: PropTypes.object.isRequired,
};

export default WaterTestChart;
