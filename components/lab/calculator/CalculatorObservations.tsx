import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Grid,
  FormControlLabel,
  Switch,
  CardActions,
  Button,
} from '@mui/material';
import { PlusCircle as PlusCircleIcon } from 'react-feather';
import { SelectListModal } from '../../widgets/modals';
import { ObservationResult } from 'src/types/waterTest';
import { useTranslation } from 'react-i18next';

interface CalculatorTestsProps {
  results: ObservationResult[];
  onUpdate: (observationResult: ObservationResult, value: boolean) => void;
}

const CalculatorObservations: FC<CalculatorTestsProps> = ({ results, onUpdate, ...props }) => {
  const [observationResults, setObservationResults] = useState<ObservationResult[]>([]);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const activeResults = results.filter((observationResult: ObservationResult) => observationResult.enabled);
    setObservationResults(activeResults);
  }, [results]);

  const handleValueChange = (observationResult: ObservationResult, value: boolean): void => {
    // dispatch(updateObservationTestResult(observationTestResult, value));
    onUpdate(observationResult, value);
  };

  const handleToggleObservationTest = (observationResult: ObservationResult, enabled: boolean) => {
    const updatedResult = {
      ...observationResult,
      enabled
    } as ObservationResult;
    onUpdate(updatedResult, updatedResult.value);
  };

  const handleClose = () => {
    setViewModal(false);
  };

  return (
    <>
      <Card {...props}>
        <CardHeader title="Observations" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            {observationResults.map((observationResult) => (
              <Grid
                item
                md={4}
                xs={6}
                key={observationResult.id}
              >
                <Box
                  sx={{
                    px: 1
                  }}
                >
                  <FormControlLabel
                    control={(
                      <Switch
                        color="primary"
                        edge="start"
                        checked={observationResult.value}
                        onChange={(event): void => handleValueChange(observationResult, event.target.checked)}
                      />
                    )}
                    label={observationResult.name}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
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
            {t('Add observation tests')}
          </Button>
        </CardActions>
      </Card>
      <SelectListModal
        label={t('Add observation tests')}
        searchPlaceholder={t('Search tests')}
        keepMounted={false}
        open={viewModal}
        items={results}
        onToggle={handleToggleObservationTest}
        onClose={handleClose}
      />
    </>
  );
};
export default CalculatorObservations;
