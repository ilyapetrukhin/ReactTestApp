import React, { FC, memo, Ref, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  useTheme,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  CardActions,
  SelectChangeEvent,
} from '@mui/material';
import {
  Check as CheckIcon,
  AlertCircle as AlertCircleIcon,
} from 'react-feather';
import { Column } from 'src/types/fileImporter';

interface ColumnItemProps {
  innerRef?: Ref<HTMLDivElement>;
  expectedColumns: Column[];
  matchedColumn?: Column;
  header: string;
  rows: string[];

  changeMode: boolean;
  ignored: boolean;
  onChangeColumn: (column: Column) => void;
  onChangeMode: (mode: boolean) => void;
  onToggleIgnore: () => void;
}

const ColumnItem: FC<ColumnItemProps> = memo(
  ({
    innerRef,
    matchedColumn,
    expectedColumns,
    header,
    rows,
    changeMode,
    ignored,
    onChangeMode,
    onChangeColumn,
    onToggleIgnore,
  }) => {
    const theme = useTheme();

    const handleChangeColumn = useCallback(
      (
        event: SelectChangeEvent
      ) => {
        const columnId = event.target.value;
        const column = expectedColumns.find((col) => col.id === columnId);
        onChangeColumn(column);
      },
      [expectedColumns, onChangeColumn]
    );

    const displaySelect = (changeMode || matchedColumn == null) && !ignored;

    return (
      <Box
        px={2}
        ref={innerRef}
      >
        <Card
          sx={{
            width: 300,
            cursor: ignored ? 'not-allowed' : undefined,
            backgroundColor: ignored ? 'action.disabledBackground' : undefined,
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'stretch',
              width: '100%',
              height: 410,
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={3}
            >
              {matchedColumn != null && !ignored && (
                <>
                  <CheckIcon color={theme.palette.success.main} />
                  <Typography sx={{ ml: 2 }}>
                    {matchedColumn.displayName}
                  </Typography>
                </>
              )}
              {matchedColumn == null && !ignored && (
                <>
                  <AlertCircleIcon color={theme.palette.error.main} />
                  <Typography sx={{ ml: 2, color: 'error.main' }}>
                    Unmatched column
                  </Typography>
                </>
              )}
              {ignored && <Typography>Don&apos;t import</Typography>}
            </Box>

            {!changeMode && matchedColumn != null && (
              <Button
                disabled={ignored}
                onClick={() => onChangeMode(true)}
              >
                Change this match?
              </Button>
            )}

            {displaySelect && (
              <>
                <Typography
                  variant="subtitle2"
                  mb={2}
                  textAlign="left"
                  width="100%"
                >
                  {`Import ${header} as`}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Column</InputLabel>
                  <Select
                    label="Column"
                    onClose={() => onChangeMode(false)}
                    onChange={handleChangeColumn}
                    value={matchedColumn?.id}
                    disabled={ignored}
                  >
                    {expectedColumns.map((w) => (
                      <MenuItem
                        value={w.id}
                        key={w.id}
                      >
                        {w.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            <List
              sx={{ width: '100%', overflowY: 'auto', overflowX: 'hidden' }}
            >
              {!displaySelect && (
              <ListItem
                divider
              >
                <Typography
                  variant="subtitle2"
                  mb={2}
                >
                  {header}
                </Typography>
              </ListItem>
              )}
              {rows.map((row, index) => (
                <ListItem
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  divider
                >
                  <ListItemText sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                  >
                    {row || '-'}
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </CardContent>
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2,
            }}
          >
            <Button
              size="small"
              onClick={onToggleIgnore}
            >
              {ignored ? 'Import' : "Don't import"}
            </Button>
          </CardActions>
        </Card>
      </Box>
    );
  }
);

ColumnItem.propTypes = {
  // @ts-ignore
  innerRef: PropTypes.object,
  // @ts-ignore
  expectedColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
  // @ts-ignore
  matchedColumn: PropTypes.object,
  header: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeMode: PropTypes.bool.isRequired,
  ignored: PropTypes.bool.isRequired,

  onChangeMode: PropTypes.func.isRequired,
  onChangeColumn: PropTypes.func.isRequired,
  onToggleIgnore: PropTypes.func.isRequired,
};

export default ColumnItem;
