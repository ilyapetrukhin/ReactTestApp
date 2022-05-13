import React, { FC, memo } from 'react';

import SmsSentListTable from './SmsSentListTable';

interface SmsManagementSentTabProps {}

const SmsManagementSentTab: FC<SmsManagementSentTabProps> = memo(() => (
  <>
    <SmsSentListTable />
  </>
));

export default SmsManagementSentTab;
