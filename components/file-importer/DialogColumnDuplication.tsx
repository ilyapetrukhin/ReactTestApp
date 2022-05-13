import React, { FC, memo, useCallback } from 'react';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

import {
  cancelDuplicationIssue,
  resolveDuplicationIssue,
  setSelectedHeaderToResolve,
} from 'src/slices/fileImporter';
import { useDispatch, useSelector } from 'src/store';

import ColumnDuplicationVariant from './ColumnDuplicationVariant';

interface DialogColumnDuplicationProps {}

const DialogColumnDuplication: FC<DialogColumnDuplicationProps> = memo(() => {
  const dispatch = useDispatch();
  const {
    issuedDuplicationHeaderA,
    issuedDuplicationHeaderB,
    issuedDuplicationColumn,
    selectedHeaderToResolve,
    issuedDuplicationRowsA,
    issuedDuplicationRowsB,
  } = useSelector((state) => state.fileImporter);

  const handleResolve = useCallback(() => {
    dispatch(resolveDuplicationIssue());
  }, []);

  const handleClose = useCallback(() => {
    dispatch(cancelDuplicationIssue());
  }, []);

  const handleChangeToColumnA = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        dispatch(
          setSelectedHeaderToResolve({
            headerName: issuedDuplicationHeaderA,
          })
        );
      }
    },
    [issuedDuplicationHeaderA]
  );

  const handleChangeToColumnB = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        dispatch(
          setSelectedHeaderToResolve({
            headerName: issuedDuplicationHeaderB,
          })
        );
      }
    },
    [issuedDuplicationHeaderB]
  );

  return (
    <Dialog
      open={issuedDuplicationColumn != null}
      scroll="body"
      onClose={handleClose}
    >
      <Card>
        <CardHeader
          disableTypography
          title={(
            <Typography
              color="testPrimary"
              display="block"
              variant="overline"
            >
              {`Hold up! You can't import two columns as “${issuedDuplicationColumn?.displayName}”.`}
            </Typography>
          )}
          subheader={(
            <Typography
              color="textSecondary"
              display="block"
              variant="overline"
            >
              {`Please choose which column to import as “${issuedDuplicationColumn?.displayName}”:`}
            </Typography>
          )}
        />
        <Divider />
        <CardContent
          sx={{
            alignItems: 'center',
            display: 'flex',
            p: 2,
            minWidth: 600
          }}
        >
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sm={6}
            >
              <ColumnDuplicationVariant
                checked={
                  selectedHeaderToResolve === issuedDuplicationHeaderA
                }
                header={issuedDuplicationHeaderA}
                rows={issuedDuplicationRowsA}
                onChange={handleChangeToColumnA}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
            >
              <ColumnDuplicationVariant
                checked={
                  selectedHeaderToResolve === issuedDuplicationHeaderB
                }
                header={issuedDuplicationHeaderB}
                rows={issuedDuplicationRowsB}
                onChange={handleChangeToColumnB}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleResolve}
          >
            Confirm
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  );
});

DialogColumnDuplication.propTypes = {};

export default DialogColumnDuplication;
