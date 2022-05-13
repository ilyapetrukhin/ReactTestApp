import { useEffect } from 'react';
import type { FC } from 'react';
import NProgress from 'nprogress';
import { Box, LinearProgress } from '@mui/material';

const LoadingScreen: FC = () => {
  useEffect(() => {
    NProgress.start();

    return (): void => {
      NProgress.done();
    };
  }, []);

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        minHeight: '100%',
        padding: 3
      }}
    >
      <Box width={400}>
        <LinearProgress />
      </Box>
    </Box>
  );
};

export default LoadingScreen;
