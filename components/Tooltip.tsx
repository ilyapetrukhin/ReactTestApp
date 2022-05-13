import {
  Tooltip as MaterialTooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { TooltipProps } from '@mui/material/Tooltip/Tooltip';

const TooltipRoot = styled((props: TooltipProps) => (
  <MaterialTooltip {...props}>
    {props.children}
  </MaterialTooltip>
))(
  ({ theme }) => (
    {
      border: 1,
      padding: 5,
      borderColor: theme.palette.divider,
      borderRadius: theme.shape.borderRadius,
      borderStyle: 'solid',
      display: 'flex',
      flexDirection: 'column',
    }
  )
);

const Tooltip = (props) => (
  <TooltipRoot
    {...props}
  />
);

export default Tooltip;
