import React, { FC, memo, useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'src/store';
import { PoolEquipmentPhoto } from 'src/types/equipment';
import HorizontalMediaList from 'src/components//horizontal-media-list/HorizontalMediaList';
import { addPhotoBlobUrisToUploadOnSave } from 'src/slices/poolEquipment';

interface SectionEquipmentImagesProps {}

const SectionEquipmentImages: FC<SectionEquipmentImagesProps> = memo(() => {
  const dispatch = useDispatch();

  const { photosBlobUrisToUploadOnSave, photos } = useSelector(
    (state) => state.poolEquipment
  );

  const data: (PoolEquipmentPhoto | string)[] = useMemo(
    () => [...photos, ...photosBlobUrisToUploadOnSave],
    [photos, photosBlobUrisToUploadOnSave]
  );

  const handleAddFiles = useCallback((files: File[]) => {
    const blobUris = files.map((file) => URL.createObjectURL(file));
    dispatch(addPhotoBlobUrisToUploadOnSave({ blobUris }));
  }, []);

  const extractKey = useCallback((item: PoolEquipmentPhoto | string) => {
    if (typeof item === 'string') {
      return item;
    }

    return item.id;
  }, []);

  const extractUri = useCallback((item: PoolEquipmentPhoto | string) => {
    if (typeof item === 'string') {
      return item;
    }

    return item.thumbnail_url;
  }, []);

  return (
    <HorizontalMediaList
      title="Equipment Photos"
      data={data}
      extractKey={extractKey}
      extractUri={extractUri}
      onSelectFiles={handleAddFiles}
    />
  );
});

SectionEquipmentImages.propTypes = {};

export default SectionEquipmentImages;
