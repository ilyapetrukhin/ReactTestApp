import type { FC } from 'react';
import React, { useEffect, memo, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Dialog,
  Stack,
  Card,
  CardActions,
  CardHeader,
  Divider
} from '@mui/material';
import type { Pool } from 'src/types/pool';
import type { Contact } from 'src/types/contact';
import PropTypes from 'prop-types';
import type { LabJob } from 'src/types/labJob';
import type { Job } from 'src/types/job';
import CalculatorObservations from './CalculatorObservations';
import CalculatorRecommendations from './CalculatorRecommendations';
import { useDispatch, useSelector } from 'src/store';
import { init, reset } from 'src/slices/waterTestCalculator';
import LoadingScreen from 'src/components/LoadingScreen';
import CalculatorTests from './CalculatorTests';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import WaterTestPdf from '../water-test-pdf/WaterTestPdf';
import { useTheme } from '@mui/material/styles';
import ArrowLeftIcon from 'src/icons/ArrowLeft';
import {
  Layout as LayoutIcon,
} from 'react-feather';
import { LoadingButton } from '@mui/lab';
import type { PdfInstance } from "src/types/common";
import debounce from "lodash/debounce";
import { DosagesList, TestsList, PoolSpecs, ProductSpecs } from "src/lib/chemical-calculator/src/types";
import { ChemicalCalculator } from "src/lib/chemical-calculator/src";
import { ChemicalResult, DosageRecommendation, ObservationResult } from 'src/types/waterTest';
import { useTranslation } from 'react-i18next';

interface WaterTestCalculatorProps {
  job: LabJob | Job;
  pool: Pool;
  contact: Contact;
  disabled: boolean;
  onGenerateReport: (
    pdfInstance: PdfInstance,
    chemicalResults: ChemicalResult[],
    observationResults: ObservationResult[],
  ) => void;
}

const WaterTestCalculator: FC<WaterTestCalculatorProps> = (props) => {
  const { job, pool, contact, disabled, onGenerateReport } = props;
  const { organisation, logo } = useSelector((state) => state.account);
  const { metrics } = useSelector((state) => state.product);
  const { poolSanitisers } = useSelector((state) => state.poolSpecifications);
  const [chemicalResults, setChemicalResults] = useState<ChemicalResult[]>([]);
  const [observationResults, setObservationResults] = useState<ObservationResult[]>([]);
  const [viewPDF, setViewPDF] = useState<boolean>(false);
  const [calculator, setCalculator] = useState<ChemicalCalculator>();
  const {
    isLoading,
    initialised,
    chemicalTests,
    observationTests,
    chemicalGroups,
    observationGroups,
    chemicalResults: savedChemicalResults,
    observationResults: savedObservationResults,
  } = useSelector((state) => state.waterTestCalculator);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();

  const [instance, updateInstance] = usePDF({
    document:
      <WaterTestPdf
        labJob={job}
        pool={pool}
        contact={contact}
        theme={theme}
        logo={logo}
        organisation={organisation}
        chemicalResults={chemicalResults}
        observationResults={observationResults}
      />
  });

  useEffect(() => () => dispatch(reset()), []);

  useEffect(() => {
    if (!initialised) {
      dispatch(init(organisation.id, job, pool));
    }
  }, [job, pool, organisation]);

  useEffect(() => {
    if (!isLoading && !calculator) {
      const tests: TestsList = {
        chemicalTests,
        observationTests
      };
      const dosages: DosagesList = {
        chemicalGroups,
        observationGroups
      };
      const poolSpecs: PoolSpecs = {
        pool,
        sanitisers: poolSanitisers
      };
      const productSpecs: ProductSpecs = {
        metrics,
        products: []
      };
      const calc = new ChemicalCalculator(
        poolSpecs,
        productSpecs,
        tests,
        dosages
      );
      setCalculator(calc);
      calc.initResults(savedChemicalResults, savedObservationResults);
      const results = calc.getResults();
      setChemicalResults(results.chemicalResults);
      setObservationResults(results.observationResults);
    }
  }, [
    isLoading,
    calculator,
    chemicalTests,
    observationTests,
    chemicalGroups,
    observationGroups,
    pool,
    poolSanitisers,
    metrics,
    savedChemicalResults,
    savedObservationResults,
  ]);


  useEffect(() => {
    const handleChangeDebounce = debounce(() => {
      updateInstance();
    }, 2000);
    handleChangeDebounce();
  }, [pool, contact, chemicalResults, observationResults]);

  const handleChemicalResultUpdate = (chemicalResult: ChemicalResult, value: string) => {
    calculator.processChemicalResult(chemicalResult, value);
    const updatedResults = calculator.getResults();
    setChemicalResults(updatedResults.chemicalResults);
  };

  const handleChemicalRecommendationUpdate = (
    testResult: ChemicalResult,
    selectedRecommendation: DosageRecommendation,
    showOnReport: boolean,
    customerAction: string
  ) => {
    calculator.changeChemicalRecommendation(
      testResult,
      selectedRecommendation,
      showOnReport,
      customerAction
    );
    const updatedResults = calculator.getResults();
    setChemicalResults(updatedResults.chemicalResults);
  };

  const handleObservationResultUpdate = (observationResult: ObservationResult, value: boolean) => {
    calculator.processObservationResult(observationResult, value);
    const updatedResults = calculator.getResults();
    setObservationResults(updatedResults.observationResults);
  };

  const handleChemicalObservationUpdate = (
    testResult: ObservationResult,
    selectedRecommendation: DosageRecommendation,
    showOnReport: boolean,
    customerAction: string
  ) => {
    calculator.changeObservationRecommendation(
      testResult,
      selectedRecommendation,
      showOnReport,
      customerAction
    );
    const updatedResults = calculator.getResults();
    setObservationResults(updatedResults.observationResults);
  };

  if (isLoading || !calculator) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
          <Card {...props}>
            <CardHeader title={t('Report settings')} />
            <Divider />
            <CardActions
              sx={{
                p: 2
              }}
              disableSpacing
            >
              <Button
                color="primary"
                startIcon={<LayoutIcon fontSize="small" />}
                variant="text"
                disabled={disabled}
              >
                {t('Configure report layout')}
              </Button>
              <Box flexGrow={1} />
              <Button
                color="primary"
                onClick={(): void => setViewPDF(true)}
                variant="outlined"
                disabled={disabled}
              >
                {t('Preview PDF')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <CalculatorTests results={chemicalResults} onUpdate={handleChemicalResultUpdate} />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <CalculatorObservations results={observationResults} onUpdate={handleObservationResultUpdate} />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <CalculatorRecommendations
            calculator={calculator}
            chemicalResults={chemicalResults}
            observationResults={observationResults}
            onChemicalRecommendationUpdate={handleChemicalRecommendationUpdate}
            onObservationRecommendationUpdate={handleChemicalObservationUpdate}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          py: 2
        }}
      >
        <LoadingButton
          color="primary"
          sx={{ ml: 2 }}
          onClick={() => onGenerateReport(instance, chemicalResults, observationResults)}
          type="button"
          variant="contained"
          loading={disabled}
        >
          {t('Generate report')}
        </LoadingButton>
      </Box>
      <Dialog
        fullScreen
        open={viewPDF}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <Box
            sx={{
              backgroundColor: 'background.default',
              p: 2
            }}
          >
            <Button
              color="primary"
              startIcon={<ArrowLeftIcon fontSize="small" />}
              onClick={(): void => setViewPDF(false)}
              variant="contained"
            >
              {t('Back')}
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <PDFViewer
              height="100%"
              style={{ border: 'none' }}
              width="100%"
              showToolbar
            >
              <WaterTestPdf
                labJob={job}
                pool={pool}
                contact={contact}
                theme={theme}
                logo={logo}
                organisation={organisation}
                chemicalResults={chemicalResults}
                observationResults={observationResults}
              />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

WaterTestCalculator.propTypes = {
  // @ts-ignore
  job: PropTypes.object.isRequired,
  // @ts-ignore
  pool: PropTypes.object.isRequired,
  // @ts-ignore
  contact: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  onGenerateReport: PropTypes.func.isRequired,
};

export default memo(WaterTestCalculator);
