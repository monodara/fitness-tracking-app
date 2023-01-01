import React, { Component } from "react";
import { AppBar, Button, TextField } from '@mui/material';
import { UserAttemptsToLogin, UserLoginFail } from "../event";
import PubSub from 'pubsub-js';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

//define the login interface theme
const theme = createTheme();

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  componentDidMount() {
    PubSub.subscribe(UserLoginFail, ({ reason: error }) => {
      window.alert("Incorrect username or password!");
    })
  }

  handleClick(event) {
    PubSub.publish(UserAttemptsToLogin, { email: this.state.username, password: this.state.password });
  }

  render() {
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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h3" variant="h7">
              Welcome to MetaFitness!
            </Typography>

            <div>
              <AppBar title="Login" />
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email Address"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={(event) =>
                  this.setState({ username: event.target.value })
                }
              />
              <br />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event) =>
                  this.setState({ password: event.target.value })
                }
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <br />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={(event) => this.handleClick(event)}
              >Sign In</Button>
            </div>
          </Box>
        </Container>
      </ThemeProvider>

    );
  }
}
export default LoginView;
