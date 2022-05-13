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
import DownloadIcon from '../../icons/Download';
import TrashIcon from '../../icons/Trash';

const PoolDataManagement: FC = (props) => (
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
        <Button
          color="inherit"
          startIcon={<DownloadIcon fontSize="small" />}
          sx={{ mt: 1 }}
          variant="text"
        >
          Export Data
        </Button>
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
          Remove this pool if he requested that, if not
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
        Delete pool
      </Button>
    </CardContent>
  </Card>
);

export default PoolDataManagement;
