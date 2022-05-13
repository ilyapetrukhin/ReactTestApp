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
import type { CustomException } from 'src/types/pool';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { apiConfig } from 'src/config';
import { useSelector } from 'src/store';
import PlusIcon from 'src/icons/Plus';
import { Scrollbar } from '../../scrollbar';
import ManageEntityModal, { ManageEntityType } from '../../widgets/modals/ManageEntityModal';

const applyFilters = (
  customExceptions: CustomException[],
  query: string
): CustomException[] => customExceptions
  .filter((customException) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (customException[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });

const CustomExceptionListTable: FC = (props) => {
  const { ...other } = props;

  const isMountedRef = useIsMountedRef();
  const confirm = useConfirm();
  const { organisation } = useSelector((state) => state.account);
  const [customExceptions, setCustomExceptions] = useState<CustomException[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [manageCustomException, setManageCustomException] = useState<ManageEntityType | null>(null);
  const [query, setQuery] = useState<string>('');

  const getCustomExceptions = useCallback(async () => {
    try {
      const response = await axios.get(`${apiConfig.apiV1Url}/organisations/${organisation.id}/customexceptions?orderBy=name`);

      if (isMountedRef.current) {
        setCustomExceptions(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getCustomExceptions();
  }, []);

  useEffect(() => {
    setQuery(query);
  }, [customExceptions]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleDelete = (customException: CustomException) => {
    confirm({ description: `This will permanently delete the custom exception ${customException.name}` })
      .then(async () => {
        await axios.delete(`${apiConfig.apiV1Url}/organisations/${organisation.id}/customexceptions/${customException.id}`);
        toast.success('Custom exception successfully deleted');
        setCustomExceptions(customExceptions.filter((item) => item.id !== customException.id));
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  const handleModalSubmit = async (customException: ManageEntityType) => {
    const requestType = customException.mode === 'edit' ? 'put' : 'post';
    const requestUrl = customException.mode === 'edit'
      ? `${apiConfig.apiV1Url}/organisations/${organisation.id}/customexceptions/${customException.id}`
      : `${apiConfig.apiV1Url}/organisations/${organisation.id}/customexceptions`;
    return axios[requestType](requestUrl, { name: customException.name });
  };

  const handleAddModalOpen = (): void => {
    const newCustomException = {
      name: '',
      mode: 'add'
    };
    setManageCustomException(newCustomException);
    setIsEditModalOpen(true);
  };

  const handleEditModalOpen = (customException: CustomException): void => {
    setManageCustomException({
      ...customException,
      mode: 'edit'
    });
    setIsEditModalOpen(true);
  };

  const handleModalClose = (updatedEntity?: ManageEntityType): void => {
    setIsEditModalOpen(false);
    setManageCustomException(null);
    if (updatedEntity) {
      getCustomExceptions();
    }
  };

  const filteredCustomExceptionTypes = applyFilters(customExceptions, query);

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
              placeholder="Search custom exception"
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
                {filteredCustomExceptionTypes.map((customException) => (
                  <TableRow
                    hover
                    onClick={() => handleEditModalOpen(customException)}
                    key={customException.id}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {customException.name}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        sx={{
                          color: 'primary.main',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModalOpen(customException);
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
                          handleDelete(customException);
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
          entity={manageCustomException}
          title="custom exception"
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
          open={isEditModalOpen}
        />
      )}
    </>
  );
};

export default CustomExceptionListTable;
