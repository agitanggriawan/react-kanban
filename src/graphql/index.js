import { gql } from '@apollo/client';

export const AUTHENTICATE = gql`
  query authenticate($username: String!, $password: String!) {
    authenticate(username: $username, password: $password) {
      uid
      username
      id
      token
    }
  }
`;

export const BOARDS = gql`
  query boards {
    boards {
      id
      bid
      name
      jsonb
      created_at
      updated_at
    }
  }
`;

export const CREATE_BOARD = gql`
  mutation createBoard($data: InBoard!) {
    createBoard(data: $data) {
      bid
      id
      name
      jsonb
      created_at
      updated_at
    }
  }
`;

export const FIND_CARD_BY_BID = gql`
  query findCardByBid($bid: String!) {
    findCardByBid(bid: $bid) {
      id
      cid
      task
      board {
        id
        bid
        name
        jsonb
        users {
          id
          username
        }
      }
    }
  }
`;

export const UPDATE_CARD = gql`
  mutation updateCard($cid: String!, $task: JSON!) {
    updateCard(cid: $cid, task: $task) {
      id
      cid
      task
    }
  }
`;

export const USERS = gql`
  query users($board_id: ID) {
    users(board_id: $board_id) {
      id
      username
    }
  }
`;

export const ADD_MEMBER = gql`
  mutation addMember($board_id: ID!, $user_ids: [ID!]!) {
    addMember(board_id: $board_id, user_ids: $user_ids)
  }
`;
