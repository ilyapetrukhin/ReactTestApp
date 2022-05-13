import React, { FC, memo, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';

import { createOrUpdateEquipment } from 'src/slices/poolEquipment';
import { useDispatch, useSelector } from 'src/store';

interface SectionEquipmentActionsProps {}

const SectionEquipmentActions: FC<SectionEquipmentActionsProps> = memo(() => {
  const dispatch = useDispatch();
  const organizationId = useSelector((state) => state.account.organisation.id);
  const poolEquipmentState = useSelector((state) => state.poolEquipment);
  const { isEditingMode, isCreatingOrUpdatingEquipment, typeId, name } = poolEquipmentState;

  const createOrUpdateDisabled = useMemo(
    () => isCreatingOrUpdatingEquipment || typeId == null || name.trim().length === 0,
    [typeId, name, isCreatingOrUpdatingEquipment]
  );

  const handleCreateOrUpdate = useCallback(async () => {
    try {
      await dispatch(createOrUpdateEquipment(organizationId, poolEquipmentState));
    } catch (_) {
      toast.error('Something went wrong');
    }
  }, [organizationId, poolEquipmentState, isEditingMode]);

  return (
    <Box
      display="flex"
      justifyContent="center"
    >
      <LoadingButton
        variant="contained"
        disabled={createOrUpdateDisabled}
        loading={isCreatingOrUpdatingEquipment}
        onClick={handleCreateOrUpdate}
      >
        {isEditingMode ? 'Update' : 'Create'}
      </LoadingButton>
    </Box>
  );
});

SectionEquipmentActions.propTypes = {};

export default SectionEquipmentActions;
