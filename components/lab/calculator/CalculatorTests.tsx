import type { FC } from 'react';
import React, { memo, useEffect, useState } from 'react';
import {
  Divider,
  Card,
  CardContent,
  CardHeader,
  Grid,
  CardActions,
  Button,
} from '@mui/material';
import find from 'lodash/find';
import { PlusCircle as PlusCircleIcon } from 'react-feather';
import ChemicalTestResultInput from './ChemicalTestResultInput';
import { SelectListModal } from '../../widgets/modals';
import { ChemicalResult } from 'src/types/waterTest';
import { useTranslation } from 'react-i18next';
import { TEMPERATURE_TEST } from './constants';
import TemperatureTestInput from './TemperatureTestInput';

interface CalculatorTestsProps {
  results: ChemicalResult[];
  onUpdate: (chemicalResult: ChemicalResult, value: string) => void;
}

const CalculatorTests: FC<CalculatorTestsProps> = ({ results, onUpdate, ...props }) => {
  const [chemicalResults, setChemicalResults] = useState<ChemicalResult[]>([]);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const activeResults = results.filter((chemicalResults: ChemicalResult) => chemicalResults.enabled);
    setChemicalResults(activeResults);
  }, [results]);

  const handleValueChange = (chemicalResult: ChemicalResult, value: string): void => {
    onUpdate(chemicalResult, value);
  };

  const handleToggleChemicalTest = (chemicalResult: ChemicalResult, enabled: boolean) => {
    const updatedResult = {
      ...chemicalResult,
      enabled
    } as ChemicalResult;
    onUpdate(updatedResult, updatedResult.value);
  };

  const handleClose = () => {
    setViewModal(false);
  };

  const chemicalTestInputs = () => {
    const temperatureTest: ChemicalResult = find(chemicalResults, (chemicalResult) => chemicalResult.name === TEMPERATURE_TEST)

    return (
      <Grid
        container
        spacing={3}
      >
        {!!temperatureTest && (
          <Grid
            item
            xs={12}
          >
            <TemperatureTestInput
              chemicalResult={temperatureTest}
              onChange={handleValueChange}
            />
          </Grid>
        )}
        {chemicalResults.map((chemicalResult) => {
          if (chemicalResult.id === temperatureTest.id) {
            return null
          }

          return (
            <Grid
              item
              md={6}
              xs={12}
              key={chemicalResult.chemical_test.id}
            >
              <ChemicalTestResultInput
                chemicalResult={chemicalResult}
                onChange={handleValueChange}
                onRemove={handleToggleChemicalTest}
              />
            </Grid>
          )
        })}
      </Grid>
    )
  }

  return (
    <>
      <Card {...props}>
        <CardHeader title="Water test" />
        <Divider />
        <CardContent>
          {chemicalTestInputs()}
        </CardContent>
        <CardActions
          sx={{
            p: 2
          }}
          disableSpacing
        >
          <Button
            type="button"
            startIcon={<PlusCircleIcon size={16} />}
            onClick={() => setViewModal(true)}
            variant="text"
          >
            {t('Add chemical tests')}
          </Button>
        </CardActions>
      </Card>
      <SelectListModal
        label={t('Add chemical tests')}
        searchPlaceholder={t('Search tests')}
        keepMounted={false}
        open={viewModal}
        items={results}
        onToggle={handleToggleChemicalTest}
        onClose={handleClose}
      />
    </>
  );
};

export default memo(CalculatorTests);
