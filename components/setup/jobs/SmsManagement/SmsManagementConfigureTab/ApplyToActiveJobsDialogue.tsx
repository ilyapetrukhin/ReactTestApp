import React, { FC, memo, useCallback } from 'react';

import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from '@mui/material';

const OPTION_BOOKING_REMINDER_SWITCH = 'booking_reminder_switch';
const OPTION_BOOKING_REMINDER_MESSAGE = 'booking_reminder_message';
const OPTION_BOOKING_REMINDER_TIME = 'booking_reminder_time';
const OPTION_BOOKING_CHANGED_SWITCH = 'booking_changed_switch';
const OPTION_BOOKING_CHANGES_MESSAGE = 'booking_changed_message';
const JOB_COMPLETE_SWITCH = 'job_complete_switch';
const JOB_COMPLETE_MESSAGE = 'job_complete_message';

interface SectionOption {
  name: string;
  value: string;
}

interface Section {
  name: string;
  options: SectionOption[];
}

const secions: Section[] = [
  {
    name: 'Booking reminder',
    options: [
      {
        name: 'Update on/off status',
        value: OPTION_BOOKING_REMINDER_SWITCH,
      },
      {
        name: 'Update message content',
        value: OPTION_BOOKING_REMINDER_MESSAGE,
      },
      {
        name: 'Update message send timing',
        value: OPTION_BOOKING_REMINDER_TIME,
      },
    ],
  },
  {
    name: 'Booking changed',
    options: [
      {
        name: 'Update on/off status',
        value: OPTION_BOOKING_CHANGED_SWITCH,
      },
      {
        name: 'Update message content',
        value: OPTION_BOOKING_CHANGES_MESSAGE,
      },
    ],
  },
  {
    name: 'Job complete',
    options: [
      {
        name: 'Update on/off status',
        value: JOB_COMPLETE_SWITCH,
      },
      {
        name: 'Update message content',
        value: JOB_COMPLETE_MESSAGE,
      },
    ],
  },
];

interface ApplyToActiveJobsDialogueProps {
  options: string[];
  onChangeOptions: (options: string[]) => void;

  isSubmitting: boolean;

  onSubmit: (updateActiveJobs: boolean) => void;
  onClose: () => void;
}

const ApplyToActiveJobsDialogue: FC<ApplyToActiveJobsDialogueProps> = memo(
  ({ options, isSubmitting, onChangeOptions, onSubmit, onClose }) => {
    const updateActiveJobsEnabled = options.length !== 0;
    const updateActiveJobs = useCallback(() => onSubmit(true), [onSubmit]);
    const doNotUpdateActiveJobs = useCallback(
      () => onSubmit(false),
      [onSubmit]
    );

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = event.target;

        if (event.target.checked) {
          onChangeOptions([...options, name]);
        } else {
          onChangeOptions(options.filter((option) => option !== name));
        }
      },
      [options, onChangeOptions]
    );

    return (
      <Card>
        <CardHeader title="Would you like to apply this to all active jobs?" />
        <Divider />
        <CardContent>
          {secions.map((section, index) => (
            <div key={section.name}>
              <Typography
                color="textPrimary"
                variant="h6"
                sx={{ textTransform: 'uppercase', mt: index === 0 ? 0 : 3 }}
              >
                {section.name}
              </Typography>

              <Grid
                container
                spacing={3}
                sx={{ mt: 1, px: 1 }}
              >
                {section.options.map((option) => (
                  <Grid
                    key={option.value}
                    item
                    xs={12}
                    sm={6}
                  >
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={options.includes(option.value)}
                          color="primary"
                          edge="start"
                          name={option.value}
                          onChange={handleChange}
                        />
                      )}
                      label={option.name}
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          ))}

          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row'
              },
              mt: 2,
            }}
          >
            <Button
              sx={{ ml: { xs: 1, sm: 'auto' }, mb: 1 }}
              color="primary"
              onClick={onClose}
              variant="text"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={isSubmitting}
              sx={{ ml: 1, mb: 1 }}
              type="submit"
              variant="text"
              onClick={doNotUpdateActiveJobs}
            >
              Do not update active jobs
            </Button>
            <Button
              color="primary"
              disabled={isSubmitting || !updateActiveJobsEnabled}
              sx={{ ml: 1, mb: 1 }}
              type="submit"
              variant="contained"
              onClick={updateActiveJobs}
            >
              Update active jobs
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

ApplyToActiveJobsDialogue.propTypes = {
  onChangeOptions: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ApplyToActiveJobsDialogue;
