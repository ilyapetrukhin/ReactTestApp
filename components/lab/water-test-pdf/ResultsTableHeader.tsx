import React, { FC, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Theme } from '@mui/material';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { useCommonStyles } from './commonStyles';

interface ResultsTableHeaderProps {
  theme: Theme;
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 14,
  },
  name: {
    width: '50%',
    color: theme.palette.grey[500],
  },
  range: {
    width: '20%',
    color: theme.palette.grey[500],
    textAlign: 'left',
  },
  actual: {
    width: '20%',
    color: theme.palette.grey[500],
    textAlign: 'left',
  },

  icon: {
    width: 16,
    height: 16,
  },
});

const ResultsTableHeader: FC<ResultsTableHeaderProps> = memo(({ theme }) => {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const commonStyles = useCommonStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={[commonStyles.subtitle1, styles.name]}>Tested</Text>
      <Text style={[commonStyles.subtitle1, styles.range]}>Range</Text>
      <Text style={[commonStyles.subtitle1, styles.actual]}>Actual</Text>
    </View>
  );
});

ResultsTableHeader.propTypes = {
  // @ts-ignore
  theme: PropTypes.object.isRequired,
};

export default ResultsTableHeader;
