import React, { memo, FC, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, alpha, Typography } from '@mui/material';
import { experimentalStyled, useTheme } from '@mui/material/styles';
import format from 'date-fns/format';
import { utcToZonedTime } from 'date-fns-tz';

import { useSelector } from 'src/store';

const NowIndicatorRoot = experimentalStyled('div')({
  position: 'relative',
  left: '2px',
});

interface NowIndicatorProps {
  date: Date,
}

const NowIndicator : FC<NowIndicatorProps> = ({ date }) => {
  const { timezone } = useSelector((state) => state.account.organisation);
  const theme = useTheme();
  const time = useMemo(() => format(utcToZonedTime(date, timezone), 'h:mm'), [date, timezone]);

  return (
    <NowIndicatorRoot>
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'block',
            backgroundColor: alpha(theme.palette.primary.main, 0.8),
            borderBottomLeftRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius,
            color: theme.palette.common.white,
          }}
          py={0.5}
          px={2}
        >
          <Typography
            sx={{
              color: 'common.white'
            }}
            variant="caption"
          >
            {time}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'block',
            width: theme.spacing(0.5),
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            height: theme.spacing(20),
          }}
        />
      </Box>
    </NowIndicatorRoot>
  );
};

export default memo(NowIndicator);

NowIndicator.propTypes = {
  date: PropTypes.instanceOf(Date),
};
