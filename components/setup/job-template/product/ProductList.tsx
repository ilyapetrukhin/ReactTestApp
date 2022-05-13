import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ListItem,
  List,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
} from '@mui/material';
import { Trash as TrashIcon } from 'react-feather';
import { styled } from '@mui/material/styles';
import type { Product } from 'src/types/product';
import ProductAdd from './ProductAdd';
import { TransitionGroup } from 'react-transition-group';

interface ProductsListProps {
  products: Product[];
  onAdd?: (product: Product | null) => void;
  onDelete?: (productId: number) => void;
}

const ProductsListRoot = styled('div')();

const ProductList: FC<ProductsListProps> = (props) => {
  const { products, onAdd, onDelete } = props;

  const handleAddProduct = (product: Product): void => {
    if (onAdd) {
      onAdd(product);
    }
  };

  const handleDeleteProduct = (productId: number): void => {
    if (onDelete) {
      onDelete(productId);
    }
  };

  return (
    <ProductsListRoot>
      <List component="div">
        <TransitionGroup>
          {products.map((product) => (
            <Collapse key={product.id}>
              <ListItem
                sx={{
                  py: 2
                }}
                disableGutters
                divider
              >
                <ListItemText primary={product.name} />
                <ListItemSecondaryAction>
                  <IconButton
                    sx={{
                      color: 'error.main',
                    }}
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <TrashIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
      <Box
        sx={{
          mt: 1
        }}
      >
        <ProductAdd onAdd={handleAddProduct} />
      </Box>
    </ProductsListRoot>
  );
};

ProductList.propTypes = {
  // @ts-ignore
  products: PropTypes.array.isRequired,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ProductList;
