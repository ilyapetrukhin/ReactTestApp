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
import type { Type as EquipmentType } from 'src/types/equipment';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { apiConfig } from 'src/config';
import { useSelector } from 'src/store';
import PlusIcon from 'src/icons/Plus';
import { Scrollbar } from '../../scrollbar';
import ManageEntityModal, { ManageEntityType } from '../../widgets/modals/ManageEntityModal';

const applyFilters = (
  equipmentTypes: EquipmentType[],
  query: string
): EquipmentType[] => equipmentTypes
  .filter((equipmentType) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (equipmentType[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });

const EquipmentTypeListTable: FC = (props) => {
  const { ...other } = props;

  const isMountedRef = useIsMountedRef();
  const confirm = useConfirm();
  const { organisation } = useSelector((state) => state.account);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [manageEquipmentType, setManageEquipmentType] = useState<ManageEntityType | null>(null);
  const [query, setQuery] = useState<string>('');

  const getEquipmentTypes = useCallback(async () => {
    try {
      const response = await axios.get(`${apiConfig.apiV1Url}/organisations/${organisation.id}/equipment-types?orderBy=name`);

      if (isMountedRef.current) {
        setEquipmentTypes(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getEquipmentTypes();
  }, []);

  useEffect(() => {
    setQuery(query);
  }, [equipmentTypes]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleDelete = (equipmentType: EquipmentType) => {
    confirm({ description: `This will permanently delete the equipment type ${equipmentType.name}` })
      .then(async () => {
        await axios.delete(`${apiConfig.apiV1Url}/organisations/${organisation.id}/equipment-types/${equipmentType.id}`);
        toast.success('Equipment type successfully deleted');
        setEquipmentTypes(equipmentTypes.filter((item) => item.id !== equipmentType.id));
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  const handleModalSubmit = async (equipmentType: ManageEntityType) => {
    const requestType = equipmentType.mode === 'edit' ? 'put' : 'post';
    const requestUrl = equipmentType.mode === 'edit'
      ? `${apiConfig.apiV1Url}/organisations/${organisation.id}/equipment-types/${equipmentType.id}`
      : `${apiConfig.apiV1Url}/organisations/${organisation.id}/equipment-types`;
    return axios[requestType](requestUrl, { name: equipmentType.name });
  };

  const handleAddModalOpen = (): void => {
    const newEquipmentType = {
      name: '',
      mode: 'add'
    };
    setManageEquipmentType(newEquipmentType);
    setIsEditModalOpen(true);
  };

  const handleEditModalOpen = (equipmentType: EquipmentType): void => {
    setManageEquipmentType({
      ...equipmentType,
      mode: 'edit'
    });
    setIsEditModalOpen(true);
  };

  const handleModalClose = (updatedEntity?: ManageEntityType): void => {
    setIsEditModalOpen(false);
    setManageEquipmentType(null);
    if (updatedEntity) {
      getEquipmentTypes();
    }
  };

  const filteredEquipmentTypeTypes = applyFilters(equipmentTypes, query);

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
              placeholder="Search equipment type"
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
                {filteredEquipmentTypeTypes.map((equipmentType) => (
                  <TableRow
                    hover
                    onClick={() => handleEditModalOpen(equipmentType)}
                    key={equipmentType.id}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {equipmentType.name}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        sx={{
                          color: 'primary.main',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModalOpen(equipmentType);
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
                          handleDelete(equipmentType);
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
          entity={manageEquipmentType}
          title="equipment type"
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
          open={isEditModalOpen}
        />
      )}
    </>
  );
};

export default EquipmentTypeListTable;
