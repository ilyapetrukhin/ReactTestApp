import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';

interface LinearProgressProps {
  value: number;
  countOfIndicators?: number;
}

const LinearProgress: FC<LinearProgressProps> = memo(
  ({ value, countOfIndicators }) => {
    const pos = (value * countOfIndicators) / 100;
    return (
      <Box
        display="flex"
        alignItems="center"
      >
        {new Array(countOfIndicators).fill(null).map((_, index) => (
          <Box
            sx={{
              backgroundColor: index < pos ? 'primary.main' : grey[400],
              mr: 0.25,
              width: 5,
              height: 15,
            }}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
          />
        ))}
      </Box>
    );
  }
);

LinearProgress.propTypes = {
  value: PropTypes.number.isRequired,
  countOfIndicators: PropTypes.number,
};

LinearProgress.defaultProps = {
  countOfIndicators: 9,
};

export default LinearProgress;
