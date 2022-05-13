import type { FC } from 'react';
import numeral from 'numeral';
import each from 'lodash/each';
import { Box, Grid, Typography, Card, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../../store';
import { getClassicMetrics } from '../../../slices/dashboardFinance';
import { ClassicMetric } from '../../../types/dashboard';
import { ClassicMetricChart } from '../charts';

const FinanceOverview: FC = (props) => {
  const { organisation } = useSelector((state) => state.account);
  const { classicMetricsLoading, classicMetrics } = useSelector((state) => state.dashboardFinance);
  const [revenue, setRevenue] = useState<ClassicMetric>(null);
  const [invoice, setInvoice] = useState<ClassicMetric>(null);
  const [avgInvoice, setAvgInvoice] = useState<ClassicMetric>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClassicMetrics(organisation.id));
  }, [organisation]);

  useEffect(() => {
    if (classicMetrics && classicMetrics.length) {
      each(classicMetrics, (classicMetric) => {
        switch (classicMetric.metricType) {
          case 'revenue':
            setRevenue(classicMetric);
            break;
          case 'invoice':
            setInvoice(classicMetric);
            break;
          case 'avgInvoice':
            setAvgInvoice(classicMetric);
            break;
          default:
        }
      });
    }
  }, [classicMetrics]);

  return (
    <Card {...props}>
      <Grid container>
        <Grid
          item
          md={4}
          xs={12}
          sx={{
            alignItems: 'center',
            borderRight: (theme) => (
              {
                md: `1px solid ${theme.palette.divider}`
              }
            ),
            borderBottom: (theme) => (
              {
                md: 'none',
                xs: `1px solid ${theme.palette.divider}`
              }
            ),
            display: 'flex',
            justifyContent: 'space-between',
            p: 3
          }}
        >
          <div>
            <Typography
              color="textSecondary"
              variant="overline"
            >
              REVENUE
            </Typography>
            {classicMetricsLoading && (
              <Box
                sx={{
                  display: 'flex',
                  minWidth: 150
                }}
              >
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={30}
                />
              </Box>
            )}
            {!classicMetricsLoading && revenue && (
              <Typography
                color="textPrimary"
                variant="h5"
              >
                {numeral(revenue.current_month).format('($0.00a)')}
              </Typography>
            )}
            {classicMetricsLoading && (
              <Box
                sx={{
                  display: 'flex'
                }}
              >
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={30}
                />
              </Box>
            )}
            {!classicMetricsLoading && revenue && (
              <Typography
                color="textSecondary"
                variant="caption"
              >
                vs.
                {numeral(revenue.last_month).format('($0.00a)')}
                &nbsp;
                last month
              </Typography>
            )}
          </div>
          {classicMetricsLoading && (
            <Box
              sx={{
                display: 'flex',
                minWidth: 177
              }}
            >
              <Skeleton
                animation="wave"
                width="100%"
                height={54}
              />
            </Box>
          )}
          {!classicMetricsLoading && revenue && (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                height: 54,
                width: 177
              }}
            >
              <ClassicMetricChart
                classicMetric={revenue}
                width={150}
              />
            </Box>
          )}
        </Grid>
        <Grid
          item
          md={4}
          xs={12}
          sx={{
            alignItems: 'center',
            borderRight: (theme) => (
              {
                md: `1px solid ${theme.palette.divider}`
              }
            ),
            borderBottom: (theme) => (
              {
                xs: `1px solid ${theme.palette.divider}`,
                md: 'none'
              }
            ),
            display: 'flex',
            justifyContent: 'space-between',
            p: 3
          }}
        >
          <div>
            <Typography
              color="textSecondary"
              variant="overline"
            >
              INVOICES
            </Typography>
            {classicMetricsLoading && (
              <Box
                sx={{
                  display: 'flex',
                  minWidth: 150
                }}
              >
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={30}
                />
              </Box>
            )}
            {!classicMetricsLoading && invoice && (
              <Typography
                color="textPrimary"
                variant="h5"
              >
                {numeral(invoice.current_month).format('($0.00a)')}
              </Typography>
            )}
            {classicMetricsLoading && (
              <Box
                sx={{
                  display: 'flex'
                }}
              >
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={30}
                />
              </Box>
            )}
            {!classicMetricsLoading && invoice && (
              <Typography
                color="textSecondary"
                variant="caption"
              >
                vs.
                {numeral(invoice.last_month).format('($0.00a)')}
                &nbsp;
                last month
              </Typography>
            )}
          </div>
          {classicMetricsLoading && (
            <Box
              sx={{
                display: 'flex',
                minWidth: 177
              }}
            >
              <Skeleton
                animation="wave"
                width="100%"
                height={54}
              />
            </Box>
          )}
          {!classicMetricsLoading && invoice && (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                height: 54,
                width: 177
              }}
            >
              <ClassicMetricChart
                classicMetric={invoice}
                width={150}
              />
            </Box>
          )}
        </Grid>
        <Grid
          item
          md={4}
          xs={12}
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            p: 3
          }}
        >
          <div>
            <Typography
              color="textSecondary"
              variant="overline"
            >
              AVG INVOICE VALUE
            </Typography>
            {classicMetricsLoading && (
              <Box
                sx={{
                  display: 'flex',
                  minWidth: 150
                }}
              >
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={30}
                />
              </Box>
            )}
            {!classicMetricsLoading && avgInvoice && (
              <Typography
                color="textPrimary"
                variant="h5"
              >
                {numeral(avgInvoice.current_month).format('($0.00a)')}
              </Typography>
            )}
            {classicMetricsLoading && (
              <Box
                sx={{
                  display: 'flex',
                }}
              >
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={30}
                />
              </Box>
            )}
            {!classicMetricsLoading && avgInvoice && (
              <Typography
                color="textSecondary"
                variant="caption"
              >
                vs.
                {numeral(avgInvoice.last_month).format('($0.00a)')}
                &nbsp;
                last month
              </Typography>
            )}
          </div>
          {classicMetricsLoading && (
            <Box
              sx={{
                display: 'flex',
                minWidth: 177
              }}
            >
              <Skeleton
                animation="wave"
                width="100%"
                height={54}
              />
            </Box>
          )}
          {!classicMetricsLoading && avgInvoice && (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                height: 54,
                width: 177
              }}
            >
              <ClassicMetricChart
                classicMetric={avgInvoice}
                width={150}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default FinanceOverview;
