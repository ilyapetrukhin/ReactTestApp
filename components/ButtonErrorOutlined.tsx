import React, { FC, memo, MouseEventHandler } from 'react';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';

interface ButtonErrorOutlinedProps {
  loading?: boolean;
  children: string;

  onClick?: MouseEventHandler;
}

const ButtonErrorOutlined: FC<ButtonErrorOutlinedProps> = memo(({ loading, children, onClick }) => (
  <LoadingButton
    sx={{
      textTransform: 'uppercase',
      borderColor: 'error.main',
      color: 'error.main',
      '&:hover': {
        borderColor: 'error.main',
        color: 'error.main',
      },
      mb: 1,
    }}
    variant="outlined"
    loading={loading}
    onClick={onClick}
  >
    {children}
  </LoadingButton>
));

ButtonErrorOutlined.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.string,

  onClick: PropTypes.func,
};

ButtonErrorOutlined.defaultProps = {
  loading: false,
};

export default ButtonErrorOutlined;
