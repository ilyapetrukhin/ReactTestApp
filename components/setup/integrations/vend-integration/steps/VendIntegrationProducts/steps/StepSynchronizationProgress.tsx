import React, { FC, memo } from 'react';
import { useSelector } from 'src/store';
import SynchronizationProgressCard from '../../../components/SynchronizationProgressCard';

interface StepSynchronizationProgressProps {}

const StepSynchronizationProgress: FC<StepSynchronizationProgressProps> = memo(() => {
  const { synchronizationTotalQueuedCount, synchronizationProcessedCount } = useSelector((state) => state.vendIntegrationSyncProducts);

  return (
    <SynchronizationProgressCard
      totalCount={synchronizationTotalQueuedCount}
      processedCount={synchronizationProcessedCount}
      entityName="products"
    />
  );
});

export default StepSynchronizationProgress;
