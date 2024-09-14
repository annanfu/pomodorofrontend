import React, { useState } from 'react';
import './App.css';
import ButtonAppBar from './components/Appbar';
import Todo from './components/Todo';
import Pomodoro from './components/Pomodoro';

function App() {
  const [selectedTodo, setSelectedTodo] = useState(null);

  const handleSelectTodo = (todo) => {
    setSelectedTodo(todo);
  };

  return (
    <div className="App">
      <ButtonAppBar />
      <div className="main-content">
        <div className="side-by-side">
          <div className="pomodoro-container">
            <Pomodoro selectedTodo={selectedTodo} />
          </div>
          <div className="todo-container">
            <Todo onSelectTodo={handleSelectTodo} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;