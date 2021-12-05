import Board, { addCardLink } from 'react-trello';
import logo from './logo.svg';
import './App.css';

function App() {
  const data = {
    lanes: [
      {
        cards: [
          {
            description: '2 Gallons of milk at the Deli store',
            id: 'Milk',
            label: '15 mins',
            laneId: 'PLANNED',
            title: 'Buy milk',
            tags: [
              {
                bgcolor: 'red',
                color: 'white',
                title: 'Critical',
              },
              {
                bgcolor: '#0079BF',
                color: 'white',
                title: '2d ETA',
              },
            ],
          },
          {
            description: 'Sort out recyclable and waste as needed',
            id: 'Plan2',
            label: '10 mins',
            laneId: 'PLANNED',
            title: 'Dispose Garbage',
          },
          {
            description: 'Can AI make memes?',
            id: 'Plan3',
            label: '30 mins',
            laneId: 'PLANNED',
            title: 'Write Blog',
          },
          {
            description: 'Transfer to bank account',
            id: 'Plan4',
            label: '5 mins',
            laneId: 'PLANNED',
            title: 'Pay Rent',
          },
        ],
        currentPage: 1,
        disallowAddingCard: true,
        id: 'PLANNED',
        label: '20/70',
        style: {
          width: 280,
        },
        title: 'Disallowed adding card',
      },
      {
        cards: [
          {
            description:
              'Soap wash and polish floor. Polish windows and doors. Scrap all broken glasses',
            id: 'Wip1',
            label: '30 mins',
            laneId: 'WIP',
            title: 'Clean House',
          },
        ],
        currentPage: 1,
        id: 'WIP',
        label: '10/20',
        style: {
          width: 280,
        },
        title: 'Work In Progress',
      },
      {
        cards: [],
        currentPage: 1,
        id: 'BLOCKED',
        label: '0/0',
        style: {
          width: 280,
        },
        title: 'Blocked',
      },
      {
        cards: [
          {
            description: 'Use Headspace app',
            id: 'Completed1',
            label: '15 mins',
            laneId: 'COMPLETED',
            title: 'Practice Meditation',
          },
          {
            description: 'Use Spreadsheet for now',
            id: 'Completed2',
            label: '15 mins',
            laneId: 'COMPLETED',
            title: 'Maintain Daily Journal',
          },
        ],
        currentPage: 1,
        id: 'COMPLETED',
        label: '2/5',
        style: {
          width: 280,
        },
        title: 'Completed',
      },
    ],
  };

  const onCardClick = (cardId, metadata, laneId) => {
    debugger;
  };

  return <Board data={data} onCardClick={onCardClick} editable />;
}

export default App;
