import first from 'lodash/first';
import React from 'react';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  TextField,
  Switch
} from '@mui/material';
import { useSelector } from 'src/store';
import { useAddMutation } from 'src/api/product';

interface ProductCreateFormProps {
  className?: string;
}

const ProductCreateForm: FC<ProductCreateFormProps> = ({ className, ...rest }) => {
  const router = useRouter();
  const { organisation } = useSelector((state) => state.account);
  const { categories, brands, metrics } = useSelector((state) => state.product);
  const [addRequest] = useAddMutation();

  return (
    <Formik
      initialValues={{
        product_category_id: first(categories).id,
        product_brand_id: '',
        linkProductToChemicalTest: false,
        linkProductToObservationTest: false,
        visibility: true,
        is_gst_price: false,
        product_metric_id: first(metrics).id,
        name: '',
        cost: '',
        barcode_text: '',
        sku: '',
        volume: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        product_category_id: Yup.number(),
        product_brand_id: Yup.number(),
        product_metric_id: Yup.number().required(),
        barcode_text: Yup.string().max(255),
        volume: Yup.number().required('Volume is required'),
        visibility: Yup.bool().required(),
        is_gst_price: Yup.bool().required(),
        name: Yup.string().max(255).required('Product title is required'),
        cost: Yup.number().min(0, 'Price must be greater than or equal to 0').required('Price is required'),
        sku: Yup.string().max(255),
      })}
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
            visibility: +values.visibility,
            name: values.name,
            cost: values.cost,
            barcode_text: values.barcode_text,
            sku: values.sku,
            volume: values.volume,
            quantity: 1,
            product_brand_id: values.product_brand_id
          };
          // TODO: move to the slice
          await addRequest({ organisationId: organisation.id, body: data });
          setStatus({ success: true });
          setSubmitting(false);
          router.push('/products');
        } catch (err) {
          console.error(err);
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
        <form
          onSubmit={handleSubmit}
          noValidate
          className={className}
          {...rest}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              lg={8}
            >
              <Card>
                <CardContent>
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
                  <Box mt={2}>
                    <Grid
                      container
                      alignItems="center"
                      spacing={3}
                    >
                      <Grid
                        item
                        xs={6}
                        md={6}
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
                              key={category.id}
                              value={category.id}
                            >
                              {category.name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        md={6}
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
                              key={brand.id}
                              value={brand.id}
                            >
                              {brand.name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Price details" />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      alignItems="center"
                      spacing={3}
                    >
                      <Grid
                        item
                        xs={6}
                        md={6}
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
                        xs={6}
                        md={6}
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
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              lg={4}
            >
              <Card>
                <CardHeader title="Details" />
                <Divider />
                <CardContent>
                  <Box
                    ml={1}
                    mt={1}
                  >
                    <FormControlLabel
                      control={(
                        <Switch
                          checked={values.visibility}
                          color="primary"
                          edge="start"
                          name="visibility"
                          onChange={handleChange}
                          value={values.visibility}
                        />
                      )}
                      label="Active"
                    />
                  </Box>
                  <Box mt={2}>
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
                  </Box>
                  <Box mt={2}>
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
                  </Box>
                  <Box mt={2}>
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
                  </Box>
                  <Box mt={2}>
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
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              Create product
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

ProductCreateForm.propTypes = {
  className: PropTypes.string
};

export default ProductCreateForm;
