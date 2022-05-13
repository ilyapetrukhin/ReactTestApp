import React, { ChangeEvent, useMemo, useState, memo, useCallback } from 'react';
import type { FC } from 'react';
import numeral from 'numeral';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { QuillEditor } from 'src/components/quill-editor';
import PhoneIcon from 'src/icons/Phone';
import type { InvoiceRecipient as InvoiceRecipientType } from 'src/types/invoice';
import { getGst, getSubTotal, getTotal } from 'src/utils/invoice';
import { useSelector } from 'src/store';
import InformationCircleIcon from 'src/icons/InformationCircle';
import axios from 'axios';
import InvoiceRecipientItems from './InvoiceRecipientItems';
import { HtmlModal } from '../widgets/modals';
import { apiConfig } from '../../config';

interface InvoiceRecipientProps {
  recipient: InvoiceRecipientType;
}

const InvoiceRecipient: FC<InvoiceRecipientProps> = (props) => {
  const { recipient, ...other } = props;
  const [subjectMessage, setSubjectMessage] = useState<string>(recipient.subject_message);
  const [configure, setConfigure] = useState<boolean>(false);
  const [isEmailPreview, setIsEmailPreview] = useState<boolean>(false);
  const [emailPreviewContent, setEmailPreviewContent] = useState<string>('');
  const [intro, setIntro] = useState<string>(recipient.contact_intro);
  const { gst, organisation } = useSelector((state) => state.account);

  const handleSubjectChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSubjectMessage(event.target.value);
  };

  const handleChangeIntro = (value: string): void => {
    setIntro(value);
  };

  const contact = useMemo(
    () => recipient.contact,
    [recipient],
  );

  const invoices = useMemo(
    () => recipient.products,
    [recipient],
  );

  const subTotalCost = useMemo(
    () => {
      let res = 0;
      if (recipient.products) {
        res = getSubTotal(recipient.products, gst);
      }
      return res;
    },
    [recipient, gst],
  );

  const gstCost = useMemo(
    () => {
      let res = 0;
      if (recipient.products) {
        res = getGst(recipient.products, gst);
      }
      return res;
    },
    [recipient, gst],
  );

  const totalCost = useMemo(
    () => {
      let res = 0;
      if (recipient.products) {
        res = getTotal(recipient.products);
      }
      return res;
    },
    [recipient],
  );

  const previewEmail = useCallback(async () => {
    const data = {
      issued_date: moment().format('YYYY-MM-DD'),
      date_of_visit: moment().format('YYYY-MM-DD'),
      due_date: moment().format('YYYY-MM-DD'),
      invoice_message: recipient.contact_intro,
      is_invoice_disp: 0,
    };
    const result = await axios.post(`${apiConfig.apiV2Url}/organisations/${organisation.id}/invoice/preview-email`, data);
    setEmailPreviewContent(result.data);
    setIsEmailPreview(true);
  }, [recipient, organisation]);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 1
      }}
      {...other}
    >
      <form onSubmit={(event) => event.preventDefault()}>
        <Card
          variant="outlined"
          sx={{
            backgroundColor: 'background.paper',
            p: 3
          }}
        >
          <Typography
            color="textPrimary"
            variant="h6"
          >
            {contact.full_name}
          </Typography>
          <Typography
            color="textSecondary"
            noWrap
            variant="body2"
          >
            {contact.full_address}
          </Typography>
          {contact.phones && recipient.contact.phones.length > 0 && (
            <Box
              mt={1}
            >
              {recipient.contact.phones.map((phone) => (
                <Chip
                  key={phone.id}
                  icon={<PhoneIcon fontSize="small" />}
                  label={phone.phone_number}
                  sx={{ mr: 1 }}
                  variant="outlined"
                />
              ))}
            </Box>
          )}
          <Box
            mt={2}
          >
            <TextField
              fullWidth
              label="Subject line"
              placeholder="Subject line"
              value={subjectMessage}
              onChange={handleSubjectChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Invoice number is generated after invoice submission">
                      <InformationCircleIcon
                        color="primary"
                        fontSize="small"
                      />
                    </Tooltip>
                  </InputAdornment>
                )
              }}
              variant="outlined"
            />
          </Box>
          <Box
            mt={2}
          >
            <Typography
              color="textPrimary"
              variant="h6"
            >
              INTRO MESSAGE
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              This appears in the email and PDF to customers
            </Typography>
            <Paper
              sx={{ mt: 3 }}
              variant="outlined"
            >
              <QuillEditor
                onChange={handleChangeIntro}
                placeholder="Description"
                name="intro_message"
                sx={{
                  border: 'none',
                  flexGrow: 1,
                  minHeight: 200
                }}
                value={intro}
              />
            </Paper>
          </Box>
          {invoices.length > 0 && (
            <>
              <Divider sx={{ mt: 2 }} />
              <InvoiceRecipientItems invoices={invoices} />
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 2
                }}
              >
                <Typography
                  color="textPrimary"
                  variant="subtitle1"
                  sx={{
                    textTransform: 'uppercase'
                  }}
                >
                  Subtotal
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'fontWeightBold'
                  }}
                >
                  {numeral(subTotalCost).format('$0,0.00')}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 2
                }}
              >
                <Typography
                  color="textPrimary"
                  variant="subtitle1"
                  sx={{
                    textTransform: 'uppercase'
                  }}
                >
                  Gst
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'fontWeightBold'
                  }}
                >
                  {numeral(gstCost).format('$0,0.00')}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Typography
                  color="textPrimary"
                  variant="subtitle1"
                  sx={{
                    textTransform: 'uppercase'
                  }}
                >
                  Total
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'fontWeightBold'
                  }}
                >
                  {numeral(totalCost).format('$0,0.00')}
                </Typography>
              </Box>
            </>
          )}
        </Card>
        <Grid
          container
          spacing={2}
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Grid
            item
          >
            <Typography
              color="textPrimary"
              gutterBottom
              variant="subtitle2"
            >
              Configure service report
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Some descriptive text
            </Typography>
            <Switch
              checked={configure}
              onChange={(event) => setConfigure(event.target.checked)}
              color="primary"
              edge="start"
              name="configure"
            />
          </Grid>
          <Grid
            item
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                color="primary"
                type="button"
                variant="text"
                onClick={() => previewEmail()}
              >
                Preview Email
              </Button>
              <Box>
                <Divider orientation="vertical" />
              </Box>
              <Button
                color="primary"
                type="button"
                variant="text"
              >
                Preview Invoice PDF
              </Button>
              <Box>
                <Divider orientation="vertical" />
              </Box>
              <Button
                color="primary"
                type="button"
                variant="text"
              >
                Preview Job Sheet PDF
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <HtmlModal
        content={emailPreviewContent}
        onClose={() => setIsEmailPreview(false)}
        open={isEmailPreview}
      />
    </Box>
  );
};

InvoiceRecipient.propTypes = {
  // @ts-ignore
  recipient: PropTypes.object.isRequired
};

export default memo(InvoiceRecipient);
