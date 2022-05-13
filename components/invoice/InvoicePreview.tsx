import React, { useMemo } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { getGst, getSubTotal, getTotal } from 'src/utils/invoice';
import type { Invoice } from '../../types/contactInvoice';
import { Scrollbar } from '../scrollbar';
import { useSelector } from '../../store';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview: FC<InvoicePreviewProps> = (props) => {
  const { invoice, ...other } = props;
  const { organisation, gst } = useSelector((state) => state.account);

  const subTotalCost = useMemo(
    () => {
      let res = 0;
      if (invoice?.products) {
        res = getSubTotal(invoice?.products, gst);
      }
      return res;
    },
    [invoice],
  );

  const gstCost = useMemo(
    () => {
      let res = 0;
      if (invoice?.products) {
        res = getGst(invoice?.products, gst);
      }
      return res;
    },
    [invoice],
  );

  const totalCost = useMemo(
    () => {
      let res = 0;
      if (invoice?.products) {
        res = getTotal(invoice?.products);
      }
      return res;
    },
    [invoice],
  );

  return (
    <Paper {...other}>
      <Scrollbar>
        <Box
          sx={{
            minWidth: 800,
            p: 6
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
            >
              <Grid item>
                <Typography
                  color="textPrimary"
                  variant="body2"
                >
                  {organisation.company_address_street_one}
                  <br />
                  {organisation.company_address_postcode}
                  <br />
                  {`${organisation.company_address_city}, ${organisation.company_address_state}, ${organisation.company_address_country}`}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  color="textPrimary"
                  variant="body2"
                >
                  {organisation.company_abn}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  align="right"
                  color="textPrimary"
                  variant="body2"
                >
                  {organisation.contact_email}
                  <br />
                  {organisation.company_phone}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ my: 4 }}>
            <Grid
              container
              justifyContent="space-between"
            >
              <Grid item>
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="subtitle2"
                >
                  Due date
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="body2"
                >
                  {moment(invoice.due_date).format('dd MMM yyyy')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="subtitle2"
                >
                  Date of issue
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="body2"
                >
                  {moment(invoice.send_date).format('dd MMM yyyy')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="subtitle2"
                >
                  Job
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="body2"
                >
                  {invoice.job_template_name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="subtitle2"
                >
                  Number
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="body2"
                >
                  {invoice.prefixed_invoice_no}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ my: 4 }}>
            <Typography
              color="textPrimary"
              gutterBottom
              variant="subtitle2"
            >
              Billed to
            </Typography>
            <Typography
              color="textPrimary"
              variant="body2"
            >
              {`${invoice.contact_first_name} ${invoice.contact_last_name}`}
              <br />
              {invoice.email}
              <br />
              {invoice.address}
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography
              color="textSecondary"
              variant="body2"
              dangerouslySetInnerHTML={{ __html: invoice.contact_intro }}
            />
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Description
                </TableCell>
                <TableCell>
                  QTY
                </TableCell>
                <TableCell
                  sx={{
                    width: 150
                  }}
                >
                  Unit price
                </TableCell>
                <TableCell />
                <TableCell align="right">
                  Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.name}
                  </TableCell>
                  <TableCell>
                    {product.quantity}
                  </TableCell>
                  <TableCell>
                    {numeral(product.unit_price).format('$0,0.00')}
                  </TableCell>
                  <TableCell />
                  <TableCell align="right">
                    {numeral(product.cost).format('$0,0.00')}
                  </TableCell>
                </TableRow>
              ))}
              {organisation.gst_enabled && (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={3}
                    />
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="subtitle1"
                        sx={{
                          textTransform: 'uppercase'
                        }}
                      >
                        Subtotal
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                        sx={{
                          fontWeight: 'fontWeightBold'
                        }}
                      >
                        {numeral(subTotalCost).format('$0,0.00')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={3}
                    />
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="subtitle1"
                        sx={{
                          textTransform: 'uppercase'
                        }}
                      >
                        Gst
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                        sx={{
                          fontWeight: 'fontWeightBold'
                        }}
                      >
                        {numeral(gstCost).format('$0,0.00')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </>
              )}
              <TableRow>
                <TableCell
                  colSpan={3}
                />
                <TableCell>
                  <Typography
                    color="textPrimary"
                    variant="subtitle1"
                    sx={{
                      textTransform: 'uppercase'
                    }}
                  >
                    Total
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                    sx={{
                      fontWeight: 'fontWeightBold'
                    }}
                  >
                    {numeral(totalCost).format('$0,0.00')}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Paper>
  );
};

InvoicePreview.propTypes = {
  // @ts-ignore
  invoice: PropTypes.object.isRequired
};

export default InvoicePreview;
