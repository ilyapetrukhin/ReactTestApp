import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Card, Alert } from '@mui/material';

import { promisifyPapaParse, transformExcelDataToReadableArray } from 'src/utils/import';

import Importer from './Importer';
import { Column, ParsedRow } from 'src/types/fileImporter';
import { useSelector, useDispatch } from 'src/store';
import { parseFile, reset, setExpectedColumns, setError } from 'src/slices/fileImporter';
import FileDropzone from '../FileDropzone';
import readXlsxFile from 'read-excel-file';

interface FileImporterProps {
  title: string;
  expectedColumns: Column[];
  onConfirm: (rows: any[]) => void;
}

const FileImporter: FC<FileImporterProps> = memo(({ title, expectedColumns }) => {
  const dispatch = useDispatch();
  const [loadedFile, setLoadedFile] = useState<File | null>(null);
  const { parsedRows, error } = useSelector((state) => state.fileImporter);

  const handleSelectFile = useCallback(async ([file]: File[]) => {
    let result;
    setLoadedFile(file);
    dispatch(setError({ error: null }));
    try {
      if (file.type === 'text/csv') {
        result = await promisifyPapaParse(file, {
          skipEmptyLines: true,
          header: true,
          fastMode: true,
          preview: 4,
        });
      } else {
        const xlsxFileResult = await readXlsxFile(file, {});
        result = {
          data: transformExcelDataToReadableArray(xlsxFileResult, 4)
        };
      }
      dispatch(
        parseFile({
          fileName: file.name,
          parsedRows: result.data as ParsedRow[],
        })
      );
      console.log(loadedFile);
    } catch (e) {
      dispatch(setError({ error: e.message }));
    }
  }, []);

  useEffect(() => {
    dispatch(setExpectedColumns({ expectedColumns }));
  }, [expectedColumns]);

  useEffect(
    () => () => {
      dispatch(reset());
    },
    []
  );

  const fileLoaded = parsedRows.length !== 0;

  return (
    <>
      {fileLoaded && (
        <Importer />
      )}
      {!fileLoaded && (
        <Card sx={{ p: 3 }}>
          {error && (
            <Box pb={2}>
              <Alert severity="error">
                This is an error alert — check it out!
              </Alert>
            </Box>
          )}
          <FileDropzone
            title={title}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            maxFiles={1}
            onDrop={handleSelectFile}
          />
        </Card>
      )}
    </>
  );
});

FileImporter.propTypes = {
  title: PropTypes.string.isRequired,
  // @ts-ignore
  expectedColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  onConfirm: PropTypes.func.isRequired,
};

export default FileImporter;
