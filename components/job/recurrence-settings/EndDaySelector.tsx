/* eslint-disable react/prop-types */
import React, {
  FC,
  memo,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Radio,
  TextField,
  Box,
  SelectChangeEvent
} from '@mui/material';
import MobileDatePicker from '@mui/lab/MobileDatePicker';

import UnitSelector from './UnitSelector';

interface EndDaySelectorProps {
  initialEndDayType: EndDayType;
  endTypes: EndDayType[];
  date: Date;
  onChange: (settings: EndDaySettings) => void;
}

export interface EndDaySettings {
  endType: EndDayType;
  occurrences: number;
  date: Date;
}

export enum EndDayType {
  neverEnd = 0,
  afterOccurrences = 1,
  endDate = 2,
}

interface HandleOccurrencesHook {
  occurrences: number[];
  selectedOccurrence: number;
  handleChangeOccurrence: (
    event: SelectChangeEvent
  ) => void;
}

interface HandleEndDayTypeHook {
  selectedEndDayType: EndDayType;
  handleEndDayTypeChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    newType: string
  ) => void;
}

interface HandleDayHook {
  selectedDate: Date;
  handleDateChange: (date: Date) => void;
}

const mapEndDayTypeToText = {
  [EndDayType.afterOccurrences]: 'No. of occurrences',
  [EndDayType.endDate]: 'End date',
  [EndDayType.neverEnd]: 'Never end',
};

function useHandleOccurrences(): HandleOccurrencesHook {
  const occurrences = useMemo<number[]>(
    () => new Array(30).fill(null).map((_, i: number) => i + 1),
    []
  );
  const [selectedOccurrence, setSelectedOccurrence] = useState(occurrences[0]);
  const handleChangeOccurrence = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      setSelectedOccurrence(parseInt(event.target.value, 10));
    },
    []
  );

  return {
    occurrences,
    selectedOccurrence,
    handleChangeOccurrence,
  };
}

function useHandleEndDayTypes(initialEndDayType: EndDayType): HandleEndDayTypeHook {
  const [selectedEndDayType, setSelectedEndDayType] = useState<EndDayType>(initialEndDayType);
  const handleEndDayTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, newType: string) => {
      setSelectedEndDayType(parseInt(newType, 10) as EndDayType);
    },
    []
  );

  return {
    selectedEndDayType,
    handleEndDayTypeChange,
  };
}

function useHandleDate(initialDate: Date): HandleDayHook {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return {
    selectedDate,
    handleDateChange,
  };
}

const EndDaySelector: FC<EndDaySelectorProps> = memo(
  ({ endTypes, initialEndDayType, date, onChange }) => {
    const { occurrences, selectedOccurrence, handleChangeOccurrence } = useHandleOccurrences();
    const { handleEndDayTypeChange, selectedEndDayType } = useHandleEndDayTypes(initialEndDayType);
    const { selectedDate, handleDateChange } = useHandleDate(date);

    useEffect(() => {
      onChange({
        endType: selectedEndDayType,
        date: selectedDate,
        occurrences: selectedOccurrence,
      });
    }, [onChange, selectedEndDayType, selectedDate, selectedOccurrence]);

    return (
      <>
        <div>
          <FormControl>
            <FormLabel>End</FormLabel>
            <RadioGroup
              value={selectedEndDayType}
              onChange={handleEndDayTypeChange}
            >
              {endTypes.map((t) => (
                <FormControlLabel
                  key={t}
                  value={t}
                  control={<Radio />}
                  label={mapEndDayTypeToText[t]}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
        {selectedEndDayType === EndDayType.afterOccurrences && (
          <div>
            <UnitSelector
              prefix="Repeat after"
              suffix={selectedOccurrence === 1 ? 'occurrence' : 'occurrences'}
              values={occurrences}
              value={selectedOccurrence}
              onChange={handleChangeOccurrence}
            />
          </div>
        )}
        {selectedEndDayType === EndDayType.endDate && (
          <Box
            mt={1}
          >
            <MobileDatePicker
              label="End date"
              renderInput={(props) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  {...props}
                />
              )}
              disableCloseOnSelect={false}
              showToolbar={false}
              disableMaskedInput
              inputFormat="yyyy-MM-dd"
              minDate={date}
              onChange={handleDateChange}
              value={selectedDate}
            />
          </Box>
        )}
      </>
    );
  }
);

export default EndDaySelector;
