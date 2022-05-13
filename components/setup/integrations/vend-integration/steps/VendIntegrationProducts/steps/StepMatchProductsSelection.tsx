import React, { FC, memo, useCallback } from 'react';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import {
  back,
  handleCurrentPageAndLoadMore,
  selectMatch,
} from 'src/slices/vendIntegrationSyncProducts';
import { useDispatch, useSelector } from 'src/store';

import ProductMatchRow from '../components/ProductMatchRow';

interface StepMatchContactsSelectionProps {}

const StepMatchContactsSelection: FC<StepMatchContactsSelectionProps> = memo(
  () => {
    const dispatch = useDispatch();
    const { id: organisationId } = useSelector(
      (state) => state.account.organisation
    );
    const {
      isLoading,
      isLoadingBack,
      handledProducts,
      productsCount,
      currentProductsPage,
      mapProductIdToVendProductId,
      products,
    } = useSelector((state) => state.vendIntegrationSyncProducts);
    const title = `${handledProducts} of ${productsCount} products processed`;
    const hasPrevPage = currentProductsPage > 1;

    const handleNext = useCallback(() => {
      dispatch(
        handleCurrentPageAndLoadMore(
          organisationId,
          currentProductsPage,
          mapProductIdToVendProductId
        )
      );
    }, [organisationId, currentProductsPage, mapProductIdToVendProductId]);
    const handleBack = useCallback(() => {
      dispatch(back(organisationId, currentProductsPage));
    }, [organisationId, currentProductsPage]);

    const handleChangeSelectedVendProductId = useCallback(
      (vendProductId: string, productId: number) => {
        dispatch(selectMatch({ vendProductId, productId }));
      },
      []
    );

    return (
      <Card>
        <CardHeader title={title} />
        <Divider />
        <CardContent>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: 'background.default',
              height: '100%',
              p: 2,
              mb: 3,
            }}
          >
            <Typography
              variant="body1"
              color="textPrimary"
            >
              Select the best matching product from the drop-down and click
              {' '}
              <Typography
                variant="body2"
                color="textPrimary"
                component="span"
                fontWeight="bold"
                sx={{
                  textTransform: 'uppercase',
                }}
              >
                next.
              </Typography>
            </Typography>
          </Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight="bold"
                  >
                    Pooltrackr product
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight="bold"
                  >
                    Vend product
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    minWidth: 110
                  }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((productMatch, index) => (
                <ProductMatchRow
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  productMatch={productMatch}
                  selectedVendProductId={
                    mapProductIdToVendProductId[productMatch.id]
                  }
                  onChange={(vendProductId) => handleChangeSelectedVendProductId(
                    vendProductId,
                    productMatch.id
                  )}
                />
              ))}
            </TableBody>
          </Table>
          <Box
            display="flex"
            justifyContent="center"
            mt={3}
          >
            {hasPrevPage && (
              <LoadingButton
                loading={isLoadingBack}
                disabled={isLoading}
                variant="outlined"
                sx={{ mr: 3, textTransform: 'uppercase' }}
                onClick={handleBack}
              >
                Back
              </LoadingButton>
            )}
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
  }
);

StepMatchContactsSelection.propTypes = {};

export default StepMatchContactsSelection;
