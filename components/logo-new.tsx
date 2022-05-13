import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

interface LogoProps {
  variant?: 'light' | 'primary';
}

export const Logo = styled((props: LogoProps) => {
  const { variant, ...other } = props;

  const color = variant === 'light' ? '#C1C4D6' : '#31A6F4';

  return (
    <svg
      version="1.1"
      viewBox="0 0 227.8 64.6"
      width="150"
      {...other}
    >
      <path
        id="XMLID_41_"
        fill={color}
        d="M39.7,7.2c-10.2,0-18.5,8.3-18.5,18.5c0,8.3,4.7,13.4,9.3,18.4c3.7,4,7.1,7.7,8.3,12.9c0.1,0.4,0.5,0.7,0.9,0.7c0.4,0,0.8-0.3,0.9-0.7c1.2-5.3,4.6-9,8.3-12.9c4.6-5,9.3-10.1,9.3-18.4C58.2,15.5,49.9,7.2,39.7,7.2zM39.6,38.3c-6.8-0.1-11.8-5.4-11.7-12.5C28,19.1,33.2,14,39.8,14.1c6.5,0.1,11.6,5.5,11.5,12.2C51.2,33.1,46.1,38.4,39.6,38.3zM41.9,64.6c-0.3,0.1-0.7-0.1-0.7-0.6c0.1-0.7,0.4-1.6,0.8-2.9c0.8-2.4,2-4.9,3.1-6.8c1.5-2.7,2.5-3.8,3.8-5.2c0.7-0.7,2.5-2.1,4.4-2.8c4.5-1.7,9.5,0.6,11,4.7c1.7,4.5-0.4,9.3-4.4,10.7c-1.9,0.7-4.4,0.5-5.8,0.3c-1.8-0.2-4.6-1.2-7.7-0.4c-1.6,0.4-2.8,1.3-3.6,2C42.7,63.9,42.2,64.5,41.9,64.6z M34.5,57.4c-0.8-0.5-2-0.9-3.3-0.9c-2.6-0.1-4.7,1.2-6.1,1.8c-1.1,0.4-3,1-4.7,0.8c-3.5-0.4-6.1-3.7-5.6-7.7c0.4-3.6,4-6.4,8-5.9c1.7,0.2,3.4,1,4.1,1.4c1.3,0.9,2.3,1.6,4.1,3.4c1.2,1.3,2.7,3.1,3.8,4.9c0.6,1,1,1.6,1.2,2.2c0.1,0.4-0.2,0.6-0.4,0.6C35.2,58,34.8,57.6,34.5,57.4z"
      />
      <g id="XMLID_215_">
        <path
          id="XMLID_216_"
          fill="#666666"
          d="M24.6,26.3c0,1.9-0.3,3.6-0.9,5.3c-0.6,1.6-1.4,3.1-2.5,4.3c-1.1,1.2-2.3,2.2-3.7,2.9c-1.4,0.7-2.9,1.1-4.5,1.1c-1.8,0-3.5-0.4-5-1.3c-1.5-0.8-2.8-2-3.8-3.5v15.2H0V13.3h4.2v4.3c1-1.5,2.3-2.7,3.8-3.5c1.5-0.9,3.2-1.3,5-1.3c1.6,0,3.1,0.4,4.5,1.1c1.4,0.7,2.6,1.7,3.7,2.9c1.1,1.2,1.9,2.6,2.5,4.3C24.3,22.7,24.6,24.4,24.6,26.3zM4.1,26.3c0,1.3,0.2,2.5,0.7,3.6c0.5,1.1,1.1,2.1,1.8,3c0.8,0.9,1.7,1.5,2.7,2c1,0.5,2.1,0.7,3.2,0.7c1.1,0,2.1-0.2,3.1-0.7c1-0.5,1.8-1.2,2.5-2c0.7-0.8,1.3-1.8,1.7-3s0.6-2.4,0.6-3.6c0-1.3-0.2-2.5-0.6-3.6s-1-2.1-1.7-3c-0.7-0.8-1.6-1.5-2.5-2c-1-0.5-2-0.7-3.1-0.7c-1.1,0-2.2,0.2-3.2,0.7c-1,0.5-1.9,1.2-2.7,2c-0.8,0.8-1.4,1.8-1.8,3C4.3,23.8,4.1,25,4.1,26.3z"
        />
      </g>
      <path
        id="XMLID_205_"
        fill="#666666"
        d="M54.6,26c0-1.9,0.3-3.6,1-5.3c0.7-1.6,1.6-3.1,2.7-4.3c1.2-1.2,2.5-2.2,4.1-2.9c1.6-0.7,3.3-1.1,5.2-1.1c1.9,0,3.7,0.4,5.3,1.1c1.6,0.7,3,1.7,4.1,2.9c1.2,1.2,2.1,2.6,2.7,4.3c0.7,1.6,1,3.4,1,5.3s-0.3,3.6-1,5.3c-0.7,1.6-1.6,3.1-2.7,4.3c-1.2,1.2-2.5,2.2-4.1,2.9c-1.6,0.7-3.3,1.1-5.3,1.1c-1.9,0-3.6-0.4-5.2-1.1c-1.6-0.7-3-1.7-4.1-2.9c-1.2-1.2-2.1-2.6-2.7-4.3C54.9,29.6,54.6,27.9,54.6,26z M58.7,26c0,1.3,0.2,2.5,0.6,3.6c0.4,1.1,1,2.1,1.8,3c0.8,0.9,1.7,1.5,2.8,2c1.1,0.5,2.3,0.7,3.6,0.7c1.3,0,2.5-0.2,3.6-0.7c1.1-0.5,2.1-1.2,2.8-2c0.8-0.8,1.4-1.8,1.8-3c0.4-1.1,0.6-2.4,0.6-3.6c0-1.3-0.2-2.5-0.6-3.6c-0.4-1.1-1-2.1-1.8-3c-0.8-0.8-1.7-1.5-2.8-2c-1.1-0.5-2.3-0.7-3.6-0.7c-1.3,0-2.5,0.2-3.6,0.7c-1.1,0.5-2,1.2-2.8,2c-0.8,0.8-1.4,1.8-1.8,3C58.9,23.5,58.7,24.7,58.7,26z"
      />
      <path
        id="XMLID_203_"
        fill="#666666"
        d="M86.5,0h4.2v39h-4.2V0z"
      />
      <path
        id="XMLID_201_"
        fill="#666666"
        d="M101.5,17.2h-4.7V13h4.7V3l4.2-0.9V13h5.2v4.2h-5.2v12.5c0,1.5,0.5,2.7,1.5,3.7c1,1,2.2,1.5,3.7,1.5V39c-1.3,0-2.5-0.2-3.6-0.7c-1.1-0.5-2.1-1.2-3-2c-0.9-0.8-1.5-1.8-2-3c-0.5-1.1-0.7-2.4-0.7-3.6V17.2z"
      />
      <path
        id="XMLID_199_"
        fill="#666666"
        d="M131.3,16.6c-3.2,0-5.6,0.8-7.1,2.4c-1.5,1.6-2.3,3.9-2.3,6.9v13h-4.2V13h4.2v4.3c1-1.7,2.3-2.9,4-3.7c1.6-0.8,3.5-1.2,5.4-1.2V16.6z"
      />
      <path
        id="XMLID_196_"
        fill="#666666"
        d="M136.3,14.7c0.3-0.2,0.7-0.4,1.3-0.6c0.6-0.3,1.2-0.5,2-0.7c0.8-0.2,1.6-0.4,2.5-0.6c0.9-0.2,1.8-0.3,2.8-0.3c1.6,0,3.1,0.2,4.5,0.7c1.4,0.5,2.5,1.1,3.5,2c1,0.8,1.7,1.8,2.3,3c0.5,1.1,0.8,2.4,0.8,3.7V39h-4.2v-3.3c-0.9,1.1-2,2.1-3.4,2.8c-1.4,0.7-3,1.1-4.7,1.1c-1.4,0-2.6-0.2-3.8-0.6c-1.2-0.4-2.2-1-3.1-1.8c-0.9-0.7-1.6-1.6-2.1-2.6c-0.5-1-0.8-2.1-0.8-3.2s0.3-2.2,0.8-3.2c0.5-1,1.3-1.8,2.2-2.6c0.9-0.7,2-1.3,3.2-1.7c1.2-0.4,2.6-0.6,4-0.6h7.7v-1.2c0-1.5-0.6-2.8-1.8-3.8c-1.2-1-2.9-1.5-5-1.5c-1.7,0-3.1,0.2-4.4,0.6c-1.3,0.4-2.2,0.8-2.8,1.2L136.3,14.7z M138.1,31c0,0.6,0.2,1.2,0.5,1.7c0.3,0.5,0.8,1,1.4,1.4c0.6,0.4,1.3,0.7,2.1,0.9c0.8,0.2,1.6,0.3,2.5,0.3c1,0,1.9-0.1,2.8-0.3c0.9-0.2,1.6-0.5,2.3-0.9c0.6-0.4,1.2-0.9,1.5-1.4c0.4-0.5,0.6-1.1,0.6-1.7v-4.4H145c-0.9,0-1.8,0.1-2.7,0.3c-0.8,0.2-1.6,0.5-2.2,0.9c-0.6,0.4-1.1,0.9-1.5,1.4C138.3,29.8,138.1,30.4,138.1,31z"
      />
      <path
        id="XMLID_194_"
        fill="#666666"
        d="M183.5,17.2c-0.2,0.1-0.4,0.3-0.7,0.5c-0.3,0.2-0.6,0.5-0.9,0.7c-0.3,0.3-0.6,0.5-0.9,0.7c-0.3,0.2-0.6,0.4-0.7,0.5c-0.8-0.9-1.8-1.6-2.9-2.2c-1.1-0.6-2.4-0.8-3.7-0.8c-1.3,0-2.5,0.2-3.6,0.7c-1.1,0.5-2,1.2-2.8,2c-0.8,0.8-1.4,1.8-1.8,3c-0.4,1.1-0.6,2.4-0.6,3.6c0,1.3,0.2,2.5,0.6,3.6c0.4,1.1,1,2.1,1.8,3c0.8,0.9,1.7,1.5,2.8,2c1.1,0.5,2.3,0.7,3.6,0.7c1.4,0,2.6-0.3,3.7-0.8c1.1-0.5,2.1-1.3,2.9-2.2c0.2,0.1,0.4,0.3,0.7,0.5c0.3,0.2,0.6,0.5,0.9,0.7c0.3,0.3,0.6,0.5,0.9,0.7c0.3,0.2,0.6,0.4,0.7,0.5c-1.2,1.5-2.6,2.6-4.3,3.4c-1.7,0.8-3.6,1.2-5.6,1.2c-1.9,0-3.6-0.4-5.2-1.1c-1.6-0.7-3-1.7-4.1-2.9c-1.2-1.2-2.1-2.6-2.7-4.3c-0.7-1.6-1-3.4-1-5.3s0.3-3.6,1-5.3c0.7-1.6,1.6-3.1,2.7-4.3c1.2-1.2,2.5-2.2,4.1-2.9c1.6-0.7,3.3-1.1,5.2-1.1c2,0,3.9,0.4,5.6,1.2C180.9,14.6,182.3,15.7,183.5,17.2z"
      />
      <path
        id="XMLID_192_"
        fill="#666666"
        d="M196.4,27.2l-4.2,4.4V39H188V0h4.2v25.6L204.4,13h5.8l-10.8,11.1L210.2,39H205L196.4,27.2z"
      />
      <path
        id="XMLID_190_"
        fill="#666666"
        d="M227.8,16.6c-3.2,0-5.6,0.8-7.1,2.4c-1.5,1.6-2.3,3.9-2.3,6.9v13h-4.2V13h4.2v4.3c1-1.7,2.3-2.9,4-3.7c1.6-0.8,3.5-1.2,5.4-1.2V16.6z"
      />
    </svg>
  );
})``;

Logo.defaultProps = {
  variant: 'primary'
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['light', 'primary'])
};
