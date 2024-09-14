import React from 'react';
import './App.css';
import ButtonAppBar from './components/Appbar';
import Todo from './components/Todo';
import Pomodoro from './components/Pomodoro';

function App() {
  return (
    <div className="App">
      <ButtonAppBar />
      <div className="main-content">
        <div className="side-by-side">
          <div className="pomodoro-container">
            <Pomodoro />
          </div>
          <div className="todo-container">
            <Todo />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

