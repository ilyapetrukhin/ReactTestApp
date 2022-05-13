import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import MobileTimePicker from '@mui/lab/MobileTimePicker';

import { CalendarTodayOutlined, ScheduleOutlined } from '@mui/icons-material';

import type { QuickScheduleColumn as Column } from 'src/types/calendar';
import type { Job } from 'src/types/job';
import { getEntityAddress } from 'src/utils/address';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';
import { User } from 'src/types/user';

interface MoveJobModalProps {
  job: Job;
  column: Column;
  technicians: User[];
  onMove: (techId: string | number, startDate: string, endDate: string) => void;
  onClose?: () => void;
  open: boolean;
}

const MoveJobModal: FC<MoveJobModalProps> = (props) => {
  const { job, column, technicians, onMove, onClose, open, ...other } = props;
  const [techId, setTechId] = useState(job.user_id);
  const [date, setDate] = useState(moment(job.start_time).toDate());

  const address = useMemo(
    () => getEntityAddress(job?.contact || {}, 'contact'),
    [job?.contact]
  );

  const handleChangeDate = useCallback((date: Date) => {
    setDate(date);
  }, []);

  const handleChangeTime = useCallback((date: Date) => {
    setDate(date);
  }, []);

  const handleChangeTechId = useCallback((event: SelectChangeEvent) => {
    setTechId(event.target.value);
  }, []);

  const handleMove = useCallback(() => {
    const startTimeMoment = moment(date);
    const startTime = startTimeMoment.format('YYYY-MM-DD HH:mm:ss');
    if (startTime === job.start_time) {
      onMove(techId, job.start_time, job.end_time);
    } else {
      const delta = moment(job.end_time).diff(moment(job.start_time));
      const endTime = startTimeMoment.add(delta).format('YYYY-MM-DD HH:mm:ss');
      onMove(techId, startTime, endTime);
    }
  }, [date, techId, onClose, onMove]);

  useEffect(() => {
    setDate(moment(job.start_time).toDate());
  }, [job.start_time]);

  useEffect(() => {
    setTechId(job.user_id);
  }, [job.user_id]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
      {...other}
    >
      <Box>
        <Box
          py={2}
          px={3}
        >
          <Typography
            variant="h6"
            color="inherit"
          >
            Move Job
          </Typography>
        </Box>
        <Paper
          sx={{
            backgroundColor: 'background.default',
            p: 3,
          }}
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
              {job?.contact?.full_name}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {job?.job_template?.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {address}
          </Typography>
        </Paper>
        <Box
          my={3}
          px={3}
        >
          <MobileDatePicker
            label="Date"
            renderInput={(props) => (
              <TextField
                fullWidth
                variant="outlined"
                {...props}
              />
            )}
            mask="YYYY-MM-DD"
            disableCloseOnSelect={false}
            showToolbar={false}
            disableMaskedInput
            inputFormat="EEE d MMMM yyyy"
            onChange={handleChangeDate}
            value={date}
            InputProps={{
              endAdornment: (
                <CalendarTodayOutlined sx={{ color: 'grey.400' }} />
              ),
            }}
          />
        </Box>
        <Box px={3}>
          <MobileTimePicker
            label="Time"
            renderInput={(props) => (
              <TextField
                fullWidth
                variant="outlined"
                {...props}
              />
            )}
            mask="YYYY-MM-DD"
            disableCloseOnSelect={false}
            showToolbar={false}
            disableMaskedInput
            inputFormat="hh:mm aa"
            onChange={handleChangeTime}
            value={date}
            InputProps={{
              endAdornment: <ScheduleOutlined sx={{ color: 'grey.400' }} />,
            }}
          />
        </Box>
        <Box
          my={3}
          px={3}
        >
          <FormControl
            variant="outlined"
            sx={{
              minWidth: '100%',
            }}
          >
            <InputLabel>Technician</InputLabel>
            <Select
              label="Technician"
              onChange={handleChangeTechId}
              value={techId}
              size="medium"
            >
              {
                technicians.map((tech) => (
                  <MenuItem
                    key={tech.id}
                    value={tech.id}
                  >
                    {tech.first_name}
                    {' '}
                    {tech.last_name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          pb={3}
        >
          <Button
            color="primary"
            sx={{ mr: 2 }}
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleMove}
          >
            MOVE JOB
          </LoadingButton>
        </Box>
      </Box>
    </Dialog>
  );
};

MoveJobModal.propTypes = {
  // @ts-ignore
  job: PropTypes.object.isRequired,
  // @ts-ignore
  column: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

MoveJobModal.defaultProps = {
  open: false,
};

export default MoveJobModal;
