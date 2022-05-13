import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  Typography,
  List,
  ListItem,
  ListItemText,
  Theme,
} from '@mui/material';
import { SxProps } from '@mui/system';

interface ColumnDuplicationVariantProps {
  header?: string;
  rows: string[];
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps<Theme>;
}

const ColumnDuplicationVariant: FC<ColumnDuplicationVariantProps> = memo(
  ({ header, rows, checked, onChange, ...other }) => (
    <Card
      raised
      {...other}
    >
      <CardContent sx={{ mx: 2 }}>
        <FormControlLabel
          control={(
            <Radio
              checked={checked}
              onChange={onChange}
              color="primary"
              edge="start"
            />
          )}
          label={(
            <>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {header}
              </Typography>
            </>
          )}
        />
        <List>
          {
            rows.map((row, index) => (
              <ListItem
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                divider
              >
                <ListItemText sx={{
                  display: 'initial',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                >
                  {row}
                </ListItemText>
              </ListItem>
            ))
          }
        </List>
      </CardContent>
    </Card>
  )
);

export default ColumnDuplicationVariant;

ColumnDuplicationVariant.propTypes = {
  header: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.string).isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
