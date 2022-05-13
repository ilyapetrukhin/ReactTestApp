import { Theme } from '@mui/material';
import {
  Font,
  StyleSheet,
} from '@react-pdf/renderer';
import { useMemo } from 'react';

export const initializePdfRender = () => {
  Font.register({
    family: 'InterBold',
    fonts: [
      {
        src: 'src/assets/fonts/Inter-Bold.ttf'
      },
    ],
  });
  
  Font.register({
    family: 'InterRegular',
    fonts: [
      {
        src: 'src/assets/fonts/Inter-Regular.ttf'
      },
    ],
  });
};

const createStyles = (theme: Theme) => StyleSheet.create({
  h4: {
    fontSize: 25,
    fontFamily: 'InterBold',
    color: theme.palette.primary.main,
  },
  h6: {
    fontSize: 15,
    lineHeight: 1.4,
    fontFamily: 'InterBold',
    fontWeight: 900,
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    borderBottomWidth: 1,
  },
  subtitle1: {
    fontFamily: 'InterBold',
    fontSize: 9,
    color: theme.palette.primary.main,
  },
  title: {
    fontFamily: 'InterBold',
    fontSize: 9,
    color: theme.palette.primary.main,
  },
  subtitle2: {
    fontFamily: 'InterBold',
    fontSize: 9,
  },
  body1: {
    fontSize: 9,
    lineHeight: 1.5,
    fontFamily: 'InterRegular',
  },
  body2: {
    fontSize: 9,
    lineHeight: 1.5,
    fontFamily: 'InterBold',
  },
});

export default createStyles;

export const useCommonStyles = (theme: Theme) => useMemo(() => createStyles(theme), [theme]);
