import React, { FC, memo, useMemo } from 'react';
import {
  Card,
  CardHeader,
  Divider,
  Link,
  List,
  ListItem,
  Typography,
  Grid,
} from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';

import moment from 'moment';
import numeral from 'numeral';

import { useSelector } from 'src/store';

import BatchInvoiceStatusLabel from '../BatchInvoiceStatusLabel';

const SummaryListItemRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    '& button': {
      visibility: 'visible',
    },
  },
}));

interface BatchInvoiceSummaryProps {
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
        <Grid
          container
          spacing={1}
        >
          <Grid
            item
            xs={5}
          >
            <Typography
              color="textSecondary"
              variant="subtitle2"
              fontWeight="bold"
              sx={{ wordBreak: 'break-word' }}
            >
              {label}
            </Typography>
          </Grid>
          <Grid
            item
            xs={7}
            sx={{ wordBreak: 'break-word' }}
          >
            {children}
          </Grid>
        </Grid>
      </ListItem>
    </SummaryListItemRoot>
  );
}

const BatchInvoiceSummary: FC<BatchInvoiceSummaryProps> = memo(() => {
  const theme = useTheme();
  const { batchInvoice, contact } = useSelector((state) => state.batchInvoiceDetails);
  const ccEmails = useMemo(() => {
    const emails = batchInvoice?.contact?.cc_emails || '';
    return emails.split(',');
  }, [batchInvoice?.contact?.cc_emails]);

  const issuedDateText = useMemo(
    () => moment(batchInvoice?.send_date).format('DD MMM YYYY'),
    [batchInvoice?.send_date]
  );
  const dueDateText = useMemo(
    () => moment(batchInvoice?.due_date).format('DD MMM YYYY'),
    [batchInvoice?.send_date]
  );

  const attachmentsText = useMemo<string>(() => {
    const isJobSheetsAttached = batchInvoice?.is_job_sheets_attached;
    const isIndividualInvoicesAttached = batchInvoice?.is_individual_invoices_attached;

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
    batchInvoice?.is_job_sheets_attached,
    batchInvoice?.is_individual_invoices_attached,
  ]);

  const totalText = useMemo(
    () => numeral(batchInvoice?.total).format('$0,0.00'),
    [batchInvoice?.total]
  );

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

export default BatchInvoiceSummary;
