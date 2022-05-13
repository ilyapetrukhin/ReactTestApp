import React, { FC, memo } from 'react';
import {
  Container,
} from '@mui/material';

import SmsManagementConfigure from './SmsManagementConfigure';

interface SmsManagementConfigureTabProps {}

const SmsManagementConfigureTab: FC<SmsManagementConfigureTabProps> = memo(
  () => (
    <Container
      maxWidth="lg"
      sx={{
        px: 0,
      }}
    >
      <SmsManagementConfigure />
    </Container>
  )
);

export default SmsManagementConfigureTab;
