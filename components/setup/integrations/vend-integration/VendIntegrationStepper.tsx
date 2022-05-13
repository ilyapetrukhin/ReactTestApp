import React, { FC, memo } from 'react';

import { Box } from '@mui/material';

import Stepper from './VendStepper';
import {
  STEP_CONNECT,
  STEP_SYNC_CONTACTS,
  STEP_SYNC_PRODUCTS,
  STEP_MATCH_USERS,
} from 'src/slices/vendIntegration';
import { useSelector } from 'src/store';

import VendIntegrationConnect from './steps/VendIntegrationConnect';
import VendIntegrationContacts from './steps/VendIntegrationContacts/index';
import VendIntegrationProducts from './steps/VendIntegrationProducts/index';
import VendIntegrationMatchUsers from './steps/VendIntegrationMatchUsers/index';
import ResetIntegrationButton from './components/ResetIntegrationButton';

interface VendIntegrationStepperProps {}

const VendIntegrationStepper: FC<VendIntegrationStepperProps> = memo(() => {
  const { activeStep, steps } = useSelector(
    (state) => state.vendIntegration
  );

  return (
    <>
      {activeStep !== STEP_MATCH_USERS && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={3}
        >
          <Box
            display="flex"
            flex={1}
          >
            <Stepper
              activeStep={activeStep}
              steps={steps}
            />
          </Box>

          {activeStep !== STEP_CONNECT && (
            <Box
              display="flex"
              p={2}
            >
              <ResetIntegrationButton text="Reset connection" />
            </Box>
          )}
        </Box>
      )}

      {activeStep === STEP_CONNECT && <VendIntegrationConnect />}
      {activeStep === STEP_SYNC_CONTACTS && <VendIntegrationContacts />}
      {activeStep === STEP_SYNC_PRODUCTS && <VendIntegrationProducts />}
      {activeStep === STEP_MATCH_USERS && <VendIntegrationMatchUsers />}
    </>
  );
});

VendIntegrationStepper.propTypes = {};

export default VendIntegrationStepper;
