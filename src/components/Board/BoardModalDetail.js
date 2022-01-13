import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {
  const { openDetail, setOpenDetail, tempData } = props;

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
          <DialogContentText id="alert-dialog-description">
            <div>{tempData?.description}</div>
            <Typography variant="subtitle2">{tempData?.date}</Typography>
            {tempData?.tags.length
              ? tempData.tags.map((x) => (
                  <>
                    <Chip
                      color="primary"
                      label={x}
                      style={{ color: 'white' }}
                    />
                    &nbsp;
                  </>
                ))
              : null}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
