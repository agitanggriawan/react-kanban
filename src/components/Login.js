import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AUTHENTICATE } from '../graphql';
import Cookies from 'universal-cookie/cjs';

const theme = createTheme();

export default function SignIn(props) {
  const { query, history } = props;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      data: { authenticate },
    } = await query({
      query: AUTHENTICATE,
      variables: { username: '123', password: '123' },
      fetchPolicy: 'no-cache',
    });

    const cookie = new Cookies();
    cookie.set('token', authenticate.token, { path: '/' });

    history.replace('/board');
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
              src="/ebelajar.png"
              alt="logo"
              style={{
                width: '100%',
              }}
            />
            <Typography component="h1" variant="h6">
              Aplikasi Kanban E-BELAJAR
            </Typography>
          </center>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              autoComplete="off"
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
