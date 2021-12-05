import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloConsumer,
} from '@apollo/client';
import MyRouter from './components/MyRouter';
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

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
