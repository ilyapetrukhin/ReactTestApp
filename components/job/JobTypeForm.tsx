/* eslint-disable */
import React, { useState } from 'react';
import type { FC, FormEvent } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import {
  Box,
  Button,
  Card, CardHeader, Divider,
  FormHelperText, Grid, IconButton,
  TextField,
  Typography
} from '@mui/material';
import {useDispatch, useSelector} from "../../store";
import {updateJobTemplate, updateUser} from "../../slices/jobDetail";
import JobTemplateSearch from "../widgets/search-inputs/JobTemplateSearch";
import {JobTemplate} from "../../types/jobTemplate";
import {
  Edit as EditIcon,
  Trash as TrashIcon,
} from 'react-feather';

interface JobTypeFormProps {
  onNext?: () => void;
  onBack?: () => void;
}

const JobTypeForm: FC<JobTypeFormProps> = (props) => {
  const { onBack, onNext, ...other } = props;
  const { technicians } = useSelector((state) => state.user);
  const { job, jobTemplate } = useSelector((state) => state.jobDetail);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleTechChange = (techId: number): void => {
    const tech = find(technicians, { id: techId })
    dispatch(updateUser(tech))
  };

  const handleTemplateChange = (jobTemplate: JobTemplate): void => {
    if (jobTemplate) {
      dispatch(updateJobTemplate(jobTemplate));
      setShowSearch(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      if (onNext) {
        onNext();
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      {...other}
    >
      <Card >
        <CardHeader title="Job details" />
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography
            color="textPrimary"
            variant="h6"
          >
            Assign technicians
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            Or keep it unassigned and assign to a tech later
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              name="user_id"
              onChange={(event): void => handleTechChange(parseInt(event.target.value, 10))}
              select
              InputLabelProps={{ shrink: true }}
              SelectProps={{ native: true, displayEmpty: true }}
              value={job.user_id}
              variant="outlined"
            >
              <option value="">Unassigned</option>
              {technicians.map((technician) => (
                <option
                  key={technician.id}
                  value={technician.id}
                >
                  {`${technician.first_name} ${technician.last_name} (${technician.email})`}
                </option>
              ))}
            </TextField>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography
              color="textPrimary"
              variant="h6"
            >
              Job type
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              It will prefill the list of job tasks and products
            </Typography>
            {jobTemplate && !showSearch && (
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 2
                }}
              >
                <TextField
                  fullWidth
                  name="job_template"
                  disabled
                  placeholder="Choose job template"
                  value={jobTemplate ? jobTemplate.name : ''}
                  variant="outlined"
                />
                <IconButton
                  sx={{
                    ml: 2,
                    color: 'primary.main',
                  }}
                  onClick={(): void => setShowSearch(true)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
          {(showSearch || !jobTemplate) && (
            <Box sx={{ mt: 2 }}>
              <JobTemplateSearch onSelect={handleTemplateChange} hideLabel />
            </Box>
          )}
          {error && (
            <Box sx={{ mt: 2 }}>
              <FormHelperText error>
                {error}
              </FormHelperText>
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              mt: 6
            }}
          >
            {onBack && (
              <Button
                color="primary"
                onClick={onBack}
                size="large"
                variant="text"
              >
                Previous
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="primary"
              disabled={!jobTemplate || isSubmitting}
              type="submit"
              variant="contained"
            >
              Next
            </Button>
          </Box>
        </Box>
      </Card>
    </form>
  );
};

JobTypeForm.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func
};

export default JobTypeForm;
