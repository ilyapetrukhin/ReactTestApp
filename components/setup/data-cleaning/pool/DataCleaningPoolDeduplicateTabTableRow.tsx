/* eslint-disable react/prop-types */
import React, { FC, memo, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';

import StarIcon from 'src/icons/Star';
import { Address } from 'src/types/address';
import { getEntityAddress } from 'src/utils/address';
import {
  Classification,
  GroundLevel,
  Location,
  PoolSanitiser,
  PoolSurfaceType,
  PoolType,
  PoolVolume,
} from 'src/types/pool';
import { ignoreDuplicationGroup } from 'src/slices/deduplicatePool';
import { useDispatch } from 'src/store';
import type { SelectChangeEvent } from '@mui/material/Select';

interface DataCleaningPoolTableRowProps {
  groupKey: string;
  isPrimary: boolean;
  isMerging: boolean;
  createdAt: string;
  addressIndex: number;
  typeIndex: number;
  poolVolume: PoolVolume;
  surfaceTypeIndex: number;
  selectedPoolSanitisers: PoolSanitiser[];
  classificationIndex: number;
  locationIndex: number;
  groundLevelIndex: number;

  poolTypes: PoolType[];
  surfaceTypes: PoolSurfaceType[];
  poolSanitisers: PoolSanitiser[];
  poolClassifications: Classification[];
  groundLevels: GroundLevel[];
  locations: Location[];
  addresses: Address[];
  poolVolumes: PoolVolume[];
  linkedContacts: string[];

  handleMarkAsPrimary: () => void;
  handleIgnorePool: () => void;
  handleMerge: () => void;
  handleChangeTypeIndex: (
    event: SelectChangeEvent
  ) => void;
  handleChangeVolume: (
    event: SelectChangeEvent
  ) => void;
  handleChangeSurfaceIndex: (
    event: SelectChangeEvent
  ) => void;
  handleChangeSanitisers: (
    event: SelectChangeEvent<PoolSanitiser[]>
  ) => void;
  handleChangeClassificationIndex: (
    event: SelectChangeEvent
  ) => void;
  handleChangeLocationIndex: (
    event: SelectChangeEvent
  ) => void;
  handleChangeGroundLevelIndex: (
    event: SelectChangeEvent
  ) => void;
  handleChangeAddressIndex: (
    event: SelectChangeEvent
  ) => void;
}

const DataCleaningPoolTableRow: FC<DataCleaningPoolTableRowProps> = memo(
  ({
    groupKey,
    isPrimary,
    isMerging,
    createdAt,
    addressIndex,
    typeIndex,
    poolVolume,
    surfaceTypeIndex,
    classificationIndex,
    selectedPoolSanitisers,
    locationIndex,
    groundLevelIndex,
    poolTypes,
    surfaceTypes,
    poolSanitisers,
    poolClassifications,
    groundLevels,
    locations,
    addresses,
    poolVolumes,
    linkedContacts,
    handleMarkAsPrimary,
    handleIgnorePool,
    handleMerge,
    handleChangeTypeIndex,
    handleChangeVolume,
    handleChangeSurfaceIndex,
    handleChangeSanitisers,
    handleChangeClassificationIndex,
    handleChangeLocationIndex,
    handleChangeAddressIndex,
    handleChangeGroundLevelIndex,
  }) => {
    const dispatch = useDispatch();

    const createdAtText = useMemo(
      () => moment(createdAt).format('DD MMM yyyy'),
      [createdAt]
    );

    const handleIgnore = useCallback(
      (event: React.SyntheticEvent) => {
        event.stopPropagation();
        dispatch(ignoreDuplicationGroup({ groupKey }));
      },
      [groupKey]
    );

    return (
      <Box
        display="flex"
        flexWrap="nowrap"
        minWidth={1950}
        p={3}
        pl={0}
        sx={{
          backgroundColor: isPrimary ? 'background.default' : 'common.white',
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          position="sticky"
          left={0}
          width={250}
          p={3}
          zIndex={2}
          sx={{ backgroundColor: isPrimary ? 'background.default' : 'common.white' }}
        >
          <>
            {isPrimary && (
              <>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  disabled={isMerging}
                  onClick={handleMerge}
                  loading={isMerging}
                >
                  MERGE POOL
                </LoadingButton>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    mt: 1,
                  }}
                  disabled={isMerging}
                  onClick={handleIgnore}
                >
                  IGNORE ALL
                </Button>
              </>
            )}
            {!isPrimary && (
              <>
                <Button
                  variant="text"
                  color="primary"
                  sx={{
                    mt: 1,
                    justifyContent: 'flex-start',
                  }}
                  disabled={isMerging}
                  onClick={handleMarkAsPrimary}
                >
                  <StarIcon sx={{ width: 14, height: 14, mr: 1 }} />
                  Set as primary
                </Button>
                <Button
                  color="primary"
                  sx={{
                    mt: 1,
                    justifyContent: 'flex-start',
                    color: 'error.main',
                  }}
                  disabled={isMerging}
                  onClick={handleIgnorePool}
                >
                  <CloseIcon sx={{ width: 14, height: 14, mr: 1 }} />
                  Ignore pool
                </Button>
              </>
            )}
          </>
        </Box>
        <Box
          pl={4}
          pr={2}
        >
          <Box
            display="flex"
            alignItems="center"
          >
            <Typography
              variant="subtitle2"
              color="textSecondary"
              fontWeight="bold"
              sx={{ width: 150 }}
            >
              Created on
            </Typography>
            <Typography
              variant="body2"
              color="textPrimary"
            >
              {createdAtText}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
          >
            <Typography
              variant="subtitle2"
              color="textSecondary"
              fontWeight="bold"
              sx={{ width: 150 }}
            >
              Linked contacts
            </Typography>
            <Typography
              variant="body2"
              color="textPrimary"
            >
              {linkedContacts.join(' | ') || '—'}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            mt={4}
          >
            {/* ---- Address ----- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 450,
                  mr: 2,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Pool Address</InputLabel>
                <Select
                  onChange={handleChangeAddressIndex}
                  value={addressIndex.toString()}
                  label="Pool Address"
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                >
                  {addresses.map((address, index) => (
                    <MenuItem
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      value={index}
                    >
                      {getEntityAddress(address, 'pool')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 450, mr: 2, pr: 1 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {getEntityAddress(addresses[addressIndex], 'pool')}
                </Typography>
              </Box>
            )}

            {/* ------ Pool Type -------- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 120,
                  mr: 2,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Type</InputLabel>
                <Select
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                  onChange={handleChangeTypeIndex}
                  value={typeIndex.toString()}
                  label="Type"
                >
                  {poolTypes.map((poolType, index) => (
                    <MenuItem
                      key={poolType.id}
                      value={index}
                    >
                      {poolType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 120, mr: 2, pr: 1 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {poolTypes[typeIndex]?.name}
                </Typography>
              </Box>
            )}

            {/* ------ Pool Volume -------- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 140,
                  mr: 2,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Volume</InputLabel>
                <Select
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                  onChange={handleChangeVolume}
                  value={poolVolume}
                  label="Volume"
                >
                  {poolVolumes.map((volume) => (
                    <MenuItem
                      key={volume}
                      value={volume}
                    >
                      {volume}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 140, mr: 2, pr: 1 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {poolVolume}
                </Typography>
              </Box>
            )}

            {/* ------ Surface -------- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 140,
                  mr: 2,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Surface</InputLabel>
                <Select
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                  onChange={handleChangeSurfaceIndex}
                  value={surfaceTypeIndex.toString()}
                  label="Surface"
                >
                  {surfaceTypes.map((surface, index) => (
                    <MenuItem
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      value={index}
                    >
                      {surface.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 140, mr: 2, pr: 1 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {surfaceTypes[surfaceTypeIndex]?.name}
                </Typography>
              </Box>
            )}
            {/* ----- Sanitisers ---- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 300,
                  mr: 2,
                }}
              >
                <InputLabel>Sanitisers</InputLabel>
                <Select
                  multiple
                  label="Sanitisers"
                  sx={{ backgroundColor: 'common.white' }}
                  value={selectedPoolSanitisers}
                  onChange={handleChangeSanitisers}
                  IconComponent={Box}
                  renderValue={(sanitisers) => (
                    <Box
                      display="flex"
                      sx={{ backgroundColor: 'common.white' }}
                    >
                      {sanitisers.map((sanitiser) => (
                        <Chip
                          key={sanitiser.id}
                          label={sanitiser.name}
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {poolSanitisers.map((sanitiser) => (
                    // TODO: fix this multiple select
                    <MenuItem
                      key={sanitiser.id}
                      value={sanitiser.id}
                    >
                      {sanitiser.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 300, mr: 2, px: 2 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {selectedPoolSanitisers.map(({ name }) => name).join(', ')
                    || '—'}
                </Typography>
              </Box>
            )}

            {/* Classification */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 140,
                  mr: 2,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Classification</InputLabel>
                <Select
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                  onChange={handleChangeClassificationIndex}
                  value={classificationIndex.toString()}
                  label="Classification"
                >
                  {poolClassifications.map((classification, index) => (
                    <MenuItem
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      value={index}
                    >
                      {classification.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 140, mr: 2, pr: 1 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {poolClassifications[classificationIndex]?.name}
                </Typography>
              </Box>
            )}

            {/* ----- Location ----- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 140,
                  mr: 2,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Location</InputLabel>
                <Select
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                  onChange={handleChangeLocationIndex}
                  value={locationIndex.toString()}
                  label="Location"
                >
                  {locations.map((location, index) => (
                    <MenuItem
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      value={index}
                    >
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 140, mr: 2, pr: 1 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {locations[locationIndex]?.name}
                </Typography>
              </Box>
            )}

            {/* ----- Ground level ----- */}
            {isPrimary && (
              <FormControl
                variant="outlined"
                sx={{
                  width: 150,
                  mr: 3,
                }}
                disabled={!isPrimary}
              >
                <InputLabel>Ground level</InputLabel>
                <Select
                  inputProps={{ sx: { backgroundColor: 'common.white' } }}
                  onChange={handleChangeGroundLevelIndex}
                  value={groundLevelIndex.toString()}
                  label="Ground level"
                >
                  {groundLevels.map((groundLevel, index) => (
                    <MenuItem
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      value={index}
                    >
                      {groundLevel.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!isPrimary && (
              <Box sx={{ width: 140, mr: 4, pr: 1 }}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  noWrap
                >
                  {groundLevels[groundLevelIndex]?.name}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
);

export default DataCleaningPoolTableRow;
