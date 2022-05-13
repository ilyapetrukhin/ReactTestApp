import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';
import { List, ListSubheader, Button, Collapse } from '@mui/material';
import type { ListProps } from '@mui/material';

import NavItem from './NavItem';
import PlusIcon from '../icons/Plus';
import MinusIcon from '../icons/Minus';

interface Item {
  path?: string;
  icon?: ReactNode;
  info?: ReactNode;
  children?: Item[];
  title: string;
}

interface NavSectionProps extends ListProps {
  items: Item[];
  pathname: string;
  title: string;
  isCollapsed: boolean;
  onToggleSection: () => void;
}

const renderNavItems = ({
  depth = 0,
  items,
  pathname
}: {
  items: Item[];
  pathname: string;
  depth?: number;
}): JSX.Element => (
  <List disablePadding>
    {items.reduce(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
      (acc, item) => reduceChildRoutes({
        acc,
        item,
        pathname,
        depth
      }),
      []
    )}
  </List>
);

const reduceChildRoutes = ({
  acc,
  pathname,
  item,
  depth
}: {
  acc: JSX.Element[];
  pathname: string;
  item: Item;
  depth: number;
}): Array<JSX.Element> => {
  const key = `${item.title}-${depth}`;
  const exactMatch = item.path ? !!matchPath({
    path: item.path,
    end: true
  }, pathname) : false;

  if (item.children) {
    const partialMatch = item.path ? !!matchPath({
      path: item.path,
      end: false
    }, pathname) : false;

    acc.push(
      <NavItem
        active={partialMatch}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={partialMatch}
        path={item.path}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          items: item.children,
          pathname
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        active={exactMatch}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        path={item.path}
        title={item.title}
      />
    );
  }

  return acc;
};

const NavSection: FC<NavSectionProps> = (props) => {
  const {
    items,
    pathname,
    title,
    isCollapsed,
    onToggleSection,
    ...other
  } = props;

  return (
    <List
      subheader={(
        <Button
          endIcon={isCollapsed ? <PlusIcon fontSize="small" /> : <MinusIcon fontSize="small" />}
          sx={{
            color: 'text.primary',
            fontWeight: 'fontWeightMedium',
            justifyContent: 'flex-start',
            textAlign: 'left',
            pr: 1,
            textTransform: 'none',
            width: '100%',
          }}
          variant="text"
          onClick={onToggleSection}
        >
          <ListSubheader
            disableGutters
            disableSticky
            sx={{
              color: 'text.primary',
              width: '100%',
              fontSize: '0.8rem',
              lineHeight: 2,
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          >
            {title}
          </ListSubheader>
        </Button>
      )}
      {...other}
    >
      <Collapse in={!isCollapsed}>
        {renderNavItems({
          items,
          pathname
        })}
      </Collapse>
    </List>
  );
};

NavSection.propTypes = {
  items: PropTypes.array,
  pathname: PropTypes.string,
  title: PropTypes.string,
  isCollapsed: PropTypes.bool,
  onToggleSection: PropTypes.func,
};

export default NavSection;
