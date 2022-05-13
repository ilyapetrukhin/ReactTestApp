import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { useConfirm } from 'material-ui-confirm';
import {
  Box,
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
import { Trash as TrashIcon } from 'react-feather';
import { User } from 'src/types/user';
import { deleteUser } from 'src/slices/user';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from '../../../store';
import { Scrollbar } from '../../scrollbar';

const applyFilters = (
  users: User[],
  query: string
): User[] => users
  .filter((user) => {
    let matches = true;

    if (query) {
      const properties = ['first_name', 'last_name', 'email'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (user[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });

interface UserListTableProps {
  users: User[];
}

const UserListTable: FC<UserListTableProps> = (props) => {
  const { users, ...other } = props;
  const { organisation } = useSelector((state) => state.account);
  const [query, setQuery] = useState<string>('');
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleDelete = (user: User) => {
    confirm({ description: `This will permanently delete ${user.first_name} ${user.last_name} (${user.email})` })
      .then(async () => {
        await dispatch(deleteUser(organisation.id, user.id));
        toast.success('User successfully deleted');
      })
      .catch(() => {});
  };

  const filteredUsers = applyFilters(users, query);

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
              placeholder="Search user"
              value={query}
              variant="outlined"
            />
          </Box>
        </Box>
        <Scrollbar>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    First name
                  </TableCell>
                  <TableCell>
                    Last name
                  </TableCell>
                  <TableCell>
                    Email
                  </TableCell>
                  <TableCell>
                    Added
                  </TableCell>
                  <TableCell>
                    Role
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    hover
                    key={user.id}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      {user.first_name}
                    </TableCell>
                    <TableCell>
                      {user.last_name}
                    </TableCell>
                    <TableCell>
                      {user.email}
                    </TableCell>
                    <TableCell>
                      {moment(user.created_at).format('DD MMM YYYY')}
                    </TableCell>
                    <TableCell>
                      -
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        sx={{
                          color: 'primary.main',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
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
                          handleDelete(user);
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
    </>
  );
};

UserListTable.propTypes = {
  users: PropTypes.array.isRequired
};

export default UserListTable;
