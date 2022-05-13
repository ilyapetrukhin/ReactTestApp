/* eslint-disable react/no-array-index-key */
import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import type { FC } from 'react';
import chunk from 'lodash/chunk';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface MergeTag {
  name: string;
}

interface MergeTagsInfoProps {
  mergeTags: MergeTag[];
  tagsPerColumn?: number;
}

const MergeTagsInfo: FC<MergeTagsInfoProps> = (props) => {
  const { mergeTags, tagsPerColumn } = props;

  const gridMergeTags = useMemo(
    () => chunk(mergeTags, tagsPerColumn),
    [mergeTags, tagsPerColumn],
  );

  return (
    <div>
      <Accordion
        sx={{
          backgroundColor: 'background.default'
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            color="textPrimary"
            variant="subtitle2"
          >
            PERSONALISING CUSTOMER COMMUNICATIONS
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            The information from the app can be used to personalise customer communications.
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            We have pre-populated some sample merge tags below, but you can add your own by copying and pasting from the list below.
          </Typography>
          <Grid
            container
            spacing={3}
            sx={{
              mt: 1
            }}
          >
            {gridMergeTags.map((gridMergeTag, index) => (
              <Grid
                item
                key={index}
                md={3}
                xs={6}
              >
                <Grid
                  container
                  spacing={1}
                >
                  {gridMergeTag.map((mergeTag, index) => (
                    <Grid
                      item
                      key={index}
                      xs={12}
                    >
                      <Typography
                        color="primary"
                        variant="body2"
                      >
                        {mergeTag.name}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

MergeTagsInfo.propTypes = {
  // @ts-ignore
  mergeTags: PropTypes.array.isRequired,
  tagsPerColumn: PropTypes.number,
};

MergeTagsInfo.defaultProps = {
  tagsPerColumn: 4,
};

export default memo(MergeTagsInfo);
