import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Edit as EditIcon } from 'react-feather';
import toast from 'react-hot-toast';
import {
  Box,
  Card,
  CardProps,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import moment from 'moment';

import { Scrollbar } from 'src/components/scrollbar';
import ManageEntityModal, {
  ManageEntityType,
} from 'src/components/widgets/modals/ManageEntityModal';
import { ERROR_STATUSES } from 'src/constants/sms';
import EmailIcon from 'src/icons/Email';
import {
  FILTER_STATUS_ALL,
  FILTER_STATUS_DELIVERED,
  FILTER_STATUS_FAILED,
  FILTER_STATUS_QUEUED,
  FILTER_STATUS_SENT,
  FILTER_STATUS_UNDELIVERED,
  getSentSMS,
  resendSms,
  reset,
  setLimit,
  setPage,
  setResendStatusMessage,
  setStatusFilter,
  StatusFilter,
  updatePhoneNumber,
} from 'src/slices/sentSms';
import { useDispatch, useSelector } from 'src/store';
import { Sms } from 'src/types/sms';

import CardHeaderRemainingSms from '../CardHeaderRemainingSms';
import SmsSentStatusLabel from './SmsSentStatusLabel';
import type { SelectChangeEvent } from '@mui/material/Select';

interface SmsSentListTableProps extends CardProps {}

interface StatusFilterInfo {
  label: string;
  value: StatusFilter;
}

const MAP_SMS_TYPE_TO_TEXT = {
  tech_on_the_way: 'Tech on the way',
  job_complete: 'Job complete',
  booking_reminder: 'Reminder',
  booking: 'booking changed',
};

const PAGE_OFFSET_FROM_ZERO = 1;

const STATUS_FILTERS: StatusFilterInfo[] = [
  {
    label: 'All statuses',
    value: FILTER_STATUS_ALL,
  },
  {
    label: 'Delivered',
    value: FILTER_STATUS_DELIVERED,
  },
  {
    label: 'Undelivered',
    value: FILTER_STATUS_UNDELIVERED,
  },
  {
    label: 'Queued',
    value: FILTER_STATUS_QUEUED,
  },
  {
    label: 'Sent',
    value: FILTER_STATUS_SENT,
  },
  {
    label: 'Failed',
    value: FILTER_STATUS_FAILED,
  },
];

const SmsSentListTable: FC<SmsSentListTableProps> = (props) => {
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [smsEditingModel, setSmsEditingModel] = useState<ManageEntityType | null>(null);
  const isEditModalOpen = smsEditingModel != null;

  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const {
    isLoading,
    limit,
    page,
    total,
    statusFilter,
    sms,
    resendStatusMessage,
    isResending,
  } = useSelector((state) => state.sentSms);

  const handleEdit = useCallback((sms: Sms) => {
    setSmsEditingModel({ id: sms.id, name: sms.phone_number, mode: 'edit' });
  }, []);

  const handleEditModalClose = useCallback(() => setSmsEditingModel(null), []);

  const handleResend = useCallback(
    async (sms: Sms) => {
      const confirmed = await confirm({
        description: `Are you sure you want to resend this notification message to ${sms.phone_number}?`,
        confirmationText: 'Yes',
        cancellationText: 'No',
      })
        .then(() => true)
        .catch(() => false);

      if (confirmed) {
        const loadingToastId = toast.loading(
          `Resending to ${sms.phone_number}`
        );
        try {
          await dispatch(resendSms(organisationId, sms.id));
        } finally {
          toast.remove(loadingToastId);
        }
      }
    },
    [organisationId]
  );

  const handlePageChange = useCallback(
    (event: React.SyntheticEvent, newPage: number): void => {
      dispatch(setPage({ page: newPage + PAGE_OFFSET_FROM_ZERO }));
    },
    []
  );

  const handleLimitChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      dispatch(setLimit({ limit: parseInt(event.target.value, 10) }));
    },
    []
  );

  const handleChangeStatusFilter = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      dispatch(setStatusFilter({ status: event.target.value }));
    },
    []
  );

  const handleUpdatePhoneNumber = useCallback(
    async (entity: ManageEntityType) => {
      await dispatch(updatePhoneNumber(organisationId, entity.id, entity.name));
    },
    [organisationId]
  );

  useEffect(
    () => () => {
      dispatch(reset());
    },
    []
  );

  useEffect(() => {
    if (resendStatusMessage != null) {
      toast.success(resendStatusMessage);
      dispatch(setResendStatusMessage({ message: null }));
    }
  }, [resendStatusMessage]);

  useEffect(
    () => dispatch(getSentSMS(organisationId, limit, page, statusFilter)),
    [organisationId, limit, page, statusFilter]
  );

  return (
    <>
      {isEditModalOpen && (
        <ManageEntityModal
          title="phone number"
          entity={smsEditingModel}
          onSubmit={handleUpdatePhoneNumber}
          onClose={handleEditModalClose}
          open={isEditModalOpen}
          inputLabel="Phone number"
          placeholder="Enter phone number"
          nameAttr="phone"
        />
      )}
      <Card {...props}>
        <CardHeaderRemainingSms />
        <Divider />
        {isLoading && <LinearProgress />}
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            m: -1,
            p: 2,
          }}
        >
          <Box
            sx={{
              m: 1,
              mr: 2,
              maxWidth: '100%',
              width: 500,
            }}
          >
            <FormControl
              variant="outlined"
              sx={{
                minWidth: 150,
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                onChange={handleChangeStatusFilter}
                value={statusFilter}
                size="small"
                label="Status"
              >
                {STATUS_FILTERS.map((filter) => (
                  <MenuItem
                    key={filter.value}
                    value={filter.value}
                  >
                    {filter.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box flexGrow={1} />
        </Box>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Contact</TableCell>
                  <TableCell>Number</TableCell>
                  <TableCell>SMS type</TableCell>
                  <TableCell>Send time</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sms.map((smsItem) => (
                  <TableRow key={smsItem.id}>
                    <TableCell>{smsItem.contact?.data?.full_name}</TableCell>
                    <TableCell>{smsItem.phone_number}</TableCell>
                    <TableCell>{MAP_SMS_TYPE_TO_TEXT[smsItem.type]}</TableCell>
                    <TableCell>
                      {moment(smsItem.send_date).format('MMM DD YYYY')}
                    </TableCell>
                    <TableCell align="center">
                      <SmsSentStatusLabel status={smsItem.status} />
                    </TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                      >
                        <IconButton
                          sx={{
                            color: 'primary.main',
                          }}
                          onClick={() => handleEdit(smsItem)}
                        >
                          <EditIcon />
                        </IconButton>
                        {ERROR_STATUSES.includes(smsItem.status) && (
                          <IconButton
                            disabled={isResending}
                            sx={{
                              color: 'primary.main',
                            }}
                            onClick={() => handleResend(smsItem)}
                          >
                            <EmailIcon />
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
              count={total}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page - PAGE_OFFSET_FROM_ZERO}
              rowsPerPage={limit}
              rowsPerPageOptions={[10, 20, 50, 100]}
            />
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

SmsSentListTable.propTypes = {};

export default SmsSentListTable;
