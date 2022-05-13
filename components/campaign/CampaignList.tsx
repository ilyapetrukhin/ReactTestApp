import { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import type { Campaign } from 'src/types/campaign';
import { useDispatch, useSelector } from 'src/store';
import { setPage } from 'src/slices/campaign';
import CampaignCard from './CampaignCard';

interface CampaignListProps {
  campaigns: Campaign[];
}

const CampaignList: FC<CampaignListProps> = (props) => {
  const { campaigns, ...other } = props;
  const { page, lastPage, total } = useSelector((state) => state.campaign);
  const [mode, setMode] = useState<string>('grid');
  const dispatch = useDispatch();

  const handleModeChange = (event: any, value: string): void => {
    setMode(value);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    dispatch(setPage(newPage));
  };

  return (
    <div {...other}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          mb: 2
        }}
      >
        <Typography
          color="textPrimary"
          sx={{
            position: 'relative',
            '&:after': {
              backgroundColor: 'primary.main',
              bottom: '-8px',
              content: '" "',
              height: '3px',
              left: 0,
              position: 'absolute',
              width: '48px'
            }
          }}
          variant="h5"
        >
          Showing
          {' '}
          {campaigns.length}
          {' '}
          campaigns of
          {' '}
          {total}
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <ToggleButtonGroup
            exclusive
            onChange={handleModeChange}
            size="small"
            value={mode}
          >
            <ToggleButton value="grid">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Grid
        container
        spacing={3}
      >
        {campaigns.map((campaign) => (
          <Grid
            item
            key={campaign.id}
            xl={mode === 'grid' ? 3 : 12}
            md={mode === 'grid' ? 4 : 12}
            sm={mode === 'grid' ? 6 : 12}
            xs={12}
          >
            <CampaignCard
              campaign={campaign}
              mode={mode}
            />
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 6
        }}
      >
        <Pagination
          count={lastPage}
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </div>
  );
};

CampaignList.propTypes = {
  campaigns: PropTypes.array.isRequired
};

export default CampaignList;
