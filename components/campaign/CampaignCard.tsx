import React from 'react';
import type { FC } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { formatDistanceToNowStrict } from 'date-fns';
import moment from 'moment';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  Link,
  Switch,
  Typography
} from '@mui/material';
import type { Campaign } from 'src/types/campaign';
import { Edit as EditIcon, Trash as TrashIcon } from 'react-feather';
import { deleteCampaign, updateCampaign } from 'src/slices/campaign';
import { useDispatch, useSelector } from 'src/store';
import toast from 'react-hot-toast';
import { useConfirm } from 'material-ui-confirm';

interface CampaignCardProps {
  campaign: Campaign;
  mode?: string;
}

const CampaignCard: FC<CampaignCardProps> = (props) => {
  const { campaign, mode, ...other } = props;
  const { organisation } = useSelector((state) => state.account);
  const { searchText, page, limit, order, orderBy } = useSelector((state) => state.campaign);
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const handleDelete = (campaign: Campaign) => {
    confirm({ description: `This will permanently delete ${campaign.name}` })
      .then(async () => {
        await dispatch(deleteCampaign(organisation.id, campaign.id));
        toast.success('Campaign successfully deleted');
      })
      .catch(() => {});
  };

  return (
    <Card {...other}>
      <Box sx={{ p: 2 }}>
        <CardMedia
          component="img"
          image={campaign.banner_url}
          sx={{
            height: 140,
            width: '100%',
            objectFit: 'contain'
          }}
        />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mt: 2
          }}
        >
          <Box sx={{ ml: 1 }}>
            <NextLink
              href="#"
              passHref
            >
              <Link
                color="textPrimary"
                variant="h6"
              >
                {campaign.name}
              </Link>
            </NextLink>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Updated
              {' '}
              {formatDistanceToNowStrict(moment(campaign.updated_at).toDate())}
              {' '}
              ago
            </Typography>
          </Box>
        </Box>
      </Box>
      <CardContent
        sx={{ ml: 1 }}
      >
        <Formik
          enableReinitialize
          initialValues={{
            email_enabled: campaign.email_enabled,
            job_sheet_enabled: campaign.job_sheet_enabled,
            water_test_enabled: campaign.water_test_enabled,
            invoice_enabled: campaign.invoice_enabled,
            submit: null
          }}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }): Promise<void> => {
            try {
              const data = {
                name: campaign.name,
                start_date: campaign.start_date,
                expiry_date: campaign.expiry_date,
                email_enabled: values.email_enabled,
                job_sheet_enabled: values.job_sheet_enabled,
                water_test_enabled: values.water_test_enabled,
                invoice_enabled: values.invoice_enabled,
              };

              const sortBy = orderBy ? `${order === 'desc' ? '-' : ''}${orderBy}` : '';
              await dispatch(updateCampaign(organisation.id, campaign.id, data, limit, page, searchText, sortBy));

              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              toast.success('Campaign successfully updated');
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({
            handleChange,
            submitForm,
            values
          }): JSX.Element => (
            <form noValidate>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={mode === 'grid' ? 6 : 3}
                  sm={mode === 'grid' ? 6 : 6}
                  xs={6}
                >
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="subtitle2"
                  >
                    Email footer
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Some descriptive text
                  </Typography>
                  <Switch
                    checked={values.email_enabled}
                    color="primary"
                    defaultChecked={values.email_enabled}
                    onChange={(event): void => {
                      handleChange(event);
                      submitForm();
                    }}
                    edge="start"
                    name="email_enabled"
                  />
                </Grid>
                <Grid
                  item
                  md={mode === 'grid' ? 6 : 3}
                  sm={mode === 'grid' ? 6 : 6}
                  xs={6}
                >
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="subtitle2"
                  >
                    Job sheet
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Some descriptive text
                  </Typography>
                  <Switch
                    checked={values.job_sheet_enabled}
                    color="primary"
                    defaultChecked={values.job_sheet_enabled}
                    onChange={(event): void => {
                      handleChange(event);
                      submitForm();
                    }}
                    edge="start"
                    name="job_sheet_enabled"
                  />
                </Grid>
                <Grid
                  item
                  md={mode === 'grid' ? 6 : 3}
                  sm={mode === 'grid' ? 6 : 6}
                  xs={6}
                >
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="subtitle2"
                  >
                    Invoice
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Some descriptive text
                  </Typography>
                  <Switch
                    checked={values.invoice_enabled}
                    color="primary"
                    defaultChecked={values.invoice_enabled}
                    onChange={(event): void => {
                      handleChange(event);
                      submitForm();
                    }}
                    edge="start"
                    name="invoice_enabled"
                  />
                </Grid>
                <Grid
                  item
                  md={mode === 'grid' ? 6 : 3}
                  sm={mode === 'grid' ? 6 : 6}
                  xs={6}
                >
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="subtitle2"
                  >
                    Water test
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    Some descriptive text
                  </Typography>
                  <Switch
                    checked={values.water_test_enabled}
                    color="primary"
                    defaultChecked={values.water_test_enabled}
                    onChange={(event): void => {
                      handleChange(event);
                      submitForm();
                    }}
                    edge="start"
                    name="water_test_enabled"
                  />
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </CardContent>
      <Box
        sx={{
          px: 3,
          py: 2
        }}
      >
        <Grid
          alignItems="center"
          container
          justifyContent="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              {campaign.start_date ? moment(campaign.start_date).format('DD MMM YYYY') : '-'}
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Started
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              {campaign.expiry_date ? moment(campaign.expiry_date).format('DD MMM YYYY') : '-'}
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Expires
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          pr: 2,
          py: 1
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
        <NextLink
          href={`/campaigns/${campaign.id}`}
          passHref
        >
          <IconButton
            sx={{
              color: 'primary.main',
            }}
          >
            <EditIcon />
          </IconButton>
        </NextLink>
        <IconButton
          sx={{
            color: 'error.main',
          }}
          onClick={() => handleDelete(campaign)}
        >
          <TrashIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

CampaignCard.propTypes = {
  // @ts-ignore
  campaign: PropTypes.object.isRequired,
  mode: PropTypes.string,
};

export default CampaignCard;
