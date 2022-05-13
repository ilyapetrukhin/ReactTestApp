import React, { useEffect, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';
import debounce from 'lodash/debounce';
import { useConfirm } from 'material-ui-confirm';
import { setSearchText } from 'src/slices/jobRecurrence';
import moment from 'moment/moment';
import SearchIcon from '../../icons/Search';
import type { JobRecurrence } from '../../types/jobRecurrence';
import { Scrollbar } from '../scrollbar';
import { useDispatch, useSelector } from '../../store';
import LoadingScreen from '../LoadingScreen';

interface RecurrenceDashboardProps {
  isLoading?: boolean;
  quotes: JobRecurrence[];
}

const RecurrenceDashboard: FC<RecurrenceDashboardProps> = (props) => {
  const { isLoading, quotes, ...other } = props;
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const { searchText } = useSelector((state) => state.jobRecurrence);
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

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <Card
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
            placeholder="Search opened recurrence dashboards"
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
                <TableCell>
                  Contact
                </TableCell>
                <TableCell>
                  Technician
                </TableCell>
                <TableCell>
                  Pool Address
                </TableCell>
                <TableCell>
                  Job
                </TableCell>
                <TableCell>
                  Recurrence Pattern
                </TableCell>
                <TableCell>
                  Next Date
                </TableCell>
                <TableCell>
                  End Date
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((quote) => (
                <TableRow
                  hover
                  key={quote.id}
                >
                  <TableCell>
                    {quote.contact.full_name}
                  </TableCell>
                  <TableCell>
                    {quote.user.first_name} {quote.user.last_name}
                  </TableCell>
                  <TableCell>
                    {quote.pool.address_street_one},
                    {quote.pool.address_city}, {quote.pool.address_state} {quote.pool.address_postcode}
                  </TableCell>
                  <TableCell>
                    {quote.job_template.name}
                  </TableCell>
                  <TableCell>
                    Every week on {''}
                    {moment(quote.recurrence_logic.split(';').find(el => el.length > 23).replace(/DTSTART=/g,"")).format('dddd')}       
                  </TableCell>
                  <TableCell>
                    {moment(quote.start_time).format('DD MMM YYYY')}
                  </TableCell>
                  <TableCell>
                    {moment(quote.end_time).format('DD MMM YYYY')}
                  </TableCell>
                  <TableCell>
                    tbd
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={quotes.length}
            rowsPerPageOptions={[5, 10, 25]}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Scrollbar>
    </Card>
  );
};

RecurrenceDashboard.propTypes = {
  isLoading: PropTypes.bool,
  quotes: PropTypes.array.isRequired
};

export default RecurrenceDashboard;
