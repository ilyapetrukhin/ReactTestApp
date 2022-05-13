import React, { FC, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Paper, Theme, Typography, ButtonBase } from '@mui/material';
import { SxProps } from '@mui/system';
import { format } from 'date-fns';

interface DaySwitcherButtonProps {
  selected: boolean;
  date: Date;
  onSelect: () => void;
}

const DaySwitcherButton: FC<DaySwitcherButtonProps> = memo(({ selected, date, onSelect }) => {
  const style: SxProps<Theme> = selected
    ? { backgroundColor: 'primary.main', color: 'common.white' }
    : {
      backgroundColor: 'common.white',
      cursor: 'pointer',
      '&:hover': {
        color: 'primary.main',
      },
    };

  const weekDay = useMemo(() => format(date, 'EEEEEE').toUpperCase(), [date]);
  const monthDay = useMemo(() => format(date, 'dd'), [date]);

  return (
    <Paper
      elevation={0}
      sx={{
        mr: 1,
        overflow: 'hidden',
      }}
    >
      <ButtonBase
        disableRipple={selected}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          px: 1,
          py: 0.5,
          userSelect: 'none',
          width: 40,
          ...style,
        }}
        onClick={onSelect}
      >
        <Typography
          variant="caption"
          color="inherit"
        >
          {weekDay}
        </Typography>
        <Typography
          variant="h6"
          color="inherit"
          style={{ lineHeight: 1.2, fontWeight: 'bold' }}
        >
          {monthDay}
        </Typography>
      </ButtonBase>
    </Paper>
  );
});

DaySwitcherButton.propTypes = {
  selected: PropTypes.bool.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DaySwitcherButton;
