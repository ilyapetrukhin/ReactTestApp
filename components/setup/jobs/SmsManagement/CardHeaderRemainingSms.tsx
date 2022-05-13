import React, { FC, memo, useCallback, useState } from 'react';
import { useTheme, useMediaQuery, CardHeader, Button, Dialog } from '@mui/material';

import { useSelector } from 'src/store';

import BuyAnotherPackDialogueForm from './BuyAnotherPackDialogueForm';

interface CardHeaderRemainingSmsProps {}

const CardHeaderRemainingSms: FC<CardHeaderRemainingSmsProps> = memo(() => {
  const theme = useTheme();
  const nonDesktopDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [isModalPurchaseOpen, setIsModalPurchaseOpen] = useState(false);

  const handleOpenPurchaseModal = useCallback(
    () => setIsModalPurchaseOpen(true),
    []
  );

  const handleClosePurchaseModal = useCallback(
    () => setIsModalPurchaseOpen(false),
    []
  );

  const {
    notification_settings: notificationSettings,
  } = useSelector((state) => state.account.organisation);
  return (
    <>
      <CardHeader
        title={`Remaining ${notificationSettings.remaining_sms_count}/${notificationSettings.purchased_sms_count}`}
        action={(
          <Button
            variant="text"
            onClick={handleOpenPurchaseModal}
          >
            Buy another pack
          </Button>
    )}
      />
      <Dialog
        fullWidth
        fullScreen={nonDesktopDevice}
        maxWidth="sm"
        open={isModalPurchaseOpen}
        onClose={handleClosePurchaseModal}
      >
        <BuyAnotherPackDialogueForm handleClose={handleClosePurchaseModal} />
      </Dialog>
    </>
  );
});

export default CardHeaderRemainingSms;
