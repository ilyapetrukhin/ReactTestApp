import { useCallback, useEffect, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { useConfirm } from 'material-ui-confirm';
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import PencilAltIcon from 'src/icons/PencilAlt';
import SearchIcon from 'src/icons/Search';
import axios from 'axios';
import { Trash as TrashIcon } from 'react-feather';
import toast from 'react-hot-toast';
import type { Brand } from 'src/types/product';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { apiConfig } from 'src/config';
import { useSelector } from 'src/store';
import PlusIcon from 'src/icons/Plus';
import { Scrollbar } from '../../scrollbar';
import ManageEntityModal, { ManageEntityType } from '../../widgets/modals/ManageEntityModal';

const applyFilters = (
  brands: Brand[],
  query: string
): Brand[] => brands
  .filter((brand) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (brand[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });

const BrandListTable: FC = (props) => {
  const { ...other } = props;

  const isMountedRef = useIsMountedRef();
  const confirm = useConfirm();
  const { organisation } = useSelector((state) => state.account);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [manageBrand, setManageBrand] = useState<ManageEntityType | null>(null);
  const [query, setQuery] = useState<string>('');

  const getBrands = useCallback(async () => {
    try {
      const response = await axios.get(`${apiConfig.apiV1Url}/organisations/${organisation.id}/productsbrands?orderBy=name`);

      if (isMountedRef.current) {
        setBrands(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getBrands();
  }, []);

  useEffect(() => {
    setQuery(query);
  }, [brands]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleDelete = (brand: Brand) => {
    confirm({ description: `This will permanently delete the brand ${brand.name}` })
      .then(async () => {
        await axios.delete(`${apiConfig.apiV1Url}/organisations/${organisation.id}/productsbrands/${brand.id}`);
        toast.success('Brand successfully deleted');
        setBrands(brands.filter((item) => item.id !== brand.id));
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  const handleModalSubmit = async (brand: ManageEntityType) => {
    const requestType = brand.mode === 'edit' ? 'put' : 'post';
    const requestUrl = brand.mode === 'edit'
      ? `${apiConfig.apiV1Url}/organisations/${organisation.id}/productsbrands/${brand.id}`
      : `${apiConfig.apiV1Url}/organisations/${organisation.id}/productsbrands`;
    return axios[requestType](requestUrl, { name: brand.name });
  };

  const handleAddModalOpen = (): void => {
    const newBrand = {
      name: '',
      mode: 'add'
    };
    setManageBrand(newBrand);
    setIsEditModalOpen(true);
  };

  const handleEditModalOpen = (brand: Brand): void => {
    setManageBrand({
      ...brand,
      mode: 'edit'
    });
    setIsEditModalOpen(true);
  };

  const handleModalClose = (updatedEntity?: ManageEntityType): void => {
    setIsEditModalOpen(false);
    setManageBrand(null);
    if (updatedEntity) {
      getBrands();
    }
  };

  const filteredBrandTypes = applyFilters(brands, query);

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
              placeholder="Search brand"
              value={query}
              variant="outlined"
            />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="primary"
            startIcon={<PlusIcon fontSize="small" />}
            sx={{ m: 1 }}
            onClick={handleAddModalOpen}
            variant="contained"
          >
            Add
          </Button>
        </Box>
        <Scrollbar>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBrandTypes.map((brand) => (
                  <TableRow
                    hover
                    onClick={() => handleEditModalOpen(brand)}
                    key={brand.id}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {brand.name}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        sx={{
                          color: 'primary.main',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModalOpen(brand);
                        }}
                      >
                        <PencilAltIcon />
                      </IconButton>
                      <IconButton
                        sx={{
                          color: 'error.main',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(brand);
                        }}
                      >
                        <TrashIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
      {isEditModalOpen && (
        <ManageEntityModal
          entity={manageBrand}
          title="brand"
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
          open={isEditModalOpen}
        />
      )}
    </>
  );
};

export default BrandListTable;
