import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';

import Step from '@mui/material/Step';
import { alpha, styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import IntegrationIcon from 'src/icons/Integrations';
import ContactIcon from 'src/icons/Contact';
import ProductIcon from 'src/icons/Product';
import CheckIcon from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';

interface VendStepperProps {
  steps: string[];
  activeStep: number;
}

const StepperConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        `linear-gradient( 95deg,${alpha(theme.palette.primary.main, 0.3)} 0%,${alpha(theme.palette.primary.main, 0.6)} 50%,${theme.palette.primary.main} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const StepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      `linear-gradient( 95deg,${alpha(theme.palette.primary.main, 0.3)} 0%,${alpha(theme.palette.primary.main, 0.6)} 50%,${theme.palette.primary.main} 100%)`,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      `linear-gradient( 95deg,${alpha(theme.palette.primary.main, 0.3)} 0%,${alpha(theme.palette.primary.main, 0.6)} 50%,${theme.palette.primary.main} 100%)`,
  }),
}));

function StepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <IntegrationIcon />,
    2: <ContactIcon />,
    3: <ProductIcon />,
    4: <CheckIcon />,
  };

  return (
    <StepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(icon)]}
    </StepIconRoot>
  );
}

const VendStepper: FC<VendStepperProps> = memo(({ steps, activeStep }) => (
  <Stack
    sx={{ width: '100%' }}
    spacing={3}
  >
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<StepperConnector />}
    >
      {steps.map((label, index) => (
        <Step
          key={label}
          disabled={index + 1 > activeStep}
        >
          <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  </Stack>
));

VendStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeStep: PropTypes.number.isRequired,
};

export default VendStepper;
