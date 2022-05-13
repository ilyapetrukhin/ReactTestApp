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

import { updateDuplicationSwitcher } from 'src/slices/deduplicateContactTool';
import { useDispatch, useSelector } from 'src/store';
import { DuplicationSwitcher } from 'src/types/deduplicateContactTool';

interface DataCleaningContactDeduplicateSwitchersProps {}

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
  handler: (event: ChangeEvent<HTMLInputElement>) => void;
}

function useSwitchHandlers(): SwitchHandler[] {
  const dispatch = useDispatch();
  const { switchers } = useSelector((state) => state.deduplicateContactTool);

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

const DataCleaningContactDeduplicateSwitchers: FC<DataCleaningContactDeduplicateSwitchersProps> = memo(() => {
  const handlers = useSwitchHandlers();
  const { switchers } = useSelector((state) => state.deduplicateContactTool);

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
        </Grid>
      </CardContent>
    </Card>
  );
});

DataCleaningContactDeduplicateSwitchers.propTypes = {};

export default DataCleaningContactDeduplicateSwitchers;
