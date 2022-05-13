import React, { FC, useEffect, useState } from 'react';
import {
  Divider,
  Card,
  CardHeader,
  CardContent,
  Theme,
  Typography,
} from '@mui/material';
import { Box, SxProps } from '@mui/system';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import ObservationRecommendation from './ObservationRecommendation';
import ChemicalRecommendation from './ChemicalRecommendation';
import { ChemicalCalculator } from 'src/lib/chemical-calculator/src';
import { ChemicalResult, DosageRecommendation, ObservationResult } from 'src/types/waterTest';
import { useTranslation } from 'react-i18next';

interface CalculatorRecommendationsProps {
  calculator: ChemicalCalculator;
  chemicalResults: ChemicalResult[];
  observationResults: ObservationResult[];
  onChemicalRecommendationUpdate: (
    testResult: ChemicalResult,
    selectedRecommendation: DosageRecommendation,
    showOnReport: boolean,
    customerAction: string
  ) => void;
  onObservationRecommendationUpdate: (
    testResult: ObservationResult,
    selectedRecommendation: DosageRecommendation,
    showOnReport: boolean,
    customerAction: string
  ) => void;
  sx?: SxProps<Theme>;
}

const CalculatorRecommendations: FC<CalculatorRecommendationsProps> = (props) => {
  const {
    calculator,
    chemicalResults,
    observationResults,
    onChemicalRecommendationUpdate,
    onObservationRecommendationUpdate,
    ...rest
  } = props;
  const [activeChemicalResults, setActiveChemicalResults] = useState<ChemicalResult[] | []>([]);
  const [activeObservationResults, setActiveObservationResults] = useState<ObservationResult[] | []>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (chemicalResults.length) {
      const activeResults: ChemicalResult[] = filter(chemicalResults, (chemicalResult: ChemicalResult) => chemicalResult.value && chemicalResult.recommendations.length > 0);
      setActiveChemicalResults(activeResults);
    }
  }, [chemicalResults]);

  useEffect(() => {
    if (observationResults.length) {
      const activeResults: ObservationResult[] = filter(observationResults, (observationResult: ObservationResult) => observationResult.value && observationResult.recommendations.length > 0);
      setActiveObservationResults(activeResults);
    }
  }, [observationResults]);

  const handleChemicalRecommendationUpdate = (
    testResult: ChemicalResult,
    selectedRecommendation: DosageRecommendation,
    showOnReport: boolean,
    customerAction: string
  ) => {
    onChemicalRecommendationUpdate(
      testResult,
      selectedRecommendation,
      showOnReport,
      customerAction
    )
  };

  const handleObservationRecommendationUpdate = (
    testResult: ObservationResult,
    selectedRecommendation: DosageRecommendation,
    showOnReport: boolean,
    customerAction: string
  ) => {
    onObservationRecommendationUpdate(
      testResult,
      selectedRecommendation,
      showOnReport,
      customerAction
    )
  };

  return (
    <Card {...rest}>
      <CardHeader title={t('Recommendations')} />
      <Divider />
      
      <CardContent>
        {activeChemicalResults.length === 0 && activeObservationResults.length === 0 && (
          <Box
            textAlign="center"
          >
            <Typography
              color="textSecondary"
              variant="h6"
            >
              {t('Enter test results to view recommendations')}
            </Typography>
          </Box>
        )}
        {activeChemicalResults.map((result: ChemicalResult) => (
          <ChemicalRecommendation
            sx={{
              mt: 3,
              backgroundColor: 'background.default',
            }}
            key={result.id}
            result={result}
            onUpdate={handleChemicalRecommendationUpdate}
          />
        ))}
        {activeObservationResults.map((result: ObservationResult) => (
          <ObservationRecommendation
            sx={{
              mt: 3,
              backgroundColor: 'background.default',
            }}
            key={result.id}
            result={result}
            onUpdate={handleObservationRecommendationUpdate}
          />
        ))}
      </CardContent>
    </Card>
  );
};

CalculatorRecommendations.propTypes = {
  // @ts-ignore
  calculator: PropTypes.object.isRequired,
  chemicalResults: PropTypes.array.isRequired,
  observationResults: PropTypes.array.isRequired,
  onChemicalRecommendationUpdate: PropTypes.func.isRequired,
  onObservationRecommendationUpdate: PropTypes.func.isRequired,
  sx: PropTypes.object
};

export default CalculatorRecommendations;
