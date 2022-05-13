import React, { FC, memo, useMemo } from 'react';

import PropTypes from 'prop-types';

import Label, { LabelColor } from 'src/components/Label';
import {
  ERROR_STATUSES,
  NEUTRAL_STATUSES,

  SMS_STATUS_DELIVERED,
  SMS_STATUS_ERROR,
  SMS_STATUS_FAILED,
  SMS_STATUS_LOW_BALANCE,
  SMS_STATUS_QUEUED,
  SMS_STATUS_SENT,
  SMS_STATUS_UNDELIVERED,
  SUCCESS_STATUSES,
} from 'src/constants/sms';
import { SmsStatus } from 'src/types/sms';

interface SmsSentStatusLabelProps {
  status: SmsStatus;
}

function getColorByStatus(status: SmsStatus): LabelColor {
  if (SUCCESS_STATUSES.includes(status)) {
    return 'success';
  }

  if (NEUTRAL_STATUSES.includes(status)) {
    return 'secondary';
  }

  if (ERROR_STATUSES.includes(status)) {
    return 'error';
  }

  return 'secondary';
}

const MAP_STATUS_TO_TEXT = {
  [SMS_STATUS_DELIVERED]: 'Delivered',
  [SMS_STATUS_SENT]: 'Sent',
  [SMS_STATUS_QUEUED]: 'Queued',
  [SMS_STATUS_UNDELIVERED]: 'Undelivered',
  [SMS_STATUS_LOW_BALANCE]: 'Low balance',
  [SMS_STATUS_ERROR]: 'Error',
  [SMS_STATUS_FAILED]: 'Failed',
};
const SmsSentStatusLabel: FC<SmsSentStatusLabelProps> = memo(({ status }) => {
  const color = useMemo(() => getColorByStatus(status), [status]);
  return <Label color={color}>{MAP_STATUS_TO_TEXT[status]}</Label>;
});

SmsSentStatusLabel.propTypes = {
  // @ts-ignore
  status: PropTypes.string.isRequired,
};

export default SmsSentStatusLabel;
