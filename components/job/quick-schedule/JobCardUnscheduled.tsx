import React, { FC, forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, Paper, PaperProps, Typography, useTheme } from '@mui/material';
import { Job } from 'src/types/job';
import { getEntityAddress } from 'src/utils/address';

interface JobCardUnscheduledProps extends PaperProps {
  index: number;
  status?: string;
  job: Job | null;
  isDragging: boolean;
}

const JobCardUnscheduled: FC<JobCardUnscheduledProps> = forwardRef(
  ({ index, status, job, isDragging, ...other }, ref) => {
    const theme = useTheme();

    const subtitle = useMemo(
      () => `${job?.job_template?.name} | ${getEntityAddress(
        job?.contact || {},
        'contact'
      )}`,
      [job?.job_template?.name, job?.contact]
    );

    if (job == null) {
      return null;
    }

    return (
      <Paper
        {...other}
        ref={ref}
        elevation={isDragging ? 3 : 0}
        sx={{ backgroundColor: 'background.default', p: 1, mt: 1 }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {job.contact.full_name}
          </Typography>
          {status != null && (
          <Chip
            label={(
              <Typography variant="caption">
                {status.toUpperCase()}
              </Typography>
                  )}
            size="small"
            color="primary"
            sx={{
              backgroundColor: `${theme.palette.primary.main} !important`,
              height: 15,
              fontWeight: 'bold',
            }}
          />
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {subtitle}
        </Typography>
      </Paper>
    );
  }
);

JobCardUnscheduled.propTypes = {
  index: PropTypes.number.isRequired,
  status: PropTypes.string,
  // @ts-ignore
  job: PropTypes.object.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default memo(JobCardUnscheduled);
