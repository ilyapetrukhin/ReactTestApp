import type { FC } from 'react';
import { Box } from '@mui/material';
import AppLogo from './AppLogo';

const SlashScreen: FC = () => (
  <Box
    sx={{
      alignItems: 'center',
      backgroundColor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      left: 0,
      p: 3,
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 2000
    }}
  >
    <AppLogo />
  </Box>
);

export default SlashScreen;
