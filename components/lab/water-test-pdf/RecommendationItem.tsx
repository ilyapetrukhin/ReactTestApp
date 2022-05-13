import React, { FC, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Theme } from '@mui/material';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

import { useCommonStyles } from './commonStyles';

const createStyles = () => StyleSheet.create({
  container: {
    marginTop: 14,
  },
});

interface RecommendationItemProps {
  theme: Theme;
  title: string;
  subtitle: string;
  description: string;
}

const RecommendationItem: FC<RecommendationItemProps> = memo(
  ({ theme, title, subtitle, description }) => {
    const styles = useMemo(() => createStyles(), []);
    const commonStyles = useCommonStyles(theme);

    return (
      <View
        style={styles.container}
        wrap={false}
      >
        <Text style={commonStyles.title}>{title}</Text>
        <Text style={commonStyles.subtitle2}>{subtitle}</Text>
        <Text style={commonStyles.body1}>{description}</Text>
      </View>
    );
  }
);

RecommendationItem.propTypes = {
  // @ts-ignore
  theme: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default RecommendationItem;
