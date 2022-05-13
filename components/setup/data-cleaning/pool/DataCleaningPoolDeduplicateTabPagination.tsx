import React, { FC, memo, useCallback } from 'react';
import { Box, TablePagination } from '@mui/material';

import { setPage, setPageLimit } from 'src/slices/deduplicatePool';
import { useDispatch, useSelector } from 'src/store';

interface DataCleaningContactDeduplicateTabPaginationProps {}

const DataCleaningContactDeduplicateTabPagination: FC<DataCleaningContactDeduplicateTabPaginationProps> = memo(() => {
  const dispatch = useDispatch();
  const { currentPage, pageLimit, duplicatesCount } = useSelector(
    (state) => state.deduplicatePoolTool
  );

  const handleChangePage = useCallback((event, page: number) => {
    dispatch(setPage({ page }));
  }, []);

  const handleLimitChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setPageLimit({ limit: parseInt(event.target.value, 10) }));
    },
    []
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      mt={3}
    >
      <TablePagination
        component="div"
        count={duplicatesCount}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleLimitChange}
        page={currentPage}
        rowsPerPage={pageLimit}
        rowsPerPageOptions={[1, 5, 10, 25]}
      />
    </Box>
  );
});

DataCleaningContactDeduplicateTabPagination.propTypes = {};

export default DataCleaningContactDeduplicateTabPagination;
