import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  TableSortLabel,
  Tooltip,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Trash as TrashIcon,
} from 'react-feather';
import { saveAs } from 'file-saver';
import debounce from 'lodash/debounce';
import VendIcon from 'src/icons/Vend';
import { alpha, useTheme } from '@mui/material/styles';
import { useConfirm } from 'material-ui-confirm';
import { setLimit, setPage, setSearchText, setOrder, setEnabledColumns, restoreEnabledColumns, setExpandedRow } from 'src/slices/contact';
import moment from 'moment/moment';
import SearchIcon from '../../icons/Search';
import type { Contact } from '../../types/contact';
import { Scrollbar } from '../scrollbar';
import { useDispatch, useSelector } from '../../store';
import Phones from '../Phones';
import ContactListBulkActions from './ContactListBulkActions';
import ColumnManagement, { Column } from '../ColumnManagement';
import {
  CONTACT_LIST_COLUMN_CREATED_DATE,
  CONTACT_LIST_COLUMN_ADDRESS,
  CONTACT_LIST_COLUMN_COMPANY_NAME,
  CONTACT_LIST_COLUMN_EMAIL,
  CONTACT_LIST_COLUMN_FIRST_NAME,
  CONTACT_LIST_COLUMN_ID,
  CONTACT_LIST_COLUMN_LAST_NAME,
  CONTACT_LIST_COLUMN_PHONES,
  CONTACT_LIST_COLUMN_POOLS,
  CONTACT_LIST_COLUMN_VEND,
} from './constants';
import UploadIcon from '../../icons/Upload';
import DownloadIcon from '../../icons/Download';
import ContactTableExpandedRow from './ContactTableExpandedRow';
import { useDeleteContactMutation, useExportContactMutation, useChangeVisibilityMutation } from '../../api/contact';

interface ContactListTableProps {
  className?: string;
  contacts: Contact[];
}

function useColumnManagement() : [Column[], string[], (newIds: string[]) => void] {
  const dispatch = useDispatch();
  const { isVendConnected } = useSelector((state) => state.account);
  const { enabledColumns, enabledColumnsRestored } = useSelector((state) => state.contact);
  const columns = useMemo<Column[]>(() => [
    {
      id: CONTACT_LIST_COLUMN_ID,
      label: 'ID',
    },
    {
      id: CONTACT_LIST_COLUMN_VEND,
      label: 'Vend',
    },
    {
      id: CONTACT_LIST_COLUMN_FIRST_NAME,
      label: 'First Name',
    },
    {
      id: CONTACT_LIST_COLUMN_LAST_NAME,
      label: 'Last Name',
    },
    {
      id: CONTACT_LIST_COLUMN_COMPANY_NAME,
      label: 'Company Name',
    },
    {
      id: CONTACT_LIST_COLUMN_EMAIL,
      label: 'Email',
    },
    {
      id: CONTACT_LIST_COLUMN_PHONES,
      label: 'Phones',
    },
    {
      id: CONTACT_LIST_COLUMN_ADDRESS,
      label: 'Address',
    },
    {
      id: CONTACT_LIST_COLUMN_CREATED_DATE,
      label: 'Created date',
    },
    {
      id: CONTACT_LIST_COLUMN_POOLS,
      label: 'Pools',
    },
  ].filter(({ id }) => {
    if (isVendConnected) {
      return true;
    }

    return id !== CONTACT_LIST_COLUMN_VEND;
  }), [isVendConnected]);

  useEffect(() => {
    if (!enabledColumnsRestored) {
      dispatch(restoreEnabledColumns());
    }
  }, [enabledColumnsRestored]);

  useEffect(() => {
    if (enabledColumns == null && enabledColumnsRestored) {
      dispatch(setEnabledColumns(columns.map(({ id }) => id)));
    }
  }, [enabledColumns, enabledColumnsRestored]);

  const handleChangeColumns = useCallback((newIds: string[]) => {
    dispatch(setEnabledColumns(newIds));
  }, []);

  return [columns, enabledColumns || [], handleChangeColumns];
}

const ContactListTable: FC<ContactListTableProps> = (props) => {
  const { className, contacts, ...other } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const confirm = useConfirm();
  const { organisation, isVendConnected } = useSelector((state) => state.account);
  const { limit, page, total, searchText, orderBy, order, expandedContactId } = useSelector((state) => state.contact);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [query, setQuery] = useState<string>('');
  const [columns, selectedColumns, handleChangeColumns] = useColumnManagement();
  const [deleteContact] = useDeleteContactMutation();
  const [exportContact] = useExportContactMutation();
  const [changeVisibilityRequest, { isLoading: isChangeVisibilityLoading }] = useChangeVisibilityMutation();

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

  const handleExpandRow = (contactId: number | null): void => {
    dispatch(setExpandedRow(contactId));
  };

  const handleSelectAllContacts = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedContacts(event.target.checked
      ? contacts.map((contact) => contact.id)
      : []);
  };

  const handleSelectOneContact = (event: ChangeEvent<HTMLInputElement>, contactId: number): void => {
    if (!selectedContacts.includes(contactId)) {
      setSelectedContacts((prevSelected) => [...prevSelected, contactId]);
    } else {
      setSelectedContacts((prevSelected) => prevSelected.filter((id) => id !== contactId));
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const exportContacts = useCallback(async () => {
    try {
      // TODO: move to the slice
      const response:any = await exportContact({
        organisationId: organisation.id,
      });
      const csv = new Blob([response.data], {
        type: 'application/csv'
      });
      const fileName = `Contacts_export_${new Date().toLocaleDateString()}.csv`;
      saveAs(csv, fileName);
    } catch (err) {
      console.error(err);
    }
  }, [organisation]);

  const handleDelete = (contact: Contact) => {
    confirm({ description: `This will permanently delete ${contact.full_name}` })
      .then(async () => {
        await deleteContact({
          organisationId: organisation.id,
          id: parseInt(contact.id.toString(), 10)
        });
      }).catch(() => {
      });
  };

  const handleChangeVisibility = async (contact: Contact): Promise<void> => {
    if (isChangeVisibilityLoading) return;
    await changeVisibilityRequest({
      organisationId: organisation.id,
      id: parseInt(contact.id.toString(), 10),
      body: {
        visibility: +Boolean(!contact.visibility)
      }
    });
  };

  // Usually query is done on backend with indexing solutions
  const enableBulkActions = selectedContacts.length > 0;
  const selectedSomeContacts = selectedContacts.length > 0
    && selectedContacts.length < contacts.length;
  const selectedAllContacts = selectedContacts.length === contacts.length;

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
              mr: 2,
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
              placeholder="Search contacts"
              value={query}
              variant="outlined"
            />
          </Box>
          <Box flexGrow={1} />
          <Box
            sx={{
              display: 'flex'
            }}
          >
            <NextLink
              href="/contacts/import"
              passHref
            >
              <Button
                color="primary"
                startIcon={<UploadIcon fontSize="small" />}
                sx={{ m: 1 }}
              >
                Import
              </Button>
            </NextLink>
            <Button
              color="primary"
              startIcon={<DownloadIcon fontSize="small" />}
              sx={{ m: 1 }}
              onClick={exportContacts}
            >
              Export
            </Button>
            <ColumnManagement
              columns={columns}
              selectedColumnIds={selectedColumns}
              onChange={handleChangeColumns}
            />
          </Box>
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllContacts}
                      indeterminate={selectedSomeContacts}
                      onChange={handleSelectAllContacts}
                    />
                  </TableCell>
                  {
                    selectedColumns.includes(CONTACT_LIST_COLUMN_ID) && (
                      <TableCell>
                        ID
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_LIST_COLUMN_VEND) && isVendConnected && (
                      <TableCell>
                        Vend
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_LIST_COLUMN_FIRST_NAME) && (
                      <TableCell
                        sortDirection={orderBy === 'first_name' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'first_name'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('first_name', order === 'asc' ? 'desc' : 'asc')}
                        >
                          First name
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_LIST_COLUMN_LAST_NAME) && (
                      <TableCell
                        sortDirection={orderBy === 'last_name' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'last_name'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('last_name', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Last name
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_LIST_COLUMN_COMPANY_NAME) && (
                      <TableCell
                        sortDirection={orderBy === 'company_name' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'company_name'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('company_name', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Company name
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_LIST_COLUMN_EMAIL) && (
                      <TableCell
                        sortDirection={orderBy === 'email' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'email'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('email', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Email
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_LIST_COLUMN_PHONES) && (
                      <TableCell>
                        Phones
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_LIST_COLUMN_ADDRESS) && (
                      <TableCell
                        size="medium"
                        sortDirection={orderBy === 'address_street_one' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'address_street_one'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('address_street_one', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Address
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_LIST_COLUMN_CREATED_DATE) && (
                      <TableCell
                        sortDirection={orderBy === 'created_at' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'created_at'}
                          direction={order === 'asc' ? 'asc' : 'desc'}
                          onClick={() => handleSortChange('created_at', order === 'asc' ? 'desc' : 'asc')}
                        >
                          Created date
                        </TableSortLabel>
                      </TableCell>
                    )
                  }
                  {
                    selectedColumns.includes(CONTACT_LIST_COLUMN_POOLS) && (
                      <TableCell>
                        Pools
                      </TableCell>
                    )
                  }
                  <TableCell>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => {
                  const isContactSelected = selectedContacts.includes(contact.id);

                  return (
                    <React.Fragment key={contact.id}>
                      <TableRow
                        hover
                        selected={isContactSelected}
                        onClick={() => handleExpandRow(expandedContactId === contact.id ? null : contact.id)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: expandedContactId === contact.id ? alpha(theme.palette.primary.main, 0.10) : 'inherit'
                        }}
                      >
                        <TableCell
                          padding="checkbox"
                          sx={{
                            borderLeft: expandedContactId === contact.id ? `8px solid ${theme.palette.primary.main}` : 0
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isContactSelected}
                            onChange={(event) => handleSelectOneContact(event, contact.id)}
                            value={isContactSelected}
                          />
                        </TableCell>
                        {
                          selectedColumns.includes(CONTACT_LIST_COLUMN_ID) && (
                            <TableCell>
                              {contact.id}
                            </TableCell>
                          )
                        }
                        {
                          selectedColumns.includes(CONTACT_LIST_COLUMN_VEND) && (
                            <TableCell>
                              {contact.vend_contact_id
                                ? (
                                  <Tooltip
                                    title="Synced to Vend"
                                  >
                                    <span>
                                      <IconButton disabled>
                                        <VendIcon
                                          fontSize="large"
                                          sx={{
                                            color: theme.palette.success.main
                                          }}
                                        />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                )
                                : (
                                  <Tooltip
                                    title="Push contact to Vend"
                                  >
                                    <IconButton
                                      onClick={() => {}}
                                    >
                                      <VendIcon
                                        fontSize="large"
                                        sx={{
                                          color: alpha(theme.palette.error.main, 0.70)
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                )}
                            </TableCell>
                          )
                        }
                        {
                          selectedColumns.includes(CONTACT_LIST_COLUMN_FIRST_NAME) && (
                            <TableCell>
                              {contact.first_name}
                            </TableCell>
                          )
                        }
                        {
                          selectedColumns.includes(CONTACT_LIST_COLUMN_LAST_NAME) && (
                            <TableCell>
                              {contact.last_name}
                            </TableCell>
                          )
                        }
                        {
                          selectedColumns.includes(CONTACT_LIST_COLUMN_COMPANY_NAME) && (
                            <TableCell>
                              {contact.company_name}
                            </TableCell>
                          )
                        }
                        {
                          selectedColumns.includes(CONTACT_LIST_COLUMN_EMAIL) && (
                            <TableCell>
                              {contact.email}
                            </TableCell>
                          )
                        }
                        {
                          selectedColumns.includes(CONTACT_LIST_COLUMN_PHONES) && (
                            <TableCell
                              align="center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {contact.phones.length
                                ? <Phones phones={contact.phones} />
                                : null}
                            </TableCell>
                          )
                        }
                        {
                          selectedColumns.includes(CONTACT_LIST_COLUMN_ADDRESS) && (
                            <TableCell size="medium">
                              {contact.full_address}
                            </TableCell>
                          )
                        }
                        {
                          selectedColumns.includes(CONTACT_LIST_COLUMN_CREATED_DATE) && (
                            <TableCell>
                              {moment(contact.created_at).format('DD MMM YYYY')}
                            </TableCell>
                          )
                        }
                        {
                          selectedColumns.includes(CONTACT_LIST_COLUMN_POOLS) && (
                            <TableCell>
                              {contact.pools ? contact.pools.length : ''}
                            </TableCell>
                          )
                        }
                        <TableCell
                          align="right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                          >
                            <NextLink
                              href={`/contacts/${contact.id}/edit`}
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
                              onClick={() => handleDelete(contact)}
                            >
                              <TrashIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            p: 0,
                            borderLeft: expandedContactId === contact.id ? `8px solid ${theme.palette.primary.main}` : 0,
                            borderBottom: expandedContactId === contact.id ? `1px solid ${theme.palette.divider}` : 'none',
                            backgroundColor: expandedContactId === contact.id ? alpha(theme.palette.primary.main, 0.10) : 'inherit'
                          }}
                          colSpan={selectedColumns.length + 2}
                        >
                          <ContactTableExpandedRow
                            contact={contact}
                            isExpanded={expandedContactId === contact.id}
                            onChangeVisibility={handleChangeVisibility}
                          />
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
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
      <ContactListBulkActions
        open={enableBulkActions}
        selected={selectedContacts}
      />
    </>
  );
};

ContactListTable.propTypes = {
  className: PropTypes.string,
  contacts: PropTypes.array.isRequired
};

export default ContactListTable;
