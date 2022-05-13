import React, {
  FC,
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from 'react-feather';
import { Box, Button, Dialog, Typography } from '@mui/material';
import debounce from 'lodash/debounce';
import {
  reset,
  setColumnsInfoAroundViewPort,
  setColumnHeaderToChange,
  toggleIgnore,
  tryToSetColumnMatch,
} from 'src/slices/fileImporter';
import { useDispatch, useSelector } from 'src/store';
import { Column } from 'src/types/fileImporter';

import { Scrollbar } from '../scrollbar';
import ColumnItem from './ColumnItem';
import DialogColumnDuplication from './DialogColumnDuplication';
import DialogMissingClumns from './DialogMissingColumns';

interface ImporterProps {}

interface ImporterNavigationHook {
  onScroll: () => void;

  firstColumnRef: MutableRefObject<HTMLDivElement>;
  scrollableContainerRef: MutableRefObject<HTMLElement>;
}

function useImporterNavigation(): ImporterNavigationHook {
  const dispatch = useDispatch();

  const firstColumnRef = useRef<HTMLDivElement>();
  const scrollableContainerRef = useRef<HTMLElement>();

  const { matchedColumns, ignoredColumnHeaders } = useSelector(
    (state) => state.fileImporter
  );

  const onScroll = useMemo(
    () => debounce(() => {
      const visibleWidth = scrollableContainerRef.current?.getBoundingClientRect()?.width;
      const leftScroll = scrollableContainerRef.current?.scrollLeft;
      const columnWidth = firstColumnRef.current?.clientWidth;

      if (visibleWidth == null || leftScroll == null || columnWidth == null) {
        return;
      }

      const startVisibleIndex = Math.floor(leftScroll / columnWidth);
      const visibleItems = Math.ceil(visibleWidth / columnWidth);
      const endVisibleIndex = startVisibleIndex + visibleItems;
      const cols = Object.keys(matchedColumns);

      let leftCount = 0;
      let rightCount = 0;
      let leftFirstUnmatchedColumnIndex;
      let rightFirstUnmatchedColumnIndex;

      cols.forEach((colName, index) => {
        const col = matchedColumns[colName];
        const ignored = ignoredColumnHeaders.includes(colName);

        if (col == null && !ignored && index < startVisibleIndex) {
          leftCount += 1;
          leftFirstUnmatchedColumnIndex = leftFirstUnmatchedColumnIndex || index;
        }

        if (col == null && !ignored && index >= endVisibleIndex) {
          rightCount += 1;
          rightFirstUnmatchedColumnIndex = rightFirstUnmatchedColumnIndex || index;
        }
      });

      dispatch(
        setColumnsInfoAroundViewPort({
          unmatchedColumnsCountOnTheLeftOfViewPort: leftCount,
          unmatchedColumnsCountOnTheRightOfViewPort: rightCount,
          leftFirstUnmatchedColumnIndex,
          rightFirstUnmatchedColumnIndex,
        })
      );
    }, 100),
    [matchedColumns, ignoredColumnHeaders]
  );

  useEffect(() => {
    const id = setTimeout(() => {
      onScroll();
    }, 300);
    return () => clearTimeout(id);
  }, [onScroll]);

  return {
    onScroll,

    firstColumnRef,
    scrollableContainerRef,
  };
}

const Importer: FC<ImporterProps> = memo(() => {
  const dispatch = useDispatch();
  const [missingColumnsDialogOpened, setMissingColumnsDialogOpened] = useState(false);

  const { firstColumnRef, scrollableContainerRef, onScroll } = useImporterNavigation();
  const {
    expectedColumns,

    fileName,
    parsedRows,

    unmatchedColumnsCountOnTheLeftOfViewPort,
    unmatchedColumnsCountOnTheRightOfViewPort,
    leftFirstUnmatchedColumnIndex,
    rightFirstUnmatchedColumnIndex,

    matchedColumns,
    ignoredColumnHeaders,

    changingColumnHeader,
  } = useSelector((state) => state.fileImporter);

  const onCancel = useCallback(() => {
    dispatch(reset());
  }, []);

  const handleChangeColumnMatch = useCallback(
    (fileColumnHeader: string, column: Column) => {
      dispatch(
        tryToSetColumnMatch(
          column,
          fileColumnHeader,
          parsedRows,
          matchedColumns
        )
      );
    },
    [parsedRows, matchedColumns]
  );

  const handleSetColumnHeaderToChange = useCallback(
    (fileColumnHeader: string, changeMode: boolean) => {
      dispatch(
        setColumnHeaderToChange({
          fileColumnHeader: changeMode ? fileColumnHeader : null,
        })
      );
    },
    []
  );

  const handleToggleIgnoreColumn = useCallback(
    (fileColumnHeader: string) => {
      dispatch(toggleIgnore({ fileColumnHeader }));
    },
    [ignoredColumnHeaders, matchedColumns]
  );

  const handleCloseMissingColumnsDialog = useCallback(() => {
    setMissingColumnsDialogOpened(false);
  }, []);

  const handleGoLeft = useCallback(() => {
    const x = leftFirstUnmatchedColumnIndex * firstColumnRef.current.clientWidth;
    scrollableContainerRef.current.scrollTo({ left: x, behavior: 'smooth' });
  }, [leftFirstUnmatchedColumnIndex]);

  const handleGoRight = useCallback(() => {
    const x = rightFirstUnmatchedColumnIndex * firstColumnRef.current.clientWidth;
    scrollableContainerRef.current.scrollTo({ left: x, behavior: 'smooth' });
  }, [rightFirstUnmatchedColumnIndex]);

  const unmatchedCount = useMemo(
    () => Object.keys(matchedColumns).reduce(
      (sum, columnHeader) => (matchedColumns[columnHeader] == null
          && !ignoredColumnHeaders.includes(columnHeader)
        ? sum + 1
        : sum),
      0
    ),
    [matchedColumns, ignoredColumnHeaders]
  );

  const missingColumns = useMemo(() => {
    const cols = Object.values(matchedColumns);

    return expectedColumns.filter((col) => {
      if (!col.required) {
        return false;
      }

      const fileColumnHeader = Object.keys(matchedColumns).find((header) => matchedColumns[header]?.id === col.id);

      return !cols.includes(col) || ignoredColumnHeaders.includes(fileColumnHeader);
    });
  }, [matchedColumns, ignoredColumnHeaders, expectedColumns]);

  const handleImport = useCallback(() => {
    if (missingColumns.length > 0) {
      setMissingColumnsDialogOpened(true);
    } else {
      // eslint-disable-next-line no-alert
      alert('done');
    }
  }, [missingColumns]);

  return (
    <Box>
      {unmatchedCount === 0 && (
        <Typography
          textAlign="center"
          mb={1}
        >
          All matched! Ready for us to check the product information?
        </Typography>
      )}
      {unmatchedCount !== 0 && (
        <Typography
          textAlign="center"
          mb={1}
        >
          There are
          {' '}
          {unmatchedCount}
          {' '}
          columns that are not matched in &apos;
          {fileName}
          &apos;
        </Typography>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        mb={4}
      >
        <Button
          variant="contained"
          sx={{
            visibility:
              unmatchedColumnsCountOnTheLeftOfViewPort > 0
                ? 'visible'
                : 'hidden',
          }}
          onClick={handleGoLeft}
        >
          <ChevronLeftIcon />
          {unmatchedColumnsCountOnTheLeftOfViewPort}
          {' '}
          more
        </Button>
        <Button
          variant="contained"
          sx={{
            visibility:
              unmatchedColumnsCountOnTheRightOfViewPort > 0
                ? 'visible'
                : 'hidden',
          }}
          onClick={handleGoRight}
        >
          {unmatchedColumnsCountOnTheRightOfViewPort}
          {' '}
          more
          <ChevronRightIcon />
        </Button>
      </Box>

      <Scrollbar
        // @ts-ignore
        containerRef={(el) => (scrollableContainerRef.current = el)}
        onScroll={onScroll}
      >
        <Box
          display="flex"
          pb={2}
        >
          {Object.keys(matchedColumns).map((header, index) => (
            <ColumnItem
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              innerRef={index === 0 ? firstColumnRef : null}
              expectedColumns={expectedColumns}
              matchedColumn={matchedColumns[header]}
              rows={parsedRows.map((row) => row[header])}
              changeMode={header === changingColumnHeader}
              ignored={ignoredColumnHeaders.includes(header)}
              header={header}
              onChangeColumn={(column) => handleChangeColumnMatch(header, column)}
              onChangeMode={(changeMode) => handleSetColumnHeaderToChange(header, changeMode)}
              onToggleIgnore={() => handleToggleIgnoreColumn(header)}
            />
          ))}
        </Box>
      </Scrollbar>
      <Box
        display="flex"
        justifyContent="flex-end"
        mt={1}
      >
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleImport}
        >
          {unmatchedCount === 0 ? 'Continue' : 'Continue anyway'}
        </Button>
      </Box>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={missingColumnsDialogOpened}
        onClose={handleCloseMissingColumnsDialog}
      >
        <DialogMissingClumns
          missingColumns={missingColumns}
          onClose={handleCloseMissingColumnsDialog}
        />
      </Dialog>
      <DialogColumnDuplication />
    </Box>
  );
});

Importer.propTypes = {};

export default Importer;
