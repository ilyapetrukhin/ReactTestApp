import { useEffect, useState } from 'react';
import type { FC } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  IconButton,
  Typography
} from '@mui/material';
import { useSettings } from '../hooks/use-settings';
import { X as XIcon } from '../icons/x-new';
// @ts-ignore
import LightThemeIcon from './light-theme.svg';
// @ts-ignore
import DarkThemeIcon from './dark-theme.svg';
import PropTypes from 'prop-types';

interface SettingsDrawerProps {
  onClose?: () => void;
  open?: boolean;
}

const themes = [
  {
    label: 'Light',
    value: 'light',
    icon: LightThemeIcon
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: DarkThemeIcon
  }
];

const getValues = (settings) => ({
  compact: settings.compact,
  direction: settings.direction,
  responsiveFontSizes: settings.responsiveFontSizes,
  roundedCorners: settings.roundedCorners,
  theme: settings.theme
});

export const SettingsDrawer: FC<SettingsDrawerProps> = (props) => {
  const { open, onClose, ...other } = props;
  const { settings, saveSettings } = useSettings();
  const [values, setValues] = useState(getValues(settings));

  useEffect(() => {
    setValues(getValues(settings));
  }, [settings]);

  const handleChange = (field, value): void => {
    setValues({
      ...values,
      [field]: value
    });
  };

  const handleSave = (): void => {
    saveSettings(values);
    onClose?.();
  };

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{ sx: { zIndex: 2000 } }}
      PaperProps={{ sx: { width: 320 } }}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          py: 2
        }}
      >
        <Typography
          color="inherit"
          variant="h6"
        >
          Theme settings
        </Typography>
        <IconButton
          color="inherit"
          onClick={onClose}
        >
          <XIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          py: 4,
          px: 3
        }}
      >
        <Typography
          color="textSecondary"
          sx={{
            display: 'block',
            mb: 1
          }}
          variant="overline"
        >
          Color Scheme
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            m: -1
          }}
        >
          {themes.map((theme) => {
            const { label, icon: Icon, value } = theme;

            return (
              <div key={value}>
                <Box
                  onClick={() => handleChange('theme', value)}
                  sx={{
                    borderColor: values.theme === value ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    borderStyle: 'solid',
                    borderWidth: 2,
                    cursor: 'pointer',
                    flexGrow: 1,
                    fontSize: 0,
                    m: 1,
                    overflow: 'hidden',
                    p: 1,
                    '& svg': {
                      height: 'auto',
                      width: '100%'
                    }
                  }}
                >
                  <Icon />
                </Box>
                <Typography
                  align="center"
                  sx={{ mt: 1 }}
                  variant="subtitle2"
                >
                  {label}
                </Typography>
              </div>
            );
          })}
        </Box>
        <Typography
          color="textSecondary"
          sx={{
            display: 'block',
            mb: 1,
            mt: 4
          }}
          variant="overline"
        >
          Settings
        </Typography>
        <div>
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.compact}
                name="compact"
                onChange={(event): void => handleChange(
                  'compact',
                  event.target.checked
                )}
              />
            )}
            label={(
              <Typography variant="subtitle2">
                Compact
                <Typography
                  color="textSecondary"
                  component="p"
                  variant="caption"
                >
                  Fixed width on some screens
                </Typography>
              </Typography>
            )}
          />
        </div>
        <div>
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.roundedCorners}
                name="roundedCorners"
                onChange={(event): void => handleChange(
                  'roundedCorners',
                  event.target.checked
                )}
              />
            )}
            label={(
              <Typography variant="subtitle2">
                Rounded Corners
                <Typography
                  color="textSecondary"
                  component="p"
                  variant="caption"
                >
                  Increase border radius
                </Typography>
              </Typography>
            )}
          />
        </div>
        <div>
          <FormControlLabel
            control={(
              <Checkbox
                checked={values.responsiveFontSizes}
                name="direction"
                onChange={(event): void => handleChange(
                  'responsiveFontSizes',
                  event.target.checked
                )}
              />
            )}
            label={(
              <Typography variant="subtitle2">
                Responsive font sizes
              </Typography>
            )}
          />
        </div>
        <Button
          color="primary"
          fullWidth
          onClick={handleSave}
          sx={{ mt: 3 }}
          variant="contained"
        >
          Save Settings
        </Button>
      </Box>
    </Drawer>
  );
};

SettingsDrawer.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
