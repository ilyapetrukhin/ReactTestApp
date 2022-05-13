import React, {
  forwardRef,
  useEffect,
  useCallback
} from 'react';
import type {
  HTMLProps,
  ReactNode
} from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { gtm } from 'src/lib/gtm';
import { Box } from '@mui/material';

interface PageProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  title?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({
  children,
  title = '',
  ...rest
}, ref) => {
  const sendPageViewEvent = useCallback(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(() => {
    sendPageViewEvent();
  }, [sendPageViewEvent]);

  return (
    <div
      ref={ref as any}
      {...rest}
    >
      <Head>
        <title>
          {title}
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          pb: 8
        }}
      >
        {children}
      </Box>
    </div>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

export default Page;
