import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { customAlphabet } from 'nanoid/non-secure';
import dayjs from 'dayjs';
import { FIND_CARD_BY_BID, UPDATE_CARD, USERS, ADD_MEMBER } from '../graphql';
import InputCard from './List/InputCard';
import Invite from './List/Invite';
import BoardModalDetail from './Board/BoardModalDetail';

const MyList = (props) => {
  const { query, match, mutate, history } = props;
  const [columns, setColumns] = useState({});
  const [fixedValue, setFixedValue] = useState({});
  const [cid, setCid] = useState(null);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [date, setDate] = useState(null);
  const [tag, setTag] = useState([]);
  const [board, setBoard] = useState(null);
  const [users, setUsers] = useState(null);
  const [members, setMembers] = useState([]);
  const [ids, setIds] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDetail, setOpenDetail] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [, setTagLists] = useState([]);

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

      setColumns(findCardByBid?.task);
      setFixedValue(findCardByBid?.task);
      setCid(findCardByBid?.cid);
      setBoard(findCardByBid?.board);
      setMembers(findCardByBid?.board?.users);

      const _task = findCardByBid?.task;
      const _keys = Object.keys(_task);
      const _tags = _keys
        ?.map((x) => {
          return _task[x].items.filter((y) => y.tags);
        })
        ?.flat()
        ?.map((z) => z.tags)
        ?.flat();
      setTagLists([...new Set(_tags)]);
    };

    getCard();
  }, [match?.params?.bid, query]);

  useEffect(() => {
    const getUsers = async () => {
      const {
        data: { users },
      } = await query({
        query: USERS,
        fetchPolicy: 'no-cache',
        variables: {
          board_id: match?.params?.bid,
        },
      });

      setUsers(users);
    };

    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddMember = async (user_ids) => {
    const user = await mutate({
      mutation: ADD_MEMBER,
      variables: {
        board_id: board.id,
        user_ids,
      },
    });

    const newMember = user.data.addMember.map((x) => ({
      ...x.user,
    }));

    const filterUser = users.filter((x) => !user_ids.includes(x.username));
    const oldMember = members;
    setUsers([...filterUser]);
    setMembers([...oldMember, ...newMember]);

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
      setFixedValue({ ...task });
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
      setFixedValue({ ...task });
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
      tags: tag.filter((x) => x),
      title,
      description,
    });

    setColumns({ ...task });
    setFixedValue({ ...task });

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

  const handleDeleteTask = async (id) => {
    let task = columns;
    const items = task[idx].items.filter((x) => x.id !== id);
    task[idx].items = items;

    setColumns({ ...task });
    setFixedValue({ ...task });

    await mutate({
      mutation: UPDATE_CARD,
      variables: {
        cid,
        task,
      },
    });
    setOpenDetail(false);
  };

  const handleFilter = () => {
    console.log('columns', columns);
    // const data = {
    //   0: {
    //     name: 'Backlog',
    //     items: [
    //       {
    //         id: 'D4OO6mUlqp',
    //         date: '2021-06-12T03:08:30.048Z',
    //         tags: ['MEMORY'],
    //         title: 'Chicken',
    //         description:
    //           'Consequatur voluptas voluptatem doloribus sequi dolore et. Dolorem inventore minus commodi ratione explicabo aut natus. Assumenda ipsa non amet error ut eum. Est cum dolores amet eos quaerat. Officia dolore repellat.',
    //       },
    //       {
    //         id: 'Gtalafgzb5',
    //         date: '2021-06-13T16:04:21.098Z',
    //         tags: ['ARCHIVE'],
    //         title: 'Keyboard',
    //         description:
    //           'Dolores doloremque ut occaecati odit necessitatibus vitae cumque. Rerum enim veniam consequatur. Rerum ipsa perspiciatis dicta quia dolores sint veritatis tenetur. Dignissimos sed placeat dolores dolorem autem. Blanditiis iure ea. Similique aut assumenda dicta velit labore et tempore quod.',
    //       },
    //       {
    //         id: 'YNqqRgI5ad',
    //         date: '2022-05-09T20:13:07.248Z',
    //         tags: ['BLACKHOLE'],
    //         title: 'Shoes',
    //         description:
    //           'Cumque ea id itaque est et. Qui tempore soluta non inventore molestias laboriosam expedita enim sit. Et optio aut aperiam velit. Omnis cumque dolores in id et eos ut nostrum.',
    //       },
    //       {
    //         id: 'YFk0nA7fN4',
    //         date: '2021-09-27T11:53:44.352Z',
    //         tags: ['InnoDB'],
    //         title: 'Table',
    //         description:
    //           'Adipisci ullam dolore ipsam eligendi fugit velit enim nihil consequatur. Consequuntur a quae quo impedit ea error. Doloribus non dolore maxime dolorem unde.',
    //       },
    //       {
    //         id: 'QoRZq38A1i',
    //         date: '2021-12-10T16:00:09.757Z',
    //         tags: ['InnoDB'],
    //         title: 'Pizza',
    //         description:
    //           'Ut sapiente nesciunt eius qui unde voluptatum. Error voluptatem expedita ipsum quas. Ea accusamus adipisci quam animi aut qui eum excepturi. Laboriosam ut est autem. Velit corrupti modi molestiae voluptatem non id. Id expedita in nulla corporis.',
    //       },
    //     ],
    //   },
    //   1: {
    //     name: 'To do',
    //     items: [
    //       {
    //         id: 's4pB4p20nh',
    //         date: '2021-12-13T07:14:17.730Z',
    //         tags: ['MEMORY'],
    //         title: 'Bike',
    //         description:
    //           'Aliquid vero quo rerum non dolorum. Qui est non nihil consectetur sunt rerum tenetur harum. Earum autem error quidem. Eius similique quia vero placeat voluptatem. Libero incidunt sed beatae error et quia. Cum ad fugiat corrupti non.',
    //       },
    //       {
    //         id: 'LK8IdK9JvF',
    //         date: '2021-07-17T07:02:05.435Z',
    //         tags: ['CSV'],
    //         title: 'Fish',
    //         description:
    //           'Dolores molestiae non aut. Velit eius excepturi ut et consequuntur adipisci. Aperiam illo quisquam. Doloribus consectetur fugit non qui reprehenderit soluta ut.',
    //       },
    //       {
    //         id: 'gtaxelxZNV',
    //         date: '2022-02-23T22:54:57.815Z',
    //         tags: ['ARCHIVE'],
    //         title: 'Shoes',
    //         description:
    //           'Delectus veritatis aut nesciunt velit ipsum enim. Quo possimus fuga perspiciatis omnis sed. Quo quibusdam et doloribus hic quia qui excepturi quia iure. Omnis inventore at et et adipisci minima cum. Harum magnam quod non qui voluptatem sit harum. Quia dolore hic exercitationem est.',
    //       },
    //       {
    //         id: 'Qzw13EkQCW',
    //         date: '2021-09-14T03:25:52.282Z',
    //         tags: ['ARCHIVE'],
    //         title: 'Mouse',
    //         description:
    //           'Sed dolor non unde molestias quae consectetur autem. Perferendis libero et ea esse vitae repellat libero quaerat reiciendis. Non consectetur consequuntur modi. Magni quia nesciunt quos commodi est voluptas. Cumque voluptatum sunt necessitatibus autem ipsum maiores eos.',
    //       },
    //       {
    //         id: '5ZE9OmqNvV',
    //         date: '2022-04-11T05:14:01.936Z',
    //         tags: ['ARCHIVE'],
    //         title: 'Car',
    //         description:
    //           'Tempore ipsa vitae nisi quisquam consequatur. Natus in quia debitis aut perferendis minima. Et facilis unde repellat mollitia. Sunt ratione in aut libero ut.',
    //       },
    //     ],
    //   },
    //   2: {
    //     name: 'Doing',
    //     items: [
    //       {
    //         id: 'frjKqYSL60',
    //         date: '2021-09-17T04:25:56.685Z',
    //         tags: ['BLACKHOLE'],
    //         title: 'Hat',
    //         description:
    //           'Voluptas dolores inventore officiis quis repudiandae illo. Porro quo dolorem. Et expedita aut aperiam porro.',
    //       },
    //       {
    //         id: 'w6wf6pvjoT',
    //         date: '2022-01-14T06:28:35.370Z',
    //         tags: ['ARCHIVE'],
    //         title: 'Bacon',
    //         description:
    //           'Nihil aliquid vitae vero porro amet sunt. Qui soluta possimus adipisci. Voluptas dicta quos ducimus suscipit non. Nihil nihil fuga nihil pariatur. Fugiat maxime deleniti.',
    //       },
    //       {
    //         id: 'CbzSp8QIL3',
    //         date: '2021-09-21T04:06:07.874Z',
    //         tags: ['MEMORY'],
    //         title: 'Cheese',
    //         description:
    //           'Sunt nesciunt perspiciatis quod consequuntur quas illum distinctio. Et provident sint. Magni non nostrum. Aut et nam. Vero quis enim.',
    //       },
    //       {
    //         id: 'UNGJTo0NRM',
    //         date: '2021-12-17T08:59:21.481Z',
    //         tags: ['ARCHIVE'],
    //         title: 'Pants',
    //         description:
    //           'Est sed nobis qui ea voluptatibus velit iusto. Accusamus consequuntur nulla quisquam voluptas quia voluptate dolores. Deleniti et aut et et dolores ratione alias. Nihil autem amet.',
    //       },
    //       {
    //         id: 'NW3SvPSxdj',
    //         date: '2021-06-18T08:15:36.241Z',
    //         tags: ['ARCHIVE'],
    //         title: 'Pants',
    //         description:
    //           'Exercitationem officiis quis sit quaerat. Fugit quam autem nisi ipsum in voluptas repellat rerum deleniti. Aut rerum vel.',
    //       },
    //     ],
    //   },
    //   3: {
    //     name: 'Done',
    //     items: [
    //       {
    //         id: 'Dmrib0dck5',
    //         date: '2021-09-29T15:32:31.658Z',
    //         tags: ['MEMORY'],
    //         title: 'Towels',
    //         description:
    //           'Molestias vero optio odio voluptatem suscipit velit. In fuga aut quis molestiae tempore blanditiis neque non ipsum. Alias aut omnis qui qui est velit. Explicabo aut corporis aperiam distinctio eveniet rem. Magnam quis voluptates adipisci qui cum qui. Illo voluptas deserunt vero.',
    //       },
    //       {
    //         id: '0IdQWewG9G',
    //         date: '2021-09-06T23:44:56.286Z',
    //         tags: ['CSV'],
    //         title: 'Table',
    //         description:
    //           'Quos hic atque et voluptatem nihil voluptatem ipsum. Illo hic eos magnam. Nihil eaque voluptatem enim et est nihil doloribus numquam.',
    //       },
    //       {
    //         id: 'BC5y7p0z1v',
    //         date: '2022-01-04T15:27:25.351Z',
    //         tags: ['MyISAM'],
    //         title: 'Table',
    //         description:
    //           'Deleniti ipsam accusantium perferendis. Ut ut ab vero nesciunt officia et inventore. Accusantium ut deleniti voluptatem sit. Doloribus recusandae sit sed doloribus nam. Esse est officia adipisci necessitatibus porro. Aut est et ex est odit.',
    //       },
    //       {
    //         id: 'YPz7WUjH5s',
    //         date: '2021-06-03T20:05:52.736Z',
    //         tags: ['ARCHIVE'],
    //         title: 'Ball',
    //         description:
    //           'Corporis labore enim voluptatem nobis quis. Est quis aut debitis est minima corporis distinctio. Minima sapiente nesciunt doloribus aut qui voluptatibus qui. Perferendis quasi culpa. Perferendis magnam maxime voluptatem.',
    //       },
    //       {
    //         id: 'axXxWzsQCR',
    //         date: '2021-06-20T17:07:59.955Z',
    //         tags: ['MyISAM'],
    //         title: 'Keyboard',
    //         description:
    //           'Sint atque consequuntur ipsam ut hic cupiditate. Voluptatem in consequatur labore. Dolore quo voluptas nobis repellat. Voluptatem rerum dolores.',
    //       },
    //     ],
    //   },
    //   4: {
    //     name: 'Check',
    //     items: [
    //       {
    //         id: 'HanFz9CH43',
    //         date: '2021-10-05T09:29:13.786Z',
    //         tags: ['MyISAM'],
    //         title: 'Keyboard',
    //         description:
    //           'Harum illo nihil sit et odio est soluta cupiditate ipsam. Cupiditate et sunt ea et at omnis sint. Dolores accusamus perferendis et velit placeat.',
    //       },
    //       {
    //         id: '0IkW0msy74',
    //         date: '2021-07-19T02:34:49.783Z',
    //         tags: ['MEMORY'],
    //         title: 'Chair',
    //         description:
    //           'Est vero ipsam enim dolorem et eligendi. Dicta autem maxime vitae velit fuga sint consequatur quisquam exercitationem. Odit deleniti et alias enim velit.',
    //       },
    //       {
    //         id: 'NXXfUrXqkY',
    //         date: '2021-11-03T13:56:58.252Z',
    //         tags: ['BLACKHOLE'],
    //         title: 'Bacon',
    //         description:
    //           'Qui dolores vitae. Voluptatem ut animi ratione eum nihil unde repellendus. Voluptas vel quia. Magni dolor officia facere laudantium atque hic voluptatem ad expedita.',
    //       },
    //       {
    //         id: 'MOmVNhZ8KT',
    //         date: '2022-03-03T23:52:14.168Z',
    //         tags: ['BLACKHOLE'],
    //         title: 'Tuna',
    //         description:
    //           'Et velit cum minima perferendis minus voluptatem. Distinctio possimus omnis et asperiores optio blanditiis doloremque odit distinctio. Nostrum numquam libero inventore doloremque maiores. Quis velit nihil aperiam non nisi libero dignissimos omnis dolorem.',
    //       },
    //       {
    //         id: 'kQNiqBgBCZ',
    //         date: '2021-07-01T23:44:39.913Z',
    //         tags: ['MEMORY'],
    //         title: 'Soap',
    //         description:
    //           'Aut architecto enim est qui. Possimus sed rem omnis laborum nulla. Eum molestias temporibus fugiat molestiae est adipisci. Veniam veniam sed.',
    //       },
    //     ],
    //   },
    // };
    const keys = Object.keys(columns);
    const result = keys.map((x) => {
      const obj = { ...columns[x] };
      const filterItems = obj.items.filter((y) => y.tags.includes('MEMORY'));
      obj.items = filterItems;
      return obj;
    });
    setColumns({ ...result });
  };

  const handleReset = () => {
    const result = fixedValue;
    setColumns({ ...result });
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
        <Tooltip title="Kembali">
          <IconButton aria-label="back" onClick={() => history.push('/board')}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h6">{board?.name} &nbsp;</Typography>
        <AvatarGroup max={6}>
          {members.map((x, i) => (
            <Tooltip title={x.username}>
              <Avatar sx={{ width: 32, height: 32 }} id={i}>
                {x.username.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
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
          handleFilter={handleFilter}
          handleReset={handleReset}
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
          {Object.entries(columns)?.map(([columnId, column], idx) => {
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
                                        setIdx(idx);
                                        setTempData(item);
                                        setOpenDetail(true);
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
                                          {item.date &&
                                            `Due Date: ${dayjs(
                                              item.date
                                            ).format('DD - MM - YYYY')}`}
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
                            onClick={() => handleClickOpen(idx)}
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
      <BoardModalDetail
        openDetail={openDetail}
        setOpenDetail={setOpenDetail}
        tempData={tempData}
        handleDeleteTask={handleDeleteTask}
      />
    </>
  );
};

export default MyList;
