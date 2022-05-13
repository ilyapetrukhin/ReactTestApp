import React, { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import type { Invoice } from 'src/types/job';
import PlusIcon from 'src/icons/Plus';
import ProductSearch from 'src/components/widgets/search-inputs/ProductSearch';
import type { Product } from 'src/types/product';
import { transformProductToInvoice } from 'src/utils/job';
import { ManageInvoiceModal } from 'src/components/widgets/modals';

interface InvoiceAddProps {
  onAdd?: (invoice: Invoice | null) => void;
}

const InvoiceAdd: FC<InvoiceAddProps> = (props) => {
  const { onAdd, ...other } = props;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  const handleAdd = (): void => {
    setIsExpanded(true);
  };

  const handleSubmitCustom = (invoice: Invoice): void => {
    if (invoice && onAdd) {
      onAdd(invoice);
      setIsCustomModalOpen(false);
      setIsExpanded(false);
    }
  };

  const handleAddCustom = (): void => {
    setIsCustomModalOpen(true);
  };

  const handleCancelCustom = (): void => {
    setIsCustomModalOpen(false);
  };

  const handleCancel = (): void => {
    setIsExpanded(false);
  };

  const handleSelect = (product: Product): void => {
    if (product && onAdd) {
      const invoice = transformProductToInvoice(product);
      onAdd(invoice);
      setIsExpanded(false);
    }
  };

  return (
    <div {...other}>
      {
        isExpanded
          ? (
            <div>
              <ProductSearch onSelect={handleSelect} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 2
                }}
              >
                <Button
                  color="primary"
                  startIcon={<PlusIcon fontSize="small" />}
                  onClick={handleAddCustom}
                  size="small"
                  variant="text"
                >
                  Add custom
                </Button>
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
          )
          : (
            <Button
              color="primary"
              startIcon={<PlusIcon fontSize="small" />}
              onClick={handleAdd}
              size="small"
              variant="text"
            >
              Add item
            </Button>
          )
      }
      {isCustomModalOpen && (
        <ManageInvoiceModal
          onSubmit={handleSubmitCustom}
          onClose={handleCancelCustom}
          open={isCustomModalOpen}
        />
      )}
    </div>
  );
};

InvoiceAdd.propTypes = {
  onAdd: PropTypes.func,
};

export default InvoiceAdd;
