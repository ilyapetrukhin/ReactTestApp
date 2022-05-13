import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import qs from 'qs';
import get from 'lodash/get';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import LoadingScreen from 'src/components/LoadingScreen';
import { useDispatch, useSelector } from 'src/store';
import { stripeConfig } from 'src/config';
import { useRouter } from 'next/router';
import { connectStripeAccount } from 'src/slices/account';
import toast from 'react-hot-toast';

const cardsList = [
  {
    id: 1,
    image: '/static/cards/visa.png',
    name: 'Visa'
  },
  {
    id: 2,
    image: '/static/cards/mastercard.png',
    name: 'MasterCard'
  },
  {
    id: 3,
    image: '/static/cards/amex.png',
    name: 'Amex'
  },
  {
    id: 4,
    image: '/static/cards/discover.png',
    name: 'Discover'
  },
  {
    id: 5,
    image: '/static/cards/maestro.png',
    name: 'Maestro'
  },
];

const StripeConnect: FC = (props) => {
  const { organisation } = useSelector((state) => state.account);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const isMountedRef = useIsMountedRef();
  const router = useRouter();
  const { search } = router.query;
  const dispatch = useDispatch();

  const { clientId } = stripeConfig;
  const redirectUri = `${window.location.origin}/setup/integrations/stripe`;
  const { code } = qs.parse(search, { ignoreQueryPrefix: true });
  const connectLink = `https://connect.stripe.com/oauth/authorize?response_type=code&amp&client_id=${clientId}&scope=read_write&redirect_uri=${redirectUri}`;

  const connectStripe = useCallback(async () => {
    try {
      if (code) {
        await dispatch(connectStripeAccount(organisation.id, code));

        toast.success('Stripe account successfully connected');
      }

      if (isMountedRef.current) {
        setIsLoaded(true);
      }
    } catch (err) {
      console.error(err.response);
      setIsLoaded(true);
      toast.error(get(err, 'response.data.error', 'Unable to connect Stripe account'));
    }
  }, [isMountedRef]);

  useEffect(() => {
    connectStripe();
  }, [connectStripe]);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& img': {
              height: 100
            }
          }}
        >
          <img
            alt="Stripe"
            src="/static/integrations/stripe.png"
          />
        </Box>
        <Typography
          sx={{ color: 'primary.main' }}
          variant="h6"
        >
          Connect with Stripe to accept payments
        </Typography>
        <Typography
          color="textPrimary"
          sx={{ py: 3 }}
          variant="body1"
        >
          Stripe is the easiest way to accept credit cards. Process major international debit or credit cards, including
          Visa, MasterCard and American Express. You don&apos;t need a merchant account, so you can start accepting
          payments today.
        </Typography>
        <Grid
          container
          spacing={3}
        >
          {cardsList.map((card) => (
            <Grid
              item
              key={card.id}
            >
              <Box
                sx={{
                  '& img': {
                    height: 50
                  }
                }}
              >
                <img
                  alt={card.name}
                  src={card.image}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            component="a"
            href={connectLink}
          >
            Connect
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StripeConnect;
