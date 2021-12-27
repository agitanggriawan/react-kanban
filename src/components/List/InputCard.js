import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';

export default function AlertDialog(props) {
  const {
    open,
    setOpen,
    idx,
    handleAddTask,
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
    tag,
    setTag,
  } = props;
  let header;

  switch (idx) {
    case 0:
      header = 'Backlog';
      break;
    case 1:
      header = 'To do';
      break;
    case 2:
      header = 'Doing';
      break;
    case 3:
      header = 'Done';
      break;
    case 4:
      header = 'Check';
      break;

    default:
      break;
  }
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-header"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{header}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid container spacing={2} style={{ marginTop: 0 }}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  id="title"
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  id="description"
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  id="date"
                  label="Date"
                  variant="outlined"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  id="tags"
                  label="Tag"
                  variant="outlined"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleAddTask(title, description, date, tag)}
            autoFocus
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
