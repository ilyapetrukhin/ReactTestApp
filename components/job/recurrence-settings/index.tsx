import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { RRule, Weekday } from 'rrule';
import {
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  Grid,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import CustomRecurrenceSettings from './CustomRecurrenceSettings';

interface RecurrenceSettingsProps {
  date: Date;
  onChange: (rRule?: RRule) => void;
}

interface RecurrenceType {
  rRule: RRule;
  text: string;
}

const CUSTOM_RRULE_VALUE = 'CUSTOM';

const RecurrenceSettings: FC<RecurrenceSettingsProps> = memo(
  ({ date, onChange }) => {
    const [isCustom, setIsCustom] = useState(false);
    const [customRRule, setCustomRrule] = useState<RRule | null>(null);

    const dayOfWeek = useMemo(() => date.getDay() - 1, [date]);
    const weekdayName = useMemo(() => format(date, 'EEEE'), [date]);

    const recurrenceTypes = useMemo<RecurrenceType[]>(() => [
      {
        text: `${weekdayName} - weekly`,
        rRule: new RRule({
          freq: RRule.WEEKLY,
          interval: 1,
          byweekday: new Weekday(dayOfWeek),
          wkst: 0,
        }),
      },
      {
        text: `${weekdayName} - fortnightly`,
        rRule: new RRule({
          freq: RRule.WEEKLY,
          interval: 2,
          byweekday: new Weekday(dayOfWeek),
          wkst: 0,
        }),
      },
      {
        text: `${weekdayName} - every 4 weeks`,
        rRule: new RRule({
          freq: RRule.WEEKLY,
          interval: 4,
          byweekday: new Weekday(dayOfWeek),
        }),
      },
      {
        text: `Last ${weekdayName} of every month`,
        rRule: new RRule({
          freq: RRule.WEEKLY,
          byweekday: new Weekday(dayOfWeek, 4),
        }),
      },
    ], [dayOfWeek, weekdayName]);

    const [selectedRRType, setSelectedRRType] = useState<RecurrenceType>(recurrenceTypes[0]);

    const handleRecurrenceOptionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, rruleText: string) => {
      if (rruleText === CUSTOM_RRULE_VALUE) {
        setIsCustom(true);
        setSelectedRRType(null);
        return;
      }

      const selectedType = recurrenceTypes.find((type) => type.text === rruleText);
      setSelectedRRType(selectedType);
      setIsCustom(false);
    }, [recurrenceTypes]);

    const currentRrule = useMemo<RRule | null>(() => {
      if (isCustom && customRRule != null) {
        return customRRule;
      }

      if (selectedRRType == null) {
        return null;
      }

      return selectedRRType.rRule;
    }, [selectedRRType, customRRule, isCustom]);

    useEffect(() => {
      onChange(currentRrule);
    }, [currentRrule]);

    return (
      <Grid
        container
        alignItems="stretch"
        spacing={3}
      >
        <Grid
          item
          md={5}
          xs={12}
        >
          <FormControl>
            <RadioGroup
              value={isCustom ? CUSTOM_RRULE_VALUE : selectedRRType?.text}
              onChange={handleRecurrenceOptionChange}
            >
              {recurrenceTypes.map((type) => (
                <FormControlLabel
                  key={type.text}
                  value={type.text}
                  control={<Radio />}
                  label={type.text}
                />
              ))}
              <FormControlLabel
                value={CUSTOM_RRULE_VALUE}
                control={<Radio />}
                label="Custom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        {
            isCustom && (
              <>
                <Grid
                  item
                  xs={1}
                  display="flex"
                  justifyContent="center"
                >
                  <Divider
                    orientation="vertical"
                    flexItem
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                  spacing={3}
                >
                  <CustomRecurrenceSettings
                    date={date}
                    onChange={setCustomRrule}
                  />
                </Grid>

              </>
            )
          }
      </Grid>
    );
  }
);

export default RecurrenceSettings;

RecurrenceSettings.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};
