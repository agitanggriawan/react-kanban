import React from 'react';
import { TextField, Paper, Button } from '@mui/material';

const InputCard = (props) => {
  const { closeHandler, keyDownHandler } = props;
  const divRef = React.useRef(null);

  React.useEffect(() => {
    if (divRef.current != null) {
      divRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  });

  const handleBlur = () => {
    closeHandler();
  };

  return (
    <div>
      <Paper>
        <TextField
          multiline
          fullWidth
          value={''}
          autoFocus
          placeholder={'Add Key'}
          onBlur={handleBlur}
          onKeyDown={keyDownHandler}
        />
        <Button
          ref={divRef}
          variant="contained"
          onClick={() => {
            debugger;
          }}
        >
          Save
        </Button>
      </Paper>
    </div>
  );
};

export default InputCard;
