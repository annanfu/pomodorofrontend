import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Todo() {
  const paperStyle = { padding: '50px 30px', width: 600, margin: '20px auto' };
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState([]);

  const handleClick = (e) => {
    e.preventDefault();
    const todo = { title };
    console.log(todo);
    fetch('http://localhost:8080/todo/add', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    })
    .then(() => {
      console.log('new todo added');
      fetchTodos(); // Refresh the list of todos
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
    fetch(`http://localhost:8080/todo/delete/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      console.log('Todo deleted');
      fetchTodos(); // Refresh the list of todos
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
        <Button variant="contained" onClick={handleClick}>
          Submit
        </Button>
      </Paper>

      <Paper elevation={3} style={paperStyle}>
        <h1>Todos</h1>
        {todos.map(todo => (
          <Paper elevation={3} sx={{ margin: '10px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={todo.id}>
            <item>
              {todo.title}
            </item>
            <item>
            <IconButton aria-label="delete" onClick={() => deleteTodo(todo.id)}>
              <DeleteIcon />
            </IconButton>
            </item>
          </Paper>
        ))}
      </Paper>
    </Box>
  );
}
