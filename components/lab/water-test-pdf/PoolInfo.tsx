import React, { FC, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Theme } from '@mui/material';
import { View, StyleSheet, Text } from '@react-pdf/renderer';
import { useCommonStyles } from './commonStyles';

interface PoolInfoProps {
  theme: Theme;
  to: string;
  address: string;
  type: string;
  volume: string;
  surface: string;
  sanitiser: string;
}

const createStyles = (theme: Theme) => StyleSheet.create({
  pool: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.palette.background.default,
  },
  poolLeftCol: {
    maxWidth: '35%',
  },
  poolMiddleCol: {
    maxWidth: '25%',
  },
  poolRightCol: {
    maxWidth: '40%',
  },
  poolRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  poolRowPropertyText: {
    width: '30%',
  },
  poolRowValueText: {
    width: '70%',
    fontFamily: 'InterRegular',
    fontWeight: 'normal',
  },
});

const PoolInfo: FC<PoolInfoProps> = memo(
  ({ theme, to, address, type, volume, surface, sanitiser }) => {
    const commonStyles = useCommonStyles(theme);
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
      <View style={styles.pool}>
        <View style={styles.poolLeftCol}>
          <View style={styles.poolRow}>
            <Text style={[commonStyles.subtitle1, styles.poolRowPropertyText]}>
              To:
              {' '}
            </Text>
            <Text style={[commonStyles.body2, styles.poolRowValueText]}>{to}</Text>
          </View>
          <View style={styles.poolRow}>
            <Text style={[commonStyles.subtitle1, styles.poolRowPropertyText]}>
              Address:
            </Text>
            <Text style={[commonStyles.body2, styles.poolRowValueText]}>
              {address}
            </Text>
          </View>
        </View>
        <View style={styles.poolMiddleCol}>
          <View style={styles.poolRow}>
            <Text style={[commonStyles.subtitle1, styles.poolRowPropertyText]}>
              Type:
            </Text>
            <Text style={[commonStyles.body2, styles.poolRowValueText]}>
              {type}
            </Text>
          </View>
          <View style={styles.poolRow}>
            <Text style={[commonStyles.subtitle1, styles.poolRowPropertyText]}>
              Volume:
            </Text>
            <Text style={[commonStyles.body2, styles.poolRowValueText]}>
              {volume}
            </Text>
          </View>
        </View>
        <View style={styles.poolRightCol}>
          <View style={styles.poolRow}>
            <Text style={[commonStyles.subtitle1, styles.poolRowPropertyText]}>
              Surface:
            </Text>
            <Text style={[commonStyles.body2, styles.poolRowValueText]}>
              {surface}
            </Text>
          </View>
          <View style={styles.poolRow}>
            <Text style={[commonStyles.subtitle1, styles.poolRowPropertyText]}>
              Sanitiser:
            </Text>
            <Text style={[commonStyles.body2, styles.poolRowValueText]}>
              { sanitiser }
            </Text>
          </View>
        </View>
      </View>
    );
  }
);

PoolInfo.propTypes = {
  // @ts-ignore
  theme: PropTypes.object.isRequired,
  to: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  volume: PropTypes.string.isRequired,
  surface: PropTypes.string.isRequired,
  sanitiser: PropTypes.string.isRequired,
};

export default PoolInfo;
