import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useConfirm } from 'material-ui-confirm';
import Pluralize from 'pluralize';

import CheckCircleFilledIcon from 'src/icons/CheckCircleFilled';
import { useDispatch, useSelector } from 'src/store';
import {
  deleteUnassociatedProducts,
  handleCurrentPageAndLoadMore,
  loadProductsCount,
} from 'src/slices/vendIntegrationSyncProducts';
import { LoadingButton } from '@mui/lab';

interface StepInfoProps {}

const StepInfo: FC<StepInfoProps> = memo(() => {
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const {
    isDeletingUnassociatedProducts,
    isLoadingProductsCount,
    isSomethingWentWrong,
    productsCount,

    isLoading: isSyncingProducts,
  } = useSelector((state) => state.vendIntegrationSyncProducts);

  const productsCountText = useMemo(
    () => Pluralize('product', productsCount, true),
    [productsCount]
  );

  const handleDeleteUnassociatedProducts = useCallback(async () => {
    await confirm({
      description: 'This will delete all unassociated products from Pooltrackr.',
      confirmationText: 'Yes',
      cancellationText: 'No',
    })
      .then(() => dispatch(deleteUnassociatedProducts(organisationId)))
      .catch(() => {});
  }, [organisationId]);

  const handleSyncProducts = useCallback(async () => {
    dispatch(handleCurrentPageAndLoadMore(organisationId, 0, {}));
  }, [organisationId]);

  useEffect(() => {
    dispatch(loadProductsCount(organisationId));
  }, [organisationId]);

  useEffect(() => {
    if (isSomethingWentWrong) {
      toast.error('Something went wrong!\n\n Reload the page or contact us');
    }
  }, [isSomethingWentWrong]);

  if (isSomethingWentWrong) {
    return null;
  }

  if (isLoadingProductsCount) {
    return (
      <Box
        display="flex"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardHeader title="Sync products" />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            sm={6}
            xs={12}
          >
            <Typography
              fontWeight="bold"
              variant="body2"
              color="textPrimary"
              sx={{ mb: 3 }}
            >
              Continue syncing if:
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <CheckCircleFilledIcon sx={{ color: 'success.main', mr: 2 }} />
              <Typography
                variant="body2"
                color="textPrimary"
              >
                You only have products in Pooltrackr
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <CheckCircleFilledIcon sx={{ color: 'success.main', mr: 2 }} />
              <Typography
                variant="body2"
                color="textPrimary"
              >
                You only have products in Vend
                {' '}
                <Typography
                  component="span"
                  fontWeight="bold"
                  variant="body2"
                  color="textPrimary"
                >
                  OR
                </Typography>
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <CheckCircleFilledIcon sx={{ color: 'success.main', mr: 2 }} />
              <Typography
                variant="body2"
                color="textPrimary"
              >
                You have products in both systems but they are the same or
                similar
              </Typography>
            </Box>
            <LoadingButton
              variant="contained"
              sx={{ mt: 3, textTransform: 'uppercase' }}
              disabled={isDeletingUnassociatedProducts}
              loading={isSyncingProducts}
              onClick={handleSyncProducts}
            >
              Continue syncing products
            </LoadingButton>
          </Grid>
          <Grid
            item
            sm={6}
            xs={12}
          >
            <Paper
              elevation={0}
              sx={{
                backgroundColor: 'background.default',
                p: 2,
                mb: 3,
              }}
            >
              <Typography
                color="primary"
                variant="h6"
                sx={{ mb: 2 }}
              >
                Clean up your product data
              </Typography>
              <Typography
                variant="body2"
                color="textPrimary"
                sx={{ mb: 2 }}
              >
                If you have products in Pooltrackr and in Vend and they are very
                different (eg same product but different SKU and price) you
                might want to clean up your data:
              </Typography>
              <Typography
                variant="body2"
                color="textPrimary"
                sx={{ mb: 2 }}
              >
                1. Export your products from Pooltrackr
              </Typography>
              <Typography
                variant="body2"
                color="textPrimary"
                sx={{ mb: 2 }}
              >
                2. Check through them and import into Vend or merge them with
                existing products
              </Typography>
              <Typography
                variant="body2"
                color="textPrimary"
                sx={{ mb: 2 }}
              >
                3. Press the DELETE UNASSOCIATED PRODUCTS button below:
              </Typography>
              <Typography
                variant="body2"
                color="textPrimary"
                sx={{ mb: 2 }}
              >
                This will remove
                {' '}
                <Typography
                  variant="body2"
                  color="textPrimary"
                  fontWeight="bold"
                  component="span"
                >
                  {productsCountText}
                </Typography>
                {' '}
                that are not associated with a job, job template or quote. The
                integration will then re-import them from Vend.
              </Typography>
              <LoadingButton
                variant="outlined"
                sx={{ textTransform: 'uppercase' }}
                loading={isDeletingUnassociatedProducts}
                disabled={isSyncingProducts}
                onClick={handleDeleteUnassociatedProducts}
              >
                Delete unassociated products
              </LoadingButton>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

export default StepInfo;
