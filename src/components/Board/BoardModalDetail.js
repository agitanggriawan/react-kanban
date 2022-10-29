import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

const BoardModalDetail = (props) => {
  const { openDetail, setOpenDetail, tempData, handleDeleteTask } = props;

  const handleClose = () => {
    setOpenDetail(false);
  };

  return (
    <div>
      <Dialog
        open={openDetail}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{tempData?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: 'black' }}
          >
            <Typography variant="subtitle2">Due Date</Typography>
            <Typography variant="body2">
              {dayjs(tempData?.date).format('DD - MM - YYYY')}
            </Typography>
            <Typography variant="subtitle2">Description</Typography>
            <Typography variant="body2">{tempData?.description}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteTask(tempData?.id)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BoardModalDetail;
