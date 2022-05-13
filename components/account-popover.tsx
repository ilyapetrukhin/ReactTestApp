import type { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../hooks/use-auth';
import { Cog as CogIcon } from '../icons/cog-new';
import { UserCircle as UserCircleIcon } from '../icons/user-circle-new';
import { useMemo } from 'react';
import { getAcronym } from 'src/utils/string';
import { useSelector } from '../store';

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const { organisation } = useSelector((state) => state.account);
  const router = useRouter();
  const { user, logout } = useAuth();

  const userAcronym = useMemo<string>(() => {
    if (user) return getAcronym(`${user.first_name} ${user.last_name}`);

    return null;
  }, [user]);

  const handleLogout = async (): Promise<void> => {
    try {
      onClose?.();
      await logout();
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 300 } }}
      transitionDuration={0}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          p: 2,
          display: 'flex'
        }}
      >
        <Avatar
          sx={{
            height: 32,
            width: 32
          }}
        >
          {userAcronym}
        </Avatar>
        <Box
          sx={{
            ml: 1
          }}
        >
          <Typography variant="body1">
            {user.name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {organisation.name}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          p: 2,
          display: 'flex'
        }}
      >
        <Typography
          color="textPrimary"
          variant="subtitle2"
        >
          {`${user.first_name} ${user.last_name}`}
        </Typography>
        <Typography
          ml={1}
          color="textPrimary"
          variant="subtitle2"
        >
          {user.email}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ my: 1 }}>
        <NextLink
          href="/dashboard/social/profile"
          passHref
        >
          <MenuItem component="a">
            <ListItemIcon>
              <UserCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="body1">
                  Profile
                </Typography>
              )}
            />
          </MenuItem>
        </NextLink>
        <NextLink
          href="/dashboard/account"
          passHref
        >
          <MenuItem component="a">
            <ListItemIcon>
              <CogIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="body1">
                  Settings
                </Typography>
              )}
            />
          </MenuItem>
        </NextLink>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Typography variant="body1">
                Logout
              </Typography>
            )}
          />
        </MenuItem>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

//
// import { useMemo, useRef, useState } from 'react';
// import type { FC } from 'react';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import {
//   Avatar,
//   Box,
//   Button,
//   ButtonBase,
//   Divider,
//   ListItemIcon,
//   ListItemText,
//   MenuItem,
//   Popover,
//   Typography
// } from '@mui/material';
// import packageJson from '../../package.json';
// import useAuth from '../hooks/useAuth';
// import CogIcon from '../icons/Cog';
// import UserIcon from '../icons/User';
// import { getAcronym } from 'src/utils/string';
//
// const AccountPopover: FC = () => {
//   const anchorRef = useRef<HTMLButtonElement | null>(null);
//   const { user, logout } = useAuth();
//   const router = useRouter();
//   const [open, setOpen] = useState<boolean>(false);
//
//   const userAcronym = useMemo<string>(() => getAcronym(`${user.first_name} ${user.last_name}`), [user]);
//
//   const handleOpen = (): void => {
//     setOpen(true);
//   };
//
//   const handleClose = (): void => {
//     setOpen(false);
//   };
//
//   const handleLogout = async (): Promise<void> => {
//     try {
//       handleClose();
//       await logout();
//       navigate('/');
//     } catch (err) {
//       console.error(err);
//       toast.error('Unable to logout');
//     }
//   };
//
//   return (
//     <>
//       <Box
//         component={ButtonBase}
//         onClick={handleOpen}
//         ref={anchorRef}
//         sx={{
//           alignItems: 'center',
//           display: 'flex'
//         }}
//       >
//         <Avatar
//           sx={{
//             height: 32,
//             width: 32
//           }}
//         >
//           {userAcronym}
//         </Avatar>
//       </Box>
//       <Popover
//         anchorEl={anchorRef.current}
//         anchorOrigin={{
//           horizontal: 'center',
//           vertical: 'bottom'
//         }}
//         keepMounted
//         onClose={handleClose}
//         open={open}
//         PaperProps={{
//           sx: { width: 240 }
//         }}
//       >
//         <Box sx={{ p: 2 }}>
//           <Typography
//             color="textPrimary"
//             variant="subtitle2"
//           >
//             {`${user.first_name} ${user.last_name}`}
//           </Typography>
//           <Typography
//             color="textPrimary"
//             variant="subtitle2"
//           >
//             {user.email}
//           </Typography>
//         </Box>
//         <Divider />
//         <Box sx={{ mt: 2 }}>
//           <MenuItem
//             component={RouterLink}
//             to="/dashboard/social/profile"
//           >
//             <ListItemIcon>
//               <UserIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText
//               primary={(
//                 <Typography
//                   color="textPrimary"
//                   variant="subtitle2"
//                 >
//                   Profile
//                 </Typography>
//               )}
//             />
//           </MenuItem>
//           <MenuItem
//             component={RouterLink}
//             to="/setup/organisation"
//           >
//             <ListItemIcon>
//               <CogIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText
//               primary={(
//                 <Typography
//                   color="textPrimary"
//                   variant="subtitle2"
//                 >
//                   Settings
//                 </Typography>
//               )}
//             />
//           </MenuItem>
//           <MenuItem
//             sx={{
//               display: 'flex',
//               justifyContent: 'center'
//             }}
//           >
//             <Typography
//               color="textSecondary"
//               variant="subtitle2"
//             >
//               {`v${packageJson.version}`}
//             </Typography>
//           </MenuItem>
//         </Box>
//         <Box sx={{ p: 2 }}>
//           <Button
//             color="primary"
//             fullWidth
//             onClick={handleLogout}
//             variant="outlined"
//           >
//             Logout
//           </Button>
//         </Box>
//       </Popover>
//     </>
//   );
// };
//
// export default AccountPopover;
