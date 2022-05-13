import React, { memo, FC, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, useTheme, Typography, IconButton } from '@mui/material';
import { MessageCircle as SmsOutlined } from 'react-feather';

import { filterJobsByTechnicianId } from 'src/slices/jobCalendar';
import { stringToColour, getAcronym } from 'src/utils/string';
import { useDispatch, useSelector } from 'src/store';
import SmsUnread from 'src/icons/SmsUnread';

interface ResourceItemProps {
  id: string;
  title: string;
  minHeight: number;
  unread: boolean;
  hideMessageBtn: boolean;
}

const ResourceItem: FC<ResourceItemProps> = ({
  id,
  title,
  minHeight,
  unread,
  hideMessageBtn,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const selectedId = useSelector(
    (state) => state.jobCalendar.selectedTechnicianId
  );

  const color = useMemo<string>(() => stringToColour(title), [title]);
  const titleAcr = useMemo<string>(() => getAcronym(title), [title]);
  const selected = useMemo(() => selectedId === id, [selectedId]);

  const onClick = useCallback(() => {
    dispatch(filterJobsByTechnicianId(selectedId === id ? null : id));
  }, [selectedId]);

  const onMessageClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: selected ? theme.palette.background.default : null,
        minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        padding: 1.5,
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': {
          backgroundColor: theme.palette.background.default,
        },
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: 1,
          width: '100%',
        }}
      >
        <Avatar
          alt="Remy Sharp"
          sx={{
            backgroundColor: color,
            height: 24,
            width: 24,
          }}
        >
          <Typography variant="body2">{titleAcr}</Typography>
        </Avatar>
        <Typography
          color="textPrimary"
          sx={{
            mx: 2,
            minWidth: 15,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          variant="subtitle2"
        >
          {title}
        </Typography>
        {
          !hideMessageBtn && (
            <IconButton
              onClick={onMessageClick}
              sx={{ ml: 'auto' }}
            >
              {unread && <SmsUnread />}
              {!unread && <SmsOutlined />}
            </IconButton>
          )
        }
      </Box>
    </Box>
  );
};

ResourceItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  minHeight: PropTypes.number.isRequired,
  unread: PropTypes.bool.isRequired,
};

export default memo(ResourceItem);
