import React, { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function Pomodoro() {
  const [countdown, setCountdown] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const intervalRef = useRef(null);

  const startTimer = () => {
    fetch('http://localhost:8080/sessions/0/start', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todoId: 1 }) // Example todoId; replace with actual
    })
    .then(response => response.json())
    .then(data => {
      setSessionId(data.id); // Assuming backend returns session with an ID
      setCountdown(25 * 60); // Reset to 25 minutes
      setIsRunning(true);
      setIsPaused(false);
    })
    .catch(error => console.error('Error starting session:', error));
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(true);
    fetch(`http://localhost:8080/sessions/${sessionId}/update`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" }
    })
    .catch(error => console.error('Error pausing session:', error));
  };

  const resumeTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setCountdown(25 * 60); // Reset to 25 minutes
    setIsRunning(false);
    setIsPaused(false);
    fetch(`http://localhost:8080/sessions/${sessionId}/end`, {
      method: 'POST'
    })
    .then(() => setSessionId(null))
    .catch(error => console.error('Error resetting session:', error));
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [isRunning]);

  return (
    <Paper elevation={3} style={{ padding: '50px 30px', width: 600, margin: "20px auto" }}>
        <h1>Pomodoro Timer</h1>
      <Typography variant="h1" gutterBottom>
        {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
      </Typography>
      <div style={{ marginTop: 20 }}>
        {!isRunning ? (
          <IconButton aria-label="pause" onClick={startTimer}>
            <PlayArrowIcon />
          </IconButton>
        ) : isPaused ? (
          <IconButton aria-label="pause" onClick={resumeTimer}>
            <PlayArrowIcon />
          </IconButton>
        ) : (
          <IconButton aria-label="pause" onClick={pauseTimer}>
            <PauseIcon />
          </IconButton>
        )}
        <IconButton aria-label="reset" onClick={resetTimer} disabled={!isRunning && !isPaused}>
          <RestartAltIcon />
        </IconButton>
      </div>
    </Paper>
  );
}
