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

const SummaryListItemRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    '& button': {
      visibility: 'visible',
    },
  },
}));

interface BatchPreviewSummaryProps {
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

const BatchPreviewSummary: FC<BatchPreviewSummaryProps> = memo(() => {
  const theme = useTheme();
  const {
    isExpandedFormat,

    contact,
    ccEmails,
    sendDate,
    dueDate,

    configureServiceReport,
    isIndividualInvoicesAttached,
    isIndividualInvoicesAttachedByDefault,
    isJobSheetsAttached,
    isJobSheetsAttachedByDefault,

    total,
    contactInvoiceIds,
  } = useSelector((state) => state.batchPreview);
  const issuedDateText = useMemo(
    () => moment(sendDate).format('DD MMM YYYY'),
    [sendDate]
  );
  const dueDateText = useMemo(
    () => moment(dueDate).format('DD MMM YYYY'),
    [dueDate]
  );
  const attachmentsText = useMemo<string>(() => {
    const invoiceAttached = configureServiceReport
      ? isIndividualInvoicesAttached
      : isIndividualInvoicesAttachedByDefault;
    const jobSheetAttached = configureServiceReport
      ? isJobSheetsAttached
      : isJobSheetsAttachedByDefault;

    if (!invoiceAttached && !jobSheetAttached) {
      return '—';
    }

    const result = [];

    if (invoiceAttached) {
      result.push('invoices');
    }

    if (jobSheetAttached) {
      result.push('job sheets');
    }

    return result.join(', ');
  }, [
    configureServiceReport,
    isIndividualInvoicesAttached,
    isIndividualInvoicesAttachedByDefault,
    isJobSheetsAttached,
    isJobSheetsAttachedByDefault,
  ]);

  const format = useMemo(
    () => (isExpandedFormat ? 'Expanded' : 'Compact'),
    [isExpandedFormat]
  );

  const totalText = useMemo(() => numeral(total).format('$0,0.00'), [total]);

  if (contact == null) {
    return null;
  }

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
          'Attachments',
          <Typography
            color="textPrimary"
            variant="body2"
            sx={{ textTransform: 'capitalize' }}
          >
            {attachmentsText}
          </Typography>
        )}
        {renderRow(
          'Format',
          <Typography
            color="textPrimary"
            variant="body2"
          >
            {format}
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
        {renderRow(
          'Invoices',
          <Typography
            color="textPrimary"
            variant="body2"
          >
            {contactInvoiceIds.length}
          </Typography>
        )}
      </List>
    </Card>
  );
});

export default BatchPreviewSummary;
