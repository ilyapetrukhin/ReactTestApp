import type { FC } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';
import { Box, Dialog, Divider, Grid, TextField, Typography } from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import ArchiveIcon from 'src/icons/Archive';
import ArrowRightIcon from 'src/icons/ArrowRight';
import DocumentTextIcon from 'src/icons/DocumentText';
import TemplateIcon from 'src/icons/Template';
import UsersIcon from 'src/icons/Users';
import type { QuickScheduleColumn as Column } from 'src/types/calendar';
import JobCardAction from './JobCardAction';
import type { Job } from 'src/types/job';

interface JobCardModalProps {
  job: Job;
  column: Column;
  onClose?: () => void;
  open: boolean;
}

const JobCardModal: FC<JobCardModalProps> = (props) => {
  const {
    job,
    column,
    onClose,
    open,
    ...other
  } = props;

  const handleDetailsUpdate = debounce(async () => {
    try {
      toast.success('Job updated!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }, 1000);

  const handleDelete = async (): Promise<void> => {
    try {
      toast.success('Job deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      onClose={onClose}
      open={open}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Grid
          container
          spacing={5}
        >
          <Grid
            item
            sm={8}
            xs={12}
          >
            <TextField
              defaultValue={job.job_template?.name}
              fullWidth
              label="Job template"
              disabled
              onChange={(): Promise<void> => handleDetailsUpdate()}
              variant="outlined"
            />
            <Box sx={{ mt: 3 }}>
              <TextField
                defaultValue={job.notes}
                fullWidth
                multiline
                onChange={(): Promise<void> => handleDetailsUpdate()}
                placeholder="Leave a message"
                label="Description"
                rows={6}
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
          >
            <Typography
              color="textPrimary"
              component="h4"
              sx={{
                fontWeight: 600,
                mb: 2
              }}
              variant="overline"
            >
              Add to card
            </Typography>
            <JobCardAction
              disabled
              icon={<UsersIcon fontSize="small" />}
            >
              Members
            </JobCardAction>
            <JobCardAction
              disabled
              icon={<LabelIcon fontSize="small" />}
            >
              Tags
            </JobCardAction>
            <JobCardAction
              disabled
              icon={<DocumentTextIcon fontSize="small" />}
            >
              Attachments
            </JobCardAction>
            <Box sx={{ mt: 3 }}>
              <Typography
                color="textPrimary"
                component="h4"
                sx={{
                  fontWeight: 600,
                  mb: 2
                }}
                variant="overline"
              >
                Actions
              </Typography>
              <JobCardAction
                disabled
                icon={<ArrowRightIcon fontSize="small" />}
              >
                Reschedule
              </JobCardAction>
              <JobCardAction
                disabled
                icon={<TemplateIcon fontSize="small" />}
              >
                Make Template
              </JobCardAction>
              <Divider sx={{ my: 2 }} />
              <JobCardAction
                icon={<ArchiveIcon fontSize="small" />}
                onClick={handleDelete}
              >
                Delete
              </JobCardAction>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

JobCardModal.propTypes = {
  // @ts-ignore
  job: PropTypes.object.isRequired,
  // @ts-ignore
  column: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

JobCardModal.defaultProps = {
  open: false
};

export default JobCardModal;
