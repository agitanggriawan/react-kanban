import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AddList from './List/AddList';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import InputCard from './List/InputCard';

const MyList = (props) => {
  const { setBackground } = props;
  const [addListFlag, setAddListFlag] = React.useState(false);
  const addFlag = React.useRef(true);

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
    <DragDropContext>
      <Droppable droppableId="all-columns" direction="horizontal" type="list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Typography variant="h6" sx={{ ml: 1.5, mb: 2 }}>
              Milestone 3
            </Typography>
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
    </DragDropContext>
  );
};

export default MyList;
