import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '../../chart';
import { Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import type { TestHistoryResult } from 'src/types/testHistory';

interface HistoryChartProps {
  testName: string;
  historyItems: TestHistoryResult[] | null;
}

const HistoryChart: FC<HistoryChartProps> = (props) => {
  const { testName, historyItems } = props;
  const theme = useTheme();

  const chartOptions: ApexOptions = {
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
            filename: testName,
            columnDelimiter: ',',
            headerCategory: 'Date',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString();
            }
          },
          svg: {
            filename: testName,
          },
          png: {
            filename: testName,
          }
        },
      },
      zoom: {
        enabled: false
      },
    },
    colors: [theme.palette.primary.main, theme.palette.success.main],
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2
    },
    markers: {
      hover: {
        size: undefined,
        sizeOffset: 2
      },
      radius: 2,
      shape: 'circle',
      size: 4,
      strokeColors: ['#1f87e6', '#27c6db'],
      strokeWidth: 0
    },
    title: {
      text: testName,
      align: 'left',
      style: {
        fontSize: '14px'
      }
    },
    stroke: {
      curve: 'smooth',
      dashArray: [0, 3],
      lineCap: 'butt',
      width: 3
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
      categories: [
        '01 Jan',
        '02 Jan',
        '03 Jan',
        '04 Jan',
        '05 Jan',
      ],
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: [
      {
        min: 6,
        max: 9,
        axisBorder: {
          color: theme.palette.divider,
          show: true
        },
        axisTicks: {
          color: theme.palette.divider,
          show: true
        },
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
    ]
  };

  const chartSeries = [
    {
      data: [
        7.2,
        7.7,
        7.9,
        7.1,
        7.4,
      ],
      name: 'Results'
    },
    {
      data: [7.4, 7.4, 7.4, 7.4, 7.4],
      name: 'Target',
      type: 'area',
    }
  ];

  return (
    <Card>
      <CardContent>
        <Chart
          height="300"
          options={chartOptions}
          series={chartSeries}
          type="area"
        />
      </CardContent>
    </Card>
  );
};

HistoryChart.propTypes = {
  testName: PropTypes.string.isRequired,
  historyItems: PropTypes.array,
};

export default HistoryChart;
