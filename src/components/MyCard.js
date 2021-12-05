import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import BoardModalCreate from './Board/BoardModalCreate';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  height: '150px',
  backgroundImage: `url("https://picsum.photos/seed/picsum/536/354")`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  ':hover': {
    boxShadow: '5px 10px #888888',
    cursor: 'pointer',
  },
  borderRadius: 15,
}));

const ItemNew = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '150px',
  ':hover': {
    boxShadow: '5px 10px #888888',
    cursor: 'pointer',
  },
  borderRadius: 15,
  backgroundColor: 'lightgray',
}));

const TitleBoard = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: 'black',
}));

export default function MyCard(props) {
  const {
    history,
    data,
    mutate,
    title,
    setTitle,
    handleSubmit,
    open,
    setOpen,
    handleClose,
  } = props;

  return (
    <>
      {props.create && (
        <>
          <Grid item xs={6} sm={6} md={3} lg={3}>
            <ItemNew onClick={() => setOpen(true)}>
              <p
                style={{
                  marginTop: 55,
                }}
              >
                Create New Board
              </p>
            </ItemNew>
          </Grid>
          <BoardModalCreate
            open={open}
            handleClose={handleClose}
            mutate={mutate}
            title={title}
            setTitle={setTitle}
            handleSubmit={handleSubmit}
          />
        </>
      )}
      {!props.create && (
        <Grid item xs={6} sm={6} md={3} lg={3}>
          <Item onClick={() => history.push(`/board/d/${data?.bid}`)}>
            <TitleBoard>{data?.name}</TitleBoard>
          </Item>
        </Grid>
      )}
    </>
  );
}
