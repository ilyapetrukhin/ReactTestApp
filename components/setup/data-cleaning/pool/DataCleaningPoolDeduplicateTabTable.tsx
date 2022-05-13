import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';

import { Scrollbar } from 'src/components/scrollbar';
import { useSelector } from 'src/store';

import DataCleaningPoolDeduplicateTabTableRowHOC from './DataCleaningPoolDeduplicateTabTableRowHOC';

interface DataCleaningPoolDeduplicateTableProps {
  groupKey: string;
}

const DataCleaningPoolDeduplicateTable: FC<DataCleaningPoolDeduplicateTableProps> = memo(({ groupKey }) => {
  const duplicationGroup = useSelector(
    (state) => state.deduplicatePoolTool.duplicates[groupKey]
  );

  return (
    <Scrollbar>
      {duplicationGroup.poolDuplications.map((contact, index) => (
        <DataCleaningPoolDeduplicateTabTableRowHOC
          key={contact?.pool?.id}
          groupKey={groupKey}
          poolIndex={index}
        />
      ))}
    </Scrollbar>
  );
});

DataCleaningPoolDeduplicateTable.propTypes = {
  groupKey: PropTypes.string.isRequired,
};

export default DataCleaningPoolDeduplicateTable;
