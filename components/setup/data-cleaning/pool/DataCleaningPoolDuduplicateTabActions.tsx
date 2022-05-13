import React, { FC, memo, useCallback, useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';

import { useSelector } from 'src/store';
import useLoadDuplications from './hooks/loadDuplications';

interface DataCleaningContactDuduplicateActionsProps {}

const DataCleaningContactDuduplicateActions: FC<DataCleaningContactDuduplicateActionsProps> = memo(() => {
  const { switchers } = useSelector((state) => state.deduplicatePoolTool);
  const [checkDuplicationsDisabled, setCheckDuplicationsDisabled] = useState(false);
  const loadDuplications = useLoadDuplications();

  const handleLoadDuplications = useCallback(() => {
    loadDuplications();
    setCheckDuplicationsDisabled(true);
  }, [
    loadDuplications,
  ]);

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
          variant="contained"
          sx={{ textTransform: 'uppercase' }}
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
