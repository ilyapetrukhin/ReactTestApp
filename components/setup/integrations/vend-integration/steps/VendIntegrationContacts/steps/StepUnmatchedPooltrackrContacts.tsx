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
  handleCurrentPageOfUnmatchedPtAndLoadMore,
  backUnmatchedPtContacts,
  ignoreAllPtContacts,
  ignorePtContact,
  VendIntegrationSyncContactsStep,
} from 'src/slices/vendIntegrationSyncContacts';
import { LoadingButton } from '@mui/lab';
import { Scrollbar } from 'src/components/scrollbar';

interface StepUnmatchedPtContactsProps {}

const StepUnmatchedPtContacts: FC<StepUnmatchedPtContactsProps> = memo(() => {
  const dispatch = useDispatch();
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const {
    isLoading,
    isLoadingBack,

    unmatchedPtContacts,
    ignoreUnmatchedPtContactsIds,

    unmatchedPtContactsPage,
    unmatchedPtContactsTotal,
    unmatchedPtContactsLatestPage,

    unmatchedVendContactsPage,
    currentContactsPage,

    latestStep,
  } = useSelector((state) => state.vendIntegrationSyncContacts);

  const handleIgnoreAll = useCallback(() => {
    dispatch(ignoreAllPtContacts({ ignored: true }));
  }, []);

  const handleCreateAll = useCallback(() => {
    dispatch(ignoreAllPtContacts({ ignored: false }));
  }, []);

  const onChangeIgnore = useCallback(
    (contactId: number, ignored: boolean) => {
      dispatch(ignorePtContact({ contactId, ignored }));
    },
    []
  );

  const handleBack = useCallback(() => {
    dispatch(
      backUnmatchedPtContacts(
        organisationId,
        unmatchedPtContactsPage,
        unmatchedVendContactsPage,
        currentContactsPage
      )
    );
  }, [
    organisationId,
    unmatchedPtContactsPage,
    unmatchedVendContactsPage,
    currentContactsPage,
  ]);

  const handleNext = useCallback(() => {
    dispatch(
      handleCurrentPageOfUnmatchedPtAndLoadMore(
        organisationId,
        unmatchedPtContactsPage,
        ignoreUnmatchedPtContactsIds,
        unmatchedPtContacts
      )
    );
  }, [
    organisationId,
    unmatchedPtContactsPage,
    ignoreUnmatchedPtContactsIds,
    unmatchedPtContacts,
  ]);

  const nextBtnText = useMemo(() => {
    if (
      latestStep === VendIntegrationSyncContactsStep.unmatchedPtContacts
        && unmatchedPtContactsPage === unmatchedPtContactsLatestPage
    ) {
      return 'Sync matched contacts';
    }

    return 'Next';
  }, [
    unmatchedPtContactsPage,
    unmatchedPtContactsLatestPage,
    latestStep,
  ]);

  return (
    <Card>
      <CardHeader title="Create or ignore Pooltrackr contacts" />
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
              {unmatchedPtContactsTotal}
              {' '}
              contacts in
              Pt that have no matches in Vend.
            </Typography>
            {' '}
            Create in Vend or ignore to proceed.
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
        <Scrollbar>
          <Table>
            <TableBody>
              {unmatchedPtContacts.map((contact) => (
                <ContactIgnoreRow
                  key={contact.id}
                  contact={contact}
                  contactType="contact"
                  ignored={ignoreUnmatchedPtContactsIds.includes(
                    contact.id
                  )}
                  onChangeIgnore={(ignored) => onChangeIgnore(contact.id, ignored)}
                />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
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
});

StepUnmatchedPtContacts.propTypes = {};

export default StepUnmatchedPtContacts;
