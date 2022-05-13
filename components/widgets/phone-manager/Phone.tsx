import React, { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Box,
  Button, Grid,
  IconButton,
  TextField,
  Theme,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import { Trash as TrashIcon } from 'react-feather';
import type { Phone as PhoneType, PhoneType as PhoneNumberType } from 'src/types/contact';
import { PHONE_TYPES } from 'src/constants/contact';
import { getPhoneTypeName } from 'src/utils/contact';

interface PhoneProps {
  phone: PhoneType;
  editing?: boolean;
  onEditCancel?: () => void;
  onEditComplete?: (phone: PhoneType) => void;
  onEditInit?: () => void;
  onDelete?: (phoneId: number) => void;
  sx?: SxProps<Theme>;
}

const PhoneRoot = styled('div')(
  ({ theme }) => (
    {
      alignItems: 'flex-start',
      borderRadius: theme.shape.borderRadius,
      display: 'flex',
      padding: theme.spacing(1),
      '&:hover': {
        backgroundColor: theme.palette.background.default,
        '& button': {
          visibility: 'visible'
        }
      }
    }
  )
);

const Phone: FC<PhoneProps> = (props) => {
  const {
    phone,
    editing,
    onEditCancel,
    onEditComplete,
    onEditInit,
    onDelete,
    ...other
  } = props;

  const [phoneNumber, setPhoneNumber] = useState<string>(phone.phone_number);
  const [phoneType, setPhoneType] = useState<PhoneNumberType>(phone.phone_type_id);
  const [label, setLabel] = useState<string>(phone.label);

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
      if (onEditComplete) {
        onEditComplete({
          ...phone,
          phone_number: phoneNumber,
          phone_type_id: phoneType,
          label
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleCancel = (): void => {
    setPhoneNumber(phone.phone_number);

    if (onEditCancel) {
      onEditCancel();
    }
  };

  const handleDelete = async (): Promise<void> => {
    try {
      if (onDelete) {
        onDelete(phone.id);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <PhoneRoot {...other}>
      {
        editing
          ? (
            <Box sx={{ flexGrow: 1 }}>
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
              <Box sx={{ mt: 1 }}>
                <Button
                  color="primary"
                  type="button"
                  onClick={handleSave}
                  size="small"
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  color="primary"
                  type="button"
                  onClick={handleCancel}
                  size="small"
                  variant="text"
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )
          : (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexGrow: 1
              }}
            >
              <Grid
                alignItems="center"
                container
                spacing={2}
              >
                <Grid
                  item
                  xs={3}
                >
                  <Typography
                    color="textPrimary"
                    onClick={onEditInit}
                    sx={{
                      flexGrow: 1,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      minHeight: 32
                    }}
                    variant="body1"
                  >
                    { getPhoneTypeName(phone.phone_type_id) }
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={5}
                >
                  <Typography
                    color="textPrimary"
                    onClick={onEditInit}
                    sx={{
                      flexGrow: 1,
                      textAlign: 'left',
                      cursor: 'pointer',
                      minHeight: 32
                    }}
                    variant="body1"
                  >
                    {phone.phone_number}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                >
                  <Typography
                    color="textPrimary"
                    onClick={onEditInit}
                    sx={{
                      flexGrow: 1,
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      minHeight: 32
                    }}
                    variant="body1"
                  >
                    {phone.label}
                  </Typography>
                </Grid>
              </Grid>
              <IconButton
                onClick={handleDelete}
                sx={{
                  color: 'error.main',
                }}
              >
                <TrashIcon fontSize="small" />
              </IconButton>
            </Box>
          )
      }
    </PhoneRoot>
  );
};

Phone.propTypes = {
  // @ts-ignore
  phone: PropTypes.object.isRequired,
  editing: PropTypes.bool,
  onEditCancel: PropTypes.func,
  onEditComplete: PropTypes.func,
  onEditInit: PropTypes.func,
  onDelete: PropTypes.func,
  sx: PropTypes.object
};

Phone.defaultProps = {
  editing: false
};

export default Phone;
