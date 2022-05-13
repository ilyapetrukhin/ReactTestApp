import React, { FC, memo, useCallback, useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from '@mui/material';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import moment from 'moment';

import { useDispatch, useSelector } from 'src/store';
import {
  setWarrantyEndDate,
  setWarrantyStartDate,
} from 'src/slices/poolEquipment';

interface EquipmentTextFieldProps {}

const EquipmentTextField: FC<EquipmentTextFieldProps> = memo(() => {
  const dispatch = useDispatch();
  const { warrantyStartDate, warrantyEndDate } = useSelector(
    (state) => state.poolEquipment
  );

  const startDate = useMemo(
    () => (warrantyStartDate != null ? moment(warrantyStartDate).toDate() : null),
    [warrantyStartDate]
  );
  const endDate = useMemo(
    () => (warrantyEndDate != null ? moment(warrantyEndDate).toDate() : null),
    [warrantyEndDate]
  );

  const handleChangeStartDate = useCallback((date: Date) => {
    dispatch(setWarrantyStartDate({ startDate: date.toString() }));
  }, []);
  const handleChangeEndDate = useCallback((date: Date) => {
    dispatch(setWarrantyEndDate({ endDate: date.toString() }));
  }, []);

  return (
    <Card>
      <CardHeader title="Warranty" />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
            sm={7}
          >
            <MobileDatePicker
              label="Start date"
              renderInput={(props) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 3 }}
                  {...props}
                  required={false}
                />
              )}
              disableCloseOnSelect={false}
              disableMaskedInput
              inputFormat="yyyy-MM-dd"
              maxDate={endDate}
              onChange={handleChangeStartDate}
              value={startDate}
            />
            <MobileDatePicker
              label="End date"
              renderInput={(props) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  {...props}
                  required={false}
                />
              )}
              disableCloseOnSelect={false}
              disableMaskedInput
              inputFormat="yyyy-MM-dd"
              minDate={startDate}
              onChange={handleChangeEndDate}
              value={endDate}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

EquipmentTextField.propTypes = {};

export default EquipmentTextField;
