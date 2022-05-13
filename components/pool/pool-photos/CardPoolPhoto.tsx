import React, { FC, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CardWithCarousel from 'src/components/CardWithCarousel';
import { Job } from 'src/types/job';

interface CardPoolPhotoProps {
  job: Job;
}

const CardPoolPhoto : FC<CardPoolPhotoProps> = memo(({ job }) => {
  const uris = useMemo(() => job?.photos?.map((p) => p.full_url), [job]);
  const thumbnailUrls = useMemo(() => job?.photos?.map((p) => p.thumbnail_url), [job]);
  const time = useMemo(() => moment(job.end_time).format('DD MMM YYYY'), []);

  return (
    <CardWithCarousel
      title={job.job_template?.name}
      subtitle={time}
      uris={uris}
      thumbnailUrls={thumbnailUrls}
      notes={job.notes}
      sx={{ height: '100%' }}
    />
  );
});

CardPoolPhoto.propTypes = {
  // @ts-ignore
  job: PropTypes.object,
};

export default CardPoolPhoto;
