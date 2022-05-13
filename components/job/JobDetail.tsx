import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import type { Job } from 'src/types/job';
import React from 'react';
import XIcon from 'src/icons/X';
import { useSelector } from 'src/store';
import JobBrief from './JobBrief';
import JobFileCard from './JobFileCard';
import FileDropzone from '../FileDropzone';
import { InvoiceList } from './invoice';
import { TaskList } from './task';
import JobCustomerInfo from './JobCustomerInfo';
import { useTheme } from '@mui/material/styles';

interface JobDetailProps {
  job: Job;
}

const JobDetail: FC<JobDetailProps> = (props) => {
  const { job, ...other } = props;
  const { colors } = useSelector((state) => state.account);
  const theme = useTheme();

  return (
    <Grid
      container
      spacing={3}
      {...other}
    >
      <Grid
        item
        lg={8}
        xl={9}
        xs={12}
        order={{ xs: 3, md: 3 }}
      >
        <JobBrief
          job={job}
        />
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <FileDropzone />
            </CardContent>
          </Card>
          <Grid
            container
            spacing={2}
            sx={{
              mt: 1,
            }}
          >
            {job?.photos?.map((photo) => (
              <Grid
                item
                md={3}
                xs={4}
                key={photo.id}
              >
                <JobFileCard
                  mimeType="image/png"
                  name={photo.label}
                  size={224}
                  url={photo.medium_url}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Card
          sx={{
            mt: 3
          }}
        >
          <CardHeader title="Job notes" />
          <Divider />
          <CardContent>
            <Box
              sx={{
                display: 'flex'
              }}
            >
              <TextField
                fullWidth
                label="Color"
                name="colorcode_id"
                select
                value={job.colorcode_id}
                variant="outlined"
              >
                {colors.map((color) => (
                  <MenuItem
                    key={color.id}
                    value={color.id}
                    selected={job.colorcode_id === color.id}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Box
                        width={21}
                        height={21}
                        bgcolor={color.color_code}
                      />
                      <Typography
                        color="textSecondary"
                        variant="body1"
                        sx={{
                          ml: 2
                        }}
                      >
                        {color.color_desc ? color.color_desc : 'No label'}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              {job.colorcode_id && (
                <Box
                  sx={{
                    pl: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconButton>
                    <XIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
            <Box
              mt={2}
            >
              <TextField
                fullWidth
                label="Job notes"
                name="job_notes"
                value={job.job_notes}
                multiline
                rows={2}
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader title="Tasks" />
            <Divider />
            <CardContent>
              <TaskList tasks={job.tasks} />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader title="Invoice" />
            <Divider />
            <CardContent>
              <InvoiceList invoices={job.invoices} />
            </CardContent>
          </Card>
        </Box>
      </Grid>
      <Grid
        item
        lg={4}
        xl={3}
        xs={12}
        order={{ xs: 2, md: 3, lg: 3 }}
      >
        <JobCustomerInfo
          sx={{
            position: 'sticky',
            top: theme.spacing(3),
            minWidth: '275',
          }}
          job={job}
        />
      </Grid>
    </Grid>
  );
};

JobDetail.propTypes = {
  // @ts-ignore
  job: PropTypes.object.isRequired
};

export default JobDetail;
