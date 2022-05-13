import type { ApexOptions } from 'apexcharts';
import React, { FC, useEffect, useMemo, memo, useCallback } from 'react';
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

import { getProductTabData } from 'src/slices/dashboardFinance';
import { RangeType } from 'src/types/dashboard';
import InformationCircleIcon from 'src/icons/InformationCircle';
import DownloadIcon from 'src/icons/Download';

import { useDispatch, useSelector } from 'src/store';

interface ProductsStatsProps {
  range: RangeType;
}

const ProductsStats: FC<ProductsStatsProps> = (props) => {
  const { ...data } = props;
  const theme = useTheme();

  const { organisation } = useSelector((state) => state.account);
  const { productTabData, tabDataLoading } = useSelector((state) => state.dashboardFinance);

  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(getProductTabData(data.range, organisation.id));
    },
    [dispatch, data.range],
  );

  const products = useMemo(
    () => productTabData?.products.slice(0, 5) ?? [],
    [productTabData],
  );

  const categories = useMemo(
    () => productTabData?.categories ?? [],
    [productTabData],
  );

  const totalSalesSum = useMemo(
    () => {
      let res = 0;
      if (categories) {
        res = categories.reduce((acc, elem) => acc += elem.total_sales, 0);
      }
      return res;
    },
    [categories],
  );

  const calculateSalesPercentArray = useMemo(
    () => {
      let res = [0];
      if (productTabData) {
        res = categories.map((elem) => (elem.total_sales > 0 ? Number(((elem.total_sales * 100) / totalSalesSum).toFixed(0)) : 0));
      }
      return res;
    },
    [categories, totalSalesSum],
  );

  const calculateSalesPercent = useCallback(
    (value: number) => (value > 0 ? Number(((value * 100) / totalSalesSum).toFixed(2)) : 0),
    [totalSalesSum],
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
      colors: [
        'rgba(86, 100, 210, 0.5)',
        '#FFB547',
        '#7BC67E',
        '#64B6F7',
        colors.blueGrey[700]
      ],
      dataLabels: {
        enabled: true
      },
      labels: categories ? categories.map((elem) => elem.name) : [],
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
      }
    }),
    [theme, calculateSalesPercentArray],
  );

  if (tabDataLoading || !productTabData) {
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
        md={4}
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
                  Products
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
                  <TableCell>Product name</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Total Sales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((elem) => (
                  <TableRow
                    key={elem.name}
                    sx={{
                      '&:last-child td': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell>
                      {elem.name}
                    </TableCell>
                    <TableCell>
                      {elem.brand}
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 'fontWeightBold' }}
                    >
                      {numeral(elem.total_sales).format('($0,0.00a)')}
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
                filename={`Product_stats_${moment(new Date()).format('YYYY-MM-DD')}.csv`}
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
                  Categories
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
                  <TableCell>Category name</TableCell>
                  <TableCell>Total Sales</TableCell>
                  <TableCell>% of sales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((elem) => (
                  <TableRow
                    key={elem.name}
                    sx={{
                      '&:last-child td': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell>
                      {elem.name}
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 'fontWeightBold' }}
                    >
                      {numeral(elem.total_sales).format('($0,0.00a)')}
                    </TableCell>
                    <TableCell>
                      {calculateSalesPercent(elem.total_sales)}
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
                filename={`Categories_stats_${moment(new Date()).format('YYYY-MM-DD')}.csv`}
                data={categories}
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
          <CardHeader title="% of sales by category" />
          <CardContent>
            <Chart
              height={200}
              type="donut"
              options={chartOptions}
              series={calculateSalesPercentArray}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

ProductsStats.propTypes = {};

export default memo(ProductsStats);
