import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';

const MyLoading = () => {
  return (
    <LinearProgress
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 10000,
      }}
    />
  );
};

export default MyLoading;
