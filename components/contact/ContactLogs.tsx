import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import type { Audit } from 'src/types/audit';
import { apiConfig } from 'src/config';
import { useSelector } from 'src/store';
import { AuditListTable } from '../widgets/audit';

const ContactLogs: FC = (props) => {
  const router = useRouter();
  const { contactId } = router.query;
  const isMountedRef = useIsMountedRef();
  const { organisation } = useSelector((state) => state.account);
  const [logs, setLogs] = useState<Audit[]>([]);

  const getLogs = useCallback(async () => {
    try {
      const response = await axios.get(`${apiConfig.apiV2Url}/organisations/${organisation.id}/contacts/${contactId}/audit`);

      if (isMountedRef.current) {
        setLogs(response.data);
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

export default ContactLogs;
