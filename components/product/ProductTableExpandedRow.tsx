import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControlLabel, FormHelperText,
  Grid,
  Switch, TextField,
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useEditProductMutation } from 'src/api/product';
import { useSelector } from '../../store';
import ArrowLeftIcon from '../../icons/ArrowLeft';
import { Product } from '../../types/product';
import { initialValuesFormik, validationSchemaFormik } from './constants';

interface ProductTableExpandedRowProps {
  product: Product;
  className?: string;
  isExpanded: boolean;
  setExpandedProductId?: (expandedProductId: number | null) => void;
}

const ProductTableExpandedRow: FC<ProductTableExpandedRowProps> = (props) => {
  const { className, product, isExpanded, setExpandedProductId, ...other } = props;
  const { organisation } = useSelector((state) => state.account);
  const { categories, brands, metrics } = useSelector((state) => state.product);
  const [editRequest] = useEditProductMutation();

  return (
    <Formik
      initialValues={initialValuesFormik(product)}
      validationSchema={Yup.object().shape(validationSchemaFormik())}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          const data = {
            product_category_id: values.product_category_id,
            product_metric_id: values.product_metric_id,
            is_gst_price: +values.is_gst_price,
            name: values.name,
            cost: values.cost,
            barcode_text: values.barcode_text,
            sku: values.sku,
            volume: values.volume,
            quantity: 1,
            product_brand_id: values.product_brand_id
          };
          await editRequest({
            organisationId: organisation.id,
            id: parseInt(product.id.toString(), 10),
            body: data
          });
          setStatus({ success: true });
          setSubmitting(false);
          setExpandedProductId(null);
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <Collapse
          in={isExpanded}
          timeout="auto"
          unmountOnExit
          {...other}
        >
          <form
            noValidate
            onSubmit={handleSubmit}
            className={className}
          >
            <Grid
              sx={{
                p: 2
              }}
              container
              spacing={2}
            >
              <Grid
                item
                xs={4}
                lg={3}
                xl={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextField
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  label="Product title"
                  required
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={4}
                lg={2}
                xl={2}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextField
                  fullWidth
                  label="Category"
                  name="product_category_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={values.product_category_id}
                  variant="outlined"
                >
                  {categories.map((category) => (
                    <option
                      key={`${category.id}_category`}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                xs={4}
                lg={2}
                xl={2}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextField
                  fullWidth
                  label="Brand"
                  name="product_brand_id"
                  placeholder="Select brand"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={values.product_brand_id}
                  variant="outlined"
                >
                  <option
                    key="none"
                    value="none"
                  >
                    Select brand
                  </option>
                  {brands.map((brand) => (
                    <option
                      key={`${brand.id}_brand`}
                      value={brand.id}
                    >
                      {brand.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                xs={4}
                lg={2}
                xl={2}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextField
                  error={Boolean(touched.cost && errors.cost)}
                  fullWidth
                  helperText={touched.cost && errors.cost}
                  label="Price"
                  name="cost"
                  type="number"
                  required
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.cost}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={4}
                lg={3}
                xl={2}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <FormControlLabel
                  control={(
                    <Switch
                      checked={values.is_gst_price}
                      color="primary"
                      edge="start"
                      name="is_gst_price"
                      onChange={handleChange}
                      value={values.is_gst_price}
                    />
)}
                  label="GST included"
                />
              </Grid>
            </Grid>
            <Grid
              sx={{
                p: 2
              }}
              container
              spacing={2}
            >
              <Grid
                item
                xs={4}
                lg={3}
                xl={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextField
                  error={Boolean(touched.sku && errors.sku)}
                  fullWidth
                  helperText={touched.sku && errors.sku}
                  label="SKU"
                  name="sku"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.sku}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={4}
                lg={3}
                xl={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextField
                  error={Boolean(touched.barcode_text && errors.barcode_text)}
                  fullWidth
                  helperText={touched.barcode_text && errors.barcode_text}
                  label="Barcode"
                  name="barcode_text"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.barcode_text}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={4}
                lg={3}
                xl={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextField
                  error={Boolean(touched.volume && errors.volume)}
                  fullWidth
                  helperText={touched.volume && errors.volume}
                  label="Volume"
                  name="volume"
                  required
                  type="number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.volume}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={4}
                lg={3}
                xl={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextField
                  fullWidth
                  label="Unit"
                  required
                  name="product_metric_id"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={values.product_metric_id}
                  variant="outlined"
                >
                  {metrics.map((metric) => (
                    <option
                      key={metric.id}
                      value={metric.id}
                    >
                      {metric.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>
                  {errors.submit}
                </FormHelperText>
              </Box>
              )}
              <Grid
                item
                xl={2}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <Box mt={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Update product
                  </Button>
                </Box>
              </Grid>
              <Grid
                item
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <Box mt={2}>
                  <Button
                    color="primary"
                    onClick={() => setExpandedProductId(null)}
                    startIcon={<ArrowLeftIcon fontSize="small" />}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Collapse>
      )}
    </Formik>
  );
};

ProductTableExpandedRow.propTypes = {
  product: PropTypes.any,
  isExpanded: PropTypes.bool.isRequired,
  setExpandedProductId: PropTypes.func
};

export default ProductTableExpandedRow;
