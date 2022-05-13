import React, {
  ChangeEvent,
  memo,
  useCallback,
  useState,
  useMemo,
} from 'react';
import moment from 'moment';
import numeral from 'numeral';

import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import BatchPreviewInvoicesFormat from './BatchPreviewInvoicesFormat';
import { useSelector, useDispatch } from 'src/store';
import { loadPdfInvoice, resetPdfInvoice, setIsExpandedFormat } from 'src/slices/batchPreview';

import DialogPreviewPdf from 'src/components/DialogPreviewPdf';
import { InvoiceSummary } from '../../widgets/invoice';

interface ProductFormatted {
  id: number;
  name: string;
  costText: string;
}

interface ContactInvoiceFormatted {
  title: string;
  totalAmount: string;
  key: string;
  products: ProductFormatted[];
}

const BatchPreviewInvoices = memo(() => {
  const dispatch = useDispatch();

  const [previewPdfOpened, setPreviewPdfOpened] = useState<boolean>(false);

  const {
    isExpandedFormat,

    contactInvoices,
    isLoadingPdfInvoice,
    pdfInvoiceBlob,
    contactId,
    contactInvoiceIds,
    dueDate,
    sendDate,
    products,
  } = useSelector((state) => state.batchPreview);
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );

  const contactInvoicesFormatted = useMemo<ContactInvoiceFormatted[]>(
    () => contactInvoices.map((invoice) => {
      const date = moment(invoice.send_date).format('DD MMM YYYY');
      const title = `${invoice.prefixed_invoice_no} ${invoice.job_template_name} on ${date}`;
      const totalAmount = numeral(invoice.total_amount).format('$0,0.00');
      return {
        title,
        totalAmount,
        key: invoice.prefixed_invoice_no,
        products: invoice.products.map((product) => ({
          id: product.id,
          name: product.name,
          costText: numeral(product.cost).format('$0,0.00'),
        })),
      };
    }),
    [contactInvoices]
  );

  const handleChangeCompact = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        dispatch(setIsExpandedFormat({ expanded: false }));
      }
    },
    []
  );

  const handleChangeExpanded = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        dispatch(setIsExpandedFormat({ expanded: true }));
      }
    },
    []
  );

  const handleOpenPreviewInvoicePdf = useCallback(() => {
    dispatch(
      loadPdfInvoice({
        organisationId,
        contactId,
        contactInvoiceIds,
        dueDate,
        issuedDate: sendDate,
      })
    );
    setPreviewPdfOpened(true);
  }, [organisationId, contactId, contactInvoiceIds, dueDate, sendDate]);

  const handleClosePreviewInvoicePdf = useCallback(() => {
    setPreviewPdfOpened(false);
    dispatch(resetPdfInvoice());
  }, []);

  return (
    <>
      <Card>
        <CardHeader title="Preview batch invoice" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sm={6}
            >
              <BatchPreviewInvoicesFormat
                title="Compact"
                subtitle="Display job type and date as line item"
                checked={!isExpandedFormat}
                onChange={handleChangeCompact}
                onClickPreview={handleOpenPreviewInvoicePdf}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
            >
              <BatchPreviewInvoicesFormat
                title="Expanded"
                subtitle="Show all line items"
                checked={isExpandedFormat}
                onChange={handleChangeExpanded}
                onClickPreview={handleOpenPreviewInvoicePdf}
              />
            </Grid>
          </Grid>
          <List sx={{ width: '100%' }}>
            {contactInvoicesFormatted.map((invoice) => (
              <ListItem
                key={invoice.key}
                disableGutters
                divider
                sx={{ py: 3 }}
              >
                <Grid container>
                  <Grid
                    item
                    sm={8}
                  >
                    <Typography
                      variant="subtitle1"
                      color="textPrimary"
                    >
                      {invoice.title}
                    </Typography>
                    {isExpandedFormat
                      && invoice.products.map((product) => (
                        <Typography
                          mt={2}
                          key={product.id}
                          variant="subtitle1"
                          color="textPrimary"
                          fontStyle="italic"
                        >
                          {product.name}
                        </Typography>
                      ))}
                  </Grid>
                  <Grid
                    item
                    sm={4}
                  >
                    <Typography
                      color="textPrimary"
                      variant="subtitle1"
                      textAlign="right"
                    >
                      {invoice.totalAmount}
                    </Typography>
                    {isExpandedFormat
                      && invoice.products.map((product) => (
                        <Typography
                          mt={2}
                          color="textPrimary"
                          variant="subtitle2"
                          fontStyle="italic"
                          textAlign="right"
                        >
                          {product.costText}
                        </Typography>
                      ))}
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              sm={8}
              xs={12}
            />
            <Grid
              item
              sm={4}
              xs={12}
            >
              <InvoiceSummary invoices={products} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <DialogPreviewPdf
        title="Invoice preview"
        loading={isLoadingPdfInvoice}
        pdfBlob={pdfInvoiceBlob}
        open={previewPdfOpened}
        onClose={handleClosePreviewInvoicePdf}
      />
    </>
  );
});

export default BatchPreviewInvoices;
