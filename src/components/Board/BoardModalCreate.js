import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Modal from '@mui/material/Modal';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: '150px',
  borderRadius: 5,
  zIndex: 50,
  backgroundColor: 'white',
  backgroundImage: `url("https://picsum.photos/id/1/367/267")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  transform: 'translate(-50%, -50%)',
}));

export default function BasicModal(props) {
  const { open, handleClose, title, setTitle, handleSubmit } = props;

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Item>
          <InputBase
            autoFocus
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board Title"
            style={{
              color: 'white',
              fontWeight: 'bold',
              width: '240px',
              margin: '10px',
              padding: '2px',
              paddingLeft: '10px',
              borderRadius: 5,
              backgroundColor: 'hsla(0,0%,100%,.24)',
              zIndex: 200,
            }}
          />
          <Button
            variant="contained"
            style={{
              backgroundColor: '#61BD4F',
            }}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </Item>
      </Modal>
    </div>
  );
}
