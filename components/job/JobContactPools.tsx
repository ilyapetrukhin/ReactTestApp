/* eslint-disable */
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
import PlusIcon from '../../icons/Plus';
import { RELATION_TYPES } from '../../constants/poolContact';
import { getEntityAddress } from '../../utils/address';
import { Pool } from '../../types/pool';
import { addPool, unlinkPool, updatePoolRelation, updatePool } from '../../slices/contactDetail';
import {useDispatch, useSelector} from '../../store';
import { PoolDialogueForm } from '../pool';
import PoolSearch from '../widgets/search-inputs/PoolSearch';

interface JobContactPoolsProps {
  pools: Pool[];
}

const JobContactPools: FC<JobContactPoolsProps> = (props) => {
  const fullScreenDialogue = useMediaQuery('(max-width:1280px)');
  const { pools, ...rest } = props;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editPool, setEditPool] = useState<Pool | null>(null);
  const { pool } = useSelector((state) => state.jobDetail);
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
    <>
      <Typography
        color="textPrimary"
        variant="h6"
      >
        Pool
      </Typography>
      <Typography
        color="textSecondary"
        variant="body1"
      >
        Proin tincidunt lacus sed ante efficitur efficitur.
        Quisque aliquam fringilla velit sit amet euismod.
      </Typography>

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          mt: 2
        }}
      >
        <TextField
          fullWidth
          name="job_pool"
          select
          // onChange={(event) => dispatch(updatePoolRelation(pool.id, parseInt(event.target.value, 10)))}
          InputLabelProps={{ shrink: true }}
          SelectProps={{ native: true, displayEmpty: true }}
          variant="outlined"
        >
          {pools.map((pool) => (
            <option
              key={pool.id}
              value={pool.id}
            >
              {pool.full_address}
            </option>
          ))}
        </TextField>
        <IconButton
          sx={{
            ml: 2,
            color: 'primary.main',
          }}
        >
          <PlusIcon fontSize="small" />
        </IconButton>
      </Box>
    </>
  );

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
              color="secondary"
              type="button"
              startIcon={<PlusIcon fontSize="small" />}
              onClick={handleCreateNewPool}
              variant="contained"
            >
              Create new
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Scrollbar>
        <Box
          sx={{
            maxHeight: {
              lg: 330
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
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
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
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      sx={{
                        color: 'primary.main',
                      }}
                      onClick={() => handleEditPool(pool)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: 'primary.main',
                      }}
                      onClick={() => dispatch(unlinkPool(pool.id))}
                    >
                      <LinkOffIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Dialog
        fullScreen={fullScreenDialogue}
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

JobContactPools.propTypes = {
  // @ts-ignore
  pool: PropTypes.object,
  pools: PropTypes.array.isRequired,
};

export default JobContactPools;
