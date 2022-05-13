import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import toast from 'react-hot-toast';

import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@mui/material';
import numeral from 'numeral';

import { buyPack, saveNotificationSettings } from 'src/slices/account';
import { getSmsTiers } from 'src/slices/smsTier';
import { useDispatch, useSelector } from 'src/store';
import type { SelectChangeEvent } from '@mui/material/Select';

interface BuyAnotherPackDialogueFormProps {
  handleClose: () => void;
}

const BuyAnotherPackDialogueForm: FC<BuyAnotherPackDialogueFormProps> = memo(
  ({ handleClose }) => {
    const dispatch = useDispatch();

    const [isUpdating, setIsUpdating] = useState(false);
    const [isConfirmingBuyPack, setIsConfirmingBuyPack] = useState(false);
    const [isConfirmingAutoBuy, setIsConfirmingAutoBuy] = useState(false);

    const { id: organisationId, notification_settings: notificationSettings } = useSelector((state) => state.account.organisation);
    const { isLoading: isLoadingSmsTiers, tiers } = useSelector(
      (state) => state.smsTier
    );

    const currentTier = useMemo(
      () => tiers.find((tier) => tier.endingUnit === notificationSettings.sms_pack),
      [tiers, notificationSettings.sms_pack]
    );

    const [selectedTier, setSelectedTier] = useState(currentTier);
    const [autoBuy, setAutoBuy] = useState(
      notificationSettings.auto_buy_enabled
    );

    const handleChangePack = useCallback(
      async (
        event: SelectChangeEvent
      ) => {
        setIsConfirmingBuyPack(false);
        setIsConfirmingAutoBuy(false);

        const packSize = parseInt(event.target.value, 10);

        const tier = tiers.find((tier) => tier.endingUnit === packSize);
        const previousPack = selectedTier;

        if (tier == null) {
          return;
        }

        setIsUpdating(true);
        setSelectedTier(tier);

        const data = {
          ...notificationSettings,
          sms_pack: tier.endingUnit,
          sms_pack_price: tier.price,
        };

        try {
          await dispatch(saveNotificationSettings(organisationId, data));
          toast.success('Notifications details updated');
        } catch (err) {
          toast.error(err.message);
          setSelectedTier(previousPack);
          throw err;
        } finally {
          setIsUpdating(false);
        }
      },
      [notificationSettings]
    );

    const changeAutoBuy = useCallback(
      async (autobuy: boolean) => {
        setIsUpdating(true);
        setAutoBuy(autobuy);

        const data = {
          ...notificationSettings,
          auto_buy_enabled: autobuy,
        };

        try {
          await dispatch(saveNotificationSettings(organisationId, data));
          toast.success('Notifications details updated');
        } catch (err) {
          toast.error(err.message);
          setAutoBuy(!autoBuy);
          throw err;
        } finally {
          setIsUpdating(false);
        }
      },
      [notificationSettings]
    );

    const handleChangeAutoBuy = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
          setIsConfirmingBuyPack(false);
          setIsConfirmingAutoBuy(true);
        } else {
          await changeAutoBuy(false);
        }
      },
      [setIsUpdating]
    );

    const handleCancelAutoBuy = useCallback(() => {
      setIsConfirmingAutoBuy(false);
    }, []);

    const handleConfirmAutoBuy = useCallback(async () => {
      setIsConfirmingAutoBuy(false);
      await changeAutoBuy(true);
    }, []);

    const handleCancelBuyPack = useCallback(() => {
      setIsConfirmingBuyPack(false);
    }, []);

    const handleConfirmBuyPack = useCallback(async () => {
      try {
        await setIsUpdating(true);
        await dispatch(buyPack(organisationId));
        handleClose();
        toast.success('A new pack of sms successfully applied to your account');
      } catch (err) {
        toast.error(err.message);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    }, [organisationId, handleClose]);

    const handleBuyPack = useCallback(async () => {
      setIsConfirmingBuyPack(false);
      setIsConfirmingBuyPack(true);
    }, []);

    useEffect(() => setSelectedTier(currentTier), [currentTier]);
    useEffect(() => dispatch(getSmsTiers(organisationId)), []);

    return (
      <>
        <Card sx={{ height: '100%' }}>
          <CardHeader title="SMS settings" />
          <Divider />
          <LinearProgress
            sx={{
              visibility:
                isUpdating || isLoadingSmsTiers ? 'visible' : 'hidden',
            }}
          />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                sm={8}
              >
                <FormControl
                  variant="outlined"
                  sx={{
                    minWidth: '100%',
                  }}
                  size="small"
                  disabled={isUpdating || isLoadingSmsTiers}
                >
                  <InputLabel>Select pack</InputLabel>
                  <Select
                    onChange={handleChangePack}
                    value={selectedTier?.endingUnit || '-'}
                    fullWidth
                    label="Select pack"
                  >
                    {tiers.map((tier) => (
                      <MenuItem
                        key={tier.endingUnit}
                        value={tier.endingUnit}
                      >
                        {numeral(tier.endingUnit).format('0,0')}
                        {' '}
                        SMS -
                        {numeral(tier.price).format('$0,0.00')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
              >
                <FormControlLabel
                  disabled={isUpdating || isConfirmingAutoBuy}
                  control={(
                    <Switch
                      checked={autoBuy}
                      color="primary"
                      onChange={handleChangeAutoBuy}
                      edge="start"
                    />
                  )}
                  label="Set auto-buy"
                />
              </Grid>
            </Grid>
            {
              isConfirmingAutoBuy && (
                <>
                  <Typography
                    mt={2}
                    variant="subtitle1"
                    color="textPrimary"
                  >
                    Are you sure you want to proceed?
                  </Typography>
                  <Typography
                    mt={2}
                    variant="body2"
                    color="textPrimary"
                    component="p"
                  >
                    Switching on auto-buy will automatically purchase another set of
                    {' '}
                    {notificationSettings.sms_pack}
                    {' '}
                    SMS messages for $
                    {notificationSettings.sms_pack_price}
                    , when your balance drops to
                    {' '}
                    {notificationSettings.low_sms_limit}
                    {' '}
                    SMS messages.
                  </Typography>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      mt: 2,
                    }}
                  >
                    <Button
                      sx={{ ml: 'auto' }}
                      color="primary"
                      onClick={handleCancelAutoBuy}
                      variant="text"
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      sx={{ ml: 1 }}
                      variant="contained"
                      onClick={handleConfirmAutoBuy}
                      disabled={isUpdating}
                    >
                      Confirm
                    </Button>
                  </Box>
                </>
              )
            }
            {
              isConfirmingBuyPack && (
                <>
                  <Typography
                    mt={2}
                    variant="subtitle1"
                    color="textPrimary"
                  >
                    Are you sure?
                  </Typography>
                  <Typography
                    mt={2}
                    variant="body2"
                    color="textPrimary"
                    component="p"
                  >
                    Are you sure you want to buy additional
                    {' '}
                    {notificationSettings.sms_pack}
                    {' '}
                    sms for $
                    {notificationSettings.sms_pack_price}
                    ?
                  </Typography>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      mt: 2,
                    }}
                  >
                    <Button
                      sx={{ ml: 'auto' }}
                      color="primary"
                      onClick={handleCancelBuyPack}
                      variant="text"
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      sx={{ ml: 1 }}
                      variant="contained"
                      onClick={handleConfirmBuyPack}
                      disabled={isUpdating}
                    >
                      Confirm
                    </Button>
                  </Box>
                </>
              )
            }
            {
              !isConfirmingAutoBuy && !isConfirmingBuyPack && (
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    mt: 2,
                  }}
                >
                  <Button
                    sx={{ ml: 'auto' }}
                    color="primary"
                    onClick={handleClose}
                    variant="text"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    sx={{ ml: 1 }}
                    variant="contained"
                    onClick={handleBuyPack}
                    disabled={isUpdating}
                  >
                    Buy another pack
                  </Button>
                </Box>
              )
            }

          </CardContent>
        </Card>
      </>
    );
  }
);

BuyAnotherPackDialogueForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default BuyAnotherPackDialogueForm;
