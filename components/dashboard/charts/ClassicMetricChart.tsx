import type { ApexOptions } from 'apexcharts';
import { FC, memo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../chart';
import PropTypes from 'prop-types';
import { ClassicMetric } from '../../../types/dashboard';

interface LineChartProps {
  width: number;
  classicMetric: ClassicMetric;
}

const LineChart: FC<LineChartProps> = (props) => {
  const { classicMetric, width } = props;
  const theme = useTheme();

  let chartSeries;
  if (classicMetric.ratio !== '') {
    chartSeries = [classicMetric.last_month, classicMetric.current_month];
  } else {
    chartSeries = [0, 0];
  }

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: [theme.palette.primary.main],
    dataLabels: {
      enabled: false
    },
    grid: {
      show: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      enabled: false
    },
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false
    }
  };

  return (
    <Chart
      type="line"
      width={width}
      options={chartOptions}
      series={chartSeries}
    />
  );
};

LineChart.propTypes = {
  width: PropTypes.number.isRequired,
  // @ts-ignore
  classicMetric: PropTypes.object.isRequired
};

export default memo(LineChart);
