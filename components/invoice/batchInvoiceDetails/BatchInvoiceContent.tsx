import React, { memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';

import moment from 'moment';

import ChevronRightIcon from 'src/icons/ChevronRight';
import { useSelector } from 'src/store';
import { ContactInvoice } from 'src/types/batchQueue';

import BatchInvoiceStatusLabel from '../BatchInvoiceStatusLabel';
import BatchInvoiceContentContactListItem from './BatchInvoiceContentContactListItem';
import BatchInvoiceContentInfoListItem from './BatchInvoiceContentInfoListItem';
import BatchInvoiceTotalCostSummary from './BatchInvoiceTotalCostSummary';

const BatchInvoiceContent = memo(() => {
  const router = useRouter();
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

  const onViewJob = useCallback((invoice: ContactInvoice) => {
    const jobId = invoice.job_id;
    window.open(`/jobs/${jobId}`, '_blank');
  }, []);

  const onViewJobSheetPDF = useCallback((invoice: ContactInvoice) => {
    window.open(invoice.job_pdf_sheet, '_blank');
  }, []);

  const onViewInvoicePDF = useCallback((invoice: ContactInvoice) => {
    window.open(invoice.invoice_pdf_sheet, '_blank');
  }, []);

  const onResendInvoice = useCallback((invoice: ContactInvoice) => {
    router.push(`/invoices/${invoice.id}/resend`);
  }, []);

  const onResendBatchInvoice = useCallback(() => {
    router.push(`/invoices/batch/${batchInvoice?.id}/resend`);
  }, [batchInvoice?.id]);

  const onViewBatchInvoice = useCallback(() => {
    window.open(batchInvoice?.invoice_pdf_location, '_blank');
  }, [batchInvoice?.invoice_pdf_location]);

  return (
    <>
      <Card>
        <CardHeader
          title="Issued to"
          action={(
            <BatchInvoiceStatusLabel
              sx={{ m: 1 }}
              invoice={batchInvoice}
            />
          )}
        />
        <Divider />
        <CardContent>
          <List>
            <BatchInvoiceContentInfoListItem
              label="Invoice #"
              text={batchInvoice.prefixed_invoice_no}
            />
            <BatchInvoiceContentInfoListItem
              label="Issued to"
              text={batchInvoice.prefixed_invoice_no}
            >
              <Typography
                color="textPrimary"
                variant="body2"
              >
                {contact?.full_name}
              </Typography>
              <Typography
                color="textPrimary"
                variant="body2"
              >
                {contact?.full_address}
              </Typography>
              <Link
                href={`mailto: ${contact?.email}`}
                variant="body2"
                fontWeight="bold"
                sx={{
                  color: 'palette.primary.dark',
                  wordBreak: 'break-word',
                }}
              >
                {contact.email}
              </Link>
            </BatchInvoiceContentInfoListItem>
            <BatchInvoiceContentInfoListItem label="CC emails">
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
                  key={email}
                  href={`mailto: ${email}`}
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    display: 'block',
                    color: 'palette.primary.dark',
                    wordBreak: 'break-word',
                  }}
                >
                  {email}
                </Link>
              ))}
            </BatchInvoiceContentInfoListItem>
            <BatchInvoiceContentInfoListItem
              label="Issued date"
              text={issuedDateText}
            />
            <BatchInvoiceContentInfoListItem
              label="Due date"
              text={dueDateText}
            />
            <ListItem sx={{ pl: 0, mt: 3 }}>
              <Link
                href="#"
                variant="body2"
                fontWeight="bold"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'palette.primary.dark',
                }}
              >
                <ChevronRightIcon sx={{ transform: 'translateX(-25%)' }} />
                {' '}
                View in Vend
              </Link>
            </ListItem>
          </List>
        </CardContent>
      </Card>
      <Card sx={{ mt: 3 }}>
        <CardHeader title="Invoice details" />
        <Divider />
        <CardContent>
          <List>
            {batchInvoice.contact_invoices.map((invoice) => (
              <BatchInvoiceContentContactListItem
                key={invoice.id}
                contactInvoice={invoice}
                onViewJob={() => onViewJob(invoice)}
                onViewJobSheetPDF={() => onViewJobSheetPDF(invoice)}
                onViewInvoicePDF={() => onViewInvoicePDF(invoice)}
                onResendInvoice={() => onResendInvoice(invoice)}
              />
            ))}
          </List>
          <BatchInvoiceTotalCostSummary contactInvoices={batchInvoice?.contact_invoices || []} />
        </CardContent>
      </Card>
      <Box
        mt={3}
        display="flex"
        justifyContent="center"
        sx={{
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}
      >
        <Button
          sx={{ mr: { xs: 0, sm: 3 }, mb: { xs: 3, sm: 0 } }}
          variant="contained"
          onClick={onResendBatchInvoice}
        >
          RESEND BATCH INVOICE
        </Button>
        <Button
          variant="outlined"
          onClick={onViewBatchInvoice}
        >
          VIEW INVOICE PDF
        </Button>
      </Box>
    </>
  );
});

export default BatchInvoiceContent;
