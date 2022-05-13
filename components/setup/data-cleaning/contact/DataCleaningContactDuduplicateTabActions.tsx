import React, { FC, memo, useCallback, useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';

import { useDispatch, useSelector } from 'src/store';
import { getDuplications } from 'src/slices/deduplicateContactTool';
import { openAutomateModal } from 'src/slices/deduplicateContactToolAutomatic';

interface DataCleaningContactDuduplicateActionsProps {}

const DataCleaningContactDuduplicateActions: FC<DataCleaningContactDuduplicateActionsProps> = memo(() => {
  const dispatch = useDispatch();
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const { switchers } = useSelector(
    (state) => state.deduplicateContactTool
  );
  const [checkDuplicationsDisabled, setCheckDuplicationsDisabled] = useState(false);

  const handleLoadDuplications = useCallback(() => {
    dispatch(getDuplications(organisationId, switchers));
    setCheckDuplicationsDisabled(true);
  }, [organisationId, switchers]);

  const handleAutomateDeduplication = useCallback(() => {
    dispatch(openAutomateModal());
  }, []);

  useEffect(() => setCheckDuplicationsDisabled(false), [switchers]);

  return (
    <Grid
      container
      spacing={3}
      mt={2}
      mb={4}
    >
      <Grid
        item
        display="flex"
        justifyContent="center"
        alignItems="center"
        sm={12}
      >
        <Button
          color="primary"
          type="button"
          variant="outlined"
          sx={{ textTransform: 'uppercase' }}
          onClick={handleAutomateDeduplication}
        >
          Automatic de-duplication
        </Button>
        <Button
          color="primary"
          type="button"
          variant="contained"
          sx={{ textTransform: 'uppercase', ml: 3 }}
          disabled={checkDuplicationsDisabled}
          onClick={handleLoadDuplications}
        >
          Check duplicates
        </Button>
      </Grid>
    </Grid>
  );
});

DataCleaningContactDuduplicateActions.propTypes = {};

export default DataCleaningContactDuduplicateActions;
