import React, { useEffect, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  SortDirection,
  TextField,
  TableSortLabel,
  Switch,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
} from 'react-feather';
import debounce from 'lodash/debounce';
import { changeDefault, setSearchText, setOrder } from 'src/slices/chemicalTest';
import SearchIcon from 'src/icons/Search';
import type { ChemicalTest } from 'src/types/chemical';
import { Scrollbar } from 'src/components/scrollbar';
import { useDispatch, useSelector } from 'src/store';
import toast from 'react-hot-toast';
import InformationCircleIcon from 'src/icons/InformationCircle';
import { ClipLoader } from 'react-spinners';
import { useTheme } from '@mui/material/styles';

interface ChemicalTestListTableProps {
  className?: string;
  chemicalTests: ChemicalTest[];
}

const ChemicalTestListTable: FC<ChemicalTestListTableProps> = (props) => {
  const { className, chemicalTests, ...other } = props;
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const { organisation } = useSelector((state) => state.account);
  const { isLoadingChemicalTests, searchText, orderBy, order } = useSelector((state) => state.chemicalTest);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setQuery(searchText);
  }, []);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
    event.persist();
    const handleChangeDebounce = debounce(() => {
      if (event.target.value === '' || event.target.value.length >= 1) {
        dispatch(setSearchText(event.target.value));
      }
    }, 2000);
    handleChangeDebounce();
  };

  const handleSortChange = (orderBy: string, order: SortDirection): void => {
    dispatch(setOrder(orderBy, order));
  };

  const handleChangeDefault = async (chemicalTest: ChemicalTest): Promise<void> => {
    await dispatch(changeDefault(organisation.id, chemicalTest.id, !chemicalTest.is_default));
    toast.success('Chemical test updated');
  };

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
                    {isLoadingChemicalTests
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
              placeholder="Search chemical test"
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
                  <TableCell
                    sortDirection={orderBy === 'name' ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={order === 'asc' ? 'asc' : 'desc'}
                      onClick={() => handleSortChange('name', order === 'asc' ? 'desc' : 'asc')}
                    >
                      Chemical
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    Exceptions
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        width: 150
                      }}
                    >
                      Show by default
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          ml: 1
                        }}
                      >
                        <Tooltip
                          title="If this is ticked, the test will appear by default for<br> the technician on site. If it is unticked, they will<br> need to click ‘Add test’ to test it. We recommend<br> only ticking the tests that are done regularly."
                        >
                          <InformationCircleIcon
                            color="primary"
                            fontSize="small"
                          />
                        </Tooltip>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chemicalTests.map((chemicalTest) => (
                  <TableRow
                    hover
                    key={chemicalTest.id}
                    onClick={() => router.push(`/setup/water-testing/chemical-tests/${chemicalTest.id}`)}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                      >
                        {chemicalTest.name}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {`minimum: ${chemicalTest.minimum_value} | maximum: ${chemicalTest.maximum_value} | target: ${chemicalTest.target_value}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                      >
                        {chemicalTest.exceptions.length}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 150
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Switch
                        checked={chemicalTest.is_default}
                        color="primary"
                        edge="start"
                        name="visibility"
                        onChange={() => handleChangeDefault(chemicalTest)}
                        value={chemicalTest.is_default}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <NextLink
                        href={`/setup/water-testing/chemical-tests/${chemicalTest.id}`}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

ChemicalTestListTable.propTypes = {
  className: PropTypes.string,
  chemicalTests: PropTypes.array.isRequired
};

export default ChemicalTestListTable;
