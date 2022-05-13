import { useState } from 'react';
import type { FC } from 'react';
// import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ProjectDescriptionForm from './ProjectDescriptionForm';
import JobContactForm from './JobContactForm';
import JobTypeForm from './JobTypeForm';

const JobCreateWizard: FC = (props) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = (): void => {
    setCompleted(true);
  };

  return (
    <div {...props}>
      {
        !completed
          ? (
            <>
              {activeStep === 0 && (
                <JobTypeForm onNext={handleNext} />
              )}
              {activeStep === 1 && (
                <JobContactForm
                  onBack={handleBack}
                  onNext={handleNext}
                />
              )}
              {activeStep === 3 && (
                <ProjectDescriptionForm
                  onBack={handleBack}
                  onComplete={handleComplete}
                />
              )}
            </>
          )
          : (
            <Card>
              <CardContent>
                <Box
                  sx={{
                    maxWidth: 450,
                    mx: 'auto'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText'
                      }}
                    >
                      <StarIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      align="center"
                      color="textPrimary"
                      variant="h3"
                    >
                      You are all done!
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      align="center"
                      color="textSecondary"
                      variant="subtitle1"
                    >
                      Donec ut augue sed nisi ullamcorper posuere
                      sit amet eu mauris. Ut eget mauris scelerisque.
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 2
                    }}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                    >
                      View project
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )
      }
    </div>
  );
};

export default JobCreateWizard;
