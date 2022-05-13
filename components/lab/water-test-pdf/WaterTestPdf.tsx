/* eslint-disable */
import React, { FC, useCallback, useMemo } from 'react';

import PropTypes from 'prop-types';

import { Theme } from '@mui/material';
import numeral from 'numeral';
import filter from 'lodash/filter';
import {
  Document,
  // Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import type { LabJob } from 'src/types/labJob';
import type { Image as ImageType } from 'src/types/image';
import { Organisation } from 'src/types/organisation';
import { getEntityAddress } from 'src/utils/address';

import { initializePdfRender, useCommonStyles } from './commonStyles';
import PoolInfo from './PoolInfo';
import RecommendationItem from './RecommendationItem';
import ResultsTableHeader from './ResultsTableHeader';
import ResultsTableRow from './ResultsTableRow';
import type {
  ChemicalResult,
  ObservationResult,
} from 'src/types/waterTest';
import type { Pool } from 'src/types/pool';
import type { Contact } from 'src/types/contact';
import { getFullName } from 'src/utils/contact';
import getCommaSeparatedSanitisers from 'src/utils/pool';
import moment from 'moment/moment';
import { useTranslation } from 'react-i18next';

initializePdfRender();

interface WaterTestPdfProps {
  labJob: LabJob;
  contact: Contact;
  pool: Pool;
  theme: Theme;
  logo?: ImageType;
  organisation: Organisation;
  chemicalResults: ChemicalResult[] | [];
  observationResults: ObservationResult[] | [];
}

const createStyles = (theme: Theme) => StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerInfo: {
    maxWidth: '50%',
  },
  headerLogo: {
    maxWidth: '50%',
  },
  footer: {
    padding: 16,
  },
  banner: {
    maxHeight: 60,
    paddingHorizontal: 24,
  },
  bannerImage: {
    height: 60,
    width: '100%'
  },
  content: {
    paddingTop: 12,
    paddingHorizontal: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentRecommendationsColumn: {
    width: '50%',
  },
  contentTestResultsColumn: {
    width: '45%',
  },
  footerText: {
    textAlign: 'center',
    color: theme.palette.grey[600],
  },
  spacer: {
    flexGrow: 1,
    height: 100
  }
});

// TODO: Implement organisation logo
// TODO: Implement campaign banners
// TODO: Implement text transfer between pages
// TODO: Sanitise styles

const WaterTestPdf: FC<WaterTestPdfProps> = (props) => {
  const { labJob, contact, pool, theme, logo, organisation, chemicalResults, observationResults } = props;
  const organisationAddress = useMemo(
    () => getEntityAddress(organisation, 'company'),
    []
  );
  const commonStyles = useCommonStyles(theme);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { t } = useTranslation();

  const currentDateText = useMemo(
    () => moment(labJob.start_time).format('DD MMM YYYY | HH:mm'),
    [labJob]
  );

  const getRange = useCallback(
    (chemicalResult: ChemicalResult) => `${chemicalResult.min_value} - ${chemicalResult.max_value}`,
    []
  );

  const activeChemicalResults = useMemo(() => {
    return filter(chemicalResults, (chemicalResult: ChemicalResult) => chemicalResult.value !== '')
  }, [chemicalResults])

  const activeOvservationResults = useMemo(() => {
    return filter(observationResults, (observationResult: ObservationResult) => observationResult.value)
  }, [observationResults])

  const getTestStatus = (chemicalResult: ChemicalResult): string => {
    return `${chemicalResult.chemical_test.name} is ${chemicalResult.status}`
  }

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
        wrap
      >
        <View
          fixed
          style={styles.header}
        >
          <View style={styles.headerInfo}>
            <Text style={commonStyles.h4}>Water Analysis</Text>
            <Text style={commonStyles.body1}>{currentDateText}</Text>
          </View>
          {/* <Image
            style={styles.headerLogo}
            src={{
              uri: logo.full_url,
              method: 'GET',
              headers: {
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
              },
              body: '',
            }}
          /> */}
        </View>

        <PoolInfo
          theme={theme}
          to={getFullName(contact)}
          address={getEntityAddress(pool, 'pool')}
          type={pool.pool_type?.name || 'Unknown type'}
          volume={`${numeral(pool.pool_volume).format('0,0')} L`}
          surface={pool.pool_surface_type?.name || t('Unknown surface')}
          sanitiser={getCommaSeparatedSanitisers(pool.pool_sanitisers)}
        />

        {activeChemicalResults.length > 0 && (
          <View style={styles.content}>
            <View style={styles.contentRecommendationsColumn}>
              <Text style={commonStyles.h6}>{t('Recommendations')}</Text>
              {activeChemicalResults.map((chemicalResult: ChemicalResult) => {
                return chemicalResult.show_on_report
                  ? (
                    <RecommendationItem
                      key={chemicalResult.id}
                      theme={theme}
                      title={getTestStatus(chemicalResult)}
                      subtitle={chemicalResult.action}
                      description={chemicalResult.description}
                    />
                  )
                  : null;
              })}
            </View>
            <View style={styles.contentTestResultsColumn}>
              <Text style={commonStyles.h6}>{t('Test results')}</Text>
              <ResultsTableHeader theme={theme} />
              {activeChemicalResults.map((chemicalResult: ChemicalResult, index: number) => (
                <ResultsTableRow
                  key={chemicalResult.id}
                  status={chemicalResult.status}
                  theme={theme}
                  text={chemicalResult.name}
                  range={getRange(chemicalResult)}
                  actual={chemicalResult.value}
                  highlighted={index % 2 === 0}
                />
              ))}
            </View>
          </View>
        )}

        {activeOvservationResults.length > 0 && (
          <View style={styles.content}>
            <View style={styles.contentRecommendationsColumn}>
              <Text style={commonStyles.h6}>{t('Observation recommendations')}</Text>
              {activeOvservationResults.map((observationResult: ObservationResult) => {
                return observationResult.show_on_report
                  ? (
                    <RecommendationItem
                      key={observationResult.id}
                      theme={theme}
                      title={observationResult.name}
                      subtitle={observationResult.action}
                      description={observationResult.description}
                    />
                  )
                  : null;
              })}
            </View>
            <View style={styles.contentTestResultsColumn}>
              <Text style={commonStyles.h6}>{t('Observations')}</Text>
              {activeOvservationResults.map((observationResult: ObservationResult, index: number) => (
                <ResultsTableRow
                  key={observationResult.id}
                  theme={theme}
                  text={observationResult.name}
                  highlighted={index % 2 === 0}
                />
              ))}
            </View>
          </View>
        )}

        <View
          fixed
          style={styles.spacer}
        />

        {/* <View style={styles.banner}>
          <Image
            style={styles.bannerImage}
            src={{
              uri: 'https://s3.ap-southeast-2.amazonaws.com/pooltrackr-dev-images/1/campaigns/2021-09-07-03-42-03_6136df8be7a2f_2021-04-29-03-12-59_608a243b0f50b_Smarter-Sticks-Banner.jpeg',
              method: 'GET',
              headers: {
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
              },
              body: '',
            }}
          />
        </View> */}

        <View
          fixed
          style={styles.footer}
        >
          <Text style={[commonStyles.body1, styles.footerText]}>
            {organisationAddress}
            {' '}
            |
            {' '}
            {organisation.email}
            {' '}
            |
            {' '}
            {organisation.company_phone}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

WaterTestPdf.propTypes = {
  // @ts-ignore
  labJob: PropTypes.object.isRequired,
  // @ts-ignore
  pool: PropTypes.object.isRequired,
  // @ts-ignore
  contact: PropTypes.object.isRequired,
  chemicalResults: PropTypes.array,
  observationResults: PropTypes.array,
  // @ts-ignore
  theme: PropTypes.object.isRequired,
  // @ts-ignore
  logo: PropTypes.object,
  // @ts-ignore
  organisation: PropTypes.object.isRequired,
};

export default WaterTestPdf;
