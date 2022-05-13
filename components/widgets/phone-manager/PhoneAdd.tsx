import type { ChangeEvent, FC } from 'react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Box, Button, Grid, TextField, Grow } from '@mui/material';
import type { Phone, PhoneType } from 'src/types/contact';
import { PHONE, PHONE_TYPES } from 'src/constants/contact';
import PlusIcon from '../../../icons/Plus';

interface PhoneAddProps {
  onAdd?: (phone: Phone | null) => void;
}

const PhoneAdd: FC<PhoneAddProps> = (props) => {
  const { onAdd, ...other } = props;

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [phoneType, setPhoneType] = useState<PhoneType>(PHONE);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleAdd = (): void => {
    setIsExpanded(true);
    setPhoneNumber('');
    setPhoneType(PHONE);
    setLabel('');
  };

  const handleCancel = (): void => {
    setIsExpanded(false);
    setPhoneNumber('');
    setPhoneType(PHONE);
    setLabel('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPhoneNumber(event.target.value);
  };

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLabel(event.target.value);
  };

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    // @ts-ignore
    setPhoneType(parseInt(event.target.value, 10));
  };

  const handleSave = async (): Promise<void> => {
    try {
      if (!phoneNumber) {
        return;
      }

      if (onAdd) {
        onAdd({
          phone_number: phoneNumber,
          phone_type_id: phoneType,
          label,
        });
      }
      setIsExpanded(false);
      setPhoneNumber('');
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div {...other}>
      {
        isExpanded
          ? (
            <Grow in={isExpanded}>
              <div>
                <Grid
                  alignItems="center"
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    xs={3}
                  >
                    <TextField
                      fullWidth
                      name="type"
                      onChange={handleTypeChange}
                      select
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ native: true }}
                      value={phoneType}
                      variant="outlined"
                    >
                      {PHONE_TYPES.map((typeOption) => (
                        <option
                          key={typeOption.value}
                          value={typeOption.value}
                        >
                          {typeOption.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid
                    item
                    xs={5}
                  >
                    <TextField
                      onChange={handleChange}
                      fullWidth
                      placeholder="Enter number"
                      value={phoneNumber}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                  >
                    <TextField
                      onChange={handleLabelChange}
                      fullWidth
                      placeholder="Label"
                      value={label}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 2
                  }}
                >
                  <Button
                    color="primary"
                    type="button"
                    onClick={handleCancel}
                    size="small"
                    variant="text"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="button"
                    onClick={handleSave}
                    size="small"
                    sx={{ ml: 2 }}
                    variant="contained"
                  >
                    Save
                  </Button>
                </Box>
              </div>
            </Grow>
          )
          : (
            <Button
              color="primary"
              type="button"
              onClick={handleAdd}
              startIcon={<PlusIcon fontSize="small" />}
              variant="text"
            >
              Add phone number
            </Button>
          )
      }
    </div>
  );
};

PhoneAdd.propTypes = {
  onAdd: PropTypes.func,
};

export default PhoneAdd;
