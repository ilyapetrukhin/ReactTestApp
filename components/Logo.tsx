import type { FC } from 'react';
import type { Theme } from '@mui/material';
import type { SxProps } from '@mui/system';
import { Box } from '@mui/material';
import React from 'react';
import { useSelector } from '../store';

interface LogoProps {
  sx?: SxProps<Theme>;
}

const Logo: FC<LogoProps> = (props) => {
  const { logo } = useSelector((state) => state.account);

  return (
    <Box
      sx={{
        p: 0
      }}
      {...props}
    >
      {logo && (
        <img
          alt="Organisation logo"
          src={logo.medium_url}
        />
      )}
    </Box>
  );
};

export default Logo;
