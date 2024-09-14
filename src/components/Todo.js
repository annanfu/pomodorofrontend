import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TimerIcon from '@mui/icons-material/Timer';
import Typography from '@mui/material/Typography';

export default function Todo({ onSelectTodo }) {
  const paperStyle = { padding: '50px 30px', width: 600, margin: '20px auto' };
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState([]);

  const handleClick = (e) => {
    e.preventDefault();
    const todo = { title, accumulatedTime: 0 };
    console.log(todo);
    fetch('http://localhost:8080/todo/add', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    })
    .then(() => {
      console.log('new todo added');
      fetchTodos();
      setTitle('');
    })
    .catch(error => console.error('Error adding todo:', error));
  };

  const fetchTodos = () => {
    fetch('http://localhost:8080/todo/getAll')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setTodos(data);
      })
      .catch(error => console.error('Error fetching todos:', error));
  };

const deleteTodo = (id) => {
  console.log('Attempting to delete todo with id:', id);
  fetch(`http://localhost:8080/todo/delete/${id}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (response.ok) {
      console.log('Todo deleted successfully');
      return fetchTodos(); // Ensure todos are refetched
    } else {
      console.error('Failed to delete todo');
    }
  })
  .catch(error => console.error('Error deleting todo:', error));
};


  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1 } }}
      noValidate
      autoComplete="off"
    >
      <Paper elevation={3} style={paperStyle}>
        <h1>Add Todo</h1>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Todo Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button onClick={handleClick}>
          Submit
        </Button>
      </Paper>

      <Paper elevation={3} style={paperStyle}>
        <h1>Todos</h1>
        {todos.map(todo => (
          <Paper elevation={3} sx={{ margin: '10px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'left' }} key={todo.id}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6">{todo.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Time used: {formatTime(todo.accumulatedTime)}
              </Typography>
            </Box>
            <Box>
              <IconButton aria-label="start timer" onClick={() => onSelectTodo(todo)}>
                <TimerIcon />
              </IconButton>
              <IconButton aria-label="delete" onClick={() => deleteTodo(todo.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Paper>
    </Box>
  );
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}