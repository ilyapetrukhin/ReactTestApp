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
import { deleteObservationGroup, setLimit, setPage, setSearchText, setOrder } from 'src/slices/observationGroup';
import toast from 'react-hot-toast';
import SearchIcon from 'src/icons/Search';
import type { ObservationGroup } from 'src/types/chemical';
import { Scrollbar } from 'src/components/scrollbar';
import { useDispatch, useSelector } from 'src/store';
import ObservationGroupListBulkActions from './ObservationGroupListBulkActions';

interface ObservationGroupListTableProps {
  className?: string;
  observationGroups: ObservationGroup[];
}

const ObservationGroupListTable: FC<ObservationGroupListTableProps> = (props) => {
  const { className, observationGroups, ...other } = props;
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const { organisation } = useSelector((state) => state.account);
  const { limit, page, total, searchText, orderBy, order } = useSelector((state) => state.observationGroup);
  const [selectedObservationGroups, setSelectedObservationGroups] = useState<number[]>([]);
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

  const handleSelectAllObservationGroups = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedObservationGroups(event.target.checked
      ? observationGroups.map((observationGroup) => observationGroup.id)
      : []);
  };

  const handleSelectOneObservationGroup = (event: ChangeEvent<HTMLInputElement>, observationGroupId: number): void => {
    if (!selectedObservationGroups.includes(observationGroupId)) {
      setSelectedObservationGroups((prevSelected) => [...prevSelected, observationGroupId]);
    } else {
      setSelectedObservationGroups((prevSelected) => prevSelected.filter((id) => id !== observationGroupId));
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const handleDelete = (observationGroup: ObservationGroup) => {
    confirm({ description: `This will permanently delete ${observationGroup.name}` })
      .then(async () => {
        await dispatch(deleteObservationGroup(organisation.id, observationGroup.id));
        toast.success('Observation group successfully deleted');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Usually query is done on backend with indexing solutions
  const enableBulkActions = selectedObservationGroups.length > 0;
  const selectedSomeObservationGroups = selectedObservationGroups.length > 0
    && selectedObservationGroups.length < observationGroups.length;
  const selectedAllObservationGroups = selectedObservationGroups.length === observationGroups.length;

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
              placeholder="Search observation group"
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
                      checked={selectedAllObservationGroups}
                      indeterminate={selectedSomeObservationGroups}
                      onChange={handleSelectAllObservationGroups}
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
                {observationGroups.map((observationGroup) => {
                  const isObservationGroupSelected = selectedObservationGroups.includes(observationGroup.id);

                  return (
                    <TableRow
                      hover
                      key={observationGroup.id}
                      selected={isObservationGroupSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isObservationGroupSelected}
                          onChange={(event) => handleSelectOneObservationGroup(event, observationGroup.id)}
                          value={isObservationGroupSelected}
                        />
                      </TableCell>
                      <TableCell>
                        {observationGroup.observation_test ? observationGroup.observation_test.name : '-'}
                      </TableCell>
                      <TableCell>
                        {observationGroup.name}
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
                          onClick={() => handleDelete(observationGroup)}
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
      <ObservationGroupListBulkActions
        open={enableBulkActions}
        selected={selectedObservationGroups}
      />
    </>
  );
};

ObservationGroupListTable.propTypes = {
  className: PropTypes.string,
  observationGroups: PropTypes.array.isRequired
};

export default ObservationGroupListTable;
