import React from 'react';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  add: {
    textTransform: 'none',
    margin: '0.2 1 1 1',
    justifyContent: 'left',
    opacity: 0.8,
    fontWeight: (props) =>
      props.type === 'background' ||
      props.type === 'menu' ||
      props.type === 'list'
        ? 'bold'
        : 'inherit',
    backgroundColor: (props) =>
      props.type !== 'card' ? 'hsla(0,0%,100%,.24)' : 'inherit',
    '&:hover': {
      opacity: 1,
      backgroundColor: 'rgba(9,30,66,.08)',
    },
    textShadow: (props) =>
      !props.noshadow &&
      (props.type === 'menu' || props.type === 'list') &&
      '2px 2px black',
  },
  width: (props) => ({
    width: props.width,
    color: props.color,
  }),
}));

export default function AddList({
  btnText,
  handleClick,
  type,
  icon,
  width,
  color,
  noshadow,
}) {
  const classes = useStyles({ type, width, color, noshadow });
  return (
    <Button className={`${classes.add} ${classes.width}`} onClick={handleClick}>
      {icon} {btnText}
    </Button>
  );
}
