/* eslint-disable */
import React, { FC, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useConfirm } from 'material-ui-confirm';
import toast from 'react-hot-toast';
import {
  ignorePool,
  makePrimary,
  mergePools,
  updateField,
} from 'src/slices/deduplicatePool';
import { useDispatch, useSelector } from 'src/store';

import DataCleaningPoolTableRow from './DataCleaningPoolDeduplicateTabTableRow';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { PoolSanitiser } from 'src/types/pool';

interface DataCleaningPoolTableRowHOCProps {
  groupKey: string;
  poolIndex: number;
}

const DataCleaningPoolTableRowHOC: FC<DataCleaningPoolTableRowHOCProps> = memo(
  ({ groupKey, poolIndex }) => {
    const dispatch = useDispatch();
    const confirm = useConfirm();

    const group = useSelector(
      (state) => state.deduplicatePoolTool.duplicates[groupKey]
    );
    const deduplicatePoolToolState = useSelector(
      (state) => state.deduplicatePoolTool
    );
    const {
      isMerging,
      poolTypes,
      surfaceTypes,
      poolSanitisers,
      poolClassifications,
      groundLevels,
      locations,
    } = deduplicatePoolToolState;
    const { id: organisationId } = useSelector(
      (state) => state.account.organisation
    );

    const pool = useMemo(() => {
      if (group == null) {
        return null;
      }
      return group.poolDuplications[poolIndex];
    }, [group]);

    const linkedContacts = useMemo(() => {
      if (pool.pool == null) {
        return [];
      }
      return pool.pool.contacts.map((contact) => contact.full_address);
    }, [pool]);

    const handleMarkAsPrimary = useCallback(() => {
      dispatch(makePrimary({ groupKey, poolId: pool?.pool?.id }));
    }, [groupKey, pool?.pool?.id]);

    const handleIgnorePool = useCallback(() => {
      dispatch(ignorePool({ groupKey, poolId: pool?.pool?.id }));
    }, [groupKey, pool?.pool?.id]);

    const handleMerge = useCallback(() => {
      confirm({
        description:
          'This will delete all pools except the Primary. The primary pool will be updated as below. All jobs, quotes, water tests, equipment, photos and invoices will be moved to the Primary pool. Are you sure you want to proceed?',
        confirmationText: 'Yes',
        cancellationText: 'No',
      })
        .then(() => dispatch(mergePools(organisationId, deduplicatePoolToolState)))
        .then(() => toast.success('The duplicated pool has been successfully merged'))
        .catch(() => {});
    }, [groupKey, deduplicatePoolToolState]);

    const handleChangeTypeIndex = useCallback(
      (
        event: SelectChangeEvent
      ) => {
        dispatch(
          updateField({
            groupKey,
            poolId: pool?.pool?.id,
            fieldName: 'poolTypeIndex',
            value: event.target.value,
          })
        );
      },
      [groupKey, pool?.pool?.id]
    );

    const handleChangeVolume = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
          updateField({
            groupKey,
            poolId: pool?.pool?.id,
            fieldName: 'poolVolume',
            value: event.target.value,
          })
        );
      },
      [groupKey, pool?.pool?.id]
    );

    const handleChangeSurfaceIndex = useCallback(
      (
        event: SelectChangeEvent
      ) => {
        dispatch(
          updateField({
            groupKey,
            poolId: pool?.pool?.id,
            fieldName: 'surfaceTypeIndex',
            value: parseInt(event.target.value, 10),
          })
        );
      },
      [groupKey, pool?.pool?.id]
    );

    const handleChangeSanitisers = useCallback(
      (
        event: SelectChangeEvent<PoolSanitiser[]>
      ) => {
        dispatch(
          updateField({
            groupKey,
            poolId: pool?.pool?.id,
            fieldName: 'sanitisizers',
            value: event.target.value,
          })
        );
      },
      [groupKey, pool?.pool?.id]
    );

    const handleChangeClassificationIndex = useCallback(
      (
        event: SelectChangeEvent
      ) => {
        dispatch(
          updateField({
            groupKey,
            poolId: pool?.pool?.id,
            fieldName: 'classificationIndex',
            value: parseInt(event.target.value, 10),
          })
        );
      },
      [groupKey, pool?.pool?.id]
    );

    const handleChangeLocationIndex = useCallback(
      (
        event: SelectChangeEvent
      ) => {
        dispatch(
          updateField({
            groupKey,
            poolId: pool?.pool?.id,
            fieldName: 'locationIndex',
            value: parseInt(event.target.value, 10),
          })
        );
      },
      [groupKey, pool?.pool?.id]
    );

    const handleChangeGroundLevelIndex = useCallback(
      (
        event: SelectChangeEvent
      ) => {
        dispatch(
          updateField({
            groupKey,
            poolId: pool?.pool?.id,
            fieldName: 'groundLevelIndex',
            value: parseInt(event.target.value, 10),
          })
        );
      },
      [groupKey, pool?.pool?.id]
    );

    const handleChangeAddressIndex = useCallback(
      (
        event: SelectChangeEvent
      ) => {
        dispatch(
          updateField({
            groupKey,
            poolId: pool?.pool?.id,
            fieldName: 'addressIndex',
            value: parseInt(event.target.value, 10),
          })
        );
      },
      [groupKey, pool?.pool?.id]
    );

    return (
      <>
        <DataCleaningPoolTableRow
          groupKey={groupKey}
          isPrimary={group.primaryPoolDuplicationId === pool.pool?.id}
          isMerging={isMerging}
          createdAt={pool.pool?.created_at}
          addressIndex={pool.addressIndex}
          typeIndex={pool.poolTypeIndex}
          poolVolume={pool.poolVolume}
          surfaceTypeIndex={pool.surfaceTypeIndex}
          selectedPoolSanitisers={pool.sanitisizers}
          classificationIndex={pool.classificationIndex}
          locationIndex={pool.locationIndex}
          groundLevelIndex={pool.groundLevelIndex}
          poolTypes={poolTypes}
          surfaceTypes={surfaceTypes}
          poolSanitisers={poolSanitisers}
          poolClassifications={poolClassifications}
          groundLevels={groundLevels}
          locations={locations}
          addresses={pool.addresses}
          poolVolumes={pool.poolVolumes}
          linkedContacts={linkedContacts}
          handleMarkAsPrimary={handleMarkAsPrimary}
          handleIgnorePool={handleIgnorePool}
          handleMerge={handleMerge}
          handleChangeTypeIndex={handleChangeTypeIndex}
          handleChangeVolume={handleChangeVolume}
          handleChangeSanitisers={handleChangeSanitisers}
          handleChangeSurfaceIndex={handleChangeSurfaceIndex}
          handleChangeClassificationIndex={handleChangeClassificationIndex}
          handleChangeLocationIndex={handleChangeLocationIndex}
          handleChangeAddressIndex={handleChangeAddressIndex}
          handleChangeGroundLevelIndex={handleChangeGroundLevelIndex}
        />
      </>
    );
  }
);

DataCleaningPoolTableRowHOC.propTypes = {
  groupKey: PropTypes.string.isRequired,
  poolIndex: PropTypes.number.isRequired,
};

export default DataCleaningPoolTableRowHOC;
