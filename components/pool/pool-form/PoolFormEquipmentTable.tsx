import React, { FC, memo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useConfirm } from 'material-ui-confirm';
import { Box, Table, TableHead, TableRow, TableCell, Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { useDispatch, useSelector } from 'src/store';
import { PoolEquipment } from 'src/types/equipment';
import { Scrollbar } from 'src/components/scrollbar';
import { deleteEquipment } from 'src/slices/poolDetail';

import PoolFormEquipmentRow from './PoolFormEquipmentRow';

interface PoolFormProps {}

const PoolForm: FC<PoolFormProps> = memo(() => {
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const router = useRouter();
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const { pool, equipmentIdsDeletingInProgress } = useSelector(
    (state) => state.poolDetail
  );
  const { equipments } = pool;

  const handleEdit = useCallback(
    (equipment: PoolEquipment) => {
      router.push({
        pathname: '/equipment/[poolId]/[equipmentId]/edit',
        query: { poolId: pool.id, equipmentId: equipment.id },
      });
    },
    [pool.id]
  );

  const handleDelete = useCallback(
    async (equipment: PoolEquipment) => {
      const confirmed = await confirm({
        description: `Are you sure you want to delete the equipment "${equipment.name}"?`,
      })
        .then(() => true)
        .catch(() => false);

      if (!confirmed) {
        return;
      }

      try {
        await dispatch(deleteEquipment(organisationId, equipment.id));
        toast.success(`Equipment "${equipment.name}" has been deleted`);
      } catch (_) {
        toast.error(`Something went wrong with equipment "${equipment.name}"`);
      }
    },
    [organisationId]
  );

  if (equipments.length === 0) {
    return null;
  }

  return (
    <Scrollbar>
      <Box sx={{ minWidth: 560 }}>
        <Table sx={{ mb: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '30%' }}>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Name
                </Typography>
              </TableCell>
              <TableCell sx={{ width: '23%' }}>
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                  Type
                </Typography>
              </TableCell>
              <TableCell sx={{ width: '23%' }}>
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                  Brand
                </Typography>
              </TableCell>
              <TableCell sx={{ width: '23%' }} />
            </TableRow>
          </TableHead>
          {equipments.map((equipment) => (
            <PoolFormEquipmentRow
              key={equipment.id}
              name={equipment.name}
              type={equipment.type?.name || ''}
              brand={equipment.brand?.name || ''}
              isDeleting={equipmentIdsDeletingInProgress.includes(equipment.id)}
              onEdit={() => handleEdit(equipment)}
              onDelete={() => handleDelete(equipment)}
            />
          ))}
        </Table>
      </Box>
    </Scrollbar>
  );
});

PoolForm.propTypes = {};

export default PoolForm;
