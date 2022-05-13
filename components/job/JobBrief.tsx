import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from '@mui/material';
import type { Job } from 'src/types/job';
import moment from 'moment/moment';
import Label from '../Label';

interface JobBriefProps {
  job: Job;
}

const JobBrief: FC<JobBriefProps> = (props) => {
  const {
    job,
    ...other
  } = props;

  return (
    <Card {...other}>
      <CardContent>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            sm={6}
            xs={12}
          >
            <Typography
              color="textSecondary"
              variant="overline"
            >
              Job Name
            </Typography>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              {job.job_template?.name}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography
                color="textSecondary"
                variant="overline"
              >
                Status
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Label color="success">
                  <Typography
                    variant="subtitle2"
                  >
                    Active
                  </Typography>
                </Label>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            sm={6}
            xs={12}
          >
            <Typography
              color="textSecondary"
              variant="overline"
            >
              Date
            </Typography>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              {moment(job.start_time).format('dddd DD MMM')}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography
                color="textSecondary"
                variant="overline"
              >
                Time
              </Typography>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {`${moment(job.start_time).format('h:mm a')} - ${moment(job.end_time).format('h:mm a')}`}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

JobBrief.propTypes = {
  // @ts-ignore
  job: PropTypes.object.isRequired,
};

export default JobBrief;
