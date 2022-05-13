import type { FC } from 'react';
import {
  Box,
  Theme,
} from '@mui/material';
import GoogleMapReact from 'google-map-react';
import type { SxProps } from '@mui/system';
import PropTypes from 'prop-types';
import { googleConfig } from 'src/config';

interface JobMapProps {
  sx?: SxProps<Theme>;
}

const JobMap: FC<JobMapProps> = (props) => {
  const defaultProps = {
    center: {
      lat: -33.86,
      lng: 151.12
    },
    zoom: 12
  };

  return (
    <Box {...props}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleConfig.apiKey }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      />
    </Box>
  );
};

JobMap.propTypes = {
  sx: PropTypes.object
};

export default JobMap;
