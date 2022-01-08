import React, { useContext } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import GlobalContext from '../utils/GlobalContext';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MonevSnack = (props) => {
  const { variant, message, opened } = props;
  const { setSnack } = useContext(GlobalContext);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnack({ variant, message, opened: false });
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={opened} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={variant} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default MonevSnack;
