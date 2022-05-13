import React, { useMemo, useState } from 'react';
import type { ChangeEvent, FC, MouseEvent } from 'react';
import { useSelector } from 'src/store';
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Typography,
  IconButton,
  TablePagination,
} from '@mui/material';
import { Scrollbar } from '../../scrollbar';
import { CombinedTestHistory } from 'src/types/testHistory';
import moment from 'moment/moment';
import { DownloadCloud as DownloadCloudIcon, Send as SendIcon } from 'react-feather';
import HistoryResendModal from 'src/components/lab/HistoryResendModal';

const applyPagination = (
  chemicalHistoryItems: CombinedTestHistory[],
  page: number,
  limit: number
): CombinedTestHistory[] => chemicalHistoryItems
  .slice(page * limit, page * limit + limit);

const WaterTestList: FC = (props) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [isResendModalOpen, setIsResendModalOpen] = useState<boolean>(false);
  const [resendHistoryItem, setResendHistoryItem] = useState<CombinedTestHistory | null>(null);
  const { chemicalHistoryItems } = useSelector((state) => state.poolDetail);
  const chemicalTestColumns: string[] = useMemo(
    () => {
      let res = [];
      if (chemicalHistoryItems.length) {
        const model = chemicalHistoryItems[0];
        if (model && model.results && model.results.length) {
          res = model.results.map((test) => test.name);
        }
      }
      return res;
    },
    [chemicalHistoryItems],
  );

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleResendModalOpen = (historyItem: CombinedTestHistory): void => {
    setResendHistoryItem(historyItem);
    setIsResendModalOpen(true);
  };

  const handleResendModalClose = (): void => {
    setResendHistoryItem(null);
    setIsResendModalOpen(false);
  };

  const paginatedChemicalHistoryItems = applyPagination(chemicalHistoryItems, page, limit);

  return (
    <>
      <Scrollbar {...props}>
        <Box sx={{ minWidth: 900 }}>
          <Table {...props}>
            <TableHead>
              <TableRow>
                <TableCell>
                  Analysis date
                </TableCell>
                {chemicalTestColumns.map((chemicalTestColumn: string) => (
                  <TableCell key={chemicalTestColumn}>
                    {chemicalTestColumn}
                  </TableCell>
                ))}
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedChemicalHistoryItems.map((chemicalHistoryItem: CombinedTestHistory) => (
                <TableRow key={chemicalHistoryItem.id}>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      { moment(chemicalHistoryItem.analysis_date).format('DD MMM YYYY') }
                    </Typography>
                  </TableCell>
                  {chemicalHistoryItem.results.map((result) => (
                    <TableCell key={result.name}>
                      {result.value}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Box
                      display="flex"
                      alignItems="center"
                    >
                      {chemicalHistoryItem.pdf_location && (
                        <IconButton
                          color="primary"
                          href={chemicalHistoryItem.pdf_location}
                          target="_blank"
                        >
                          <DownloadCloudIcon />
                        </IconButton>
                      )}
                      {chemicalHistoryItem.is_from_lab && (
                        <IconButton
                          sx={{
                            color: 'primary.main',
                          }}
                          onClick={() => handleResendModalOpen(chemicalHistoryItem)}
                        >
                          <SendIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={chemicalHistoryItems.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </Scrollbar>
      {resendHistoryItem && (
        <HistoryResendModal
          testHistory={resendHistoryItem}
          onClose={handleResendModalClose}
          open={isResendModalOpen}
        />
      )}
    </>
  );
};

export default WaterTestList;
