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
import getCommaSeparatedSanitisers from '../../utils/pool';

interface PoolPoolDetailsProps {
  pool: Pool;
}

const PoolDetails: FC<PoolPoolDetailsProps> = (props) => {
  const { pool, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Pool details" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                ID
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {pool.id}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Type
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {pool.pool_type.name}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Volume
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {pool.pool_volume}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Surface
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {pool.pool_surface_type ? pool.pool_surface_type.name : '-'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Sanitiser
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {pool.pool_sanitisers.length ? getCommaSeparatedSanitisers(pool.pool_sanitisers) : '-'}
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
