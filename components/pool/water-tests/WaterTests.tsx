import React, { ChangeEvent, useEffect, useState, useMemo } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'src/store';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { CSVLink } from 'react-csv';
import { getHistory, selectHistoryRange } from 'src/slices/poolDetail';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import WaterTestList from './WaterTestList';
import WaterTestGraphs from './WaterTestGraphs';
import LoadingScreen from '../../LoadingScreen';
import DownloadIcon from 'src/icons/Download';
import type { CombinedTestHistory } from 'src/types/testHistory';
import moment from 'moment/moment';

const tabs = [
  {
    label: 'Details',
    value: 'details'
  },
  {
    label: 'Graphs',
    value: 'graphs'
  },
];

const WaterTests: FC = (props) => {
  const router = useRouter();
  const { poolId } = router.query;
  const { organisation } = useSelector((state) => state.account);
  const [currentTab, setCurrentTab] = useState<string>('details');
  const { chemicalHistoryItems, selectedHistoryRange, isHistoryLoading } = useSelector((state) => state.poolDetail);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    // @ts-ignore
    dispatch(getHistory(organisation.id, parseInt(poolId, 10), selectedHistoryRange));
  }, [organisation, getHistory, poolId, selectedHistoryRange]);

  const minDate = useMemo(
    () => moment(selectedHistoryRange.from).toDate(),
    [selectedHistoryRange.from]
  );

  const maxDate = useMemo(
    () => moment(selectedHistoryRange.to).toDate(),
    [selectedHistoryRange.to]
  );

  const handleFromDateChange = (date: Date): void => {
    dispatch(selectHistoryRange(date, new Date(selectedHistoryRange.to)));
  };

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const handleToDateChange = (date: Date): void => {
    dispatch(selectHistoryRange(new Date(selectedHistoryRange.from), date));
  };

  const csvData = useMemo(
    () => {
      const res = [];
      let columnNames = ['Analysis date'];
      const model = chemicalHistoryItems[0];
      if (model && model.results && model.results.length) {
        const chemicalTests = model.results.map((test) => test.name);
        columnNames = [
          ...columnNames,
          ...chemicalTests
        ];
      }
      res.push(columnNames);
      chemicalHistoryItems.forEach((chemicalHistoryItem: CombinedTestHistory) => {
        const resultValues = chemicalHistoryItem.results.map((test) => test.value);
        const results = [chemicalHistoryItem.analysis_date, ...resultValues];
        res.push(results);
      });
      return res;
    },
    [chemicalHistoryItems],
  );

  return (
    <>
      <Card {...props}>
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
        <Divider />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            p: 3,
            pb: 0
          }}
        >
          <Box
            sx={{
              m: 1,
              maxWidth: '100%',
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid
                item
              >
                <MobileDatePicker
                  label="From date"
                  renderInput={(props) => (
                    <TextField
                      fullWidth
                      variant="outlined"
                      {...props}
                    />
                  )}
                  disableFuture
                  mask="YYYY-MM-DD"
                  disableCloseOnSelect={false}
                  showToolbar={false}
                  disableMaskedInput
                  inputFormat="dd MMM yyyy"
                  loading={isHistoryLoading}
                  maxDate={maxDate}
                  onChange={handleFromDateChange}
                  value={selectedHistoryRange.from}
                />
              </Grid>
              <Grid item>
                <MobileDatePicker
                  label="To date"
                  renderInput={(props) => (
                    <TextField
                      fullWidth
                      variant="outlined"
                      {...props}
                    />
                  )}
                  disableFuture
                  disableCloseOnSelect={false}
                  showToolbar={false}
                  disableMaskedInput
                  inputFormat="dd MMM yyyy"
                  loading={isHistoryLoading}
                  minDate={minDate}
                  onChange={handleToDateChange}
                  value={selectedHistoryRange.to}
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              alignItems: 'flex-end',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CSVLink
              style={{ textDecoration: 'none', color: theme.palette.primary.main }}
              filename="water-test-history.csv"
              data={csvData}
            >
              <Button
                color="inherit"
                startIcon={<DownloadIcon fontSize="small" />}
                variant="text"
              >
                Export Data
              </Button>
            </CSVLink>
          </Box>
        </Box>
        {isHistoryLoading ? <LoadingScreen /> : (
          <Box>
            {chemicalHistoryItems.length === 0 && (
              <Box
                p={2}
              >
                <Typography
                  color="textPrimary"
                  variant="caption"
                >
                  There are no water tests with results for the selected range
                </Typography>
              </Box>
            )}
            {chemicalHistoryItems.length > 0 && (
              <Box>
                {currentTab === 'details' && <WaterTestList />}
                {currentTab === 'graphs' && <WaterTestGraphs />}
              </Box>
            )}
          </Box>
        )}
      </Card>
    </>
  );
};

export default WaterTests;
