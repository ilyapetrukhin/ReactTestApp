import { useEffect, useMemo, useState } from 'react';
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
  SortDirection,
  TextField,
  TableSortLabel,
  Grid,
  IconButton,
} from '@mui/material';
import debounce from 'lodash/debounce';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { selectRange, setLimit, setPage, setSearchText, setOrder } from 'src/slices/testHistory';
import moment from 'moment/moment';
import {
  DownloadCloud as DownloadCloudIcon,
  Send as SendIcon,
} from 'react-feather';
import SearchIcon from '../../icons/Search';
import { Scrollbar } from '../scrollbar';
import { useDispatch, useSelector } from '../../store';
import type { TestHistory } from '../../types/testHistory';
import HistoryResendModal from './HistoryResendModal';
import {useRouter} from "next/router";

interface TestHistoryTableProps {
  className?: string;
  history: TestHistory[];
}

const TestHistoryTable: FC<TestHistoryTableProps> = (props) => {
  const { className, history, ...other } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const [isResendModalOpen, setIsResendModalOpen] = useState<boolean>(false);
  const [resendHistoryItem, setResendHistoryItem] = useState<TestHistory | null>(null);
  const { selectedRange, limit, page, total, searchText, orderBy, order, isHistoryLoading } = useSelector((state) => state.testHistory);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setQuery(searchText);
  }, []);

  const minDate = useMemo(
    () => moment(selectedRange.from).toDate(),
    [selectedRange.from]
  );

  const maxDate = useMemo(
    () => moment(selectedRange.to).toDate(),
    [selectedRange.to]
  );

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

  const handleFromDateChange = (date: Date): void => {
    dispatch(selectRange(date, new Date(selectedRange.to)));
  };

  const handleToDateChange = (date: Date): void => {
    dispatch(selectRange(new Date(selectedRange.from), date));
  };

  const handleResendModalOpen = (historyItem: TestHistory): void => {
    setResendHistoryItem(historyItem);
    setIsResendModalOpen(true);
  };

  const handleResendModalClose = (): void => {
    setResendHistoryItem(null);
    setIsResendModalOpen(false);
  };

  const getDateOfTest = (createdAt: string): string => {
    const date = moment(createdAt).format('DD MMM YYYY');
    const time = moment(createdAt).format('hh:mm');

    return `${date} | ${time}`;
  };

  const handleRowClick = (historyItem: TestHistory): void => {
    router.push(`/lab/water-test/${historyItem.pool_id}/${historyItem.contact_id}/${historyItem.id}/detail`);
  }

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
              placeholder="Search water tests"
              value={query}
              variant="outlined"
            />
          </Box>
          <Box flexGrow={1} />
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid
                item
              >
                <MobileDatePicker
                  label="From date"
                  renderInput={(props) => (
                    <TextField
                      fullWidth
                      variant="outlined"
                      {...props}
                    />
                  )}
                  disableFuture
                  mask="YYYY-MM-DD"
                  disableCloseOnSelect={false}
                  showToolbar={false}
                  disableMaskedInput
                  inputFormat="dd MMM yyyy"
                  loading={isHistoryLoading}
                  maxDate={maxDate}
                  onChange={handleFromDateChange}
                  value={selectedRange.from}
                />
              </Grid>
              <Grid item>
                <MobileDatePicker
                  label="To date"
                  renderInput={(props) => (
                    <TextField
                      fullWidth
                      variant="outlined"
                      {...props}
                    />
                  )}
                  disableFuture
                  disableCloseOnSelect={false}
                  showToolbar={false}
                  disableMaskedInput
                  inputFormat="dd MMM yyyy"
                  loading={isHistoryLoading}
                  minDate={minDate}
                  onChange={handleToDateChange}
                  value={selectedRange.to}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sortDirection={orderBy === 'start_time' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'start_time'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('start_time', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Date of test
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === 'user_name' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'user_name'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('user_name', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Tested by
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === 'contact_name' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'contact_name'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('contact_name', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Contact name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === 'pool_address' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'pool_address'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('pool_address', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Pool address
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((historyItem) => (
                  <TableRow
                    hover
                    key={historyItem.id}
                    onClick={() => handleRowClick(historyItem)}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {getDateOfTest(historyItem.start_time)}
                    </TableCell>
                    <TableCell>
                      {`${historyItem.user.first_name} ${historyItem.user.last_name}`}
                    </TableCell>
                    <TableCell>
                      {historyItem.contact ? historyItem.contact.full_name : ''}
                    </TableCell>
                    <TableCell>
                      {historyItem.pool.full_address}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        display="flex"
                        alignItems="center"
                      >
                        {historyItem.pdf_location && (
                          <IconButton
                            color="primary"
                            href={historyItem.pdf_location}
                            target="_blank"
                          >
                            <DownloadCloudIcon />
                          </IconButton>
                        )}
                        <IconButton
                          sx={{
                            color: 'primary.main',
                          }}
                          onClick={() => handleResendModalOpen(historyItem)}
                        >
                          <SendIcon />
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
      {resendHistoryItem && (
        <HistoryResendModal
          testHistory={resendHistoryItem}
          onClose={handleResendModalClose}
          open={isResendModalOpen}
        />
      )}
    </>
  );
};

TestHistoryTable.propTypes = {
  className: PropTypes.string,
  history: PropTypes.array.isRequired
};

export default TestHistoryTable;
