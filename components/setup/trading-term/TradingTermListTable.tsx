import { useEffect, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { useConfirm } from 'material-ui-confirm';
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import PencilAltIcon from 'src/icons/PencilAlt';
import SearchIcon from 'src/icons/Search';
import get from 'lodash/get';
import { Trash as TrashIcon } from 'react-feather';
import toast from 'react-hot-toast';
import type { TradingTerm } from 'src/types/contact';
import { useDispatch, useSelector } from 'src/store';
import PlusIcon from 'src/icons/Plus';
import { deleteTradingTerm, getTradingTerms, updateDefaultTerm } from 'src/slices/account';
import { Scrollbar } from '../../scrollbar';
import ManageTermModal from '../../widgets/modals/ManageTermModal';

const applyFilters = (
  tradingTerms: TradingTerm[],
  query: string
): TradingTerm[] => tradingTerms
  .filter((tradingTerm) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (get(tradingTerm, property).toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });

const TradingTermsListTable: FC = (props) => {
  const { ...other } = props;

  const confirm = useConfirm();
  const { organisation, tradingTerms } = useSelector((state) => state.account);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [manageTradingTerm, setManageTradingTerm] = useState<TradingTerm | null>(null);
  const [query, setQuery] = useState<string>('');
  const dispatch = useDispatch();

  useEffect(() => {
    setQuery(query);
  }, [tradingTerms]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleDelete = (tradingTerm: TradingTerm) => {
    confirm({ description: `This will permanently delete the trading term ${tradingTerm.name}` })
      .then(async () => {
        await dispatch(deleteTradingTerm(organisation.id, tradingTerm.id));
        toast.success('Trading term successfully deleted');
      })
      .catch((err) => {
        if (err && err.response) {
          toast.error(err.response.data);
        }
      });
  };

  const handleAddModalOpen = (): void => {
    setManageTradingTerm(null);
    setIsEditModalOpen(true);
  };

  const handleEditModalOpen = (tradingTerm: TradingTerm): void => {
    setManageTradingTerm(tradingTerm);
    setIsEditModalOpen(true);
  };

  const handleModalClose = (updatedEntity?: TradingTerm): void => {
    setIsEditModalOpen(false);
    setManageTradingTerm(null);
    if (updatedEntity) {
      dispatch(getTradingTerms(organisation.id));
    }
  };

  const handleChangeDefault = async (tradingTerm: TradingTerm): Promise<void> => {
    await dispatch(updateDefaultTerm(organisation.id, tradingTerm));
    toast.success('Default trading term successfully updated');
  };

  const filteredTradingTerms = applyFilters(tradingTerms, query);

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
              placeholder="Search trading term"
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
                    Default
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTradingTerms.map((tradingTerm) => (
                  <TableRow
                    hover
                    onClick={() => handleEditModalOpen(tradingTerm)}
                    key={tradingTerm.id}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {tradingTerm.descriptive_name}
                    </TableCell>
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Switch
                        checked={tradingTerm.is_default}
                        color="primary"
                        edge="start"
                        name="is_default"
                        onChange={() => handleChangeDefault(tradingTerm)}
                        value={tradingTerm.is_default}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        sx={{
                          color: 'primary.main',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModalOpen(tradingTerm);
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
                          handleDelete(tradingTerm);
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
        <ManageTermModal
          tradingTerm={manageTradingTerm}
          onCancel={handleModalClose}
          onAddComplete={handleModalClose}
          onDeleteComplete={handleModalClose}
          onEditComplete={handleModalClose}
          open={isEditModalOpen}
        />
      )}
    </>
  );
};

export default TradingTermsListTable;
