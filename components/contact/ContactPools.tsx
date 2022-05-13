import type { FC } from 'react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { Scrollbar } from 'src/components/scrollbar';
import { Edit as EditIcon } from 'react-feather';
import { useTheme } from '@mui/material/styles';
import PlusIcon from '../../icons/Plus';
import { RELATION_TYPES } from '../../constants/poolContact';
import { getEntityAddress } from '../../utils/address';
import { Pool } from '../../types/pool';
import { addPool, unlinkPool, updatePoolRelation, updatePool } from '../../slices/contactDetail';
import { useDispatch } from '../../store';
import { PoolDialogueForm } from '../pool';
import PoolSearch from '../widgets/search-inputs/PoolSearch';

interface ContactPoolsProps {
  pools: Pool[];
}

const ContactPools: FC<ContactPoolsProps> = (props) => {
  const theme = useTheme();
  const nonDesktopDevice = useMediaQuery(theme.breakpoints.down('lg'));
  const { pools, ...rest } = props;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editPool, setEditPool] = useState<Pool | null>(null);
  const dispatch = useDispatch();

  const handleEditPool = (pool: Pool): void => {
    setEditPool(pool);
    setIsModalOpen(true);
  };

  const handleCreateNewPool = (): void => {
    setEditPool(null);
    setIsModalOpen(true);
  };

  const handleUpdatedPool = (pool: Pool): void => {
    if (pool) {
      dispatch(updatePool(pool));
      setIsModalOpen(false);
    }
  };

  const handleCreatedPool = (pool: Pool): void => {
    if (pool) {
      dispatch(addPool(pool));
      setIsModalOpen(false);
    }
  };

  const handleLinkPool = (pool: Pool): void => {
    if (pool) {
      dispatch(addPool(pool));
    }
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  return (
    <Card {...rest}>
      <CardHeader title="Linked pools" />
      <Divider />
      <Box
        sx={{
          m: 2
        }}
      >
        <Grid
          sx={{
            alignItems: 'center'
          }}
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
            sm={9}
            md={8}
          >
            <PoolSearch
              onSelect={handleLinkPool}
              contactPools={pools}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            md={4}
          >
            <Button
              type="button"
              startIcon={<PlusIcon fontSize="small" />}
              onClick={handleCreateNewPool}
              variant="text"
            >
              Create new pool
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Scrollbar>
        <Box
          sx={{
            maxHeight: {
              lg: 355
            }
          }}
        >
          <Table>
            <TableBody>
              {pools.map((pool) => (
                <TableRow
                  key={pool.id}
                  sx={{
                    '&:last-child td': {
                      border: 0
                    }
                  }}
                >
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      sx={{ cursor: 'pointer' }}
                      variant="subtitle2"
                    >
                      { getEntityAddress(pool, 'pool', true) }
                    </Typography>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        mt: 1
                      }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {pool.pool_type.name}
                      </Typography>
                      {pool.name && (
                        <>
                          <Box
                            sx={{
                              height: 4,
                              width: 4,
                              borderRadius: 4,
                              backgroundColor: 'text.secondary',
                              mx: 1
                            }}
                          />
                          <Typography
                            color="textSecondary"
                            variant="body2"
                          >
                            {pool.name}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                    }}
                    align="right"
                  >
                    <TextField
                      label="Relationship to pool"
                      name="contact_link"
                      select
                      onChange={(event) => dispatch(updatePoolRelation(pool.id, parseInt(event.target.value, 10)))}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ native: true, displayEmpty: true }}
                      value={pool.pivot.address_type_id}
                      variant="outlined"
                    >
                      {RELATION_TYPES.map((relationType) => (
                        <option
                          key={relationType.value}
                          value={relationType.value}
                        >
                          {relationType.label}
                        </option>
                      ))}
                    </TextField>
                    <IconButton
                      sx={{
                        color: 'primary.main',
                      }}
                      onClick={() => dispatch(unlinkPool(pool.id))}
                    >
                      <LinkOffIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: 'primary.main',
                      }}
                      onClick={() => handleEditPool(pool)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Dialog
        fullScreen={nonDesktopDevice}
        fullWidth
        maxWidth="lg"
        onClose={handleModalClose}
        open={isModalOpen}
      >
        {/* Dialog renders its body even if not open */}
        {isModalOpen && (
          <Box
            sx={{
              backgroundColor: 'background.default',
              p: 3,
            }}
          >
            <PoolDialogueForm
              pool={editPool}
              contacts={editPool ? editPool.contacts : []}
              onAddComplete={handleCreatedPool}
              onEditComplete={handleUpdatedPool}
              onCancel={handleModalClose}
            />
          </Box>
        )}
      </Dialog>
    </Card>
  );
};

ContactPools.propTypes = {
  // @ts-ignore
  pools: PropTypes.array.isRequired,
};

export default ContactPools;
