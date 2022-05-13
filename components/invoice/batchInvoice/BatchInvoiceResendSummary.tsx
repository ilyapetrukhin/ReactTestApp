import React, { FC, memo, useMemo } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  Typography,
  Link,
} from '@mui/material';
import moment from 'moment';
import numeral from 'numeral';

import { alpha, styled, useTheme } from '@mui/material/styles';
import { useSelector } from 'src/store';
import BatchInvoiceStatusLabel from './BatchInvoiceStatusLabel';

const SummaryListItemRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    '& button': {
      visibility: 'visible',
    },
  },
}));

interface BatchInvoiceResendSummaryProps {
  schedule?: string;
}

function renderRow(label: string, children: React.ReactNode) {
  return (
    <SummaryListItemRoot>
      <ListItem
        disableGutters
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
            flex: 1,
          }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            ml: 2,
            flex: 2,
          }}
        >
          {children}
        </Box>
      </ListItem>
    </SummaryListItemRoot>
  );
}

const BatchInvoiceResendSummary: FC<BatchInvoiceResendSummaryProps> = memo(() => {
  const theme = useTheme();
  const {
    isIndividualInvoicesAttached,
    isJobSheetsAttached,

    ccEmails,
    batchInvoice,
    contact,
  } = useSelector((state) => state.resendBatchInvoice);
  const issuedDateText = useMemo(
    () => moment(batchInvoice?.send_date).format('DD MMM YYYY'),
    [batchInvoice?.send_date]
  );
  const dueDateText = useMemo(
    () => moment(batchInvoice?.due_date).format('DD MMM YYYY'),
    [batchInvoice?.send_date]
  );

  const attachmentsText = useMemo<string>(() => {
    if (!isJobSheetsAttached && !isIndividualInvoicesAttached) {
      return '—';
    }

    const result = [];

    if (isJobSheetsAttached) {
      result.push('individual job sheets');
    }

    if (isIndividualInvoicesAttached) {
      result.push('individual invoices');
    }

    return result.join(', ');
  }, [
    isIndividualInvoicesAttached,
    isJobSheetsAttached,
  ]);

  const totalText = useMemo(() => numeral(batchInvoice?.total).format('$0,0.00'), [batchInvoice?.total]);

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
              {batchInvoice.prefixed_invoice_no}
            </Typography>
          </>
        )}
        {renderRow(
          'Issued to',
          <>
            <Typography
              color="textPrimary"
              variant="body2"
            >
              {contact.full_name}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body2"
            >
              {contact.full_address}
            </Typography>
            <Link
              href={`mailto: ${contact.email}`}
              variant="body2"
              fontWeight="bold"
              sx={{
                color: 'palette.primary.dark',
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
            {ccEmails.map((email) => (
              <Link
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
          'Issued date',
          <Typography
            color="textPrimary"
            variant="body2"
          >
            {issuedDateText}
          </Typography>
        )}
        {renderRow(
          'Due date',
          <Typography
            color="textPrimary"
            variant="body2"
          >
            {dueDateText}
          </Typography>
        )}
        {renderRow(
          'Status',
          <BatchInvoiceStatusLabel invoice={batchInvoice} />
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
        {renderRow(
          'Total',
          <Typography
            color="textPrimary"
            variant="body2"
          >
            {totalText}
          </Typography>
        )}
      </List>
    </Card>
  );
});

export default BatchInvoiceResendSummary;
