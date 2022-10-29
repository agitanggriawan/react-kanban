import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'universal-cookie/cjs';
import { AUTHENTICATE } from '../graphql';
import GlobalContext from '../utils/GlobalContext';

const theme = createTheme();

export default function SignIn(props) {
  const { query, history } = props;
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { setSnack, setGlobalLoading } = React.useContext(GlobalContext);

  const handleSubmit = async () => {
    try {
      setGlobalLoading(true);
      const {
        data: { authenticate },
      } = await query({
        query: AUTHENTICATE,
        variables: { username, password },
        fetchPolicy: 'no-cache',
      });

      const cookie = new Cookies();
      cookie.set('token', authenticate.token, { path: '/' });
      cookie.set('username', authenticate.username);
      cookie.set('id', authenticate.id);

      setSnack({
        variant: 'success',
        message: `Selamat Datang`,
        opened: true,
      });
      setGlobalLoading(false);

      history.replace('/board');
    } catch (error) {
      console.log(error);
      setSnack({
        variant: 'error',
        message: 'Username atau Password salah',
        opened: true,
      });
      setGlobalLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <center>
            <img
              src="/bbi1.png"
              alt="logo"
              style={{
                width: '100%',
              }}
            />
            <Typography component="h1" sx={{ pt: 2 }} variant="h6">
              Aplikasi Kanban PT Boma Bisma Indra
            </Typography>
          </center>
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
