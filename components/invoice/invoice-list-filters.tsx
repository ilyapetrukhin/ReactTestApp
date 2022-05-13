import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FC, MutableRefObject } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import debounce from 'lodash/debounce';
import { useTheme } from '@mui/material/styles';
import { ClipLoader } from 'react-spinners';
import type { Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MobileDatePicker } from '@mui/lab';
import { Search as SearchIcon } from 'src/icons/search-new';
import { X } from 'src/icons/x-new';
import { useDispatch, useSelector } from 'src/store';
import moment from 'moment';
import { STATUS_FILTERS } from 'src/constants/invoice';
import { StatusFilter } from 'src/types/contactInvoice';
import {
  setSearchText,
  setStatusFilter,
  selectRange,
} from 'src/slices/contactInvoice';

interface InvoiceListFiltersProps {
  containerRef?: MutableRefObject<HTMLDivElement>;
  onClose?: () => void;
  open?: boolean;
}

const FiltersDrawerDesktop = styled(Drawer)({
  flexShrink: 0,
  width: 380,
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: 380
  }
});

const FiltersDrawerMobile = styled(Drawer)({
  maxWidth: '100%',
  width: 380,
  '& .MuiDrawer-paper': {
    height: 'calc(100% - 64px)',
    maxWidth: '100%',
    top: 64,
    width: 380
  }
});

const vendStatusOptions = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Synced',
    value: 1
  },
  {
    label: 'Not synced',
    value: 0
  },
];

export const InvoiceListFilters: FC<InvoiceListFiltersProps> = (props) => {
  const { containerRef, onClose, open, ...other } = props;
  const queryRef = useRef<HTMLInputElement | null>(null);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const [query, setQuery] = useState<string>('');
  const [statusOptions] = useState<StatusFilter[]>([
    {
      value: 'all',
      label: 'All'
    },
    ...STATUS_FILTERS
  ]);
  const { isVendConnected } = useSelector((state) => state.account);
  const { selectedRange, searchText, statusFilter, isLoading } = useSelector((state) => state.contactInvoice);
  const dispatch = useDispatch();
  const theme = useTheme();

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
    event.preventDefault();
    setQuery(event.target.value);
    event.persist();
    const handleChangeDebounce = debounce(() => {
      if (event.target.value === '' || event.target.value.length >= 3) {
        dispatch(setSearchText(event.target.value));
      }
    }, 2000);
    handleChangeDebounce();
  };

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (event.target.value !== 'all') {
      value = event.target.value;
    }

    dispatch(setStatusFilter(value));
  };

  const handleFromDateChange = (date: Date): void => {
    dispatch(selectRange(date, new Date(selectedRange.to)));
  };

  const handleToDateChange = (date: Date): void => {
    dispatch(selectRange(new Date(selectedRange.from), date));
  };

  const content = (
    <Box
      sx={{
        pb: 3,
        pt: {
          xs: 3,
          lg: 8
        },
        px: 3
      }}
    >
      <Box
        sx={{
          display: {
            lg: 'none'
          },
          mb: 2
        }}
      >
        <IconButton onClick={onClose}>
          <X fontSize="small" />
        </IconButton>
      </Box>
      <Box
        component="form"
        onSubmit={handleQueryChange}
      >
        <TextField
          fullWidth
          InputProps={{
            ref: queryRef,
            startAdornment: (
              <InputAdornment position="start">
                {isLoading
                  ? (
                    <ClipLoader
                      size={20}
                      color={theme.palette.primary.main}
                    />
                  )
                  : <SearchIcon />}
              </InputAdornment>
            )
          }}
          onChange={handleQueryChange}
          label="Search"
          placeholder="Search invoices"
          value={query}
          variant="outlined"
        />
      </Box>
      <Typography
        color="textSecondary"
        sx={{ mt: 3 }}
        variant="subtitle2"
      >
        Issue date
      </Typography>
      <Stack
        spacing={2}
        sx={{ mt: 2 }}
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
          loading={isLoading}
          maxDate={maxDate}
          onChange={handleFromDateChange}
          value={selectedRange.from}
        />
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
          loading={isLoading}
          minDate={minDate}
          onChange={handleToDateChange}
          value={selectedRange.to}
        />
      </Stack>
      <Typography
        color="textSecondary"
        sx={{ mt: 3 }}
        variant="subtitle2"
      >
        Status
      </Typography>
      <Stack
        spacing={2}
        sx={{ mt: 2 }}
        direction="row"
      >
        <TextField
          fullWidth
          label="Status"
          name="status"
          onChange={handleStatusChange}
          select
          SelectProps={{ native: true }}
          value={statusFilter || ''}
          variant="outlined"
        >
          {statusOptions.map((statusOption) => (
            <option
              key={statusOption.value}
              value={statusOption.value}
            >
              {statusOption.label}
            </option>
          ))}
        </TextField>
        {isVendConnected && (
            <TextField
            fullWidth
            label="Vend status"
            name="vend_status"
            onChange={handleStatusChange}
            select
            SelectProps={{ native: true }}
            variant="outlined"
          >
            {vendStatusOptions.map((statusOption) => (
              <option
                key={statusOption.value}
                value={statusOption.value}
              >
                {statusOption.label}
              </option>
            ))}
          </TextField>
        )}
      </Stack>
    </Box>
  );

  if (lgUp) {
    return (
      <FiltersDrawerDesktop
        anchor="left"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}
      >
        {content}
      </FiltersDrawerDesktop>
    );
  }

  return (
    <FiltersDrawerMobile
      anchor="left"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </FiltersDrawerMobile>
  );
};

InvoiceListFilters.propTypes = {
  containerRef: PropTypes.any,
  // @ts-ignore
  filters: PropTypes.object,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
