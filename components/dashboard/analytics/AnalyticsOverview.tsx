import type { FC } from 'react';
import numeral from 'numeral';
import {
  Avatar,
  Box,
  Card,
  Divider,
  Grid,
  Skeleton,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect } from 'react';
import ChevronUpIcon from 'src/icons/ChevronUp';
import ChevronDownIcon from 'src/icons/ChevronDown';
import { useDispatch, useSelector } from 'src/store';
import getMonthStat from 'src/utils/dashboard';
import { getClassicMetrics } from 'src/slices/dashboardAnalytics';
import { ClassicMetricChart } from '../charts';

const AnalyticsOverview: FC = () => {
  const { organisation } = useSelector((state) => state.account);
  const { classicMetricsLoading, classicMetrics } = useSelector((state) => state.dashboardAnalytics);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClassicMetrics(organisation.id));
  }, [organisation]);

  if (classicMetricsLoading) {
    const fakeStats = ['completedJobs', 'newCustomers', 'waterTests'];
    return (
      <Grid
        container
        spacing={2}
      >
        {fakeStats.map((fakeStat) => (
          <Grid
            item
            key={fakeStat}
            md={4}
            xs={12}
          >
            <Card>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 3
                }}
              >
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={90}
                />
              </Box>
              <Divider />
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  px: 3,
                  py: 2
                }}
              >
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={44}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid
      container
      spacing={2}
    >
      {classicMetrics.map((classicMetric) => {
        const isGrowth = classicMetric.ratio.includes('+');
        return (
          <Grid
            key={classicMetric.title}
            item
            md={4}
            xs={12}
          >
            <Card>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 3
                }}
              >
                <div>
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                  >
                    {classicMetric.title}
                  </Typography>
                  <Typography
                    color="textPrimary"
                    sx={{ mt: 1 }}
                    variant="h5"
                  >
                    {numeral(classicMetric.current_month).format(classicMetric.is_currency ? '($0.00a)' : '0a')}
                  </Typography>
                </div>
                <ClassicMetricChart
                  classicMetric={classicMetric}
                  width={120}
                />
              </Box>
              <Divider />
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  px: 3,
                  py: 2
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: (theme) => alpha(isGrowth ? theme.palette.success.main : theme.palette.error.main, 0.08),
                    color: () => (isGrowth ? 'success.main' : 'error.main'),
                    height: 36,
                    width: 36
                  }}
                >
                  {isGrowth ? <ChevronUpIcon fontSize="small" /> : <ChevronDownIcon fontSize="small" />}
                </Avatar>
                <Typography
                  color="textSecondary"
                  sx={{ ml: 1 }}
                  variant="caption"
                >
                  {getMonthStat(classicMetric)}
                </Typography>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AnalyticsOverview;
