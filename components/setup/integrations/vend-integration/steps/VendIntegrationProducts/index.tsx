import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

import { nextStep } from 'src/slices/vendIntegration';
import {
  initialize,
  SyncProductsStep,
} from 'src/slices/vendIntegrationSyncProducts';
import { useDispatch, useSelector } from 'src/store';

import StepInfo from './steps/StepInfo';
import StepMatchProductsSelection from './steps/StepMatchProductsSelection';
import StepSynchronizationProgress from './steps/StepSynchronizationProgress';
import StepUnmatchedVend from './steps/StepUnmatchedVend';
import getScrollParent from 'src/utils/getScrollParent';
import { getOrganisation } from 'src/slices/account';

interface VendIntegrationProductsProps {}

const VendIntegrationProducts: FC<VendIntegrationProductsProps> = memo(() => {
  const dispatch = useDispatch();
  const rootRef = useRef<HTMLElement>();
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const {
    currentStep,
    currentProductsPage,
    unmatchedVendProductsPage,
    isFinished,
  } = useSelector((state) => state.vendIntegrationSyncProducts);

  const goToNextPage = useCallback(async () => {
    await dispatch(getOrganisation(organisationId));
    dispatch(nextStep());
  }, []);

  useEffect(() => {
    const scrollNode = getScrollParent(rootRef.current);
    scrollNode?.scrollTo(0, 0);
  }, [currentProductsPage, unmatchedVendProductsPage]);

  useEffect(() => {
    dispatch(initialize(organisationId));
  }, [organisationId]);

  useEffect(() => {
    if (isFinished) {
      goToNextPage();
    }
  }, [isFinished]);

  return (
    <Box ref={rootRef}>
      {currentStep === SyncProductsStep.info && <StepInfo />}
      {currentStep === SyncProductsStep.matchingSelection && (
        <StepMatchProductsSelection />
      )}
      {currentStep === SyncProductsStep.unmatchedVend && <StepUnmatchedVend />}
      {currentStep === SyncProductsStep.synchronizingProgress && (
        <StepSynchronizationProgress />
      )}
    </Box>
  );
});

export default VendIntegrationProducts;
