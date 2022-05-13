import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Box, Button, FormControlLabel, Grid, Switch, Typography } from '@mui/material';
import type { Pool } from '../../types/pool';
import Collapse from '@mui/material/Collapse';
import PoolContactsInfo from './PoolContactsInfo';

interface PoolTableExpandedRowProps {
  pool: Pool;
  isExpanded: boolean;
  onChangeVisibility?: (pool: Pool) => Promise<void>;
}

const PoolTableExpandedRow: FC<PoolTableExpandedRowProps> = (props) => {
  const { pool, isExpanded, onChangeVisibility, ...other } = props;

  const handleChangeVisibility = (pool: Pool): void => {
    if (onChangeVisibility) {
      onChangeVisibility(pool);
    }
  };

  return (
    <Collapse
      in={isExpanded}
      timeout="auto"
      unmountOnExit
      {...other}
    >
      <Grid
        sx={{
          p: 2
        }}
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          xl={4}
          sx={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Typography
            sx={{ fontWeight: 'fontWeightBold' }}
            color="textSecondary"
            variant="subtitle2"
          >
            Details
          </Typography>
          <Typography
            color="textPrimary"
            ml={3}
            variant="body2"
          >
            {pool.address_street_one}
            <br />
            {pool.address_city}
            <br />
            {pool.address_state}
            {' '}
            {pool.address_postcode}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          xl={4}
          sx={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Typography
            sx={{ fontWeight: 'fontWeightBold', minWidth: '45px' }}
            color="textSecondary"
            variant="subtitle2"
            mr={3}
          >
            Contacts
          </Typography>
          <PoolContactsInfo contacts={pool.contacts} />
        </Grid>
        <Grid
          item
          xs={6}
          lg={3}
          xl={2}
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <Typography
              sx={{ fontWeight: 'fontWeightBold', minWidth: '45px' }}
              color="textSecondary"
              variant="subtitle2"
              mr={3}
            >
              Some useful details
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              -
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          lg={3}
          xl={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box>
            <NextLink
              href={`/pools/${pool.id}/details`}
              passHref
            >
              <Button
                color="primary"
                sx={{ m: 1 }}
                variant="contained"
              >
                View details
              </Button>
            </NextLink>
          </Box>
          <FormControlLabel
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
            }}
            control={(
              <Switch
                checked={!!pool.visibility}
                edge="start"
                name="visibility"
                onChange={() => handleChangeVisibility(pool)}
                value={pool.visibility}
              />
            )}
            label="Active"
          />
        </Grid>
      </Grid>
    </Collapse>
  );
};

PoolTableExpandedRow.propTypes = {
  // @ts-ignore
  pool: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onChangeVisibility: PropTypes.func,
};

export default PoolTableExpandedRow;
