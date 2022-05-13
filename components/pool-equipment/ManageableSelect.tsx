import React, { FC, memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, Grid, InputLabel, Select, SelectProps, Theme } from '@mui/material';
import { PlusCircle as PlusCircleIcon } from 'react-feather';
import ManageEntityModal, { ManageEntityType } from '../widgets/modals/ManageEntityModal';
import { SxProps } from '@mui/system';

interface ManageableSelectProps extends SelectProps {
  label: string;
  labelForAddNewField: string;

  addText: string;
  sx?: SxProps<Theme>;
  onAdd: (value: string) => Promise<void> | null;
}

const ManageableSelect: FC<ManageableSelectProps> = memo(({ label, labelForAddNewField, addText, sx, onAdd, ...props }) => {
  const [editingEntity, setEditingEntity] = useState<ManageEntityType | null>(null);
  const editingModalOpen = editingEntity != null;

  const handleOpenModal = useCallback(() => {
    setEditingEntity({ name: '', mode: 'new' });
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingEntity(null);
  }, []);

  const handleAdd = useCallback(
    async (modifiedEntity: ManageEntityType) => {
      const promise = onAdd(modifiedEntity.name);

      if (promise != null) {
        await promise;
      }
    },
    [onAdd]
  );

  return (
    <>
      <Grid
        sx={sx}
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
          sm={7}
        >
          <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
              label={label}
              {...props}
            />
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sm={5}
          display="flex"
          alignItems="center"
        >
          <Button
            startIcon={<PlusCircleIcon />}
            onClick={handleOpenModal}
          >
            {addText}
          </Button>
        </Grid>
      </Grid>
      {
        editingModalOpen && (
          <ManageEntityModal
            entity={editingEntity}
            open={editingModalOpen}
            title={labelForAddNewField}
            inputLabel={labelForAddNewField}
            placeholder={labelForAddNewField}
            nameAttr={labelForAddNewField}
            displaySuccessToast={false}
            onSubmit={handleAdd}
            onClose={handleCloseModal}
          />
        )
      }
    </>
  );
});

ManageableSelect.propTypes = {
  label: PropTypes.string.isRequired,
  labelForAddNewField: PropTypes.string.isRequired,
  sx: PropTypes.object.isRequired,
  addText: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default ManageableSelect;
