import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloConsumer,
} from '@apollo/client';
import MyRouter from './components/MyRouter';

const uri =
  process.env.NODE_ENV !== 'production'
    ? process.env.REACT_APP_GRAPHQL_URL_LOCAL
    : process.env.REACT_APP_GRAPHQL_URL_PRODUCTION;

const client = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
});
console.log('ENV', uri);
const App = () => {
  return (
    <ApolloProvider client={client}>
      {/* <MyRouter /> */}
      <ApolloConsumer>
        {(client) => <MyRouter client={client} />}
      </ApolloConsumer>
    </ApolloProvider>
  );
};

export default App;
