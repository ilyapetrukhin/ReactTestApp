import React, { ChangeEvent, FC, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, Divider, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { setNotes } from 'src/slices/poolEquipment';

interface SectionEquipmentAdditionalInfoProps {}

const SectionEquipmentAdditionalInfo: FC<SectionEquipmentAdditionalInfoProps> = memo(() => {
  const dispatch = useDispatch();
  const { notes } = useSelector((state) => state.poolEquipment);

  const handleChangeNotes = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch(setNotes({ notes: event.target.value }));
    },
    []
  );
  return (
    <Card>
      <CardHeader title="Additional info" />
      <Divider />
      <CardContent>
        <TextField
          placeholder="Notes"
          label="Notes"
          fullWidth
          value={notes}
          multiline
          minRows={2}
          onChange={handleChangeNotes}
        />
      </CardContent>
    </Card>
  );
});

SectionEquipmentAdditionalInfo.propTypes = {};

export default SectionEquipmentAdditionalInfo;
