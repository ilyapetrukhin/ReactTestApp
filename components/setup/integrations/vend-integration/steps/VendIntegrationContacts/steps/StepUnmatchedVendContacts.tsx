import React, { FC, memo, useCallback, useMemo } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
} from '@mui/material';

import { useDispatch, useSelector } from 'src/store';
import ContactIgnoreRow from '../components/ContactIgnoreRow';
import {
  backUnmatchedVend,
  handleCurrentPageOfUnmatchedVendAndLoadMore,
  ignoreAllVendContacts,
  ignoreVendContact,
  VendIntegrationSyncContactsStep,
} from 'src/slices/vendIntegrationSyncContacts';
import { LoadingButton } from '@mui/lab';

interface StepUnmatchedVendContactsProps {}

const StepUnmatchedVendContacts: FC<StepUnmatchedVendContactsProps> = memo(
  () => {
    const dispatch = useDispatch();
    const { id: organisationId } = useSelector(
      (state) => state.account.organisation
    );
    const {
      isLoading,
      isLoadingBack,

      unmatchedVendContacts,
      ignoreUnmatchedVendContactsIds,
      unmatchedVendContactsPage,
      unmatchedVendContactsTotal,
      unmatchedVendContactsLatestPage,

      currentContactsPage,

      latestStep,
    } = useSelector((state) => state.vendIntegrationSyncContacts);

    const handleIgnoreAll = useCallback(() => {
      dispatch(ignoreAllVendContacts({ ignored: true }));
    }, []);

    const handleCreateAll = useCallback(() => {
      dispatch(ignoreAllVendContacts({ ignored: false }));
    }, []);

    const onChangeIgnore = useCallback(
      (vendContactId: string, ignored: boolean) => {
        dispatch(ignoreVendContact({ vendContactId, ignored }));
      },
      []
    );

    const handleBack = useCallback(() => {
      dispatch(
        backUnmatchedVend(
          organisationId,
          unmatchedVendContactsPage,
          currentContactsPage
        )
      );
    }, [organisationId, unmatchedVendContactsPage, currentContactsPage]);

    const handleNext = useCallback(() => {
      dispatch(
        handleCurrentPageOfUnmatchedVendAndLoadMore(
          organisationId,
          unmatchedVendContactsPage,
          ignoreUnmatchedVendContactsIds,
          unmatchedVendContacts
        )
      );
    }, [
      organisationId,
      unmatchedVendContactsPage,
      ignoreUnmatchedVendContactsIds,
      unmatchedVendContacts,
    ]);

    const nextBtnText = useMemo(() => {
      if (
        latestStep === VendIntegrationSyncContactsStep.unmatchedVendContacts
        && unmatchedVendContactsPage === unmatchedVendContactsLatestPage
      ) {
        return 'Sync matched contacts';
      }

      return 'Next';
    }, [
      unmatchedVendContactsPage,
      unmatchedVendContactsLatestPage,
      latestStep,
    ]);

    return (
      <Card>
        <CardHeader title="Create or ignore Vend contacts" />
        <Divider />
        <CardContent>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: 'background.default',
              height: '100%',
              p: 2,
            }}
          >
            <Typography
              variant="body2"
              color="textPrimary"
            >
              <Typography
                variant="body2"
                color="textPrimary"
                component="span"
                fontWeight="bold"
              >
                You have
                {' '}
                {unmatchedVendContactsTotal}
                {' '}
                contacts in Vend that have
                no matches in Pooltrackr.
              </Typography>
              {' '}
              Create in Pooltrackr or ignore to proceed.
            </Typography>
          </Paper>
          <Box
            display="flex"
            justifyContent="flex-end"
            mt={3}
          >
            <Button
              variant="outlined"
              sx={{ mr: 3, textTransform: 'uppercase' }}
              onClick={handleIgnoreAll}
            >
              Ignore all
            </Button>
            <Button
              sx={{ textTransform: 'uppercase' }}
              variant="contained"
              onClick={handleCreateAll}
            >
              Create all
            </Button>
          </Box>
          <Table>
            <TableBody>
              {unmatchedVendContacts.map((contact) => (
                <ContactIgnoreRow
                  key={contact.id}
                  contact={contact}
                  contactType="vendContact"
                  ignored={ignoreUnmatchedVendContactsIds.includes(
                    contact.vend_contact_id
                  )}
                  onChangeIgnore={(ignored) => onChangeIgnore(contact.vend_contact_id, ignored)}
                />
              ))}
            </TableBody>
          </Table>
          <Box
            display="flex"
            justifyContent="center"
            mt={3}
          >
            <LoadingButton
              loading={isLoadingBack}
              disabled={isLoading}
              variant="outlined"
              sx={{ mr: 3, textTransform: 'uppercase' }}
              onClick={handleBack}
            >
              Back
            </LoadingButton>
            <LoadingButton
              loading={isLoading}
              disabled={isLoadingBack}
              variant="contained"
              sx={{ textTransform: 'uppercase' }}
              onClick={handleNext}
            >
              {nextBtnText}
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    );
  }
);

StepUnmatchedVendContacts.propTypes = {};

export default StepUnmatchedVendContacts;
