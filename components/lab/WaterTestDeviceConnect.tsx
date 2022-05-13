import type { FC } from 'react';
import React from 'react';
import {
  Card,
  CardHeader,
  Theme,
} from '@mui/material';
import { SxProps } from '@mui/system';
import type { Pool } from '../../types/pool';
import PropTypes from 'prop-types';

interface WaterTestDeviceConnectProps {
  pool: Pool;
  sx?: SxProps<Theme>;
}

const WaterTestDeviceConnect: FC<WaterTestDeviceConnectProps> = (props) => {
  const { pool, ...rest } = props;

  return (
    <Card {...rest}>
      <CardHeader title="Connected device" />
    </Card>
  );
};

WaterTestDeviceConnect.propTypes = {
  // @ts-ignore
  pool: PropTypes.object.isRequired,
  sx: PropTypes.object
};

export default WaterTestDeviceConnect;
