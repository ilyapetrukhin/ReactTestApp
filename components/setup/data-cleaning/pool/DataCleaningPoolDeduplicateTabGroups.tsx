import React, { FC, memo, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { setExpandedGroupKey } from 'src/slices/deduplicatePool';
import { useDispatch, useSelector } from 'src/store';

import DataCleaningPoolDeduplicateTabTable from './DataCleaningPoolDeduplicateTabTable';

interface DataCleaningPoolDeduplicateTabGroupsProps {
  groupKey: string;
  size: number;
}

const backgroundOpacity = 0.3;

const AccordionSummaryStyled = styled(AccordionSummary)(() => ({
  '& .MuiAccordionSummary-content': {
    maxWidth: '100%',
  },
  '& .Mui-expanded.MuiAccordionSummary-expandIconWrapper': {
    transform: 'rotate(90deg)',
  },
}));

const DataCleaningPoolDeduplicateTabGroups: FC<DataCleaningPoolDeduplicateTabGroupsProps> = memo(({ groupKey, size }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { expandedGroupKey } = useSelector(
    (state) => state.deduplicatePoolTool
  );
  const expanded = expandedGroupKey === groupKey;

  const handleChange = useCallback(
    (event: React.SyntheticEvent, exp: boolean) => {
      if (exp) {
        dispatch(setExpandedGroupKey({ groupKey }));
      } else {
        dispatch(setExpandedGroupKey({ groupKey: null }));
      }
    },
    [groupKey]
  );

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      disableGutters
    >
      <AccordionSummaryStyled
        expandIcon={<ChevronRightIcon color="primary" />}
        sx={{
          backgroundColor: expanded
            ? alpha(theme.palette.background.default, backgroundOpacity)
            : null,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          width="100%"
        >
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            mr={2}
          >
            <Chip
              label={size}
              size="small"
              color="primary"
              sx={{ mr: 1, minWidth: 20 }}
            />
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              {groupKey}
            </Typography>
          </Box>
        </Box>
      </AccordionSummaryStyled>
      <AccordionDetails
        sx={{
          backgroundColor: alpha(
            theme.palette.background.default,
            backgroundOpacity
          ),
        }}
      >
        {expanded && (
          <DataCleaningPoolDeduplicateTabTable groupKey={groupKey} />
        )}
      </AccordionDetails>
    </Accordion>
  );
});

DataCleaningPoolDeduplicateTabGroups.propTypes = {
  groupKey: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

export default DataCleaningPoolDeduplicateTabGroups;
