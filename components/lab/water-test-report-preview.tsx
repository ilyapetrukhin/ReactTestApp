import { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import Logo from 'src/components/Logo';
import { Scrollbar } from 'src/components/scrollbar';
import type { LabJob } from "src/types/labJob";
import React from "react";

interface WaterTestReportPreviewProps {
  labJob: LabJob;
}

const WaterTestReportPreview: FC<WaterTestReportPreviewProps> = (props) => {
  const { labJob, ...other } = props;

  return (
    <Paper {...other}>

      <Scrollbar>
        <Box
          sx={{
            p: 3
          }}
        >
          {/* // TODO: implement PDF viewer and use labJob.pdf_location path */}
          <Grid
            container
            justifyContent="space-between"
          >
            <Grid item>
              <Typography
                color="primary"
                variant="h3"
                fontWeight="bold"
              >
                Water Analysis
              </Typography>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Wednesday 4 August 20201 | 3:34pm
              </Typography>
            </Grid>
            <Grid item>
              <Logo
                sx={{
                  display: 'flex',
                  width: 300,
                  '& img': {
                    width: '100%'
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Scrollbar>
    </Paper>
  );
};

WaterTestReportPreview.propTypes = {
  // @ts-ignore
  labJob: PropTypes.object.isRequired
};

export default WaterTestReportPreview;
