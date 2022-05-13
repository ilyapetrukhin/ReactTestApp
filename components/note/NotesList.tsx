/* eslint-disable */
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  Typography
} from '@mui/material';
import type { Note } from '../../types/note';
import SearchIcon from "../../icons/Search";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PlusIcon from "../../icons/Plus";
import {format} from "date-fns";

interface NotesListProps {
  notes: Note[];
}

const NotesList: FC<NotesListProps> = (props) => {
  const { notes, ...other } = props;

  return (
    <Card {...props}>
      <CardHeader title="Notes" />
      <Divider />
      <Box
        p={3}
        pb={0}
      >
        <TextField
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          placeholder="Search notes"
          variant="outlined"
        />
      </Box>
      <CardActions>
        <Button
          color="primary"
          startIcon={<PlusIcon fontSize="small" />}
          variant="text"
        >
          Add note
        </Button>
        <Button
          color="primary"
          startIcon={<AttachFileIcon fontSize="small" />}
          variant="text"
        >
          Add attachment
        </Button>
      </CardActions>
      <Divider />
      <CardContent>
        {notes.length > 0 && (
          <List>
            {notes.map((note) => (
              <ListItem
                disableGutters
                key={note.id}
              >
                {/*<ListItemAvatar>*/}
                {/*  <Avatar src={member.avatar}>*/}
                {/*    {getInitials(member.name)}*/}
                {/*  </Avatar>*/}
                {/*</ListItemAvatar>*/}
                <ListItemText
                  primary={(
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      {note.title}
                    </Typography>
                  )}
                  secondary={(
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      {note.description}
                    </Typography>
                  )}
                />
              </ListItem>
            ))}
          </List>
        )}
        {notes.length === 0 && (
          <Typography
            color="textSecondary"
            noWrap
            variant="caption"
          >
            There is no attached notes
          </Typography>
        )}
      </CardContent>
      {/*<Typography*/}
      {/*  color="textSecondary"*/}
      {/*  noWrap*/}
      {/*  variant="caption"*/}
      {/*>*/}
      {/*  {format(new Date(), 'dd MMM yyyy')}*/}
      {/*</Typography>*/}
      <Divider />
    </Card>
  );
};

NotesList.propTypes = {
  notes: PropTypes.array.isRequired
};

export default NotesList;
