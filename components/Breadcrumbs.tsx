import React, {
  forwardRef,
} from 'react';
import NextLink from 'next/link';
import type {
  HTMLProps,
  ReactNode
} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Breadcrumbs as BreadcrumbsMui,
  BreadcrumbsProps as BreadcrumbsMuiProps,
  Grid,
  Link,
  Typography
} from '@mui/material';
import ChevronRightIcon from '../icons/ChevronRight';
import type { BreadcrumbItem } from '../types/common';

interface BreadcrumbsProps extends HTMLProps<HTMLDivElement> {
  title: string;
  items: BreadcrumbItem[];
  children?: ReactNode;
  muiBreadcrumbsProps?: BreadcrumbsMuiProps
}

const Breadcrumbs = forwardRef<HTMLDivElement, BreadcrumbsProps>(({
  title = '',
  items = [],
  children,
  muiBreadcrumbsProps = {},
  ...rest
}, ref) => (
  <div
    ref={ref as any}
    {...rest}
  >
    <Box
      sx={{
        backgroundColor: 'background.paper',
      }}
    >
      <Grid
        sx={{
          backgroundColor: 'background.paper',
          p: 3
        }}
        container
        justifyContent="space-between"
        spacing={3}
      >
        <Grid item>
          <Typography
            color="textPrimary"
            variant="h5"
          >
            {title}
          </Typography>
          <BreadcrumbsMui
            aria-label="breadcrumb"
            separator={<ChevronRightIcon fontSize="small" />}
            sx={{ mt: 1 }}
            {...muiBreadcrumbsProps}
          >
            {items.map((item: BreadcrumbItem) => (
              <NextLink
                href={item.routeTo}
                passHref
                key={item.routeTo}
              >
                <Link
                  key={item.title}
                  color="primary"
                  underline="hover"
                  variant="subtitle2"
                >
                  {item.title}
                </Link>
              </NextLink>
            ))}
            <Typography
              color="primary"
              variant="subtitle2"
            >
              {title}
            </Typography>
          </BreadcrumbsMui>
        </Grid>
        <Grid
          item
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {children}
        </Grid>
      </Grid>
    </Box>
  </div>
));

Breadcrumbs.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  children: PropTypes.node,
  muiBreadcrumbsProps: PropTypes.object,
};

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
