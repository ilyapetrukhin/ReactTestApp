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
import get from 'lodash/get';
import { Trash as TrashIcon } from 'react-feather';
import toast from 'react-hot-toast';
import type { PoolSanitiser } from 'src/types/pool';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { apiConfig } from 'src/config';
import { useSelector } from 'src/store';
import PlusIcon from 'src/icons/Plus';
import { Scrollbar } from '../../scrollbar';
import ManageSanitiserModal from '../../widgets/modals/ManageSanitiserModal';

const applyFilters = (
  poolSanitisers: PoolSanitiser[],
  query: string
): PoolSanitiser[] => poolSanitisers
  .filter((poolSanitiser) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'sanitiser_classification.name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (get(poolSanitiser, property).toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });

const PoolSanitiserListTable: FC = (props) => {
  const { ...other } = props;

  const isMountedRef = useIsMountedRef();
  const confirm = useConfirm();
  const { organisation } = useSelector((state) => state.account);
  const [poolSanitisers, setPoolSanitisers] = useState<PoolSanitiser[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<string>('edit');
  const [managePoolSanitiser, setManagePoolSanitiser] = useState<PoolSanitiser | null>(null);
  const [query, setQuery] = useState<string>('');

  const getPoolSanitisers = useCallback(async () => {
    try {
      const response = await axios.get(`${apiConfig.apiV1Url}/organisations/${organisation.id}/sanitisers?orderBy=name`);

      if (isMountedRef.current) {
        setPoolSanitisers(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getPoolSanitisers();
  }, []);

  useEffect(() => {
    setQuery(query);
  }, [poolSanitisers]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleDelete = (sanitiser: PoolSanitiser) => {
    confirm({ description: `This will permanently delete the sanitiser ${sanitiser.name}` })
      .then(async () => {
        await axios.delete(`${apiConfig.apiV1Url}/organisations/${organisation.id}/sanitisers/${sanitiser.id}`);
        toast.success('Sanitiser successfully deleted');
        setPoolSanitisers(poolSanitisers.filter((item) => item.id !== sanitiser.id));
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  const handleModalSubmit = async (updatedSanitiser: PoolSanitiser, mode) => {
    const requestType = mode === 'edit' ? 'put' : 'post';
    const requestUrl = mode === 'edit'
      ? `${apiConfig.apiV1Url}/organisations/${organisation.id}/sanitisers/${updatedSanitiser.id}`
      : `${apiConfig.apiV1Url}/organisations/${organisation.id}/sanitisers`;
    return axios[requestType](requestUrl, { name: updatedSanitiser.name, sanitiser_classification_id: updatedSanitiser.sanitiser_classification_id });
  };

  const handleAddModalOpen = (): void => {
    setEditMode('add');
    const newPoolSanitiser = {
      name: '',
      sanitiser_classification_id: 1
    };
    setManagePoolSanitiser(newPoolSanitiser);
    setIsEditModalOpen(true);
  };

  const handleEditModalOpen = (poolSanitiser: PoolSanitiser): void => {
    setEditMode('edit');
    setManagePoolSanitiser({
      ...poolSanitiser
    });
    setIsEditModalOpen(true);
  };

  const handleModalClose = (updatedEntity?: PoolSanitiser): void => {
    setIsEditModalOpen(false);
    setManagePoolSanitiser(null);
    if (updatedEntity) {
      getPoolSanitisers();
    }
  };

  const filteredPoolSanitiserTypes = applyFilters(poolSanitisers, query);

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
              placeholder="Search sanitiser"
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
                  <TableCell>
                    Classification
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPoolSanitiserTypes.map((poolSanitiser) => (
                  <TableRow
                    hover
                    onClick={() => handleEditModalOpen(poolSanitiser)}
                    key={poolSanitiser.id}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {poolSanitiser.name}
                    </TableCell>
                    <TableCell>
                      {poolSanitiser.sanitiser_classification ? poolSanitiser.sanitiser_classification.name : ''}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        sx={{
                          color: 'primary.main',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModalOpen(poolSanitiser);
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
                          handleDelete(poolSanitiser);
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
        <ManageSanitiserModal
          sanitiser={managePoolSanitiser}
          title="sanitiser"
          mode={editMode}
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
          open={isEditModalOpen}
        />
      )}
    </>
  );
};

export default PoolSanitiserListTable;
