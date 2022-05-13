import { useCallback } from 'react';
import { getDuplications } from 'src/slices/deduplicatePool';
import { useSelector, useDispatch } from 'src/store';

export default function useLoadDuplications() {
  const dispatch = useDispatch();
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const { switchers } = useSelector((state) => state.deduplicatePoolTool);
  const {
    poolSanitisers,
    surfaceTypes,
    poolTypes,
    locations,
    groundLevels,
    classifications: poolClassifications,
  } = useSelector((state) => state.poolSpecifications);

  return useCallback(() => {
    dispatch(
      getDuplications({
        organisationId,
        duplicationTypes: switchers,
        poolSanitisers,
        surfaceTypes,
        poolTypes,
        locations,
        groundLevels,
        poolClassifications,
      })
    );
  }, [
    switchers,
    switchers,
    poolSanitisers,
    poolTypes,
    locations,
    groundLevels,
    poolClassifications,
  ]);
}
