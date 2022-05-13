import React, { FC, memo, useEffect, useMemo } from 'react';
import {
  Card,
  CardHeader,
  Divider,
  LinearProgress,
  Typography,
} from '@mui/material';
import toast from 'react-hot-toast';

import { useSelector } from 'src/store';

import DataCleaningPoolDeduplicateTabGroups from './DataCleaningPoolDeduplicateTabGroups';
import DataCleaningPoolDeduplicateTabPagination from './DataCleaningPoolDeduplicateTabPagination';
import DataCleaningPoolDeduplicateTabSwitchers from './DataCleaningPoolDeduplicateTabSwitchers';
import DataCleaningPoolDuduplicateTabActions from './DataCleaningPoolDuduplicateTabActions';
import useLoadDuplications from './hooks/loadDuplications';

function usePaginatedDuplicationGroupKeys(): string[] {
  const { duplicates, pageLimit, currentPage } = useSelector(
    (state) => state.deduplicatePoolTool
  );
  const groupKeys = Object.keys(duplicates);
  const startIndex = pageLimit * currentPage;
  const endIndex = startIndex + pageLimit;

  return groupKeys.slice(startIndex, endIndex);
}

interface DataCleaningContactTabProps {}

const DataCleaningContactTab: FC<DataCleaningContactTabProps> = memo(() => {
  const { isLoadingDuplications, duplicates, duplicatesCount, mergeError } = useSelector((state) => state.deduplicatePoolTool);

  const groupKeys = usePaginatedDuplicationGroupKeys();

  const loadDuplications = useLoadDuplications();

  const duplicatesCountText = useMemo(() => `${duplicatesCount} duplicates found`, [duplicatesCount]);

  // Load duplications for the first time
  useEffect(() => {
    loadDuplications();
  }, []);

  useEffect(() => {
    if (mergeError != null) {
      toast.error(mergeError);
    }
  }, [mergeError]);

  return (
    <>
      <DataCleaningPoolDeduplicateTabSwitchers />
      <DataCleaningPoolDuduplicateTabActions />
      <Card>
        <CardHeader
          title={(
            <Typography
              variant="body1"
              color="textPrimary"
              component="span"
              fontWeight="bold"
              sx={{
                color: 'info.main',
              }}
            >
              {duplicatesCountText}
            </Typography>
          )}
        />
        <Divider />
        {isLoadingDuplications && <LinearProgress />}
        {groupKeys.map((groupKey) => (
          <DataCleaningPoolDeduplicateTabGroups
            key={groupKey}
            groupKey={groupKey}
            size={duplicates[groupKey].poolDuplications.length}
          />
        ))}
      </Card>
      <DataCleaningPoolDeduplicateTabPagination />
    </>
  );
});

DataCleaningContactTab.propTypes = {};

export default DataCleaningContactTab;
