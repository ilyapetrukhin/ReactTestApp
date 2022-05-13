import type { FC } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { RELATION_TYPES } from '../../constants/poolContact';
import { getEntityAddress } from '../../utils/address';
import type { Pool } from '../../types/pool';

interface ContactPoolsPreviewProps {
  pools: Pool[];
}

const ContactPoolsPreview: FC<ContactPoolsPreviewProps> = (props) => {
  const { pools, ...rest } = props;

  return (
    <Card {...rest}>
      <CardHeader title="Linked pools" />
      <Divider />
      <Scrollbar>
        <Box
          sx={{
            maxHeight: {
              lg: 330
            }
          }}
        >
          <Table>
            <TableBody>
              {!pools.length && (
                <TableRow
                  sx={{
                    '&:last-child td': {
                      border: 0
                    }
                  }}
                >
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="caption"
                    >
                      There are no attached pools yet
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {pools.map((pool) => (
                <TableRow
                  key={pool.id}
                  sx={{
                    '&:last-child td': {
                      border: 0
                    }
                  }}
                >
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      sx={{ cursor: 'pointer' }}
                      variant="subtitle2"
                    >
                      { getEntityAddress(pool, 'pool', true) }
                    </Typography>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        mt: 1
                      }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {pool.pool_type.name}
                      </Typography>
                      {pool.name && (
                        <>
                          <Box
                            sx={{
                              height: 4,
                              width: 4,
                              borderRadius: 4,
                              backgroundColor: 'text.secondary',
                              mx: 1
                            }}
                          />
                          <Typography
                            color="textSecondary"
                            variant="body2"
                          >
                            {pool.name}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      label="Relationship to pool"
                      name="contact_link"
                      select
                      disabled
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ native: true, displayEmpty: true }}
                      value={pool.pivot.address_type_id}
                      variant="outlined"
                    >
                      {RELATION_TYPES.map((relationType) => (
                        <option
                          key={relationType.value}
                          value={relationType.value}
                        >
                          {relationType.label}
                        </option>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

ContactPoolsPreview.propTypes = {
  // @ts-ignore
  pools: PropTypes.array.isRequired,
};

export default ContactPoolsPreview;
