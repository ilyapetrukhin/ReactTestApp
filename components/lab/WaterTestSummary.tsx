import type { FC } from 'react';
import React, { memo, useCallback, useState } from 'react';
import {
  Divider,
  Card,
  CardHeader,
  Typography, Theme, List, ListItem, Dialog, Box, useMediaQuery, Button
} from '@mui/material';
import { SxProps } from '@mui/system';
import type { LabJob } from '../../types/labJob';
import type { Pool } from '../../types/pool';
import type { Contact } from '../../types/contact';
import PropTypes from 'prop-types';
import { getEntityAddress } from '../../utils/address';
import get from 'lodash/get';
import numeral from 'numeral';
import getCommaSeparatedSanitisers from '../../utils/pool';
import { PoolDialogueForm } from '../pool';
import { ContactDialogueForm } from '../contact';
import { useTheme } from '@mui/material/styles';
import {
  Edit as EditIcon,
} from 'react-feather';
import { getCommaSeparatedPhones, getFullName } from '../../utils/contact';
import { useDispatch } from 'src/store';
import { updateContact, updatePool } from 'src/slices/waterTest';
import { useTranslation } from 'react-i18next';

interface WaterTestSummaryProps {
  labJob: LabJob;
  pool: Pool;
  contact: Contact;
  sx?: SxProps<Theme>;
}

const WaterTestSummary: FC<WaterTestSummaryProps> = (props) => {
  const { labJob, pool, contact, ...rest } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const nonDesktopDevice = useMediaQuery(theme.breakpoints.down('lg'));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editPool, setEditPool] = useState<Pool | null>(null);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const { t } = useTranslation();

  const handleEditPool = useCallback(() => {
    setEditPool(pool);
    setIsModalOpen(true);
  }, [setEditPool, setIsModalOpen, pool]);

  const handleUpdatedPool = useCallback((pool: Pool) => {
    dispatch(updatePool(pool));
    setEditPool(null);
    setIsModalOpen(false);
  }, [setEditPool, setIsModalOpen, updatePool]);

  const handleEditContact = useCallback(() => {
    setEditContact(contact);
    setIsModalOpen(true);
  }, [setEditContact, setIsModalOpen, contact]);

  const handleUpdatedContact = useCallback((contact: Contact) => {
    dispatch(updateContact(contact));
    setEditContact(null);
    setIsModalOpen(false);
  }, [setEditContact, setIsModalOpen, updateContact]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditPool(null);
    setEditContact(null);
  }, [setIsModalOpen, setEditContact, setEditPool]);

  return (
    <Card
      {...rest}
      sx={{
        position: 'sticky',
        top: theme.spacing(3),
        minWidth: '275',
      }}
    >
      <CardHeader title="Summary" />
      <Divider />
      <List>
        <ListItem
          disableGutters
          sx={{
            px: 2,
          }}
        >
          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              flex: 1
            }}
          >
            {t('ID')}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body2"
            sx={{
              ml: 2,
              flex: 2
            }}
          >
            {pool.id}
          </Typography>
        </ListItem>
        <ListItem
          disableGutters
          sx={{
            px: 2,
          }}
        >
          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              flex: 1
            }}
          >
            {t('Location')}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body2"
            sx={{
              ml: 2,
              flex: 2
            }}
          >
            {getEntityAddress(pool, 'pool')}
          </Typography>
        </ListItem>
        <ListItem
          disableGutters
          sx={{
            px: 2,
          }}
        >
          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              flex: 1
            }}
          >
            {t('Pool type')}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body2"
            sx={{
              ml: 2,
              flex: 2
            }}
          >
            {get(pool, 'pool_type.name', 'Unknown type')}
          </Typography>
        </ListItem>
        <ListItem
          disableGutters
          sx={{
            px: 2,
          }}
        >
          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              flex: 1
            }}
          >
            {t('Volume')}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body2"
            sx={{
              ml: 2,
              flex: 2
            }}
          >
            {numeral(pool.pool_volume).format('0,0')}
            {' '}
            L
          </Typography>
        </ListItem>
        <ListItem
          disableGutters
          sx={{
            px: 2,
          }}
        >
          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              flex: 1
            }}
          >
            {t('Surface type')}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body2"
            sx={{
              ml: 2,
              flex: 2
            }}
          >
            {get(pool, 'pool_surface_type.name', 'Unknown surface')}
          </Typography>
        </ListItem>
        <ListItem
          disableGutters
          sx={{
            px: 2,
          }}
        >
          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              flex: 1
            }}
          >
            {t('Sanitiser')}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body2"
            sx={{
              ml: 2,
              flex: 2
            }}
          >
            {pool?.pool_sanitisers.length ? getCommaSeparatedSanitisers(pool.pool_sanitisers) : '-'}
          </Typography>
        </ListItem>
        <ListItem
          disableGutters
          sx={{
            px: 2,
          }}
        >
          <Button
            onClick={handleEditPool}
            startIcon={<EditIcon fontSize="small" />}
            variant="text"
          >
            {t('Edit pool')}
          </Button>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem
          disableGutters
          sx={{
            px: 2,
          }}
        >
          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              flex: 1,
            }}
          >
            Contact
          </Typography>
          <Box
            sx={{
              ml: 2,
              flex: 2
            }}
          >
            <Box>
              <Typography
                color="primary"
                variant="body2"
                fontWeight="bold"
              >
                {getFullName(contact)}
              </Typography>
            </Box>
            <Typography
              color="textPrimary"
              variant="body2"
            >
              {getEntityAddress(contact, 'contact')}
            </Typography>
          </Box>
        </ListItem>
        <ListItem
          disableGutters
          sx={{
            px: 2,
          }}
        >
          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              flex: 1
            }}
          >
            {t('Email')}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body2"
            sx={{
              ml: 2,
              flex: 2
            }}
          >
            {contact.email}
          </Typography>
        </ListItem>
        <ListItem
          disableGutters
          sx={{
            px: 2,
          }}
        >
          <Typography
            color="textSecondary"
            variant="subtitle2"
            fontWeight="bold"
            sx={{
              flex: 1
            }}
          >
            {t('Phone')}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body2"
            sx={{
              ml: 2,
              flex: 2
            }}
          >
            {getCommaSeparatedPhones(contact.phones)}
          </Typography>
        </ListItem>
        <ListItem
          disableGutters
          sx={{
            px: 2,
          }}
        >
          <Button
            onClick={handleEditContact}
            startIcon={<EditIcon fontSize="small" />}
            variant="text"
          >
            {t('Edit contact')}
          </Button>
        </ListItem>
      </List>
      <Dialog
        fullScreen={nonDesktopDevice}
        fullWidth
        maxWidth="lg"
        onClose={handleModalClose}
        open={isModalOpen}
      >
        {/* Dialog renders its body even if not open */}
        {isModalOpen && Boolean(editPool) && (
          <Box
            sx={{
              backgroundColor: 'background.default',
              p: 3,
            }}
          >
            <PoolDialogueForm
              pool={editPool}
              contacts={editPool ? editPool.contacts : []}
              onEditComplete={handleUpdatedPool}
              onCancel={handleModalClose}
            />
          </Box>
        )}
        {isModalOpen && Boolean(editContact) && (
          <Box
            sx={{
              backgroundColor: 'background.default',
              p: 3,
            }}
          >
            <ContactDialogueForm
              contact={editContact}
              pools={editContact ? editContact.pools : []}
              onEditComplete={handleUpdatedContact}
              onCancel={handleModalClose}
            />
          </Box>
        )}
      </Dialog>
    </Card>
  );
};

WaterTestSummary.propTypes = {
  // @ts-ignore
  labJob: PropTypes.object.isRequired,
  // @ts-ignore
  pool: PropTypes.object.isRequired,
  // @ts-ignore
  contact: PropTypes.object.isRequired,
  sx: PropTypes.object
};

export default memo(WaterTestSummary);
