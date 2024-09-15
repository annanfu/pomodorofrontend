import React, { useState, useEffect, useRef, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function Pomodoro({loginWithRedirect, isAuthenticated, selectedTodo, token }) {
  const [countdown, setCountdown] = useState(25 * 60); // Default to 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isBreak, setIsBreak] = useState(false); // Tracks whether it's break or work time
  const intervalRef = useRef(null);
  const alertTriggeredRef = useRef(false); // Ref to track alert trigger

  // Function to play sound and show alert
  const playSoundAndAlert = () => {
    return new Promise((resolve) => {
      const audio = new Audio('/alert.mp3');
      audio.play();
      audio.onended = () => {
        alert('Time is up!');
        resolve();
      };
    });
  };

  // Reset timer function
  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setCountdown(isBreak ? 5 * 60 : 25 * 60); // Reset to break or work time

    if (sessionId) {
      fetch(`http://localhost:8080/sessions/${sessionId}/end`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      .then(() => setSessionId(null))
      .catch(error => console.error('Error resetting session:', error));
    }

    alertTriggeredRef.current = false; // Reset alert trigger state
  }, [isBreak, sessionId, token]);

  // Start timer function
  const startTimer = useCallback(() => {
    if (!selectedTodo) {
      alert('Please select a todo item first');
      return;
    }

    fetch(`http://localhost:8080/sessions/${selectedTodo.id}/start?isBreak=${isBreak}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setSessionId(data.id); // Assuming backend returns session with an ID
      setIsRunning(true);
      setIsPaused(false);
    })
    .catch(error => console.error('Error starting session:', error));
  }, [selectedTodo, isBreak, token]);

  // Pause timer function
  const pauseTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(true);
    if (sessionId) {
      fetch(`http://localhost:8080/sessions/${sessionId}/update`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      .catch(error => console.error('Error pausing session:', error));
    }
  }, [sessionId, token]);

  // Resume timer function
  const resumeTimer = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  // Automatically switch between work and break when the timer reaches 0
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(async () => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);

            if (!alertTriggeredRef.current) {
              // Play sound and show alert, then switch modes
              alertTriggeredRef.current = true; // Ensure alert only happens once per cycle
              playSoundAndAlert().then(() => {
                // Switch mode after sound has finished playing
                setIsBreak(prevIsBreak => !prevIsBreak);
                setCountdown(isBreak ? 25 * 60 : 5 * 60); // Reset countdown to new mode
                alertTriggeredRef.current = false; // Reset alertTriggeredRef for the next cycle
              });
            } else {
              // Switch mode if already triggered
              setIsBreak(prevIsBreak => !prevIsBreak);
              setCountdown(isBreak ? 25 * 60 : 5 * 60); // Reset countdown to new mode
              alertTriggeredRef.current = false; // Reset alertTriggeredRef for the next cycle
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak]);

  // Effect to update countdown based on `isBreak` state change
  useEffect(() => {
    setCountdown(isBreak ? 5 * 60 : 25 * 60); // Update countdown when isBreak changes
  }, [isBreak]);

  // Function to manually switch between work and break
  const toggleBreak = () => {
    setIsBreak(prevIsBreak => {
      if (!prevIsBreak) {
        resetTimer(); // Reset timer when toggling to break
      }
      return !prevIsBreak;
    });
  };

  return (
    <Paper elevation={3} style={{ padding: '50px 30px', width: 600, margin: "20px auto", textAlign: 'center' }}>
      <h1>Pomodoro Timer</h1>
      <Typography variant="h1" gutterBottom>
        {formatTime(countdown)}
      </Typography>
      {selectedTodo && (
        <Typography variant="h6" gutterBottom>
          Current Task: {selectedTodo.title}
        </Typography>
      )}
      <div style={{ marginTop: 20 }}>
        {!isRunning ? (
          <IconButton aria-label="start">
          {!isAuthenticated ? (
            <PlayArrowIcon onClick={loginWithRedirect}/>
          ) : (
            <PlayArrowIcon onClick={startTimer}/>
          )}
          </IconButton>
        ) : isPaused ? (
          <IconButton aria-label="resume" onClick={resumeTimer}>
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
        <Button aria-label="toggle break" onClick={toggleBreak}>
          {isBreak ? "Back To Work" : "Take a Break"}
        </Button>
      </div>
    </Paper>
  );
}

// Helper function to format time
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
