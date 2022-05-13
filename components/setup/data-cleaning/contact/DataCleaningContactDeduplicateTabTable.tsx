import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';

import { Scrollbar } from 'src/components/scrollbar';
import { useSelector } from 'src/store';

import DataCleaningContactDeduplicateTabTableRowHOC from './DataCleaningContactDeduplicateTabTableRowHOC';

interface DataCleaningContactDeduplicateTableProps {
  groupKey: string;
}

const DataCleaningContactDeduplicateTable: FC<DataCleaningContactDeduplicateTableProps> = memo(({ groupKey }) => {
  const duplicationGroup = useSelector(
    (state) => state.deduplicateContactTool.duplicates[groupKey]
  );

  return (
    <Scrollbar>
      {duplicationGroup.contactDuplications.map((contact, index) => (
        <DataCleaningContactDeduplicateTabTableRowHOC
          key={contact?.contact?.id}
          groupKey={groupKey}
          contactIndex={index}
        />
      ))}
    </Scrollbar>
  );
});

DataCleaningContactDeduplicateTable.propTypes = {
  groupKey: PropTypes.string.isRequired,
};

export default DataCleaningContactDeduplicateTable;
