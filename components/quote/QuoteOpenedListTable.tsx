import React, { useEffect, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
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
  Trash as TrashIcon,
} from 'react-feather';
import debounce from 'lodash/debounce';
import { useConfirm } from 'material-ui-confirm';
import { deleteQuote, setLimit, setPage, setSearchText, setOrder } from 'src/slices/openedQuote';
import toast from 'react-hot-toast';
import moment from 'moment/moment';
import SearchIcon from '../../icons/Search';
import type { Quote } from '../../types/quote';
import { Scrollbar } from '../scrollbar';
import { useDispatch, useSelector } from '../../store';

interface QuoteOpenedListTableProps {
  className?: string;
  quotes: Quote[];
}

const QuoteOpenedListTable: FC<QuoteOpenedListTableProps> = (props) => {
  const { className, quotes, ...other } = props;
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const { organisation } = useSelector((state) => state.account);
  const { limit, page, total, searchText, orderBy, order } = useSelector((state) => state.openedQuote);
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

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const handleDelete = (quote: Quote) => {
    confirm({ description: `This will permanently delete the quote ${quote.id}` })
      .then(async () => {
        await dispatch(deleteQuote(organisation.id, quote.id));
        toast.success('Quote successfully deleted');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
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
            placeholder="Search opened quotes"
            value={query}
            variant="outlined"
          />
        </Box>
        <Box flexGrow={1} />
      </Box>
      <Scrollbar>
        <Box sx={{ minWidth: 900 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  cursor: 'pointer'
                }}
              >
                <TableCell
                  sortDirection={orderBy === 'id' ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={order === 'asc' ? 'asc' : 'desc'}
                    onClick={() => handleSortChange('id', order === 'asc' ? 'desc' : 'asc')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === 'created_at' ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === 'created_at'}
                    direction={order === 'asc' ? 'asc' : 'desc'}
                    onClick={() => handleSortChange('created_at', order === 'asc' ? 'desc' : 'asc')}
                  >
                    Created
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  Job template
                </TableCell>
                <TableCell>
                  Contact
                </TableCell>
                <TableCell>
                  Amount
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow
                  hover
                  key={quote.id}
                >
                  <TableCell>
                    {quote.id}
                  </TableCell>
                  <TableCell>
                    {moment(quote.created_at).format('DD MMM YYYY')}
                  </TableCell>
                  <TableCell>
                    {quote.job_template.name}
                  </TableCell>
                  <TableCell>
                    {quote.contact.full_name}
                  </TableCell>
                  <TableCell>
                    {numeral(quote.amount)
                      .format('$0,0.00')}
                  </TableCell>
                  <TableCell>
                    tbd
                  </TableCell>
                  <TableCell>
                    <Box
                      display="flex"
                      alignItems="center"
                    >
                      <IconButton
                        sx={{
                          color: 'error.main',
                        }}
                        onClick={() => handleDelete(quote)}
                      >
                        <TrashIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
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
  );
};

QuoteOpenedListTable.propTypes = {
  className: PropTypes.string,
  quotes: PropTypes.array.isRequired
};

export default QuoteOpenedListTable;
