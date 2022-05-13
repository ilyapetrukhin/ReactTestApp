import React, { memo, useCallback, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Box,
  TextField,
  Grid,
} from '@mui/material';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import ChipInput from 'material-ui-chip-input';
import * as Yup from 'yup';

import { useSelector, useDispatch } from 'src/store';
import { setCCEmails, setDueDate, setSendDate } from 'src/slices/batchPreview';
import BatchPreviewIssueToContact from './BatchPreviewIssueToContact';
import moment from 'moment/moment';

const BatchPreviewIssueTo = memo(() => {
  const dispatch = useDispatch();
  const { sendDate, dueDate, ccEmails, contact } = useSelector((state) => state.batchPreview);

  const minDate = useMemo(
    () => moment(sendDate).toDate(),
    [sendDate]
  );

  const handleAddCCEmail = useCallback(
    (email: string) => {
      if (Yup.string().email().isValidSync(email)) {
        dispatch(setCCEmails({ emails: [...ccEmails, email] }));
      }
    },
    [ccEmails]
  );

  const handleDeleteCCEmail = useCallback(
    (email: string) => {
      dispatch(setCCEmails({ emails: ccEmails.filter((e) => e !== email) }));
    },
    [ccEmails.length]
  );

  const handleIssuedDateChange = useCallback((sendDate: Date) => {
    dispatch(setSendDate(sendDate));
  }, []);

  const handleDueDateChange = useCallback((dueDate: Date) => {
    dispatch(setDueDate(dueDate));
  }, []);

  if (contact == null) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Issue to" />
      <Divider />
      <CardContent>
        <BatchPreviewIssueToContact
          address={contact.full_address}
          name={contact.full_name}
          email={contact.email}
        />
        <Box
          mt={3}
        >
          <ChipInput
            fullWidth
            label="CC emails"
            variant="outlined"
            placeholder="Enter CC emails"
            value={ccEmails}
            onAdd={handleAddCCEmail}
            onDelete={handleDeleteCCEmail}
          />
        </Box>
        <Box
          mt={6}
          display="flex"
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
            >
              <MobileDatePicker
                label="Issued date"
                renderInput={(props) => (
                  <TextField
                    sx={{ minWidth: 250 }}
                    variant="outlined"
                    {...props}
                  />
                )}
                mask="YYYY-MM-DD"
                disableCloseOnSelect={false}
                showToolbar={false}
                inputFormat="EEEE dd MMM yyyy"
                value={sendDate}
                onChange={handleIssuedDateChange}
              />
            </Grid>
            <Grid item>
              <MobileDatePicker
                label="Due date"
                renderInput={(props) => (
                  <TextField
                    sx={{ minWidth: 250 }}
                    variant="outlined"
                    {...props}
                  />
                )}
                disableCloseOnSelect={false}
                mask="YYYY-MM-DD"
                showToolbar={false}
                inputFormat="EEEE dd MMM yyyy"
                value={dueDate}
                minDate={minDate}
                onChange={handleDueDateChange}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
});

export default BatchPreviewIssueTo;
