import React, { FC, memo, useCallback } from 'react';
import { Box, Button } from '@mui/material';
import { PlusCircle as PlusCircleIcon } from 'react-feather';
import { useRouter } from 'next/router';
import { useSelector } from 'src/store';

interface PoolFormEquipmentActionsProps {}

const PoolFormEquipmentActions: FC<PoolFormEquipmentActionsProps> = memo(() => {
  const router = useRouter();
  const { pool } = useSelector((state) => state.poolDetail);

  const handleAdd = useCallback(() => {
    router.push({
      pathname: '/equipment/[poolId]/new',
      query: { poolId: pool.id },
    });
  }, [pool.id]);

  return (
    <Box>
      <Button
        startIcon={<PlusCircleIcon />}
        onClick={handleAdd}
      >
        Add equipment
      </Button>
    </Box>
  );
});

PoolFormEquipmentActions.propTypes = {};

export default PoolFormEquipmentActions;
