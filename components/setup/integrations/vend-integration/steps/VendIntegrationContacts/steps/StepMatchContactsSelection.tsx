import React, { FC, memo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  Box,
} from '@mui/material';

import ContactMatchRow from '../components/ContactMatchRow';
import { useDispatch, useSelector } from 'src/store';
import {
  handleCurrentPageAndLoadMore,
  back,
  selectMatch,
} from 'src/slices/vendIntegrationSyncContacts';
import { LoadingButton } from '@mui/lab';

interface StepMatchContactsSelectionProps {}

const StepMatchContactsSelection: FC<StepMatchContactsSelectionProps> = memo(
  () => {
    const dispatch = useDispatch();
    const { id: organisationId } = useSelector(
      (state) => state.account.organisation
    );
    const {
      isLoading,
      isLoadingBack,

      totalContacts,
      handledContacts,
      contacts,
      mapContactIdToSelectedVendContactId,
      currentContactsPage,
    } = useSelector((state) => state.vendIntegrationSyncContacts);
    const title = `${handledContacts} of ${totalContacts} contacts processed`;
    const hasPrevPage = currentContactsPage > 1;

    const handleNext = useCallback(() => {
      dispatch(
        handleCurrentPageAndLoadMore(
          organisationId,
          currentContactsPage,
          mapContactIdToSelectedVendContactId
        )
      );
    }, [
      organisationId,
      currentContactsPage,
      mapContactIdToSelectedVendContactId,
    ]);
    const handleBack = useCallback(() => {
      dispatch(back(organisationId, currentContactsPage));
    }, [organisationId, currentContactsPage]);

    const handleChangeSelectedContactId = useCallback(
      (vendContactId: string, contactId: number) => {
        dispatch(selectMatch({ vendContactId, contactId }));
      },
      []
    );

    return (
      <Card>
        <CardHeader title={title} />
        <Divider />
        <CardContent>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: 'background.default',
              height: '100%',
              p: 2,
              mb: 3,
            }}
          >
            <Typography
              variant="body1"
              color="textPrimary"
            >
              Select the best matching contact from the drop-down and click
              {' '}
              <Typography
                variant="body2"
                color="textPrimary"
                component="span"
                fontWeight="bold"
                sx={{
                  textTransform: 'uppercase',
                }}
              >
                next.
              </Typography>
            </Typography>
          </Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight="bold"
                  >
                    Pooltrackr contact
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight="bold"
                  >
                    Vend contact
                  </Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contactMatch, index) => (
                <ContactMatchRow
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  contactMatch={contactMatch}
                  selectedVendContactId={
                    mapContactIdToSelectedVendContactId[contactMatch.id]
                  }
                  onChange={(vendContactId) => handleChangeSelectedContactId(vendContactId, contactMatch.id)}
                />
              ))}
            </TableBody>
          </Table>
          <Box
            display="flex"
            justifyContent="center"
            mt={3}
          >
            {hasPrevPage && (
              <LoadingButton
                loading={isLoadingBack}
                disabled={isLoading}
                variant="outlined"
                sx={{ mr: 3, textTransform: 'uppercase' }}
                onClick={handleBack}
              >
                Back
              </LoadingButton>
            )}
            <LoadingButton
              loading={isLoading}
              disabled={isLoadingBack}
              variant="contained"
              sx={{ textTransform: 'uppercase' }}
              onClick={handleNext}
            >
              Next
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

StepMatchContactsSelection.propTypes = {};

export default StepMatchContactsSelection;
