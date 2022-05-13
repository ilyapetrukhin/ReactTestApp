import { useState, useEffect } from 'react';
import type { FC } from 'react';
import {
  Box,
  Card, CardHeader, Divider,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@mui/material';
import PropTypes from 'prop-types';
import moment from 'moment';
import { studly } from 'src/utils/string';
import type { Audit } from 'src/types/audit';
import Label from 'src/components/Label';
import MoreMenu from '../../MoreMenu';
import { Scrollbar } from '../../scrollbar';

interface AuditListTableProps {
  audits: Audit[];
}

const AuditListTable: FC<AuditListTableProps> = (props) => {
  const { audits, ...other } = props;
  const [logs, setLogs] = useState<Audit[]>([]);

  useEffect(() => {
    if (audits) {
      const auditRecords = audits.map((auditRecord) => ({
        ...auditRecord,
        description: auditRecord.event === 'created'
          ? 'New entity created'
          : Object.keys(auditRecord.new_values)
            .filter((key) => key !== 'id')
            .map((key) => studly(key, 'true', ' '))
            .join(', ')
      }));

      setLogs(auditRecords);
    }
  }, [audits]);

  return (
    <Card {...other}>
      <CardHeader
        action={<MoreMenu />}
        title="Logs"
      />
      <Divider />
      <Scrollbar>
        <Box sx={{ minWidth: 900 }}>
          <Table {...other}>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell width="64">
                    <Label
                      color={log.event === 'updated'
                        ? 'warning'
                        : 'success'}
                    >
                      {log.event}
                    </Label>
                  </TableCell>
                  <TableCell>
                    {log.user ? `by ${log.user.first_name} ${log.user.last_name}` : 'Unknown user'}
                  </TableCell>
                  <TableCell>
                    {log.description}
                  </TableCell>
                  <TableCell align="right">
                    {log.ip_address}
                  </TableCell>
                  <TableCell align="right">
                    {moment(log.created_at).format('DD MMM YYYY | HH:mm:ss')}
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

AuditListTable.propTypes = {
  // @ts-ignore
  audits: PropTypes.array.isRequired,
};

export default AuditListTable;
