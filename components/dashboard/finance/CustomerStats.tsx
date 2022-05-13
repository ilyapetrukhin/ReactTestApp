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
} from '@mui/material';
import numeral from 'numeral';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';

import { RangeType } from 'src/types/dashboard';
import { getCustomerTabData } from 'src/slices/dashboardFinance';

import { useDispatch, useSelector } from 'src/store';
import InformationCircleIcon from 'src/icons/InformationCircle';
import DownloadIcon from 'src/icons/Download';

interface CustomerStatsProps {
  range: RangeType;
}

const CustomerStats: FC<CustomerStatsProps> = (props) => {
  const { ...data } = props;
  const theme = useTheme();

  const { organisation } = useSelector((state) => state.account);
  const { customerTabData, tabDataLoading } = useSelector((state) => state.dashboardFinance);

  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(getCustomerTabData(data.range, organisation.id));
    },
    [dispatch, data.range],
  );

  const products = useMemo(
    () => (customerTabData ? customerTabData.slice(0, 5) : []),
    [customerTabData],
  );

  if (tabDataLoading || !customerTabData) {
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
          xs={12}
        >
          <Card>
            <CardContent>
              <Skeleton
                animation="wave"
                width="100%"
                height={300}
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
                  Top customers
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
                  <TableCell>Pool address</TableCell>
                  <TableCell>Most requested job</TableCell>
                  <TableCell>Number of jobs</TableCell>
                  <TableCell>Total invoiced</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((elem) => (
                  <TableRow
                    key={elem.id}
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
                      {elem.pool_address}
                    </TableCell>
                    <TableCell>
                      {elem.most_requested_job}
                    </TableCell>
                    <TableCell>
                      {elem.number_of_jobs}
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 'fontWeightBold' }}
                    >
                      {numeral(elem.total_invoiced).format('($0,0.00a)')}
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
                filename={`Customers_stats_${moment(new Date()).format('YYYY-MM-DD')}.csv`}
                data={products}
              >
                Download full report as CSV
              </CSVLink>
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

CustomerStats.propTypes = {
};

export default memo(CustomerStats);
