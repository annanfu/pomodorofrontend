import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import ButtonAppBar from './components/Appbar';
import Todo from './components/Todo';
import Pomodoro from './components/Pomodoro';
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [token, setToken] = useState(null);

  const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const handleSelectTodo = (todo) => {
    setSelectedTodo(todo);
  };

  const fetchToken = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const token = await getAccessTokenSilently();
        setToken(token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return (
    <Box sx={{ textAlign: 'center', minHeight: '100vh' }}>
      <ButtonAppBar 
        loginWithRedirect={loginWithRedirect} 
        logout={logout} 
        isAuthenticated={isAuthenticated} 
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on small screens and horizontally on larger screens
          gap: 2,
          padding: 2,
          alignItems: 'flex-start', // Align items to start for proper positioning
        }}
      >
        <Box
          sx={{
            flex: 1, 
            maxWidth: '100%',
            order: { xs: 1, sm: 2 }, // Todo comes after Pomodoro on small screens
          }}
        >
          <Pomodoro 
            loginWithRedirect={loginWithRedirect} 
            isAuthenticated={isAuthenticated}
            selectedTodo={selectedTodo} token={token}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            maxWidth: '100%',
            order: { xs: 1, sm: 2 }, // Todo comes before Pomodoro on small screens
          }}
        >
          <Todo 
            isAuthenticated={isAuthenticated}
            onSelectTodo={handleSelectTodo} 
            token={token} 
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
