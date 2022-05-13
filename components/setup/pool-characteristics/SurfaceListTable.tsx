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
import type { PoolSurfaceType } from 'src/types/pool';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { apiConfig } from 'src/config';
import { useSelector } from 'src/store';
import PlusIcon from 'src/icons/Plus';
import { Scrollbar } from '../../scrollbar';
import ManageEntityModal, { ManageEntityType } from '../../widgets/modals/ManageEntityModal';

const applyFilters = (
  surfaceTypes: PoolSurfaceType[],
  query: string
): PoolSurfaceType[] => surfaceTypes
  .filter((surface) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (surface[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });

const SurfaceListTable: FC = (props) => {
  const { ...other } = props;

  const isMountedRef = useIsMountedRef();
  const confirm = useConfirm();
  const { organisation } = useSelector((state) => state.account);
  const [surfaceTypes, setSurfaceTypes] = useState<PoolSurfaceType[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [manageSurface, setManageSurface] = useState<ManageEntityType | null>(null);
  const [query, setQuery] = useState<string>('');

  const getSurfacesTypes = useCallback(async () => {
    try {
      const response = await axios.get(`${apiConfig.apiV1Url}/organisations/${organisation.id}/surfacetypes?orderBy=name`);

      if (isMountedRef.current) {
        setSurfaceTypes(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getSurfacesTypes();
  }, []);

  useEffect(() => {
    setQuery(query);
  }, [surfaceTypes]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleDelete = (surfaceType: PoolSurfaceType) => {
    confirm({ description: `This will permanently delete the surface ${surfaceType.name}` })
      .then(async () => {
        await axios.delete(`${apiConfig.apiV1Url}/organisations/${organisation.id}/surfacetypes/${surfaceType.id}`);
        toast.success('Surface successfully deleted');
        setSurfaceTypes(surfaceTypes.filter((item) => item.id !== surfaceType.id));
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  const handleModalSubmit = async (surfaceType: ManageEntityType) => {
    const requestType = surfaceType.mode === 'edit' ? 'put' : 'post';
    const requestUrl = surfaceType.mode === 'edit'
      ? `${apiConfig.apiV1Url}/organisations/${organisation.id}/surfacetypes/${surfaceType.id}`
      : `${apiConfig.apiV1Url}/organisations/${organisation.id}/surfacetypes`;
    return axios[requestType](requestUrl, { name: surfaceType.name });
  };

  const handleAddModalOpen = (): void => {
    const newSurface = {
      name: '',
      mode: 'add'
    };
    setManageSurface(newSurface);
    setIsEditModalOpen(true);
  };

  const handleEditModalOpen = (surface: PoolSurfaceType): void => {
    setManageSurface({
      ...surface,
      mode: 'edit'
    });
    setIsEditModalOpen(true);
  };

  const handleModalClose = (updatedEntity?: ManageEntityType): void => {
    setIsEditModalOpen(false);
    setManageSurface(null);
    if (updatedEntity) {
      getSurfacesTypes();
    }
  };

  const filteredSurfaceTypes = applyFilters(surfaceTypes, query);

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
              placeholder="Search surface"
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
                {filteredSurfaceTypes.map((surfaceType) => (
                  <TableRow
                    hover
                    onClick={() => handleEditModalOpen(surfaceType)}
                    key={surfaceType.id}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {surfaceType.name}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        sx={{
                          color: 'primary.main',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModalOpen(surfaceType);
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
                          handleDelete(surfaceType);
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
          entity={manageSurface}
          title="surface"
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
          open={isEditModalOpen}
        />
      )}
    </>
  );
};

export default SurfaceListTable;
