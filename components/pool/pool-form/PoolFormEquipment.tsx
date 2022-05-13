import React, { FC, memo } from 'react';
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';

import { useSelector } from 'src/store';
import PoolFormEquipmentTable from './PoolFormEquipmentTable';
import PoolFormEquipmentActions from './PooFormEquipmentActions';

interface PoolFormEquipmentProps {}

const PoolFormEquipment: FC<PoolFormEquipmentProps> = memo(() => {
  const { pool } = useSelector((state) => state.poolDetail);
  const isCreating = pool == null;

  return (
    <Card>
      <CardHeader title="Equipment" />
      <Divider />
      <CardContent>
        <Typography
          color="textPrimary"
          variant="subtitle2"
        >
          {isCreating && (
            <Alert severity="info">
              Please save pool first to add an equipment
            </Alert>
          )}
          {!isCreating && (
            <>
              <PoolFormEquipmentTable />
              <PoolFormEquipmentActions />
            </>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
});

PoolFormEquipment.propTypes = {};

export default PoolFormEquipment;
