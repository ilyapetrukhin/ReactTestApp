import React, { FC, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Theme } from '@mui/material';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

import ArrowDownIcon from 'src/icons/pdf-render/ArrowDown';
import ArrowUpIcon from 'src/icons/pdf-render/ArrowUp';
import CheckIcon from 'src/icons/pdf-render/Check';

import { useCommonStyles } from './commonStyles';
import type { ResultStatus } from 'src/types/waterTest';
import { HIGH_RESULT, LOW_RESULT, OK_RESULT } from 'src/lib/chemical-calculator/src/constants/chemical';

interface ResultsTableRowProps {
  theme: Theme;
  text: string;
  range?: string;
  actual?: string;
  status?: ResultStatus;
  highlighted: boolean;
}

const createStyles = (theme: Theme, props: ResultsTableRowProps) => StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: props.highlighted
      ? theme.palette.background.default
      : null,
  },
  name: {
    width: '50%',
  },
  range: {
    width: '20%',
    textAlign: 'left',
  },
  actual: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '20%',
  },
  actualText: {
    textAlign: 'right',
  },
  icon: {
    width: 12,
    height: 12,
  },
});

const ResultsTableRow: FC<ResultsTableRowProps> = memo((props) => {
  const { theme, text, range, actual, status } = props;
  const styles = useMemo(() => createStyles(theme, props), [theme, props]);
  const commonStyles = useCommonStyles(theme);

  const getStatusIcon = (status: ResultStatus): JSX.Element => {
    let result = null;

    switch (status) {
      case HIGH_RESULT:
        result = (
          <ArrowUpIcon
            style={styles.icon}
            color={theme.palette.error.main}
          />
        );
        break;
      case LOW_RESULT:
        result = (
          <ArrowDownIcon
            style={styles.icon}
            color={theme.palette.error.main}
          />
        );
        break;
      case OK_RESULT:
        result = (
          <CheckIcon
            style={styles.icon}
            color={theme.palette.success.main}
          />
        );
        break;
      default:
    }

    return result;
  };

  return (
    <View
      style={styles.container}
      wrap={false}
    >
      <Text style={[commonStyles.subtitle1, styles.name]}>{text}</Text>
      {!!range && (
        <Text style={[commonStyles.body1, styles.range]}>{range}</Text>
      )}
      {!!actual && (
        <View style={styles.actual}>
        <Text style={[commonStyles.body2, styles.actualText]}>{actual}</Text>
          {getStatusIcon(status)}
        </View>
      )}
    </View>
  );
});

ResultsTableRow.propTypes = {
  // @ts-ignore
  theme: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  range: PropTypes.string,
  actual: PropTypes.string,
  // @ts-ignore
  status: PropTypes.string,
};

export default ResultsTableRow;
