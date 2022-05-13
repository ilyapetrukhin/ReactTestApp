import React, { FC, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Register, UserRegister } from 'src/types/vendIntegration';
import { VendUser } from 'src/types/user';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

interface MatchUsersRowProps {
  username: string;
  userRegister: UserRegister;
  registers: Register[];
  vendUsers: VendUser[];
  onChange: (userId: number, vendUserId: number, registerId: number) => void;
}

const MatchUsersRow: FC<MatchUsersRowProps> = memo(
  ({ username, userRegister, registers, vendUsers, onChange }) => {
    const handleChangeRegisterId = useCallback((event: SelectChangeEvent) => {
      onChange(userRegister.user_id, userRegister.vend_user_id, parseInt(event.target.value, 10));
    }, [userRegister.user_id, userRegister.vend_user_id, onChange]);

    const handleChangeUserVendId = useCallback((event: SelectChangeEvent) => {
      onChange(userRegister.user_id, parseInt(event.target.value, 10), userRegister.register_id);
    }, [userRegister.user_id, userRegister.register_id, onChange]);

    return (
      <TableRow
        sx={{
          '&:last-child td': {
            border: 0
          }
        }}
      >
        <TableCell>
          <Typography
            color="textPrimary"
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {username}
          </Typography>
        </TableCell>
        <TableCell>
          <FormControl fullWidth>
            <InputLabel>Vend register</InputLabel>
            <Select
              label="Vend register"
              value={userRegister.register_id.toString()}
              onChange={handleChangeRegisterId}
            >
              {registers.map((register) => (
                <MenuItem
                  value={register.id}
                  key={register.id}
                >
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {register.name}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>
          <FormControl fullWidth>
            <InputLabel>Vend user</InputLabel>
            <Select
              label="Vend user"
              value={userRegister.vend_user_id.toString()}
              onChange={handleChangeUserVendId}
            >
              {vendUsers.map((vendUser) => (
                <MenuItem
                  value={vendUser.id}
                  key={vendUser.id}
                >
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {vendUser.display_name}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
      </TableRow>
    );
  }
);

MatchUsersRow.propTypes = {
  username: PropTypes.string.isRequired,
  // @ts-ignore
  userRegister: PropTypes.object.isRequired,
  // @ts-ignore
  registers: PropTypes.arrayOf(PropTypes.object),
  // @ts-ignore
  vendUsers: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
};

export default MatchUsersRow;
