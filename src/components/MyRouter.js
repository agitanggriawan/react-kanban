import React from 'react';
import Cookies from 'universal-cookie';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import MyBoard from './MyBoard';
import Login from './Login';
// import MonevSignUp from './MonevSignUp';
// import MonevSnack from './MonevSnack';
// import MonevLoading from './MonevLoading';

const cookies = new Cookies();

function PrivateRoute({ component: Component, ...rest }) {
  let auth = cookies.get('token');

  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? <Component {...props} {...rest} /> : <Redirect to="/login" />
      }
    />
  );
}

const MyRouter = (greaterProps) => {
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return cookies.get('token') ? (
                <Redirect to="/board" />
              ) : (
                <Redirect to="/login" />
              );
            }}
          />
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login query={greaterProps.client.query} {...props} />
            )}
          />
          <PrivateRoute
            path="/board"
            component={MyBoard}
            query={greaterProps.client.query}
            mutate={greaterProps.client.mutate}
          />
          <Route path="*">
            <>404</>
          </Route>
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default MyRouter;
