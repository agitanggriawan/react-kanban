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
import MyLoading from './MyLoading';
import MySnack from './MySnack';

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
      {greaterProps.globalLoading && <MyLoading />}
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
        <MySnack {...greaterProps.snack} />
      </Router>
    </>
  );
};

export default MyRouter;
