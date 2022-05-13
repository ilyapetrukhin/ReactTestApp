import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Card,
  Theme,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import { SxProps } from '@mui/system';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import ChemicalTestStatus from './ChemicalTestStatus';
import { ChemicalResult, DosageRecommendation } from 'src/types/waterTest';
import { useTranslation } from 'react-i18next';

interface ChemicalRecommendationProps {
  result: ChemicalResult;
  onUpdate: (
    testResult: ChemicalResult,
    selectedRecommendation: DosageRecommendation,
    showOnReport: boolean,
    customerAction: string
  ) => void;
  sx?: SxProps<Theme>;
}

const ChemicalRecommendation: FC<ChemicalRecommendationProps> = (props) => {
  const { result, onUpdate, ...rest } = props;
  const [selectedRecommendation, setSelectedRecommendation] = useState<DosageRecommendation>();
  const [showOnReport, setShowOnReport] = useState<boolean>();
  const [customerAction, setCustomerAction] = useState<string>();
  const [editAction, setEditAction] = useState<string>();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const recommendation = result.selected_recommendation;
    setSelectedRecommendation(recommendation);
    setCustomerAction(recommendation.custom_action);
    setShowOnReport(result.show_on_report);
  }, [result]);

  const handleEdit = (): void => {
    setEditAction(customerAction);
    setIsExpanded(true);
  };

  const handleCancel = (): void => {
    setIsExpanded(false);
    setEditAction('');
  };

  const handleActionChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEditAction(event.target.value);
  };

  const handleSaveAction = () => {
    setCustomerAction(editAction);
    setIsExpanded(false);
    onUpdate(
      result,
      selectedRecommendation,
      showOnReport,
      editAction
    );
    setEditAction('');
  };

  const handleChangeDosage = (id: number) => {
    const recommendation = find(result.recommendations, (recommendation: DosageRecommendation) => recommendation.dosage_group_id === id);
    setSelectedRecommendation(recommendation);
    onUpdate(
      result,
      recommendation,
      showOnReport,
      recommendation.action
    );
  };

  const handleShowOnReport = (showOnReport: boolean) => {
    onUpdate(
      result,
      selectedRecommendation,
      showOnReport,
      customerAction
    );
    setShowOnReport(showOnReport);
  };

  if (!selectedRecommendation) {
    return null;
  }

  return (
    <Card
      {...rest}
    >
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <ChemicalTestStatus
              currentValue={3}
              minValue={4}
              maxValue={10}
            />
            <Typography
              color="textPrimary"
              variant="h6"
              sx={{
                ml: 2
              }}
            >
              {result?.chemical_test?.name}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body2"
              sx={{
                ml: 1
              }}
            >
              |
            </Typography>
            <Typography
              sx={{
                ml: 1,
                color: 'error.main',
              }}
              variant="body2"
              fontWeight="bold"
            >
              {t('Recorded')}
              {': '}
              {result.value}
            </Typography>
            <Typography
              color="textSecondary"
              variant="body2"
              sx={{
                ml: 1
              }}
            >
              {t('Target')}
              {': '}
              {result.target_value}
            </Typography>
          </Box>
          <FormControlLabel
            control={(
              <Switch
                color="primary"
                edge="start"
              />
            )}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleShowOnReport(event.target.checked)}
            checked={showOnReport}
            label="Show on report"
          />
        </Box>
        <Box
          mt={2}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              sm={6}
              xs={12}
            >
              <TextField
                fullWidth
                label={t('Select dosage group')}
                name="dosage_group"
                select
                required
                InputLabelProps={{ shrink: true }}
                value={selectedRecommendation.dosage_group_id}
                onChange={(event): void => handleChangeDosage(parseInt(event.target.value, 10))}
                SelectProps={{ native: true, displayEmpty: true }}
                variant="outlined"
                sx={{
                  backgroundColor: 'background.paper',
                }}
              >
                {result.recommendations.map((dosageRecommendation: DosageRecommendation) => (
                  <option
                    key={dosageRecommendation.dosage_group_id}
                    value={dosageRecommendation.dosage_group_id}
                  >
                    {dosageRecommendation?.dosage_group?.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              sm={6}
              xs={12}
            >
              {
                isExpanded
                  ? (
                    <div>
                      <TextField
                        fullWidth
                        label={t('Customer action')}
                        onChange={handleActionChange}
                        name="customer_action"
                        value={editAction}
                        variant="outlined"
                        multiline
                        sx={{
                          backgroundColor: 'background.paper',
                        }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: 2
                        }}
                      >
                        <Button
                          color="primary"
                          onClick={handleCancel}
                          size="small"
                          variant="text"
                        >
                          {t('Cancel')}
                        </Button>
                        <Button
                          color="primary"
                          onClick={handleSaveAction}
                          size="small"
                          sx={{ ml: 2 }}
                          variant="contained"
                        >
                          {t('Save')}
                        </Button>
                      </Box>
                    </div>
                  )
                  : (
                    <TextField
                      fullWidth
                      label={t('Customer action')}
                      name="customer_action"
                      value={customerAction}
                      variant="outlined"
                      multiline
                      onClick={handleEdit}
                      sx={{
                        backgroundColor: 'background.paper',
                      }}
                    />
                  )
              }
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

ChemicalRecommendation.propTypes = {
  // @ts-ignore
  chemicalGroups: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
  sx: PropTypes.object,
};

export default ChemicalRecommendation;
