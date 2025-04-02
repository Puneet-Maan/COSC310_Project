import React, { useEffect, useState } from 'react';
import SnakeGame from './SnakeGame';
import RacingGameCanvas from './RacingGameCanvas';
import CatchBallsGame from './CatchBabiesGame'; // Import the CatchBallsGame component

function StudentHome() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const [showRacingGameCanvas, setShowRacingGameCanvas] = useState(false);
  const [showCatchBallsGame, setShowCatchBallsGame] = useState(false); // State for Catch the Balls game

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in.');
          return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        const response = await fetch(`http://localhost:3000/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError('Failed to fetch profile data. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Network error. Please check your connection.');
      }
    };

    fetchProfile();
  }, []);

  const handlePlaySnakeClick = () => {
    setShowSnakeGame(true);
    setShowRacingGameCanvas(false);
    setShowCatchBallsGame(false); // Hide the Catch the Balls game when Snake is selected
  };

  const handlePlayRacingClick = () => {
    setShowRacingGameCanvas(true);
    setShowSnakeGame(false);
    setShowCatchBallsGame(false); // Hide the Catch the Balls game when Racing is selected
  };

  const handlePlayCatchBallsClick = () => {
    setShowCatchBallsGame(true);
    setShowSnakeGame(false);
    setShowRacingGameCanvas(false); // Hide the other games when Catch the Balls is selected
  };

  // Function to handle going back from any game and showing game selection
  const handleBackToHome = () => {
    setShowSnakeGame(false);
    setShowRacingGameCanvas(false);
    setShowCatchBallsGame(false); // Hide the Catch the Balls game when going back to selection
  };

  return (
    <div className="student-home-page">
      <div className="admin-course-list-page">
        <h1 className="page-title">
          {profile ? profile.name : 'Student'}
        </h1>
        <p className="intro-message" style={{ textAlign: 'center' }}>
        You’re probably going to fail your exams anyway, so why not fail at a game instead? At least you’ll have fun doing it!
        </p>

        {profile && !showSnakeGame && !showRacingGameCanvas && !showCatchBallsGame && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button
              className="btn-primary"
              onClick={handlePlaySnakeClick}
              style={{
                display: 'inline-block',
                margin: '10px',
                textAlign: 'center',
              }}
            >
              Play Snake Game
            </button>
            <button
              className="btn-primary"
              onClick={handlePlayRacingClick}
              style={{
                display: 'inline-block',
                margin: '10px',
                textAlign: 'center',
              }}
            >
              Play Neon Racer
            </button>
            <button
              className="btn-primary"
              onClick={handlePlayCatchBallsClick}
              style={{
                display: 'inline-block',
                margin: '10px',
                textAlign: 'center',
              }}
            >
              Play Catch the Balls
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {!profile && !error && <p className="error-message">Loading your profile...</p>}

        {/* Conditionally show the Back to Game Selection button if a game is active */}
        {(showSnakeGame || showRacingGameCanvas || showCatchBallsGame) && (
          <button 
            onClick={handleBackToHome} 
            className="btn-primary"
            style={{
              display: 'block',
              margin: '20px auto',
              textAlign: 'center'
            }}
          >
            Back to Game Selection
          </button>
        )}

        {profile && showSnakeGame && (
          <div className="snake-game-wrapper">
            <SnakeGame />
          </div>
        )}

        {profile && showRacingGameCanvas && (
          <div className="racing-game-canvas-wrapper">
            <RacingGameCanvas />
          </div>
        )}

        {profile && showCatchBallsGame && (
          <div className="catch-balls-game-wrapper">
            <CatchBallsGame />
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentHome;
