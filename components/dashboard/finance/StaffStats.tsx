import type { ApexOptions } from 'apexcharts';
import React, { FC, memo, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Skeleton,
  CardActions,
  Button,
  Typography,
  Tooltip,
  colors,
} from '@mui/material';
import numeral from 'numeral';
import { CSVLink } from 'react-csv';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../../chart';
import moment from 'moment';

import { RangeType } from 'src/types/dashboard';
import { getStaffTabData } from 'src/slices/dashboardFinance';

import { useDispatch, useSelector } from 'src/store';
import InformationCircleIcon from 'src/icons/InformationCircle';
import DownloadIcon from 'src/icons/Download';

interface StaffStatsProps {
  range: RangeType;
}

const TABLE_COLORS = [
  'rgba(86, 100, 210, 0.5)',
  '#FFB547',
  '#7BC67E',
  '#64B6F7',
  colors.blueGrey[700]
];

const StaffStats: FC<StaffStatsProps> = (props) => {
  const { ...data } = props;
  const theme = useTheme();

  const { organisation } = useSelector((state) => state.account);
  const { staffTabData, tabDataLoading } = useSelector((state) => state.dashboardFinance);

  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(getStaffTabData(data.range, organisation.id));
    },
    [dispatch, data.range],
  );

  const products = useMemo(
    () => (staffTabData ? staffTabData.slice(0, 5) : []),
    [staffTabData],
  );

  const totalInvoiceSum = useMemo(
    () => {
      let res = 0;
      if (staffTabData) {
        res = staffTabData.reduce((acc, elem) => acc += elem.total_invoiced, 0);
      }
      return res;
    },
    [staffTabData],
  );

  const calculateInvoicePercent = useMemo(
    () => {
      let res = [0];
      if (staffTabData) {
        res = staffTabData.slice(0, 5).map((elem) => elem.total_invoiced);
      }
      return res;
    },
    [staffTabData, totalInvoiceSum],
  );

  const chartOptions = useMemo(
    () : ApexOptions => ({
      chart: {
        background: 'transparent',
        stacked: false,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: TABLE_COLORS,
      dataLabels: {
        enabled: false
      },
      labels: staffTabData ? staffTabData.slice(0, 5).map((elem) => elem.name) : [],
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
        mode: theme.palette.mode,
      },
      tooltip: {
        enabled: true,
        y: {
          formatter(val) {
            return numeral(val).format('($0.00a)');
          },
        },
      }
    }),
    [theme, staffTabData, calculateInvoicePercent],
  );

  if (tabDataLoading || !staffTabData) {
    return (
      <Grid
        container
        spacing={3}
        {...data}
        sx={{
          mt: 1
        }}
      >
        <Grid
          item
          md={8}
          xs={12}
        >
          <Card>
            <CardContent>
              <Skeleton
                animation="wave"
                width="100%"
                height={200}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          md={4}
          xs={12}
        >
          <Card>
            <CardContent>
              <Skeleton
                animation="wave"
                width="100%"
                height={200}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      container
      spacing={3}
      {...data}
      sx={{
        mt: 1
      }}
    >
      <Grid
        item
        md={8}
        xs={12}
      >
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
                  Top performers
                </Typography>
                <Tooltip
                  title="Description"
                >
                  <InformationCircleIcon fontSize="small" />
                </Tooltip>
              </Box>
            )}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Number of jobs</TableCell>
                  <TableCell>Total invoiced</TableCell>
                  <TableCell>Number of tests</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((elem, index) => (
                  <TableRow
                    key={elem.id}
                    sx={{
                      '&:last-child td': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Box
                          width={21}
                          height={21}
                          marginRight={1}
                          bgcolor={TABLE_COLORS[index]}
                        />
                        {elem.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {elem.number_of_jobs}
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 'fontWeightBold' }}
                    >
                      {numeral(elem.total_invoiced).format('($0,0.00a)')}
                    </TableCell>
                    <TableCell>
                      {elem.number_of_tests}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CardActions
            sx={{
              p: 1.5,
              backgroundColor: 'background.default'
            }}
          >
            <Button
              color="primary"
              startIcon={<DownloadIcon fontSize="small" />}
            >
              <CSVLink
                style={{ textDecoration: 'none', color: theme.palette.primary.main }}
                filename={`Staff_stats_${moment(new Date()).format('YYYY-MM-DD')}.csv`}
                data={products}
              >
                Download full report as CSV
              </CSVLink>
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid
        item
        md={4}
        xs={12}
      >
        <Card>
          <CardHeader title="Total invoiced by staff" />
          <CardContent>
            <Chart
              height={200}
              type="donut"
              options={chartOptions}
              series={calculateInvoicePercent}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

StaffStats.propTypes = {
};

export default memo(StaffStats);
