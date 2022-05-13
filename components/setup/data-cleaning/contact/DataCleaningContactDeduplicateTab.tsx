import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import {
  Card,
  CardHeader,
  Dialog,
  Divider,
  LinearProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { getDuplications } from 'src/slices/deduplicateContactTool';
import { closeAutomateModal } from 'src/slices/deduplicateContactToolAutomatic';
import { useDispatch, useSelector } from 'src/store';

import AutomaticDeduplicationDialogue from './AutomaticDeduplicationDialogue';
import AutomaticDeduplicationModalSuccess from './AutomaticDeduplicationModalSuccess';
import DataCleaningContactDeduplicateTabGroups from './DataCleaningContactDeduplicateTabGroups';
import DataCleaningContactDeduplicateTabPagination from './DataCleaningContactDeduplicateTabPagination';
import DataCleaningContactDeduplicateTabSwitchers from './DataCleaningContactDeduplicateTabSwitchers';
import DataCleaningContactDuduplicateTabActions from './DataCleaningContactDuduplicateTabActions';

function usePaginatedDuplicationGroupKeys(): string[] {
  const { duplicates, pageLimit, currentPage, searchQuery } = useSelector(
    (state) => state.deduplicateContactTool
  );

  const searchQueryLowerCased = useMemo(
    () => searchQuery.toLocaleLowerCase().trim(),
    [searchQuery]
  );
  const groupKeys = useMemo(
    () => Object.keys(duplicates).filter((key) => key.toLowerCase().includes(searchQueryLowerCased)),
    [duplicates, searchQueryLowerCased]
  );
  const startIndex = pageLimit * currentPage;
  const endIndex = startIndex + pageLimit;

  return groupKeys.slice(startIndex, endIndex);
}

interface DataCleaningContactTabProps {}

const DataCleaningContactTab: FC<DataCleaningContactTabProps> = memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const nonDesktopDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const { switchers, isLoadingDuplications, duplicates, duplicatesCount } = useSelector((state) => state.deduplicateContactTool);
  const { isAutomateModalOpen } = useSelector(
    (state) => state.deduplicateContactToolAutomatic
  );

  const groupKeys = usePaginatedDuplicationGroupKeys();

  const duplicatesCountText = useMemo(() => {
    if (isLoadingDuplications) {
      return 'Loading...';
    }

    if (duplicatesCount === 0) {
      return 'No duplicates';
    }

    if (duplicatesCount === 1) {
      return '1 duplicate found';
    }

    return `${duplicatesCount} duplicates found`;
  }, [duplicatesCount, isLoadingDuplications]);

  const handleAutomateModalClose = useCallback(() => {
    dispatch(closeAutomateModal());
  }, []);

  // Load duplications for the first time
  useEffect(() => {
    dispatch(getDuplications(organisationId, switchers));
  }, []);

  return (
    <>
      <DataCleaningContactDeduplicateTabSwitchers />
      <DataCleaningContactDuduplicateTabActions />
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
          <DataCleaningContactDeduplicateTabGroups
            key={groupKey}
            groupKey={groupKey}
            size={duplicates[groupKey].contactDuplications.length}
          />
        ))}
      </Card>
      <DataCleaningContactDeduplicateTabPagination />
      <Dialog
        fullWidth
        fullScreen={nonDesktopDevice}
        maxWidth="md"
        onClose={handleAutomateModalClose}
        open={isAutomateModalOpen}
      >
        <AutomaticDeduplicationDialogue />
      </Dialog>
      <AutomaticDeduplicationModalSuccess />
    </>
  );
});

DataCleaningContactTab.propTypes = {};

export default DataCleaningContactTab;
