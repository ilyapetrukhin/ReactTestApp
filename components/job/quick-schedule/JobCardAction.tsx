import type {
  FC,
  ReactElement,
  ReactNode
} from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface JobCardActionProps extends ButtonProps {
  icon?: ReactElement;
  children?: ReactNode;
}

const JobCardAction: FC<JobCardActionProps> = (props) => {
  const { icon, children, ...other } = props;

  return (
    <Button
      color="primary"
      fullWidth
      startIcon={icon}
      sx={{
        justifyContent: 'flex-start',
        '& + &': {
          mt: 2
        }
      }}
      variant="contained"
      {...other}
    >
      {children}
    </Button>
  );
};

JobCardAction.propTypes = {
  icon: PropTypes.element,
  children: PropTypes.node
};

export default JobCardAction;
