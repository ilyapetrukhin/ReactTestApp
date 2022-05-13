import type { CombinedTestHistory } from 'src/types/testHistory';
import type { ChartData } from 'src/types/type';
import each from 'lodash/each';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import meanBy from 'lodash/meanBy';
import type { Theme } from '@mui/material';

const transformResultsToGraphs = (historyItems: CombinedTestHistory[], theme: Theme): ChartData[] => {
  const chartResults : ChartData[] = [];
  if (historyItems.length) {
    const historyItem = historyItems[0];
    const chemicalTests = historyItem.results.map((result) => result.name);
    const groupedResults = groupBy(sortBy(historyItems, 'analysis_date'), 'analysis_date');

    each(chemicalTests, (chemicalTestName) => {
      const labels = [];
      const series = [];
      each(groupedResults, (historyResults, analysisDate) => {
        const chemicalTestResults = [];
        each(historyResults, (historyResult) => {
          const testResult = find(historyResult.results, (res) => res.name === chemicalTestName);
          if (testResult && testResult.value !== '-') chemicalTestResults.push(testResult);
        });
        if (chemicalTestResults.length) {
          labels.push(analysisDate);
          series.push(meanBy(chemicalTestResults, (chemicalTestResult) => parseFloat(chemicalTestResult.value)));
        }
      });
      chartResults.push({
        title: chemicalTestName,
        color: theme.palette.primary.main,
        labels,
        series
      });
    });
  }

  return chartResults;
};

export default transformResultsToGraphs;
