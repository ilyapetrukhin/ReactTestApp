/* eslint-disable */
import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid, Typography } from '@mui/material';
import type { Pool } from '../../types/pool';
import Collapse from '@mui/material/Collapse';
import PoolContactsInfo from 'src/components/pool/PoolContactsInfo';
import toast from 'react-hot-toast';
import {useRouter} from "next/router";

interface PoolTableExpandedRowProps {
  pool: Pool;
  isExpanded: boolean;
  onChangeVisibility?: (pool: Pool) => void;
}

const PoolTableExpandedRow: FC<PoolTableExpandedRowProps> = (props) => {
  const { pool, isExpanded, onChangeVisibility, ...other } = props;
  const router = useRouter();

  const handleTestWater = (pool: Pool): void => {
    if (pool?.contacts.length) {
      const poolContact = pool.contacts[0];
      router.push(`/lab/water-test/${pool.id}/${poolContact.id}/new/detail`);
    } else {
      toast.error('Please link contacts to the selected pool first.');
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
            <Button
              color="primary"
              sx={{ m: 1 }}
              onClick={() => handleTestWater(pool)}
              variant="contained"
            >
              Test water
            </Button>
          </Box>
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
