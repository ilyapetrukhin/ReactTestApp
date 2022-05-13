import type { FC } from 'react';
import PropTypes from 'prop-types';
import type { Theme } from '@mui/material';
import type { SxProps } from '@mui/system';

import {
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import type { Job } from 'src/types/job';

interface JobCustomerInfoProps {
  job: Job;
  sx?: SxProps<Theme>;
}

const JobCustomerInfo: FC<JobCustomerInfoProps> = (props) => {
  const { job, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Summary" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Customer
              </Typography>
            </TableCell>
            <TableCell>
              <div>
                {job.contact?.full_name}
              </div>
              <div>
                {job.contact?.address_street_one}
              </div>
              <div>
                {job.contact?.address_city}
              </div>
              <div>
                {job.contact?.address_postcode}
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Phone
              </Typography>
            </TableCell>
            <TableCell>
              {job.contact?.phones && job.contact?.phones.length > 0 && (
                job.contact.phones.map((phone) => (
                  <Chip
                    key={phone.id}
                    label={phone.phone_number}
                    sx={{ mr: 1 }}
                    variant="outlined"
                  />
                ))
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Pool
              </Typography>
            </TableCell>
            <TableCell>
              <div>
                {`${job.pool?.pool_type.name} | ${job.pool?.pool_volume}`}
              </div>
              <div>
                {job.pool?.address_street_one}
              </div>
              <div>
                {job.pool?.address_city}
              </div>
              <div>
                {job.pool?.address_postcode}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

JobCustomerInfo.propTypes = {
  // @ts-ignore
  job: PropTypes.object.isRequired,
  sx: PropTypes.object
};

export default JobCustomerInfo;
