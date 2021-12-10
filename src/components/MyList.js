import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'; // Draggable
import AddList from './List/AddList';
import AddIcon from '@mui/icons-material/Add';
// import { Typography } from '@mui/material';
import InputCard from './List/InputCard';

const taskStatus = {
  backlog: {
    name: 'Backlog',
    items: [],
  },
  toDo: {
    name: 'To do',
    items: [],
  },
  doing: {
    name: 'Doing',
    items: [],
  },
  done: {
    name: 'Done',
    items: [],
  },
  check: {
    name: 'Check',
    items: [],
  },
};

const MyList = (props) => {
  const { setBackground } = props;
  const [addListFlag, setAddListFlag] = React.useState(false);
  const addFlag = React.useRef(true);
  const [columns] = React.useState(taskStatus);

  React.useEffect(() => {
    setBackground(true);
  });

  const handleAddition = () => {
    setAddListFlag(true);
    addFlag.current = false;
  };

  const closeButtonHandler = () => {
    setAddListFlag(false);
    addFlag.current = true;
    // setListTitle('')
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // submitHandler()
    }
  };

  return (
    <div>
      <div
        style={{ display: 'flex', justifyContent: 'center', height: '100%' }}
      >
        <DragDropContext>
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div key={columnId}>
                <h2>{column.name}</h2>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        borderStyle: 'solid',
                        padding: 4,
                        width: 250,
                        minHeight: 500,
                        borderRadius: '10px',
                        margin: 10,
                      }}
                    >
                      <div>
                        {addFlag.current && (
                          <AddList
                            handleClick={handleAddition}
                            icon={<AddIcon />}
                            btnText="Add another card"
                            type="card"
                            width="256px"
                          />
                        )}
                        {addListFlag && (
                          <InputCard
                            closeHandler={closeButtonHandler}
                            keyDownHandler={handleKeyDown}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
};

export default MyList;
