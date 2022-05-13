import React, { memo, SyntheticEvent, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid } from '@mui/material';

import { Scrollbar } from '../scrollbar';
import MediaFileCard from './MediaFileCard';

interface HorizontalImagesListProps<T> {
  title: string;
  data: T[];
  extractUri: (item: T) => string;
  extractKey: (item: T) => string | number;
  onSelectFiles: (files: File[]) => void;
}

function HorizontalMediaList<T>({ title, data, extractKey, extractUri, onSelectFiles }: HorizontalImagesListProps<T>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFiles = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
    const { files } = (e.target as HTMLInputElement);
    onSelectFiles(Array.from(files));
  }, [onSelectFiles]);

  const handleAddPhoto = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Card>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        <Scrollbar>
          <Grid
            alignItems="center"
            container
            spacing={3}
            wrap="nowrap"
            sx={{
              p: 2,
            }}
          >
            {data.map((item) => (
              <Grid
                item
              >
                <MediaFileCard
                  key={extractKey(item)}
                  name="image/png"
                  mimeType="image/png"
                  size={224}
                  url={extractUri(item)}
                  onRemove={() => {}}
                  sx={{
                    minWidth: 200,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Scrollbar>
        <CardActions
          sx={{
            justifyContent: 'center',
          }}
        >
          <Button
            onClick={handleAddPhoto}
            variant="contained"
          >
            Add a photo
          </Button>
        </CardActions>
      </CardContent>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleSelectFiles}
        multiple
      />
    </Card>

  );
}

HorizontalMediaList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  extractUri: PropTypes.func.isRequired,
  extractKey: PropTypes.func.isRequired,
  onSelectFiles: PropTypes.func.isRequired,
};

export default memo(HorizontalMediaList);
