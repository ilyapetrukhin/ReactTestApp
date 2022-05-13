import React, { useEffect, useState } from 'react';
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
import get from 'lodash/get';
import { Trash as TrashIcon } from 'react-feather';
import toast from 'react-hot-toast';
import type { Color } from 'src/types/organisation';
import { useDispatch, useSelector } from 'src/store';
import PlusIcon from 'src/icons/Plus';
import { deleteColor, getColors } from 'src/slices/account';
import { Scrollbar } from 'src/components/scrollbar';
import { ManageColorModal } from 'src/components/widgets/modals';

const applyFilters = (
  colors: Color[],
  query: string
): Color[] => colors
  .filter((tradingTerm) => {
    let matches = true;

    if (query) {
      const properties = ['color_desc'];
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

const ColorsListTable: FC = (props) => {
  const { ...other } = props;

  const confirm = useConfirm();
  const { organisation, colors } = useSelector((state) => state.account);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [manageColor, setManageColor] = useState<Color | null>(null);
  const [query, setQuery] = useState<string>('');
  const dispatch = useDispatch();

  useEffect(() => {
    setQuery(query);
  }, [colors]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleDelete = (tradingTerm: Color) => {
    confirm({ description: 'This will permanently delete the chosen color and removes it from the related jobs.' })
      .then(async () => {
        await dispatch(deleteColor(organisation.id, tradingTerm.id));
        toast.success('Color successfully deleted');
      })
      .catch((err) => {
        if (err && err.response) {
          toast.error(err.response.data);
        }
      });
  };

  const handleAddModalOpen = (): void => {
    setManageColor(null);
    setIsEditModalOpen(true);
  };

  const handleEditModalOpen = (color: Color): void => {
    setManageColor(color);
    setIsEditModalOpen(true);
  };

  const handleModalClose = (updatedEntity?: Color): void => {
    setIsEditModalOpen(false);
    setManageColor(null);
    if (updatedEntity) {
      dispatch(getColors(organisation.id));
    }
  };

  const filteredColors = applyFilters(colors, query);

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
              placeholder="Search color"
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
                    Label
                  </TableCell>
                  <TableCell>
                    Color
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredColors.map((tradingTerm) => (
                  <TableRow
                    hover
                    onClick={() => handleEditModalOpen(tradingTerm)}
                    key={tradingTerm.id}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {tradingTerm.color_desc ? tradingTerm.color_desc : 'No label'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Box
                          width={21}
                          height={21}
                          bgcolor={tradingTerm.color_code}
                        />
                      </Box>
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
        <ManageColorModal
          color={manageColor}
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

export default ColorsListTable;
