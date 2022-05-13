import type { FC } from 'react';
import React, { memo } from 'react';
import {
  Divider,
  Card,
  CardHeader,
  Typography,
  Theme,
  List,
  ListItem,
  Box,
  Stack
} from '@mui/material';
import { SxProps } from '@mui/system';
import type { LabJob } from '../../types/labJob';
import type { Pool } from '../../types/pool';
import type { Contact } from '../../types/contact';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface ReportNotificationsProps {
  labJob: LabJob;
  pool: Pool;
  contact: Contact;
  sx?: SxProps<Theme>;
}

const ReportNotifications: FC<ReportNotificationsProps> = (props) => {
  const { labJob, pool, contact, ...rest } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      {...rest}
      sx={{
        position: 'sticky',
        top: theme.spacing(3),
        minWidth: '275',
      }}
    >
      <Stack
        spacing={3}
      >
        <Card>
          <CardHeader title={t('Send next test reminder')} />
          <Divider />
          <List>
            <ListItem
              disableGutters
              sx={{
                px: 2,
              }}
            >
              <Typography
                color="textPrimary"
                variant="body2"
                sx={{
                  ml: 2,
                  flex: 2
                }}
              >
                {t('Dummy')}
              </Typography>
            </ListItem>
          </List>
        </Card>
        <Card>
          <CardHeader title={t('Send via email')} />
          <Divider />
          <List>
            <ListItem
              disableGutters
              sx={{
                px: 2,
              }}
            >
              <Typography
                color="textPrimary"
                variant="body2"
                sx={{
                  ml: 2,
                  flex: 2
                }}
              >
                {t('Dummy')}
              </Typography>
            </ListItem>
          </List>
        </Card>
        <Card>
          <CardHeader title={t('Send via SMS')} />
          <Divider />
          <List>
            <ListItem
              disableGutters
              sx={{
                px: 2,
              }}
            >
              <Typography
                color="textPrimary"
                variant="body2"
                sx={{
                  ml: 2,
                  flex: 2
                }}
              >
                {t('Dummy')}
              </Typography>
            </ListItem>
          </List>
        </Card>
      </Stack>
    </Box>
  );
};

ReportNotifications.propTypes = {
  // @ts-ignore
  labJob: PropTypes.object.isRequired,
  // @ts-ignore
  pool: PropTypes.object.isRequired,
  // @ts-ignore
  contact: PropTypes.object.isRequired,
  sx: PropTypes.object
};

export default memo(ReportNotifications);
