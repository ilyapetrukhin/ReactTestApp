import * as Yup from 'yup';
import { Product } from '../../types/product';

export const PRODUCT_LIST_COLUMN_TITLE = 'title';
export const PRODUCT_LIST_COLUMN_SKU = 'sku';
export const PRODUCT_LIST_COLUMN_VOLUME = 'volume';
export const PRODUCT_LIST_COLUMN_UNITS = 'units';
export const PRODUCT_LIST_COLUMN_BRAND = 'brand';
export const PRODUCT_LIST_COLUMN_PRICE = 'price';
export const PRODUCT_LIST_COLUMN_ACTIVE = 'active';
export const validationSchemaFormik = () => (
  {
    product_category_id: Yup.number(),
    product_brand_id: Yup.number(),
    product_metric_id: Yup.number().required(),
    barcode_text: Yup.string().max(255),
    volume: Yup.number().required('Volume is required'),
    is_gst_price: Yup.bool().required(),
    name: Yup.string().max(255).required('Product title is required'),
    cost: Yup.number().min(0, 'Price must be greater than or equal to 0').required('Price is required'),
    sku: Yup.string().max(255),
  }
);
export const initialValuesFormik = (data:Product) => (
  {
    product_category_id: data.product_category_id,
    product_brand_id: data.product_brand_id ? data.product_brand_id : '',
    linkProductToChemicalTest: false,
    linkProductToObservationTest: false,
    is_gst_price: Boolean(data.is_gst_price),
    product_metric_id: data.product_metric_id,
    name: data.name,
    cost: data.cost,
    barcode_text: data.barcode_text ? data.barcode_text : '',
    sku: data.sku ? data.sku : '',
    volume: data.volume,
    submit: null
  }
);
