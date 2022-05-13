import React, { FC, memo, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { closeAutomateModal, runAutoMerge, updateDuplicationSwitcher } from 'src/slices/deduplicateContactToolAutomatic';
import { useDispatch, useSelector } from 'src/store';
import { DuplicationSwitcher } from 'src/types/deduplicateContactTool';
import { getDuplications } from 'src/slices/deduplicateContactTool';

interface AutomaticDeduplicationDialogueProps {}

const duplicationSwitchers: { [name: string]: DuplicationSwitcher } = {
  'Contact name': DuplicationSwitcher.contactName,
  Email: DuplicationSwitcher.email,
  'Address street one': DuplicationSwitcher.addressStreetOne,
  'Address city': DuplicationSwitcher.addressCity,
  'Address postcode': DuplicationSwitcher.addressPostCode,
  'First name': DuplicationSwitcher.fistName,
  'Last name': DuplicationSwitcher.lastName,
  'Has one pool': DuplicationSwitcher.hasOnePool,
};

interface SwitchHandler {
  title: string;
  value: boolean;
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function useSwitchHandlers(): SwitchHandler[] {
  const dispatch = useDispatch();
  const { switchers } = useSelector((state) => state.deduplicateContactToolAutomatic);

  const handlers: SwitchHandler[] = useMemo(
    () => Object.entries(duplicationSwitchers).map(([title, switcher]) => {
      const value = switchers.includes(switcher);
      const handler = (event) => {
        dispatch(
          updateDuplicationSwitcher({
            switcher,
            checked: event.target.checked,
          })
        );
      };

      return {
        title,
        value,
        handler,
      };
    }),
    [switchers]
  );

  return handlers;
}

const AutomaticDeduplicationDialogue: FC<AutomaticDeduplicationDialogueProps> = memo(() => {
  const dispatch = useDispatch();
  const handlers = useSwitchHandlers();
  const { switchers, isSubmitting } = useSelector(
    (state) => state.deduplicateContactToolAutomatic
  );
  const deduplicateManuallySwitchers = useSelector((state) => state.deduplicateContactTool.switchers);
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );

  const handleClose = useCallback(() => {
    dispatch(closeAutomateModal());
  }, []);

  const handleMerge = useCallback(async () => {
    dispatch(closeAutomateModal());
    await dispatch(runAutoMerge(organisationId, switchers));
    await dispatch(getDuplications(organisationId, deduplicateManuallySwitchers));
  }, [organisationId, deduplicateManuallySwitchers, switchers]);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Automatic de-duplication" />
      <CardContent>
        <Typography
          color="textPrimary"
          variant="body1"
        >
          This will automatically merge duplicates. If all of the selected
          fields match, the system will assume it is a duplicate and merge the
          contacts together. We recommend you select at least 2 fields.
        </Typography>
        <Grid
          container
          mt={2}
        >
          {handlers.map((h) => (
            <Grid
              item
              key={h.title}
              xs={6}
              sm={4}
              md={3}
            >
              <FormControlLabel
                disabled={h.value && switchers.length === 1}
                control={(
                  <Switch
                    color="secondary"
                    edge="start"
                    onChange={h.handler}
                    checked={h.value}
                  />
                  )}
                label={h.title}
              />
            </Grid>
          ))}
        </Grid>
        <Box
          display="flex"
          justifyContent="flex-end"
          mt={2}
        >
          <Button
            color="primary"
            type="button"
            variant="text"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <LoadingButton
            color="primary"
            sx={{ ml: 2 }}
            type="button"
            variant="contained"
            loading={isSubmitting}
            onClick={handleMerge}
          >
            Run auto merge procedure
          </LoadingButton>
        </Box>
      </CardContent>
    </Card>
  );
});

AutomaticDeduplicationDialogue.propTypes = {};

export default AutomaticDeduplicationDialogue;
