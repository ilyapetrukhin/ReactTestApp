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
import axios from 'axios';
import type { TestHistory, CombinedTestHistory } from 'src/types/testHistory';
import { apiConfig } from '../../config';
import { useSelector } from '../../store';

interface HistoryResendModalProps {
  testHistory: TestHistory | CombinedTestHistory;
  onClose?: () => void;
  open: boolean;
}

const HistoryResendModal: FC<HistoryResendModalProps> = (props) => {
  const {
    testHistory,
    onClose,
    open,
    ...other
  } = props;
  const [value, setValue] = useState<string>('');
  const { organisation } = useSelector((state) => state.account);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const emailValidator = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  });

  useEffect(() => {
    setValue(get(testHistory, 'contact.email', ''));
  }, [testHistory]);

  useEffect(() => {
    emailValidator
      .isValid({
        email: value,
      })
      .then((valid) => {
        setIsValid(valid);
      });
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post(`${apiConfig.apiV1Url}/organisations/${organisation.id}/labjobs/${testHistory.id}/sendemail`, { email: value });
      toast.success('The report has been sent to the recipient');
      if (onClose) {
        onClose();
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
          variant="h5"
        >
          Resend water test report to
        </Typography>
        {loading && <LinearProgress />}
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            error={Boolean(value) && !isValid}
            fullWidth
            disabled={loading}
            helperText={Boolean(value) && !isValid && 'Must be a valid email'}
            placeholder="Enter recipient email"
            label="Email"
            margin="normal"
            name="email"
            onChange={handleChange}
            type="email"
            value={value}
            variant="outlined"
          />
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
            disabled={!isValid || loading}
            onClick={handleResend}
            variant="contained"
          >
            Resend
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

HistoryResendModal.propTypes = {
  // @ts-ignore
  testHistory: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default HistoryResendModal;
