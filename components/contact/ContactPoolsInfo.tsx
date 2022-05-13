import React, { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import type { Pool } from '../../types/pool';
import get from 'lodash/get';

interface ContactPoolsInfoProps {
  pools: Pool[];
}

const ContactPoolsInfo: FC<ContactPoolsInfoProps> = (props) => {
  const { pools, ...other } = props;
  const [showAll, setShowAll] = useState<boolean>(false);

  return (
    <Box {...other}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {pools.length > 0 && (
          pools.slice(0, showAll ? pools.length : 2).map((pool) => (
            <React.Fragment key={pool.full_address}>
              <Box
                mb={1}
              >
                <Typography
                  color="textPrimary"
                  variant="body2"
                >
                  {`${get(pool, 'pool_type.name', 'Unknown type')} | ${pool.pool_volume ? pool.pool_volume : 0} L | ${get(pool, 'pool_surface_type.name', 'Unknown surface')}`}
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="body2"
                >
                  {pool.full_address}
                </Typography>
              </Box>
            </React.Fragment>
          ))
        )}
        {pools.length > 2 && (
          <Box
            sx={{
              mt: -1,
              ml: -1
            }}
          >
            <Button
              color="primary"
              onClick={() => setShowAll(!showAll)}
              type="button"
              variant="text"
              disableElevation
            >
              { showAll ? 'show less' : `and ${pools.length - 2} more` }
            </Button>
          </Box>
        )}
      </Box>
      {pools.length === 0 && (
        <Typography
          color="textPrimary"
          variant="body2"
        >
          There are no linked pools
        </Typography>
      )}
    </Box>
  );
};

ContactPoolsInfo.propTypes = {
  // @ts-ignore
  pools: PropTypes.array.isRequired,
};

export default ContactPoolsInfo;
