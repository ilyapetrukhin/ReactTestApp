import React, { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grow } from '@mui/material';
import type { Product } from 'src/types/product';
import ProductSearch from 'src/components/widgets/search-inputs/ProductSearch';
import { TransitionGroup } from 'react-transition-group';

interface ProductAddProps {
  onAdd?: (product: Product | null) => void;
}

const ProductAdd: FC<ProductAddProps> = (props) => {
  const { onAdd, ...other } = props;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleAdd = (): void => {
    setIsExpanded(true);
  };

  const handleCancel = (): void => {
    setIsExpanded(false);
  };

  const handleSelect = (product: Product): void => {
    if (product && onAdd) {
      onAdd(product);
      setIsExpanded(false);
    }
  };

  return (
    <div {...other}>
      {
        isExpanded
          ? (
            <TransitionGroup>
              <Grow>
                <div>
                  <ProductSearch onSelect={handleSelect} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mt: 2
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={handleCancel}
                      size="small"
                      variant="text"
                    >
                      Cancel
                    </Button>
                  </Box>
                </div>
              </Grow>
            </TransitionGroup>
          )
          : (
            <Button
              color="primary"
              onClick={handleAdd}
              size="small"
              variant="outlined"
            >
              Add product
            </Button>
          )
      }
    </div>
  );
};

ProductAdd.propTypes = {
  onAdd: PropTypes.func,
};

export default ProductAdd;
