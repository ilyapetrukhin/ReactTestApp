import type { FC } from 'react';
// import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { Avatar, Card, Link, Typography } from '@mui/material';
import CurrencyDollarIcon from 'src/icons/CurrencyDollar';
import DownloadIcon from 'src/icons/Download';
import TemplateIcon from 'src/icons/Template';
import UserAddIcon from 'src/icons/UserAdd';

interface JobActivityProps {
  createdAt: number;
  description: string;
  subject: string;
  type: string;
}

const avatarsMap = {
  upload_file: DownloadIcon,
  join_team: UserAddIcon,
  price_change: CurrencyDollarIcon,
  contest_created: TemplateIcon
};

const JobActivity: FC<JobActivityProps> = (props) => {
  const {
    createdAt,
    description,
    subject,
    type,
    ...other
  } = props;

  const Icon = avatarsMap[type];

  return (
    <Card
      sx={{
        alignItems: 'center',
        display: 'flex',
        p: 2,
        '& + &': {
          mt: 2
        }
      }}
      {...other}
    >
      <Avatar
        sx={{
          backgroundColor: 'primary.main',
          color: 'common.white'
        }}
      >
        <Icon fontSize="small" />
      </Avatar>
      <Typography
        color="textPrimary"
        sx={{ ml: 2 }}
        variant="body2"
      >
        <Link
          color="textPrimary"
          variant="subtitle2"
        >
          {subject}
        </Link>
        {' '}
        {description}
      </Typography>
      <Typography
        color="textPrimary"
        sx={{ ml: 'auto' }}
        variant="caption"
      >
        {formatDistanceToNowStrict(createdAt)}
        {' '}
        ago
      </Typography>
    </Card>
  );
};

JobActivity.propTypes = {
  createdAt: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default JobActivity;
