import React, { useEffect, useMemo, ChangeEvent } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
} from '@mui/material';
import { useSelector } from 'src/store';
import {
  CLASSIFICATION_TYPE,
  CUSTOM_TYPE,
  GROUND_LEVEL_TYPE,
  HIGH_TEMPERATURE,
  LOCATION_TYPE,
  LOW_TEMPERATURE,
  POOL_TYPE,
  SANITISER_TYPE,
  SURFACE_TYPE
} from 'src/constants/chemical';

interface SelectExceptionTypeProps {
  exceptionName: string;
  exceptionTypeId: number | string;
  onUpdate?: (selectedOption: ExceptionOption) => void;
}

interface ExceptionOption {
  value: string | number;
  label: string;
}

const SelectExceptionType: FC<SelectExceptionTypeProps> = (props) => {
  const {
    exceptionName,
    exceptionTypeId,
    onUpdate
  } = props;

  const {
    poolSanitisers,
    surfaceTypes,
    poolTypes,
    locations,
    groundLevels,
    classifications,
    customExceptions,
  } = useSelector((state) => state.poolSpecifications);

  const exceptionOptions = useMemo(() : ExceptionOption[] => {
    let result: ExceptionOption[] = [
      {
        label: LOW_TEMPERATURE,
        value: 1
      },
      {
        label: HIGH_TEMPERATURE,
        value: 2
      }
    ];

    switch (exceptionName) {
      case CLASSIFICATION_TYPE:
        result = classifications.map((classification) => ({ label: classification.name, value: classification.id }));
        break;
      case SURFACE_TYPE:
        result = surfaceTypes.map((surfaceType) => ({ label: surfaceType.name, value: surfaceType.id }));
        break;
      case SANITISER_TYPE:
        result = poolSanitisers.map((poolSanitiser) => ({ label: poolSanitiser.name, value: poolSanitiser.id }));
        break;
      case GROUND_LEVEL_TYPE:
        result = groundLevels.map((groundLevel) => ({ label: groundLevel.name, value: groundLevel.id }));
        break;
      case POOL_TYPE:
        result = poolTypes.map((poolType) => ({ label: poolType.name, value: poolType.id }));
        break;
      case LOCATION_TYPE:
        result = locations.map((location) => ({ label: location.name, value: location.id }));
        break;
      case CUSTOM_TYPE:
        result = customExceptions.map((customException) => ({ label: customException.name, value: customException.id }));
        break;
      default:
    }
    return result;
  }, [exceptionName]);

  useEffect(() => {
    onUpdate(exceptionOptions[0]);
  }, [exceptionOptions]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const selectedOption = exceptionOptions.find((option) => parseInt(event.target.value, 10) === option.value);
    onUpdate(selectedOption);
  };

  return (
    <TextField
      fullWidth
      name="exception_type"
      onChange={handleChange}
      size="small"
      select
      required
      SelectProps={{ native: true }}
      value={exceptionTypeId}
      variant="outlined"
    >
      {exceptionOptions.map((exceptionType) => (
        <option
          key={exceptionType.value}
          value={exceptionType.value}
        >
          {exceptionType.label}
        </option>
      ))}
    </TextField>
  );
};

SelectExceptionType.propTypes = {
  exceptionName: PropTypes.string.isRequired,
  exceptionTypeId: PropTypes.number.isRequired,
  onUpdate: PropTypes.func,
};

export default SelectExceptionType;
