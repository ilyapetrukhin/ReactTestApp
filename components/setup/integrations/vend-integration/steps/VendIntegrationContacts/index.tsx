import React, { FC, memo, useEffect, useRef } from 'react';

import { Box } from '@mui/material';

import getScrollParent from 'src/utils/getScrollParent';
import { nextStep } from 'src/slices/vendIntegration';
import {
  initialize,
  VendIntegrationSyncContactsStep,
} from 'src/slices/vendIntegrationSyncContacts';
import { useDispatch, useSelector } from 'src/store';

import StepMatchContactsSelection from './steps/StepMatchContactsSelection';
import StepMatchingProgress from './steps/StepMatchingProgress';
import StepSynchronizationProgress from './steps/StepSynchronizationProgress';
import StepUnmatchedPooltrackrContacts from './steps/StepUnmatchedPooltrackrContacts';
import StepUnmatchedVendContacts from './steps/StepUnmatchedVendContacts';

interface VendIntegrationContactsProps {}

const VendIntegrationContacts: FC<VendIntegrationContactsProps> = memo(() => {
  const dispatch = useDispatch();
  const rootRef = useRef<HTMLElement>();

  const { organisation } = useSelector((state) => state.account);
  const {
    currentStep,
    currentContactsPage,
    unmatchedVendContactsPage,
    unmatchedPtContactsPage,
    isSynced,
  } = useSelector((state) => state.vendIntegrationSyncContacts);

  useEffect(() => {
    dispatch(initialize(organisation));
  }, [organisation.id]);

  useEffect(() => {
    const scrollNode = getScrollParent(rootRef.current);
    scrollNode?.scrollTo(0, 0);
  }, [currentContactsPage, unmatchedVendContactsPage, unmatchedPtContactsPage]);

  useEffect(() => {
    if (isSynced) {
      dispatch(nextStep());
    }
  }, [isSynced]);

  return (
    <Box ref={rootRef}>
      {currentStep === VendIntegrationSyncContactsStep.matchingContactsProgress && (
        <StepMatchingProgress />
      )}
      {currentStep
        === VendIntegrationSyncContactsStep.matchingContactsSelection && (
        <StepMatchContactsSelection />
      )}
      {currentStep
        === VendIntegrationSyncContactsStep.unmatchedVendContacts && (
        <StepUnmatchedVendContacts />
      )}
      {currentStep
        === VendIntegrationSyncContactsStep.unmatchedPtContacts && (
        <StepUnmatchedPooltrackrContacts />
      )}
      {currentStep
        === VendIntegrationSyncContactsStep.synchronizingProgress && (
        <StepSynchronizationProgress />
      )}
    </Box>
  );
});

VendIntegrationContacts.propTypes = {};

export default VendIntegrationContacts;
