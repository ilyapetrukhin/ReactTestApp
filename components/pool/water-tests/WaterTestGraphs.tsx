import React, { useMemo } from 'react';
import type { FC } from 'react';
import { useSelector } from 'src/store';
import {
  Grid,
  Box,
} from '@mui/material';
import transformResultsToGraphs from './utils';
import type { ChartData } from 'src/types/type';
import WaterTestChart from './WaterTestChart';
import { useTheme } from '@mui/material/styles';

const WaterTestGraphs: FC = (props) => {
  const theme = useTheme();
  const { chemicalHistoryItems } = useSelector((state) => state.poolDetail);

  const chemicalHistoryCharts: ChartData[] = useMemo(
    () => transformResultsToGraphs(chemicalHistoryItems, theme),
    [chemicalHistoryItems],
  );

  return (
    <>
      <Box
        p={3}
        {...props}
      >
        <Grid
          container
          spacing={3}
        >
          {chemicalHistoryCharts.map((chemicalHistoryChart) => (
            <Grid
              key={chemicalHistoryChart.title}
              item
              xl={3}
              md={4}
              sm={6}
              xs={12}
            >
              <WaterTestChart chartData={chemicalHistoryChart} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default WaterTestGraphs;
