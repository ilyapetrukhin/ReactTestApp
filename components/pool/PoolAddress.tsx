import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import type { Pool } from 'src/types/pool';

interface PoolPoolDetailsProps {
  pool: Pool;
}

const PoolDetails: FC<PoolPoolDetailsProps> = (props) => {
  const { pool, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Pool address" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Address street 1
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {pool.address_street_one}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Address street 2
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {pool.address_street_two}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Postcode
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {pool.address_postcode}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Suburb/Town/City
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {pool.address_city}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                State
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {pool.address_state}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

PoolDetails.propTypes = {
  // @ts-ignore
  pool: PropTypes.object.isRequired,
};

export default PoolDetails;
