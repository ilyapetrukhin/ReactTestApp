import React, { FC, memo, useCallback } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Box,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VendIcon from 'src/icons/Vend';
import { useDispatch, useSelector } from 'src/store';
import { connect } from 'src/slices/vendIntegration';

interface VendIntegrationConnectProps {}

const SIZE = 100;

const VendIntegrationConnect: FC<VendIntegrationConnectProps> = memo(() => {
  const dispatch = useDispatch();
  const { connecting } = useSelector((state) => state.vendIntegration);

  const handleConnect = useCallback(() => {
    dispatch(connect());
  }, []);

  return (
    <Card>
      <CardHeader title="Connect to your Vend account" />
      <Divider />
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <VendIcon
            fontSize="large"
            sx={{
              color: 'success.main',
              width: SIZE,
              height: SIZE,
            }}
          />
          <LoadingButton
            color="primary"
            variant="contained"
            sx={{ textTransform: 'uppercase' }}
            loading={connecting}
            onClick={handleConnect}
          >
            Connect to vend
          </LoadingButton>
        </Box>

      </CardContent>
    </Card>
  );
});

VendIntegrationConnect.propTypes = {};

export default VendIntegrationConnect;
