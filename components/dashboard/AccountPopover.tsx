import { useRef, useState } from 'react';
import type { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';
import useAuth from '../../hooks/useAuth';
import CogIcon from '../../icons/Cog';
import UserIcon from '../../icons/User';

const AccountPopover: FC = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex'
        }}
      >
        <Avatar
          src={user.avatar}
          sx={{
            height: 32,
            width: 32
          }}
        />
      </Box>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 240 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            color="textPrimary"
            variant="subtitle2"
          >
            {`${user.first_name} ${user.last_name}`}
          </Typography>
          <Typography
            color="textPrimary"
            variant="subtitle2"
          >
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <NextLink
            href="/dashboard/social/profile"
            passHref
          >
            <MenuItem component="a">
              <ListItemIcon>
                <UserIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={(
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                  >
                    Profile
                  </Typography>
                )}
              />
            </MenuItem>
          </NextLink>
          <NextLink
            href="/setup/organisation"
            passHref
          >
            <MenuItem component="a">
              <ListItemIcon>
                <CogIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={(
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                  >
                    Settings
                  </Typography>
                )}
              />
            </MenuItem>
          </NextLink>
        </Box>
        <Box sx={{ p: 2 }}>
          <Button
            color="primary"
            fullWidth
            onClick={handleLogout}
            variant="outlined"
          >
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default AccountPopover;
