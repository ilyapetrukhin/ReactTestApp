import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, CardHeader, Box, Card, CardProps, Typography, Chip } from '@mui/material';
import moment from 'moment';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { getEntityAddress } from 'src/utils/address';
import type { QuickScheduleColumn as Column } from 'src/types/calendar';
import type { Job } from 'src/types/job';
import { cancelMovingJob, confirmMovingJob } from 'src/slices/quickSchedule';

import MoveJobModal from './MoveJobModal';
import JobCardModal from './JobCardModal';

import { useDispatch, useSelector } from 'src/store';
import type { RootState } from 'src/store';
import { useTheme } from '@mui/material/styles';
import { UNSCHEDULED } from 'src/constants/job';

interface JobCardProps extends CardProps {
  jobId: string;
  dragging: boolean;
  index?: number;
  column: Column;
  color?: string;
  style?: Record<any, any>;
}

const jobCardSelector = (state: RootState, jobId: string): Job => {
  const { jobs } = state.quickSchedule;
  const job = jobs.byId[jobId];

  return {
    ...job,
  };
};

const formatTime = (time: string | null): string => {
  if (time == null || time === '') {
    return '';
  }

  const date = moment(time).toDate();

  if (date.getMinutes() === 0) {
    return format(date, 'ha').toLocaleLowerCase();
  }

  return format(date, 'h:ma').toLocaleLowerCase();
};

const JobCard = forwardRef<HTMLDivElement, JobCardProps>((props, ref) => {
  const { jobId, dragging, column, index, color, ...other } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const [open, setOpen] = useState<boolean>(false);

  const job = useSelector((state) => jobCardSelector(state, jobId));
  const techs = useSelector((state) => state.jobCalendar.technicians);
  const movingJob = useSelector((state) => state.quickSchedule.movingJob);
  const isUnscheduled = useMemo(() => job.job_status_id === UNSCHEDULED, [job.job_status_id]);

  const openMoveJob = movingJob != null && movingJob.id.toString() === job.id.toString();

  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );

  const address = useMemo(() => getEntityAddress(job.contact, 'contact'), [job.contact]);
  const time = useMemo(() => {
    if (job.job_status_id === UNSCHEDULED || job.start_time == null || job.end_time == null) {
      return '';
    }

    return `${formatTime(job.start_time)} - ${formatTime(job.end_time)}`;
  }, [job.job_status_id, job.start_time, job.end_time]);

  const handleOpen = useCallback((): void => {
    setOpen(true);
  }, []);

  const handleClose = useCallback((): void => {
    setOpen(false);
  }, []);

  const handleCloseMoveJob = useCallback((): void => {
    dispatch(cancelMovingJob());
  }, []);

  const handleMove = useCallback(async (techId: string | number, startTime: string, endTime: string) => {
    try {
      await dispatch(confirmMovingJob(organisationId, job.id.toString(), techId.toString(), startTime, endTime));
      toast.success('Job successfully updated');
    } catch (e) {
      toast.error('Something went wrong!');
    }
  }, [organisationId, movingJob, job.id, handleCloseMoveJob]);

  return (
    <>
      <Card
        ref={ref}
        elevation={dragging ? 2 : 0}
        raised={dragging}
        onClick={handleOpen}
        sx={{
          ...(dragging && {
            backgroundColor: 'background.paper'
          }),
          '&:hover': {
            backgroundColor: 'background.default'
          }
        }}
        variant={dragging ? 'elevation' : 'outlined'}
        {...other}
      >
        <CardHeader
          sx={{
            p: 1,
            '& .MuiCardHeader-avatar': {
              mr: 1,
            },
          }}
          avatar={!isUnscheduled && (
            <Avatar
              alt="Unknown"
              sx={{
                backgroundColor: color || 'background.default',
                height: 20,
                width: 20,
                fontSize: theme.typography.pxToRem(12),
              }}
            >
              {(index + 1).toString()}
            </Avatar>
          )}
          disableTypography
          subheader={(
            <Typography
              variant="body2"
              sx={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {job?.job_template?.name}
              {' '}
              {job?.job_status_id}
            </Typography>
          )}
          title={(
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <Typography
                color="textPrimary"
                sx={{
                  fontWeight: 'fontWeightBold',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {job?.contact?.full_name}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              {!isUnscheduled && (
                <Typography
                  color="textSecondary"
                  variant="caption"
                >
                  {time}
                </Typography>
              )}
              {isUnscheduled && (
                <Chip
                  label={(
                    <Typography variant="caption">
                      AWAITING PARTS
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
          )}
        />
        <Box
          sx={{
            p: 1,
          }}
        >
          <Typography
            variant="body2"
          >
            {address}
          </Typography>
        </Box>
      </Card>
      <JobCardModal
        job={job}
        column={column}
        onClose={handleClose}
        open={open}
      />
      <MoveJobModal
        open={openMoveJob}
        job={job}
        column={column}
        technicians={techs}
        onMove={handleMove}
        onClose={handleCloseMoveJob}
      />
    </>
  );
});

JobCard.propTypes = {
  jobId: PropTypes.string.isRequired,
  dragging: PropTypes.bool,
  index: PropTypes.number,
  // @ts-ignore
  column: PropTypes.object.isRequired,
  color: PropTypes.string,
  style: PropTypes.object,
};

JobCard.defaultProps = {
  dragging: false,
};

export default JobCard;
