import React, { ChangeEvent, useState, useCallback, useMemo } from 'react';
import type { FC } from 'react';
import {
  Box,
  Divider,
  Tab,
  Tabs,
  Grid,
  Button,
  ButtonGroup,
  Typography,
} from '@mui/material';
import moment from 'moment';

import { RangeType } from 'src/types/dashboard';

import ProductsStats from './ProductsStats';
import StaffStats from './StaffStats';
import CustomerStats from './CustomerStats';

interface RangeButton {
  title: string;
  type: RangeType;
}

const rangeButtons: RangeButton[] = [
  {
    title: '1 Month',
    type: 100,
  },
  {
    title: '3 Months',
    type: 200,
  },
  {
    title: '6 Months',
    type: 300,
  },
];

const tabs = [
  { label: 'Products', value: 'products' },
  { label: 'Staff', value: 'staff' },
  { label: 'Customers', value: 'customers' },
];

const FinancePerformanceStats: FC = () => {
  const [range, setRange] = useState<RangeType>(100);
  const [currentTab, setCurrentTab] = useState<string>('products');

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const handleRangeChange = useCallback(
    (value: RangeType) => {
      setRange(value);
    },
    [setRange],
  );

  const dateValue = useMemo(
    () => {
      let subMonths = 1;
      switch (range) {
        case 200:
          subMonths = 3;
          break;
        case 300:
          subMonths = 6;
          break;
        default:
      }
      const now = moment();
      const from = moment().subtract(subMonths, 'months');
      return `${from.format('D MMM YYYY')} - ${now.format('D MMM YYYY')}`;
    },
    [range],
  );

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Grid
          alignItems="center"
          container
          justifyContent="flex-start"
          spacing={3}
          sx={{ mb: 1 }}
        >
          <Grid item>
            <ButtonGroup size="medium">
              {rangeButtons.map((rangeButton) => (
                <Button
                  key={rangeButton.type}
                  variant={rangeButton.type === range ? 'contained' : 'outlined'}
                  onClick={() => handleRangeChange(rangeButton.type)}
                >
                  {rangeButton.title}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>
          <Grid item>
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              {`Showing data for ${dateValue}`}
            </Typography>
          </Grid>
        </Grid>
        <Tabs
          indicatorColor="primary"
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="primary"
          value={currentTab}
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
            />
          ))}
        </Tabs>
      </Box>
      <Divider />
      <Box>
        {currentTab === 'products' && <ProductsStats range={range} />}
        {currentTab === 'staff' && <StaffStats range={range} />}
        {currentTab === 'customers' && <CustomerStats range={range} />}
      </Box>
    </>
  );
};

export default FinancePerformanceStats;
