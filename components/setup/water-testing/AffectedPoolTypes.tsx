import type { FC } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import filter from 'lodash/filter';
import {
  FormControlLabel,
  Grid,
  Switch,
  Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import type { PoolType } from 'src/types/chemical';
import { POOL_LABEL, POOL_TYPE, SPA_LABEL, SPA_TYPE, SWIM_SPA_LABEL, SWIM_SPA_TYPE } from 'src/constants/pool';
import { ChangeEvent, useEffect, useState } from 'react';

interface AffectedPoolTypesProps {
  poolTypes: PoolType[] | [];
  sx?: SxProps<Theme>;
  onUpdate?: (poolTypes: PoolType[] | []) => void;
}

interface PoolTypeOption {
  id: number;
  name: string;
  enabled: boolean;
}

const poolTypesDefaultOptions: PoolTypeOption[] = [
  {
    id: POOL_TYPE,
    name: POOL_LABEL,
    enabled: false
  },
  {
    id: SPA_TYPE,
    name: SPA_LABEL,
    enabled: false
  },
  {
    id: SWIM_SPA_TYPE,
    name: SWIM_SPA_LABEL,
    enabled: false
  },
];

const AffectedPoolTypesRoot = styled('div')();

const AffectedPoolTypes: FC<AffectedPoolTypesProps> = (props) => {
  const { poolTypes, onUpdate, ...other } = props;
  const [poolTypeOptions, setPoolTypeOptions] = useState<PoolTypeOption[] | []>([]);

  useEffect(() => {
    const options = poolTypesDefaultOptions.map((poolTypeOption) => ({
      ...poolTypeOption,
      enabled: Boolean(find(poolTypes, { id: poolTypeOption.id }))
    }));
    setPoolTypeOptions(options);
  }, [poolTypes]);

  const handleOptionChange = (poolTypeOption: PoolTypeOption, event: ChangeEvent<HTMLInputElement>): void => {
    const options = poolTypeOptions.map((_poolTypeOption) => ({
      ..._poolTypeOption,
      enabled: _poolTypeOption.id === poolTypeOption.id ? event.target.checked : _poolTypeOption.enabled
    }));
    setPoolTypeOptions(options);
    if (onUpdate) {
      const enabledPoolTypes = filter(options, { enabled: true });
      onUpdate(
        enabledPoolTypes.length
          ? enabledPoolTypes.map((optionType) => ({ id: optionType.id, name: optionType.name }))
          : []
      );
    }
  };

  return (
    <AffectedPoolTypesRoot {...other}>
      <Grid
        container
      >
        {poolTypeOptions.map((poolTypeOption) => (
          <Grid
            item
            md={12}
            sm={4}
            xs={12}
          >
            <FormControlLabel
              control={(
                <Switch
                  checked={poolTypeOption.enabled}
                  color="primary"
                  edge="start"
                  key={poolTypeOption.id}
                  name={poolTypeOption.name}
                  onChange={(event) => handleOptionChange(poolTypeOption, event)}
                />
              )}
              label={poolTypeOption.name}
            />
          </Grid>
        ))}
      </Grid>
    </AffectedPoolTypesRoot>
  );
};

AffectedPoolTypes.propTypes = {
  // @ts-ignore
  poolTypes: PropTypes.array.isRequired,
  sx: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default AffectedPoolTypes;
