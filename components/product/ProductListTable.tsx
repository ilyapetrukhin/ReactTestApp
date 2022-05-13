import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import NextLink from 'next/link';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  InputAdornment,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  SortDirection,
  TextField,
  TableSortLabel,
  Tooltip,
  Switch
} from '@mui/material';
import {
  Edit as EditIcon,
  Trash as TrashIcon,
} from 'react-feather';
import SyncIcon from '@mui/icons-material/SyncAlt';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { alpha, useTheme } from '@mui/material/styles';
import { useConfirm } from 'material-ui-confirm';
import {
  setCategory,
  setLimit,
  setPage,
  setSearchText,
  setOrder,
  restoreEnabledColumns,
  setEnabledColumns
} from 'src/slices/product';
import VendIcon from 'src/icons/Vend';
import ImageIcon from 'src/icons/Image';
import SearchIcon from 'src/icons/Search';
import type { Product, Category } from 'src/types/product';
import { useDispatch, useSelector } from 'src/store';
import { Scrollbar } from '../scrollbar';
import ProductListBulkActions from './ProductListBulkActions';
import ColumnManagement, { Column } from '../ColumnManagement';
import {
  PRODUCT_LIST_COLUMN_ACTIVE,
  PRODUCT_LIST_COLUMN_BRAND,
  PRODUCT_LIST_COLUMN_PRICE,
  PRODUCT_LIST_COLUMN_SKU,
  PRODUCT_LIST_COLUMN_TITLE,
  PRODUCT_LIST_COLUMN_UNITS,
  PRODUCT_LIST_COLUMN_VOLUME
} from './constants';
import {
  useChangeVisibilityMutation,
  useDeleteProductMutation,
  useUpdateBulkMutation,
} from 'src/api/product';
import ProductTableExpandedRow from './ProductTableExpandedRow';

interface ProductListTableProps {
  products: Product[];
  isLoading: boolean;
}

function useColumnManagement(): [Column[], string[], (newIds: string[]) => void] {
  const dispatch = useDispatch();
  const { enabledColumns, enabledColumnsRestored } = useSelector((state) => state.product);
  const columns = useMemo<Column[]>(() => [
    {
      id: PRODUCT_LIST_COLUMN_TITLE,
      label: 'Product title',
    },
    {
      id: PRODUCT_LIST_COLUMN_SKU,
      label: 'SKU',
    },
    {
      id: PRODUCT_LIST_COLUMN_VOLUME,
      label: 'Volume',
    },
    {
      id: PRODUCT_LIST_COLUMN_UNITS,
      label: 'Units',
    },
    {
      id: PRODUCT_LIST_COLUMN_BRAND,
      label: 'Brand',
    },
    {
      id: PRODUCT_LIST_COLUMN_PRICE,
      label: 'Price',
    },
    {
      id: PRODUCT_LIST_COLUMN_ACTIVE,
      label: 'Active',
    },
  ], []);

  useEffect(() => {
    if (!enabledColumnsRestored) {
      dispatch(restoreEnabledColumns());
    }
  }, [enabledColumnsRestored]);

  useEffect(() => {
    if (enabledColumns == null && enabledColumnsRestored) {
      dispatch(setEnabledColumns(columns.map(({ id }) => id)));
    }
  }, [enabledColumns, enabledColumnsRestored]);

  const handleChangeColumns = useCallback((newIds: string[]) => {
    dispatch(setEnabledColumns(newIds));
  }, []);

  return [columns, enabledColumns || [], handleChangeColumns];
}

const ProductListTable: FC<ProductListTableProps> = (props) => {
  const { products, isLoading, ...other } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const confirm = useConfirm();
  const [deleteRequest] = useDeleteProductMutation();
  const [changeVisibilityRequest, { isLoading: isChangeVisibilityLoading }] = useChangeVisibilityMutation();
  const { organisation, isVendConnected, isXeroConnected } = useSelector((state) => state.account);
  const { categoryFilter, limit, page, total, categories, searchText, orderBy, order } = useSelector((state) => state.product);
  const [query, setQuery] = useState<string>('');
  const [expandedProductId, setExpandedProductId] = useState<number>(0);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([{
    id: 'all',
    name: 'All'
  }]);
  const [columns, selectedColumns, handleChangeColumns] = useColumnManagement();
  const [updateBulk, { isLoading: isUpdateBulkLoading }] = useUpdateBulkMutation();
  useEffect(() => {
    setQuery(searchText);
  }, []);

  useEffect(() => {
    setCategoryOptions([
      ...categoryOptions,
      ...categories
    ]);
  }, [categories]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
    event.persist();
    const handleChangeDebounce = debounce(() => {
      if (event.target.value === '' || event.target.value.length >= 3) {
        dispatch(setSearchText(event.target.value));
      }
    }, 2000);
    handleChangeDebounce();
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();

    dispatch(setCategory(event.target.value));
  };

  const handleSortChange = (orderBy: string, order: SortDirection): void => {
    dispatch(setOrder(orderBy, order));
  };

  const handleSelectAllProducts = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedProducts(event.target.checked
      ? products.map((product) => product.id)
      : []);
  };

  const handleSelectOneProduct = (event: ChangeEvent<HTMLInputElement>, productId: number): void => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const handleDelete = (product: Product) => {
    confirm({ description: `This will permanently delete ${product.name}` })
      .then(async () => {
        await deleteRequest({
          organisationId: organisation.id,
          id: parseInt(product.id.toString(), 10)
        });
      }).catch(() => {
      });
  };

  const handleChangeVisibility = async (product: Product): Promise<void> => {
    if (isChangeVisibilityLoading) return;
    await changeVisibilityRequest({
      organisationId: organisation.id,
      id: parseInt(product.id.toString(), 10),
      body: {
        visibility: +Boolean(!product.visibility)
      }
    });
  };

  const handleBulk = async (action:string): Promise<void> => {
    if (isUpdateBulkLoading) return;
    await updateBulk({
      organisationId: organisation.id,
      body: {
        action,
        products: selectedProducts.map((val) => ({ id: val }))
      }
    });
  };
  // Usually query is done on backend with indexing solutions
  const enableBulkActions = selectedProducts.length > 0;
  const selectedSomeProducts = selectedProducts.length > 0
        && selectedProducts.length < products.length;
  const selectedAllProducts = selectedProducts.length === products.length;

  return (
    <>
      <Card {...other}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            p: 2
          }}
        >
          <Box
            sx={{
              m: 1,
              mr: 2,
              maxWidth: '100%',
              width: 500
            }}
          >
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              onChange={handleQueryChange}
              placeholder="Search products"
              value={query}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
            }}
          >
            <TextField
              sx={{
                flexBasis: 200
              }}
              label="Category"
              name="category"
              onChange={handleCategoryChange}
              select
              SelectProps={{ native: true }}
              value={categoryFilter}
              variant="outlined"
            >
              {categoryOptions.map((categoryOption) => (
                <option
                  key={categoryOption.id}
                  value={categoryOption.id}
                >
                  {categoryOption.name}
                </option>
              ))}
            </TextField>
          </Box>
          <Box flexGrow={1} />
          <ColumnManagement
            columns={columns}
            selectedColumnIds={selectedColumns}
            onChange={handleChangeColumns}
          />
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllProducts}
                      indeterminate={selectedSomeProducts}
                      onChange={handleSelectAllProducts}
                    />
                  </TableCell>
                  {(isVendConnected || isXeroConnected) && <TableCell />}
                  {isVendConnected && <TableCell />}
                  {
                    selectedColumns.includes(PRODUCT_LIST_COLUMN_TITLE) && (
                      <TableCell
                        size="medium"
                        sortDirection={orderBy === 'name' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'name'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('name', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Product title
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(PRODUCT_LIST_COLUMN_SKU) && (
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'sku'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('sku', order === 'asc' ? 'desc' : 'asc')}
                        >
                          SKU
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(PRODUCT_LIST_COLUMN_VOLUME) && (
                      <TableCell>
                        Volume
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(PRODUCT_LIST_COLUMN_UNITS) && (
                      <TableCell>
                        Units
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(PRODUCT_LIST_COLUMN_BRAND) && (
                      <TableCell>
                        Brand
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(PRODUCT_LIST_COLUMN_PRICE) && (
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'cost'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('cost', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Price
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(PRODUCT_LIST_COLUMN_ACTIVE) && (
                      <TableCell>
                        Active
                      </TableCell>
                    )
                  }
                  <TableCell align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => {
                  const isProductSelected = selectedProducts.includes(product.id);

                  return (
                    <React.Fragment key={product.id}>
                      <TableRow
                        hover
                        onClick={() => {
                          if (expandedProductId === product.id) {
                            setExpandedProductId(null);
                          } else {
                            setExpandedProductId(product.id);
                          }
                        }}
                        selected={isProductSelected}
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <TableCell
                          padding="checkbox"
                          sx={{
                            borderLeft: expandedProductId === product.id ? `8px solid ${theme.palette.primary.main}` : 0
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isProductSelected}
                            onChange={(event) => handleSelectOneProduct(event, product.id)}
                            value={isProductSelected}
                          />
                        </TableCell>
                        {isXeroConnected && (
                        <TableCell>
                          <Tooltip title="Xero">
                            <SyncIcon color={product.vend_product_id ? 'primary' : 'error'} />
                          </Tooltip>
                        </TableCell>
                        )}
                        {isVendConnected && (
                        <TableCell align="center">
                          {product.vend_product_id
                            ? (
                              <Tooltip
                                title="Synced to Vend"
                              >
                                <VendIcon
                                  fontSize="large"
                                  sx={{
                                    color: theme.palette.success.main
                                  }}
                                />
                              </Tooltip>
                            )
                            : (
                              <Tooltip
                                title="Push product to Vend"
                              >
                                <IconButton
                                  onClick={() => {}}
                                >
                                  <VendIcon
                                    fontSize="large"
                                    sx={{
                                      color: alpha(theme.palette.error.main, 0.70)
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                        </TableCell>
                        )}
                        {isVendConnected && (
                        <TableCell>
                          {(Boolean(product.vend_product) && Boolean(product.vend_product.image_thumbnail_url)) ? (
                            <Box
                              sx={{
                                display: 'flex',
                                height: 40,
                                width: 40,
                                '& img': {
                                  width: '100%'
                                }
                              }}
                            >
                              <img
                                alt="Product"
                                src={product.vend_product.image_thumbnail_url}
                              />
                            </Box>
                          ) : (
                            <Box
                              p={2}
                              bgcolor="background.dark"
                            >
                              <ImageIcon />
                            </Box>
                          )}
                        </TableCell>
                        )}
                        {
                        selectedColumns.includes(PRODUCT_LIST_COLUMN_TITLE) && (
                          <TableCell size="medium">
                            <NextLink
                              href={`/products/${product.id}`}
                              passHref
                            >
                              <Link
                                variant="subtitle2"
                                color="textPrimary"
                                underline="none"
                              >
                                {product.name}
                              </Link>
                            </NextLink>
                          </TableCell>
                        )
                      }
                        {
                        selectedColumns.includes(PRODUCT_LIST_COLUMN_SKU) && (
                          <TableCell>
                            {product.sku}
                          </TableCell>
                        )
                      }
                        {
                        selectedColumns.includes(PRODUCT_LIST_COLUMN_VOLUME) && (
                          <TableCell>
                            {product.volume}
                          </TableCell>
                        )
                      }
                        {
                        selectedColumns.includes(PRODUCT_LIST_COLUMN_UNITS) && (
                          <TableCell>
                            {get(product, 'metric.name', '')}
                          </TableCell>
                        )
                      }
                        {
                        selectedColumns.includes(PRODUCT_LIST_COLUMN_BRAND) && (
                          <TableCell>
                            {get(product, 'brand.name', '')}
                          </TableCell>
                        )
                      }
                        {
                        selectedColumns.includes(PRODUCT_LIST_COLUMN_PRICE) && (
                          <TableCell>
                            {numeral(product.cost).format('$0,0.00')}
                          </TableCell>
                        )
                      }
                        {
                        selectedColumns.includes(PRODUCT_LIST_COLUMN_ACTIVE) && (
                          <TableCell
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Switch
                              checked={!!product.visibility}
                              disabled={isChangeVisibilityLoading || isLoading}
                              color="secondary"
                              edge="start"
                              name="visibility"
                              onChange={() => handleChangeVisibility(product)}
                              value={product.visibility}
                            />
                          </TableCell>
                        )
                      }
                        <TableCell
                          align="center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <NextLink
                            href={`/products/${product.id}`}
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
                            onClick={() => handleDelete(product)}
                          >
                            <TrashIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            p: 0,
                            borderLeft: expandedProductId === product.id ? `8px solid ${theme.palette.primary.main}` : 0,
                            borderBottom: expandedProductId === product.id ? `1px solid ${theme.palette.divider}` : 'none',
                          }}
                          colSpan={12}
                        >
                          <ProductTableExpandedRow
                            product={product}
                            setExpandedProductId={setExpandedProductId}
                            isExpanded={expandedProductId === product.id}
                          />
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={total}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </Scrollbar>
      </Card>
      <ProductListBulkActions
        onDelete={handleBulk}
        onMarkAsActive={handleBulk}
        onMarkAsInactive={handleBulk}
        open={enableBulkActions}
        selected={selectedProducts}
      />
    </>
  );
};

ProductListTable.propTypes = {
  products: PropTypes.array.isRequired,
};

export default ProductListTable;
