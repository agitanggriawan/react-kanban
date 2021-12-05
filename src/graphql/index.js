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
