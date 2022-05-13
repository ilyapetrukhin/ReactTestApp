import React, { FC, memo, useMemo } from 'react';

import {
  Box,
  Card,
  CardHeader,
  Divider,
  Link,
  List,
  Typography,
} from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { parseBoolByStr } from 'src/utils/bool';
import { useSelector } from 'src/store';

const SummaryListItemRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    '& button': {
      visibility: 'visible',
    },
  },
}));

interface InvoiceResendSummaryProps {
  schedule?: string;
  contactInvoice: any,
  invoiceSettings: any
}

function renderRow(label: string, children: React.ReactNode) {
  return (
    <SummaryListItemRoot>
      <Box
        sx={{
          px: 2,
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Typography
          color="textSecondary"
          variant="subtitle2"
          fontWeight="bold"
          sx={{
            width: 100,
          }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            ml: 2,
            flex: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </SummaryListItemRoot>
  );
}

const InvoiceResendSummary: FC<InvoiceResendSummaryProps> = memo((props) => {
  const theme = useTheme();
  const { contactInvoice, invoiceSettings } = props;
  const { ccEmails } = useSelector((state) => state.resendInvoice);

  const tasksLists = parseBoolByStr(
    invoiceSettings?.settings.tasks_list
  );
  const waterResult = parseBoolByStr(
    invoiceSettings?.settings.water_result
  );
  const chemicalHistory = parseBoolByStr(
    invoiceSettings?.settings.chemical_history
  );
  const chemicalActions = parseBoolByStr(
    invoiceSettings?.settings.chemical_actions
  );
  const displayInvoiceNotes = parseBoolByStr(
    invoiceSettings?.settings.display_invoice_notes
  );
  const isJobSheetAttached = parseBoolByStr(
    contactInvoice?.is_job_sheet_attached
  );
  const isInvoiceSheetAttached = parseBoolByStr(
    contactInvoice?.is_invoice_sheet_attached
  );

  const attachmentsText = useMemo<string>(() => {
    const result = [];

    if (tasksLists) {
      result.push('tasks list');
    }

    if (waterResult) {
      result.push('water test results');
    }

    if (chemicalHistory) {
      result.push('chemical history');
    }

    const useChemicalActions = waterResult ? chemicalActions : false;

    if (useChemicalActions) {
      result.push('chemical actions');
    }

    if (displayInvoiceNotes) {
      result.push('invoice notes');
    }

    if (isJobSheetAttached) {
      result.push('job sheet');
    }

    if (isInvoiceSheetAttached) {
      result.push('invoice sheet');
    }

    return result.join(', ') || '—';
  }, [
    tasksLists,
    waterResult,
    chemicalHistory,
    chemicalActions,
    displayInvoiceNotes,
    isJobSheetAttached,
    isInvoiceSheetAttached,
  ]);

  if (contactInvoice == null) {
    return null;
  }

  const { contact } = contactInvoice;

  return (
    <Card
      sx={{
        position: 'sticky',
        top: theme.spacing(3),
        minWidth: '275',
      }}
    >
      <CardHeader title="Summary" />
      <Divider />
      <List>
        {renderRow(
          'Invoice #',
          <>
            <Typography
              color="textPrimary"
              variant="body2"
            >
              {contactInvoice.prefixed_invoice_no}
            </Typography>
          </>
        )}
        {renderRow(
          'Issued to',
          <>
            <Typography
              color="textPrimary"
              variant="body2"
              sx={{ wordBreak: 'break-word' }}
            >
              {contact.full_name}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body2"
              sx={{ wordBreak: 'break-word' }}
            >
              {contact.full_address}
            </Typography>
            <Link
              href={`mailto: ${contact.email}`}
              variant="body2"
              fontWeight="bold"
              sx={{
                color: 'palette.primary.dark',
                wordBreak: 'break-word',
              }}
            >
              {contact.email}
            </Link>
          </>
        )}
        {renderRow(
          'CC emails',
          <>
            {ccEmails.length === 0 && (
              <Typography
                color="textPrimary"
                variant="body2"
              >
                —
              </Typography>
            )}
            {ccEmails.map((email, index) => (
              <Link
                key={index}
                href={`mailto: ${email}`}
                variant="body2"
                fontWeight="bold"
                sx={{
                  display: 'block',
                  color: 'palette.primary.dark',
                }}
              >
                {email}
              </Link>
            ))}
          </>
        )}
        {renderRow(
          'Attachments',
          <Typography
            color="textPrimary"
            variant="body2"
          >
            {attachmentsText}
          </Typography>
        )}
      </List>
    </Card>
  );
});

export default InvoiceResendSummary;
