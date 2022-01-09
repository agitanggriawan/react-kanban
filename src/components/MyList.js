import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import { customAlphabet } from 'nanoid/non-secure';
import dayjs from 'dayjs';
import { FIND_CARD_BY_BID, UPDATE_CARD, USERS, ADD_MEMBER } from '../graphql';
import InputCard from './List/InputCard';
import Invite from './List/Invite';

const App = (props) => {
  const { query, match, mutate } = props;
  const [columns, setColumns] = useState({});
  const [cid, setCid] = useState(null);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [date, setDate] = useState(null);
  const [tag, setTag] = useState([]);
  const [board, setBoard] = useState(null);
  const [users, setUsers] = useState(null);
  const [ids, setIds] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const getCard = async () => {
      const {
        data: { findCardByBid },
      } = await query({
        query: FIND_CARD_BY_BID,
        variables: {
          bid: match?.params?.bid,
        },
        fetchPolicy: 'no-cache',
      });

      const {
        data: { users },
      } = await query({
        query: USERS,
        fetchPolicy: 'no-cache',
        variables: {
          board_id: findCardByBid?.board?.id,
        },
      });

      setColumns(findCardByBid?.task);
      setCid(findCardByBid?.cid);
      setBoard(findCardByBid?.board);
      setUsers(users);
    };

    getCard();
  }, [match?.params?.bid, query, users]);

  useEffect(() => {
    const getUsers = async () => {
      const {
        data: { users },
      } = await query({
        query: USERS,
        fetchPolicy: 'no-cache',
        variables: {
          board_id: board?.id,
        },
      });

      setUsers(users);
    };

    getUsers();
  }, [board?.id, match.params.bid, query, anchorEl]);

  const handleAddMember = async (user_ids) => {
    await mutate({
      mutation: ADD_MEMBER,
      variables: {
        board_id: board.id,
        user_ids,
      },
    });

    setAnchorEl(null);
  };

  const onDragEnd = async (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      const task = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      };
      setColumns({ ...task });
      await mutate({
        mutation: UPDATE_CARD,
        variables: {
          cid,
          task,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      const task = {
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      };
      setColumns({ ...task });
      await mutate({
        mutation: UPDATE_CARD,
        variables: {
          cid,
          task,
        },
      });
    }
  };

  const Item = (props) => {
    const { sx, ...other } = props;
    return <Box sx={{ ...sx }} {...other} />;
  };

  const handleClickOpen = (index) => {
    setIdx(index);
    setOpen(true);
  };

  const generateUniqueId = () => {
    const nanoid = customAlphabet(
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      10
    );

    return nanoid();
  };

  const handleAddTask = async (title, description, date, tag) => {
    const task = columns;

    task[idx].items.push({
      id: generateUniqueId(),
      date,
      tags: tag,
      title,
      description,
    });

    setColumns({ ...task });
    await mutate({
      mutation: UPDATE_CARD,
      variables: {
        cid,
        task,
      },
    });
    setTitle(null);
    setDescription(null);
    setDate(null);
    setTag(null);
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          marginLeft: 3,
        }}
      >
        <Typography variant="h6">{board?.name} &nbsp;</Typography>
        <AvatarGroup max={6}>
          {board?.users.map((x, i) => (
            <React.Fragment>
              <Tooltip title={x.username}>
                <Avatar sx={{ width: 32, height: 32 }} id={i}>
                  {x.username.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            </React.Fragment>
          ))}
        </AvatarGroup>
        &nbsp;&nbsp;&nbsp;
        <Invite
          users={users}
          handleAddMember={handleAddMember}
          ids={ids}
          setIds={setIds}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%',
        }}
      >
        <DragDropContext
          onDragEnd={async (result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns)?.map(([columnId, column], index) => {
            return (
              <Item key={columnId}>
                <h2>{column.name}</h2>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <>
                        <Box
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? 'lightblue'
                              : 'lightgrey',
                            padding: 4,
                            width: 250,
                            maxHeight: 500,
                            minHeight: 500,
                            borderRadius: '10px',
                            overflow: 'scroll',
                          }}
                        >
                          {column?.items?.map((item, index) => {
                            return (
                              <Draggable
                                key={'aaaaa' + index}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: 'none',
                                        padding: 16,
                                        margin: 10,
                                        minHeight: '50px',
                                        backgroundColor: snapshot.isDragging
                                          ? '#263B4A'
                                          : '#1976d2',
                                        color: 'white',
                                        borderRadius: '10px',

                                        ...provided.draggableProps.style,
                                      }}
                                      onClick={(e) => {
                                        console.log(item);
                                        debugger;
                                      }}
                                      id={`a${index}`}
                                    >
                                      <Box id={`b${index}`}>
                                        <Typography variant="subtitle2">
                                          {item.title}
                                        </Typography>
                                      </Box>
                                      <Box
                                        id={`c${index}`}
                                        sx={{
                                          display: 'flex',
                                          mt: 1,
                                          flexWrap: 'wrap',
                                        }}
                                      >
                                        {item.tags.length
                                          ? item.tags.map((x) => (
                                              <>
                                                <Chip
                                                  label={x}
                                                  style={{ color: 'white' }}
                                                />
                                                &nbsp;
                                              </>
                                            ))
                                          : null}
                                      </Box>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          mt: 1,
                                        }}
                                      >
                                        <Typography variant="caption">
                                          Due Date:{' '}
                                          {dayjs(item.date).format(
                                            'DD - MM - YYYY'
                                          )}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            p: 1,
                            m: 1,
                            bgcolor: 'background.paper',
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => handleClickOpen(index)}
                          >
                            Add Task
                          </Button>
                        </Box>
                      </>
                    );
                  }}
                </Droppable>
              </Item>
            );
          })}
        </DragDropContext>
      </Box>
      <InputCard
        open={open}
        setOpen={setOpen}
        idx={idx}
        handleAddTask={handleAddTask}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        date={date}
        setDate={setDate}
        tag={tag}
        setTag={setTag}
      />
    </>
  );
};

export default App;
