import type { FC } from 'react';
import { Box } from '@mui/material';
import AppLogo from './AppLogo';
import { keyframes } from '@emotion/react';

const bounce1 = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 1px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

const bounce5 = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 5px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

export const SplashScreen: FC = () => (
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
    <AppLogo
      sx={{
        height: 80,
        width: 150,
        '& path:nth-child(1)': {
          animation: `${bounce1} 1s ease-in-out infinite`
        },
        '& path:nth-child(2)': {
          animation: `${bounce5} 1s ease-in-out infinite`
        },
      }}
    />
  </Box>
);
