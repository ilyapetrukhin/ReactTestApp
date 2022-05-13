/* eslint-disable */
import React, { useState } from 'react';
import type { ChangeEvent, FC } from 'react';
import {Box, Grid, IconButton, Typography} from '@mui/material';
import CogIcon from 'src/icons/Cog';
import PencilAltIcon from 'src/icons/PencilAlt';
import type { Contact } from 'src/types/chat';
import { Scrollbar } from 'src/components/scrollbar';
import {useSelector} from "../../store";
import JobSummary from "./JobSummary";

const JobSidebar: FC = () => {
  const { jobTemplate } = useSelector((state) => state.jobDetail);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        flexDirection: 'column',
        maxWidth: '100%',
        width: 300
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: 64,
          px: 2
        }}
      >
        <Box
          sx={{
            display: {
              xs: 'none',
              md: 'block'
            }
          }}
        >
          <Typography
            color="textPrimary"
            variant="h5"
          >
            Chats
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton>
            <CogIcon fontSize="small" />
          </IconButton>
        </Box>
        <IconButton>
          <PencilAltIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: {
            xs: 'none',
            md: 'block'
          }
        }}
      >
        <JobSummary schedule="" />
      </Box>
    </Box>
  );
};

export default JobSidebar;
