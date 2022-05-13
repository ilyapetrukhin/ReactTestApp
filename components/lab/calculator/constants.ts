export const SALT_TEST = 'Salt';
export const BROMINE_TEST = 'Bromine';
export const BIGUANIDE_TEST = 'Biguanide';
export const TEMPERATURE_TEST = 'Temperature';
export const FREE_CHLORINE_TEST = 'Free Chlorine';
export const TOTAL_CHLORINE_TEST = 'Total Chlorine';
export const COMBINED_CHLORINE_TEST = 'Combined Chlorine';
export const TDS_TEST = 'TDS';
export const PH_TEST = 'pH';
export const CYANURIC_ACID_TEST = 'Cyanuric Acid';
export const TA_TEST = 'Total Alkalinity';
export const TA_ADJ_TEST = 'Tot. Alkalinity (adjusted)';
export const TOTAL_HARDNESS_TEST = 'Total Hardness';
export const MAG_HARDNESS_TEST = 'Magnesium Hardness';
export const CALC_HARDNESS_TEST = 'Calcium Hardness';
export const PHOSPHATES_TEST = 'Phosphates';
export const IRON_TEST = 'Iron';
export const FREE_COPPER_TEST = 'Free Copper';
export const COPPER_TEST = 'Total Copper';
export const BORATES_TEST = 'Borates';
export const OZONE_TEST = 'Ozone';
export const HYDROGEN_PEROXIDE_TEST = 'Hydrogen Peroxide';
export const SULPHATE_TEST = 'Sulphate';
export const NITRATES_TEST = 'Nitrates';
export const LSI_TEST = 'LSI';

export const AUTO_CALCULATED_CHEMICALS = [LSI_TEST, TA_ADJ_TEST, CALC_HARDNESS_TEST, COMBINED_CHLORINE_TEST];

export const CHEMICAL_EXCEPTION_MAPPINGS = [
  { propName: 'pool_sanitisers', exceptionName: 'sanitiser', isArray: true },
  { propName: 'surface_type_id', exceptionName: 'surface' },
  { propName: 'pool_type_id', exceptionName: 'pool_type' },
  { propName: 'classification_id', exceptionName: 'classification' },
  { propName: 'ground_level_id', exceptionName: 'ground_level' },
  { propName: 'location_id', exceptionName: 'location' },
  { propName: 'pool_sanitisers', exceptionName: 'sanitiser' },
  { propName: 'custom_exception_id', exceptionName: 'custom', isCustom: true },
  { exceptionName: 'temperature', isTemp: true },
];

export const DOSAGE_EXCEPTIONS = [
  {
    logicalName: 'Pool Volume',
    conditionalProp: 'pool_volume',
    isValueCompare: true,
    conditionalPropCustom: 'poolVolume',
  },
  { logicalName: 'Pool Type', conditionalProp: 'pool_type_id' },
  { logicalName: 'Classification Type', conditionalProp: 'classification_id' },
  { logicalName: 'Ground Level', conditionalProp: 'ground_level_id' },
  { logicalName: 'Location', conditionalProp: 'location_id' },
  { logicalName: 'Surface Types', conditionalProp: 'surface_type_id' },
  {
    logicalName: 'Pool Sanitiser Classifications',
    conditionalProp: 'pool_sanitisers',
  },
  {
    logicalName: 'ChemicalResult',
    conditionalProp: 'current',
    isValueCompare: true,
    isResultHandler: true,
  },
  { logicalName: 'Pool Sanitisers', conditionalProp: 'pool_sanitisers' },
  {
    logicalName: 'Enabled Checkbox',
    conditionalProp: 'pool_modules',
    conditionalPropCustom: 'poolVolume',
  },
  { logicalName: 'pH reducer', conditionalProp: 'ph_reducer' },
  { logicalName: 'Algaecide' },
  { logicalName: 'Clarifier' },
];

export const UNIT_KG_LTR_CONVERTER = {
  g: 1000,
  mg: 1000000,
  oz: 35.273990723,
  lb: 2.2046244202,
  ml: 1000,
  gal: 0.2641721769,
  qt: 1.0566887074,
  pt: 2.1133774149,
};

export const GOOD_STATUS = 'Good';
export const LOW_STATUS = 'Low';
export const HIGH_STATUS = 'High';
