import React from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function ButtonAppBar({ loginWithRedirect, logout, isAuthenticated }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pomodoro - Focus & Track my Todos
          </Typography>
          {!isAuthenticated ? (
            <Button color="inherit" onClick={loginWithRedirect}>Login</Button>
          ) : (
            <>
              <Typography variant="body2" sx={{ mr: 2 }}>Welcome</Typography>
              <Button color="inherit" onClick={() => logout({ returnTo: window.location.origin })}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
