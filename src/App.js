import React from 'react';
import {
  ApolloConsumer,
  ApolloProvider,
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
} from '@apollo/client';

import Cookies from 'universal-cookie';
import MyRouter from './components/MyRouter';
import { GlobalProvider } from './utils/GlobalContext';

const uri =
  process.env.NODE_ENV !== 'production'
    ? process.env.REACT_APP_GRAPHQL_URL_LOCAL
    : process.env.REACT_APP_GRAPHQL_URL_PRODUCTION;

const httpLink = new HttpLink({ uri });

const authMiddleware = new ApolloLink((operation, forward) => {
  const cookies = new Cookies();
  const token = cookies.get('token');
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

// const httpLink = new CreateUploadLink({ uri });

// const linkError = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) console.log('graphQLErrors App.js: ', graphQLErrors);
//   if (networkError) console.log('networkError: ', networkError);
// });

// const authLink = setContext((_, { headers }) => {
//   const cookies = new Cookies();
//   const token = cookies.get('token');

//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: authLink.concat(linkError.concat(httpLink)),
// });

const App = () => {
  const [snack, setSnack] = React.useState({
    variant: 'success',
    message: null,
    opened: false,
  });
  const [globalLoading, setGlobalLoading] = React.useState(false);

  return (
    <GlobalProvider value={{ setSnack, setGlobalLoading }}>
      <ApolloProvider client={client}>
        <ApolloConsumer>
          {(client) => (
            <MyRouter
              client={client}
              snack={snack}
              globalLoading={globalLoading}
            />
          )}
        </ApolloConsumer>
      </ApolloProvider>
    </GlobalProvider>
  );
};

export default App;
