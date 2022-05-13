import React, { ChangeEvent, FC, memo, useMemo } from 'react';
import {
  FormControlLabel,
  Grid,
  Switch,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Typography,
} from '@mui/material';

import { updateDuplicationSwitcher } from 'src/slices/deduplicatePool';
import { useDispatch, useSelector } from 'src/store';
import { DuplicationPoolSwitcher } from 'src/types/deduplicatePoolTool';

interface DataCleaningPoolDeduplicateSwitchersProps {}

const duplicationSwitchers: { [name: string]: DuplicationPoolSwitcher } = {
  'Linked contact': DuplicationPoolSwitcher.linkedContact,
  Address: DuplicationPoolSwitcher.address,
  'Pool Type': DuplicationPoolSwitcher.poolType,
  Surface: DuplicationPoolSwitcher.surface,
  Sanitiser: DuplicationPoolSwitcher.sanitiser,
};

const allPrimarySwitchers = [DuplicationPoolSwitcher.linkedContact, DuplicationPoolSwitcher.address];

interface SwitchHandler {
  title: string;
  value: boolean;
  switcher: DuplicationPoolSwitcher;
  handler: (event: ChangeEvent<HTMLInputElement>) => void;
}

function useSwitchHandlers(): SwitchHandler[] {
  const dispatch = useDispatch();
  const { switchers } = useSelector((state) => state.deduplicatePoolTool);

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
        switcher,
        handler,
      };
    }),
    [switchers]
  );

  return handlers;
}

const DataCleaningPoolDeduplicateSwitchers: FC<DataCleaningPoolDeduplicateSwitchersProps> = memo(() => {
  const handlers = useSwitchHandlers();
  const { switchers } = useSelector((state) => state.deduplicatePoolTool);
  const enabledPrimarySwitchers = useMemo(() => switchers.filter((switcher) => allPrimarySwitchers.includes(switcher)), [switchers]);
  const disableEnabledPrimarySwitchers = useMemo(() => enabledPrimarySwitchers.length === 1, [enabledPrimarySwitchers]);

  return (
    <Card>
      <CardHeader title="Filter duplicates" />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={5}
        >
          <Grid
            item
            xs={12}
            md={3}
          >
            <Paper
              elevation={0}
              sx={{
                backgroundColor: 'background.default',
                height: '100%',
                p: 2,
              }}
            >
              <Typography
                variant="body2"
                color="textPrimary"
              >
                Select one or more atrtibutes to filter and click
                {' '}
                <Typography
                  variant="body2"
                  color="textPrimary"
                  component="span"
                  fontWeight="bold"
                  sx={{
                    color: 'info.main',
                    textTransform: 'uppercase',
                  }}
                >
                  check duplicates
                </Typography>
                {' '}
                to find duplicated entries
              </Typography>
            </Paper>
          </Grid>
          <Grid
            container
            item
            xs={12}
            md={9}
            spacing={2}
          >
            {handlers.map((h) => (
              <Grid
                item
                key={h.title}
                xs={12}
                sm={4}
                md={3}
              >
                <FormControlLabel
                  disabled={disableEnabledPrimarySwitchers && h.value && allPrimarySwitchers.includes(h.switcher)}
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
        </Grid>
      </CardContent>
    </Card>
  );
});

DataCleaningPoolDeduplicateSwitchers.propTypes = {};

export default DataCleaningPoolDeduplicateSwitchers;
