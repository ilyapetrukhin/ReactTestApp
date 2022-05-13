import type { FC } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Typography
} from '@mui/material';
import { CSVLink } from 'react-csv';
import DownloadIcon from '../../icons/Download';
import TrashIcon from '../../icons/Trash';

const csvData = [
  ['First name', 'Last name', 'email'],
  ['John', 'Doe', 'john.doe@doe.com'],
];

const ContactDataManagement: FC = (props) => (
  <Card {...props}>
    <CardHeader title="Data Management" />
    <Divider />
    <CardContent>
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CSVLink
          style={{ textDecoration: 'none', color: 'inherit' }}
          filename="ContactDetails.csv"
          data={csvData}
        >
          <Button
            color="inherit"
            startIcon={<DownloadIcon fontSize="small" />}
            variant="text"
          >
            Export Data
          </Button>
        </CSVLink>
      </Box>
      <Box
        sx={{
          mb: 2,
          mt: 1
        }}
      >
        <Typography
          color="textSecondary"
          variant="body2"
        >
          Remove this contact if he requested that, if not
          please be aware that what has been deleted can never brought
          back
        </Typography>
      </Box>
      <Button
        startIcon={<TrashIcon fontSize="small" />}
        sx={{
          backgroundColor: 'error.main',
          color: 'error.contrastText',
          '&:hover': {
            backgroundColor: 'error.dark'
          }
        }}
        variant="contained"
      >
        Delete contact
      </Button>
    </CardContent>
  </Card>
);

export default ContactDataManagement;
