import React, { FC, memo, useCallback } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Table,
  TableBody,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { Scrollbar } from 'src/components/scrollbar';
import {
  backUnmatchedVend,
  handleCurrentPageOfUnmatchedVendAndLoadMore,
  ignoreAllVendContacts,
  ignoreVendProduct,
} from 'src/slices/vendIntegrationSyncProducts';
import { useDispatch, useSelector } from 'src/store';

import ProductIgnoreRow from '../components/ProductIgnoreRow';

interface StepUnmatchedVendProps {}

const StepUnmatchedVend: FC<StepUnmatchedVendProps> = memo(() => {
  const dispatch = useDispatch();
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const {
    isLoading,
    isLoadingBack,

    unmatchedVendProducts,
    ignoreUnmatchedVendProductIds,
    unmatchedVendProductsPage,
    unmatchedVendProductsTotal,

    currentProductsPage,
  } = useSelector((state) => state.vendIntegrationSyncProducts);

  const handleIgnoreAll = useCallback(() => {
    dispatch(ignoreAllVendContacts({ ignored: true }));
  }, []);

  const handleCreateAll = useCallback(() => {
    dispatch(ignoreAllVendContacts({ ignored: false }));
  }, []);

  const onChangeIgnore = useCallback(
    (vendProductId: string, ignored: boolean) => {
      dispatch(ignoreVendProduct({ vendProductId, ignored }));
    },
    []
  );

  const handleBack = useCallback(() => {
    dispatch(
      backUnmatchedVend(
        organisationId,
        unmatchedVendProductsPage,
        currentProductsPage
      )
    );
  }, [organisationId, unmatchedVendProductsPage, currentProductsPage]);

  const handleNext = useCallback(() => {
    dispatch(
      handleCurrentPageOfUnmatchedVendAndLoadMore(
        organisationId,
        unmatchedVendProductsPage,
        ignoreUnmatchedVendProductIds,
        unmatchedVendProducts
      )
    );
  }, [
    organisationId,
    unmatchedVendProductsPage,
    ignoreUnmatchedVendProductIds,
    unmatchedVendProducts,
  ]);

  return (
    <Card>
      <CardHeader title="Create or ignore Vend products" />
      <Divider />
      <CardContent>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'background.default',
            height: '100%',
            p: 2,
          }}
        >
          <Typography
            variant="body2"
            color="textPrimary"
          >
            <Typography
              variant="body2"
              color="textPrimary"
              component="span"
              fontWeight="bold"
            >
              You have
              {' '}
              {unmatchedVendProductsTotal}
              {' '}
              products in Vend that have
              no matches in Pooltrackr.
            </Typography>
            {' '}
            Create in Pooltrackr or ignore to proceed.
          </Typography>
        </Paper>
        <Box
          display="flex"
          justifyContent="flex-end"
          mt={3}
        >
          <Button
            variant="outlined"
            sx={{ mr: 3, textTransform: 'uppercase' }}
            onClick={handleIgnoreAll}
          >
            Ignore all
          </Button>
          <Button
            sx={{ textTransform: 'uppercase' }}
            variant="contained"
            onClick={handleCreateAll}
          >
            Create all
          </Button>
        </Box>
        <Scrollbar>
          <Table>
            <TableBody>
              {unmatchedVendProducts.map((product) => (
                <ProductIgnoreRow
                  key={product.id}
                  product={product}
                  ignored={ignoreUnmatchedVendProductIds.includes(
                    product.vend_product_id
                  )}
                  onChangeIgnore={(ignored) => onChangeIgnore(product.vend_product_id, ignored)}
                />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
        <Box
          display="flex"
          justifyContent="center"
          mt={3}
        >
          <LoadingButton
            loading={isLoadingBack}
            disabled={isLoading}
            variant="outlined"
            sx={{ mr: 3, textTransform: 'uppercase' }}
            onClick={handleBack}
          >
            Back
          </LoadingButton>
          <LoadingButton
            loading={isLoading}
            disabled={isLoadingBack}
            variant="contained"
            sx={{ textTransform: 'uppercase' }}
            onClick={handleNext}
          >
            Next
          </LoadingButton>
        </Box>
      </CardContent>
    </Card>
  );
});

StepUnmatchedVend.propTypes = {};

export default StepUnmatchedVend;
