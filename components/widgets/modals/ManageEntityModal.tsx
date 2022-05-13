import React, { useEffect, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Dialog,
  LinearProgress,
  TextField,
  Typography
} from '@mui/material';

export interface ManageEntityType {
  id?: number;
  name: string;
  mode: string;
}

interface ManageEntityModalProps {
  entity: ManageEntityType;
  title: string;
  onClose?: (modifiedEntity: ManageEntityType | null) => void;
  onSubmit: (modifiedEntity: ManageEntityType) => void;
  open: boolean;

  inputLabel?: string;
  placeholder?: string;
  nameAttr?: string;
  errRequiredMessage?: string;
  displaySuccessToast?: boolean;
}

const ManageEntityModal: FC<ManageEntityModalProps> = (props) => {
  const {
    entity,
    title,
    onClose,
    onSubmit,
    open,

    inputLabel,
    placeholder,
    nameAttr,
    errRequiredMessage,
    displaySuccessToast,
    ...other
  } = props;
  const [value, setValue] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const schema = Yup.object().shape({
    name: Yup.string().max(255).required(),
  });

  useEffect(() => {
    setValue(get(entity, 'name', ''));
  }, [entity]);

  useEffect(() => {
    schema
      .isValid({
        name: value,
      })
      .then((valid) => {
        setIsValid(valid);
      });
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedEntity = {
        ...entity,
        name: value
      };
      await onSubmit(updatedEntity);

      if (displaySuccessToast) {
        toast.success(`The ${title} successfully ${entity.mode === 'edit' ? 'updated' : 'saved'}`);
      }

      if (onClose) {
        onClose(updatedEntity);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      open={open}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          sx={{
            textTransform: 'capitalize'
          }}
          variant="h5"
        >
          {`${entity.mode} ${title}`}
        </Typography>
        {loading && <LinearProgress />}
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            error={Boolean(value) && !isValid}
            fullWidth
            disabled={loading}
            helperText={Boolean(value) && !isValid && errRequiredMessage}
            placeholder={placeholder}
            label={inputLabel}
            margin="normal"
            name={nameAttr}
            onChange={handleChange}
            value={value}
            variant="outlined"
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button
            color="primary"
            sx={{
              textTransform: 'capitalize'
            }}
            disabled={!isValid || loading}
            onClick={handleSubmit}
            variant="contained"
          >
            {entity.mode === 'edit' ? 'update' : 'save'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

ManageEntityModal.propTypes = {
  // @ts-ignore
  entity: PropTypes.object,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,

  inputLabel: PropTypes.string,
  placeholder: PropTypes.string,
  nameAttr: PropTypes.string,
  errRequiredMessage: PropTypes.string,
  displaySuccessToast: PropTypes.bool,
};

ManageEntityModal.defaultProps = {
  inputLabel: 'Name',
  placeholder: 'Enter name',
  nameAttr: 'name',
  errRequiredMessage: 'Name is required',
  displaySuccessToast: true,
};

export default ManageEntityModal;
