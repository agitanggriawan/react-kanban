import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import Cookies from 'universal-cookie';
import { Route, Switch } from 'react-router-dom';
import MyCard from './MyCard';
import MyList from './MyList';
import { BOARDS } from '../graphql';
import { CREATE_BOARD } from '../graphql';

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function MyBoard(props) {
  const { history, query, mutate } = props;
  const cookie = new Cookies();
  const [boards, setBoards] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [background, setBackground] = React.useState(false);

  React.useEffect(() => {
    setBackground(false);

    const getBoards = async () => {
      const {
        data: { boards },
      } = await query({
        query: BOARDS,
        fetchPolicy: 'no-cache',
      });

      setBoards(boards);
    };

    getBoards();
  }, [query]);

  const handleSubmit = async () => {
    try {
      if (!title) {
        return false;
      }

      const {
        data: { createBoard },
      } = await mutate({
        mutation: CREATE_BOARD,
        variables: {
          data: {
            name: title,
            user_id: cookie.get('id'),
          },
        },
        fetchPolicy: 'no-cache',
      });

      if (createBoard) {
        boards.unshift(createBoard);
        setTitle('');
        setOpen(false);
      }
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const handleLogout = () => {
    cookie.remove('token', { path: '/' });
    history.replace('/login');
  };

  const handleClose = () => setOpen(false);

  const backgroundStyle = {
    height: '100vh',
    backgroundImage: `url("https://images.unsplash.com/photo-1519092437326-bfd121eb53ae?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNTc4MDZ8MHwxfHNlYXJjaHw2NzJ8fGxhbmRzY2FwZXxlbnwwfHx8fDE2Mzg3MTIwMjE&ixlib=rb-1.2.1&q=85")`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div style={background ? backgroundStyle : null}>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" component="div">
              React Kanban | Username: {cookie.get('username').toUpperCase()}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <div style={{ float: 'right' }}>
                <Button
                  variant="contained"
                  endIcon={<LogoutIcon />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container sx={{ mt: 5 }} maxWidth="false">
        <Box>
          <Switch>
            <Route
              exact
              path="/board/d/:bid"
              render={(props) => (
                <Grid container spacing={2}>
                  <MyList
                    mutate={mutate}
                    query={query}
                    setBackground={setBackground}
                    {...props}
                  />
                </Grid>
              )}
            />
            <Route
              exact
              path="/board"
              render={(props) => (
                <Grid container spacing={2}>
                  {boards &&
                    boards.map((x, i) => (
                      <MyCard key={i} history={history} data={x} />
                    ))}
                  <MyCard
                    create
                    mutate={mutate}
                    title={title}
                    setTitle={setTitle}
                    handleSubmit={handleSubmit}
                    open={open}
                    handleClose={handleClose}
                    setOpen={setOpen}
                  />
                </Grid>
              )}
            />
          </Switch>
        </Box>
      </Container>
    </div>
  );
}
