import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import axios from 'axios';
import { studly } from 'src/utils/string';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import type { Audit } from '../../types/audit';
import { apiConfig } from '../../config';
import { useSelector } from '../../store';
import { AuditListTable } from '../widgets/audit';
import { useRouter } from 'next/router';

const PoolLogs: FC = (props) => {
  const router = useRouter();
  const { poolId } = router.query;
  const isMountedRef = useIsMountedRef();
  const { organisation } = useSelector((state) => state.account);
  const [logs, setLogs] = useState<Audit[]>([]);

  const getLogs = useCallback(async () => {
    try {
      const response = await axios.get(`${apiConfig.apiV2Url}/organisations/${organisation.id}/pools/${poolId}/audit`);

      const auditRecords = response.data.map((auditRecord) => ({
        ...auditRecord,
        description: Object.keys(auditRecord.new_values)
          .filter((key) => key !== 'id')
          .map((key) => studly(key, 'true', ' '))
          .join(', ')
      }));

      console.log(auditRecords);

      if (isMountedRef.current) {
        setLogs(auditRecords);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  return (
    <AuditListTable
      audits={logs}
      {...props}
    />
  );
};

export default PoolLogs;
