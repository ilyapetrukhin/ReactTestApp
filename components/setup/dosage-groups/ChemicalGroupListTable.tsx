import React, { useEffect, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  SortDirection,
  TextField,
  TableSortLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Trash as TrashIcon,
} from 'react-feather';
import debounce from 'lodash/debounce';
import { useConfirm } from 'material-ui-confirm';
import { deleteChemicalGroup, setLimit, setPage, setSearchText, setOrder } from 'src/slices/chemicalGroup';
import toast from 'react-hot-toast';
import SearchIcon from 'src/icons/Search';
import type { ChemicalGroup } from 'src/types/chemical';
import { Scrollbar } from 'src/components/scrollbar';
import { useDispatch, useSelector } from 'src/store';
import ChemicalGroupListBulkActions from './ChemicalGroupListBulkActions';
import Breadcrumbs from '../../Breadcrumbs';

interface ChemicalGroupListTableProps {
  className?: string;
  chemicalGroups: ChemicalGroup[];
}

const ChemicalGroupListTable: FC<ChemicalGroupListTableProps> = (props) => {
  const { className, chemicalGroups, ...other } = props;
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const { organisation } = useSelector((state) => state.account);
  const { limit, page, total, searchText, orderBy, order } = useSelector((state) => state.chemicalGroup);
  const [selectedChemicalGroups, setSelectedChemicalGroups] = useState<number[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setQuery(searchText);
  }, []);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
    event.persist();
    const handleChangeDebounce = debounce(() => {
      if (event.target.value === '' || event.target.value.length >= 3) {
        dispatch(setSearchText(event.target.value));
      }
    }, 2000);
    handleChangeDebounce();
  };

  const handleSortChange = (orderBy: string, order: SortDirection): void => {
    dispatch(setOrder(orderBy, order));
  };

  const handleSelectAllChemicalGroups = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedChemicalGroups(event.target.checked
      ? chemicalGroups.map((chemicalGroup) => chemicalGroup.id)
      : []);
  };

  const handleSelectOneChemicalGroup = (event: ChangeEvent<HTMLInputElement>, chemicalGroupId: number): void => {
    if (!selectedChemicalGroups.includes(chemicalGroupId)) {
      setSelectedChemicalGroups((prevSelected) => [...prevSelected, chemicalGroupId]);
    } else {
      setSelectedChemicalGroups((prevSelected) => prevSelected.filter((id) => id !== chemicalGroupId));
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const handleDelete = (chemicalGroup: ChemicalGroup) => {
    confirm({ description: `This will permanently delete ${chemicalGroup.name}` })
      .then(async () => {
        await dispatch(deleteChemicalGroup(organisation.id, chemicalGroup.id));
        toast.success('Chemical group successfully deleted');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Usually query is done on backend with indexing solutions
  const enableBulkActions = selectedChemicalGroups.length > 0;
  const selectedSomeChemicalGroups = selectedChemicalGroups.length > 0
    && selectedChemicalGroups.length < chemicalGroups.length;
  const selectedAllChemicalGroups = selectedChemicalGroups.length === chemicalGroups.length;

  return (
    <>
      <Card
        className={className}
        {...other}
      >
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
              placeholder="Search chemical group"
              value={query}
              variant="outlined"
            />
          </Box>
          <Box flexGrow={1} />
        </Box>
        <Scrollbar>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllChemicalGroups}
                      indeterminate={selectedSomeChemicalGroups}
                      onChange={handleSelectAllChemicalGroups}
                    />
                  </TableCell>
                  <TableCell>
                    Test
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === 'name' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('name', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Dosage group
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chemicalGroups.map((chemicalGroup) => {
                  const isChemicalGroupSelected = selectedChemicalGroups.includes(chemicalGroup.id);

                  return (
                    <TableRow
                      hover
                      key={chemicalGroup.id}
                      selected={isChemicalGroupSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isChemicalGroupSelected}
                          onChange={(event) => handleSelectOneChemicalGroup(event, chemicalGroup.id)}
                          value={isChemicalGroupSelected}
                        />
                      </TableCell>
                      <TableCell>
                        {chemicalGroup.chemical_test ? chemicalGroup.chemical_test.name : '-'}
                      </TableCell>
                      <TableCell>
                        {chemicalGroup.name}
                      </TableCell>
                      <TableCell align="center">
                        <NextLink
                          href="#"
                          passHref
                        >
                          <IconButton
                            sx={{
                              color: 'primary.main',
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </NextLink>
                        <IconButton
                          sx={{
                            color: 'error.main',
                          }}
                          onClick={() => handleDelete(chemicalGroup)}
                        >
                          <TrashIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={total}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </Scrollbar>
      </Card>
      <ChemicalGroupListBulkActions
        open={enableBulkActions}
        selected={selectedChemicalGroups}
      />
    </>
  );
};

ChemicalGroupListTable.propTypes = {
  className: PropTypes.string,
  chemicalGroups: PropTypes.array.isRequired
};

export default ChemicalGroupListTable;
