import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import {
  Grid,
  Typography,
} from '@mui/material';

import { load } from 'src/slices/poolPhotos';
import useScrollToBottomDetector from 'src/hooks/useScrollToBottomDetector';
import { useDispatch, useSelector } from 'src/store';
import CardPoolPhoto from './CardPoolPhoto';
import LoadingScreen from '../../LoadingScreen';
import { useRouter } from 'next/router';

const PoolPhotos: FC = memo(() => {
  const dispatch = useDispatch();
  const loadNextPageTriggerRef = useRef();
  const router = useRouter();
  const { poolId } = router.query;
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const { isLoading, page, jobs, hasNextPage } = useSelector((state) => state.poolPhotos);

  const loadNextPage = useCallback(() => {
    if (isLoading || !hasNextPage) {
      return;
    }
    // @ts-ignore
    dispatch(load(page + 1, organisationId, parseInt(poolId, 10)));
  }, [organisationId, poolId, page, hasNextPage, isLoading]);

  useEffect(() => {
    // @ts-ignore
    dispatch(load(1, organisationId, parseInt(poolId, 10)));
  }, [organisationId]);

  useScrollToBottomDetector(loadNextPageTriggerRef.current, loadNextPage);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Grid
      container
      spacing={3}
    >
      {
        jobs.length === 0 && !isLoading && (
          <Grid
            item
            xs={12}
          >
            <Typography textAlign="center">There are no linked jobs with attached photos</Typography>
          </Grid>
        )
      }
      {jobs.map((job) => (
        <Grid
          key={job.id}
          item
          md={3}
          sm={6}
          xs={12}
        >
          <CardPoolPhoto job={job} />
        </Grid>
      ))}
    </Grid>
  );
});

export default PoolPhotos;
