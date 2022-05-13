import React, { FC, memo, useCallback, useMemo } from 'react';

import PropTypes from 'prop-types';
import {
  Chip,
  Popover,
  Typography,
  Box,
  Divider,
  SvgIcon,
} from '@mui/material';
import {
  MessageCircle as MessageCircleIcon,
  RefreshCcw as RefreshCcwIcon,
  FileText as FileTextIcon
} from 'react-feather';
import { format, utcToZonedTime } from 'date-fns-tz';
import PhoneIcon from 'src/icons/Phone';
import StickyNoteIcon from 'src/icons/StickyNote';
import { useRouter } from 'next/router';
import { isEmpty } from 'src/utils/string';

interface EventProps {
  eventId: string;
  title: string;
  timezone: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  contactName?: string;
  fullAddress?: string;
  phones: string[];
  recurrenceIc?: boolean;
  messageIc: boolean;
  color?: string;
}

function renderTextWithIcon(Icon: typeof SvgIcon, text: string) {
  return (
    <>
      <Divider />
      <Box
        mt={1}
        mb={1}
        display="flex"
        alignItems="center"
      >
        <Icon fontSize="small" />
        <Typography
          variant="subtitle2"
          sx={{
            ml: 1,
          }}
        >
          {text}
        </Typography>
      </Box>
    </>
  );
}

function renderPhones(phones: string[]) {
  return (
    <Box
      mt={1}
      mb={1}
    >
      {phones.map((phone) => (
        <Chip
          key={phone}
          icon={<PhoneIcon fontSize="small" />}
          label={phone}
          sx={{ mr: 1 }}
          variant="outlined"
        />
      ))}
    </Box>
  );
}

const EventItem: FC<EventProps> = ({
  eventId,
  title,
  contactName,
  fullAddress,
  startTime,
  endTime,
  timezone,
  phones,
  recurrenceIc,
  messageIc,
  notes,
  color,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();
  const open = Boolean(anchorEl);

  const handlePopoverOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onClick = useCallback(
    () => router.push(`/jobs/${eventId}`),
    [eventId]
  );

  const timeStr = useMemo(
    () => `${format(utcToZonedTime(startTime, timezone), 'h:mm a')} - ${format(
      utcToZonedTime(endTime, timezone),
      'h:mm a'
    )}`,
    [startTime, endTime]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        maxHeight: 70,
      }}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
      onClick={onClick}
    >
      {color != null && (
        <Box
          sx={{
            width: 8,
            backgroundColor: color,
          }}
        />
      )}

      <Box
        sx={{
          width: '100%',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          p: 0.6,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            ml: 1,
            float: 'right',
          }}
        >
          {recurrenceIc && (
            <Box
              mb={0.1}
            >
              <RefreshCcwIcon
                size={16}
              />
            </Box>
          )}
          {messageIc && (
            <Box
              mb={0.1}
            >
              <MessageCircleIcon
                size={16}
              />
            </Box>
          )}
          {!isEmpty(notes) && (
            <Box
              mb={0.1}
            >
              <FileTextIcon
                size={16}
              />
            </Box>
          )}
        </Box>
        {!isEmpty(contactName) && (
        <>
          <Typography
            variant="body2"
            color="common.white"
            component="span"
          >
            {contactName}
          </Typography>
          <br />
        </>
        )}
        {fullAddress != null && (
          <>
            <Typography
              variant="body2"
              color="common.white"
              component="span"
            >
              {fullAddress}
            </Typography>
            <br />
          </>
        )}
        <Typography
          variant="body2"
          color="common.white"
          component="span"

        >
          {title}
        </Typography>
        <Popover
          sx={{
            zIndex: 10000,
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            sx: {
              p: 1,
            },
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography fontWeight="fontWeightBold">{timeStr}</Typography>
          <Typography>{title}</Typography>
          <Typography
            color="textPrimary"
            variant="body2"
          >
            {contactName}
          </Typography>
          <Typography
            color="textPrimary"
            variant="body2"
          >
            {fullAddress}
          </Typography>
          {renderPhones(phones)}

          {notes != null && renderTextWithIcon(StickyNoteIcon, notes)}
        </Popover>
      </Box>
    </Box>
  );
};

EventItem.propTypes = {
  eventId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  startTime: PropTypes.instanceOf(Date),
  endTime: PropTypes.instanceOf(Date),
  contactName: PropTypes.string,
  fullAddress: PropTypes.string,
  phones: PropTypes.arrayOf(PropTypes.string).isRequired,
  recurrenceIc: PropTypes.bool.isRequired,
  messageIc: PropTypes.bool.isRequired,
  notes: PropTypes.string,
};

export default memo(EventItem);
