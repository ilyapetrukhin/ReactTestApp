import React, { ChangeEvent, FC, memo, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import toast from 'react-hot-toast';

import { useDispatch, useSelector } from 'src/store';
import {
  createBrand,
  createType,
  setBrandId,
  setName,
  setSerial,
  setTypeId,
} from 'src/slices/poolEquipment';
import ManageableSelect from './ManageableSelect';

interface SectionEquipmentInfoProps {}

const SectionEquipmentInfo: FC<SectionEquipmentInfoProps> = memo(() => {
  const dispatch = useDispatch();
  const organizationId = useSelector((state) => state.account.organisation.id);
  const {
    isCreatingType,
    isCreatingBrand,
    equipmentTypes,
    productBrands,
    typeId,
    brandId,
    name,
    serial,
  } = useSelector((state) => state.poolEquipment);

  const handleAddType = useCallback(
    async (typeName: string) => {
      try {
        await dispatch(createType(organizationId, typeName, equipmentTypes));
      } catch (e) {
        toast.error('Something went wrong');
      }
    },
    [organizationId, equipmentTypes]
  );

  const handleAddBrand = useCallback(
    async (brandName: string) => {
      try {
        await dispatch(createBrand(organizationId, brandName, productBrands));
      } catch (e) {
        toast.error('Something went wrong');
      }
    },
    [organizationId, productBrands]
  );

  const handleChangeType = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      dispatch(setTypeId({ id: parseInt(event.target.value, 10) }));
    },
    []
  );

  const handleChangeBrand = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      dispatch(setBrandId({ id: parseInt(event.target.value, 10) }));
    },
    []
  );

  const handleChangeName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(setName({ name: event.target.value }));
    },
    []
  );

  const handleChangeSerial = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(setSerial({ serial: event.target.value }));
    },
    []
  );

  return (
    <Card>
      <CardHeader title="Equipment info" />
      <Divider />
      <CardContent>
        <ManageableSelect
          required
          label="Type *"
          labelForAddNewField="Type"
          addText="Add new type"
          sx={{ mb: 3 }}
          value={typeId || ''}
          disabled={isCreatingType}
          onChange={handleChangeType}
          onAdd={handleAddType}
        >
          {equipmentTypes.map((type) => (
            <MenuItem
              key={type.id}
              value={type.id}
            >
              {type.name}
            </MenuItem>
          ))}
        </ManageableSelect>
        <ManageableSelect
          label="Brand"
          labelForAddNewField="Brand"
          addText="Add new brand"
          sx={{ mb: 3 }}
          defaultValue={null}
          value={brandId || ''}
          disabled={isCreatingBrand}
          onAdd={handleAddBrand}
          onChange={handleChangeBrand}
        >
          {productBrands.map((brand) => (
            <MenuItem
              key={brand.id}
              value={brand.id}
            >
              {brand.name}
            </MenuItem>
          ))}
        </ManageableSelect>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
            sm={7}
          >
            <TextField
              required
              placeholder="Product name"
              label="Product name"
              fullWidth
              value={name}
              sx={{ mb: 3 }}
              onChange={handleChangeName}
            />
            <TextField
              placeholder="Serial #"
              label="Serial #"
              fullWidth
              value={serial}
              sx={{ mb: 3 }}
              onChange={handleChangeSerial}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

SectionEquipmentInfo.propTypes = {};

export default SectionEquipmentInfo;
