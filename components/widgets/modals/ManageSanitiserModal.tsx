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
import type { PoolSanitiser } from 'src/types/pool';
import { useSelector } from 'src/store';

interface ManageSanitiserModalProps {
  sanitiser: PoolSanitiser;
  title: string;
  mode: string;
  onClose?: (modifiedSanitiser: PoolSanitiser | null) => void;
  onSubmit: (modifiedSanitiser, mode) => void;
  open: boolean;
}

const ManageSanitiserModal: FC<ManageSanitiserModalProps> = (props) => {
  const {
    sanitiser,
    title,
    mode,
    onClose,
    onSubmit,
    open,
    ...other
  } = props;
  const [name, setName] = useState<string>('');
  const [classificationId, setClassificationId] = useState<number>(null);
  const { sanitiserClassifications } = useSelector((state) => state.poolSpecifications);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const schema = Yup.object().shape({
    name: Yup.string().max(255).required(),
  });

  useEffect(() => {
    setName(get(sanitiser, 'name', ''));
    setClassificationId(get(sanitiser, 'sanitiser_classification_id', 1));
  }, [sanitiser]);

  useEffect(() => {
    schema
      .isValid({
        name,
      })
      .then((valid) => {
        setIsValid(valid);
      });
  }, [name]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleClassificationChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setClassificationId(parseInt(event.target.value, 10));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedEntity = {
        ...sanitiser,
        name,
        sanitiser_classification_id: classificationId
      };
      await onSubmit(updatedEntity, mode);
      toast.success(`The ${title} successfully ${mode === 'edit' ? 'updated' : 'saved'}`);
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
          {`${mode} ${title}`}
        </Typography>
        {loading && <LinearProgress />}
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            error={Boolean(name) && !isValid}
            fullWidth
            disabled={loading}
            helperText={Boolean(name) && !isValid && 'Name is required'}
            placeholder="Enter name"
            label="Name"
            margin="normal"
            name="name"
            onChange={handleChange}
            value={name}
            variant="outlined"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Classification"
            name="sanitiser_classification_id"
            onChange={handleClassificationChange}
            select
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: true }}
            value={classificationId}
            variant="outlined"
          >
            {sanitiserClassifications.map((classification) => (
              <option
                key={classification.id}
                value={classification.id}
              >
                {classification.name}
              </option>
            ))}
          </TextField>
        </Box>
        <Box
          sx={{
            mt: 2,
            p: 2
          }}
        >
          <Button
            color="primary"
            fullWidth
            sx={{
              textTransform: 'capitalize'
            }}
            disabled={!isValid || loading}
            onClick={handleSubmit}
            variant="contained"
          >
            {mode === 'edit' ? 'update' : 'save'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

ManageSanitiserModal.propTypes = {
  // @ts-ignore
  sanitiser: PropTypes.object,
  title: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default ManageSanitiserModal;
