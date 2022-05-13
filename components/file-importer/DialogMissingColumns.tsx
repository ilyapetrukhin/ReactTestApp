import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { Column } from 'src/types/fileImporter';

interface DialogMissingColumnsProps {
  missingColumns: Column[];
  onClose: () => void;
}

const DialogMissingColumns: FC<DialogMissingColumnsProps> = memo(
  ({ missingColumns, onClose }) => (
    <Card>
      <CardHeader
        disableTypography
        title={(
          <Typography
            color="testPrimary"
            display="block"
            variant="overline"
          >
            Hold Up! We&apos;re missing important columns
          </Typography>
        )}
        subheader={(
          <Typography
            color="textSecondary"
            display="block"
            variant="overline"
          >
            You can&apos;t continue without these columns. You can go back and try to match them, or download a spreadsheet file with updated headers to add these columns
          </Typography>
        )}
      />
      <Divider />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Column</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          {missingColumns.map((col) => (
            <TableRow>
              <TableCell>{col.displayName}</TableCell>
              <TableCell>{col.description}</TableCell>
            </TableRow>
          ))}
        </Table>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
        >
          Go Back to Match Columns
        </Button>
      </CardActions>
    </Card>
  )
);

DialogMissingColumns.propTypes = {
  // @ts-ignore
  missingColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DialogMissingColumns;
