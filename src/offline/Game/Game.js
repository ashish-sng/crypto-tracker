import React, { useState, useEffect, useCallback } from 'react';
import './offlineGame.css';

const OfflineGame = () => {
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [obstaclePosition, setObstaclePosition] = useState(400);

  // Constants for game configuration
  const PLAYER_LEFT = 50; // px from left
  const GROUND_HEIGHT = 20; // px from bottom
  const JUMP_HEIGHT = 150; // px from bottom when jumping
  const PLAYER_WIDTH = 30;
  const PLAYER_HEIGHT = 50;
  const OBSTACLE_WIDTH = 20;
  const OBSTACLE_HEIGHT = 30;

  const handleJump = useCallback(() => {
    if (!isJumping && !gameOver) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 500);
    }
  }, [isJumping, gameOver]);

  // Game loop for obstacle movement
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setObstaclePosition((prevPosition) => {
        if (prevPosition <= -50) {
          setScore((prev) => prev + 1);
          return 400;
        }
        return prevPosition - 5;
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameOver]);

  // Collision detection
  useEffect(() => {
    if (gameOver) return;

    const checkCollision = () => {
      const playerBottom = isJumping ? JUMP_HEIGHT : GROUND_HEIGHT;
      const obstacleLeft = obstaclePosition;

      const playerRight = PLAYER_LEFT + PLAYER_WIDTH;
      const playerLeft = PLAYER_LEFT;
      const obstacleRight = obstacleLeft + OBSTACLE_WIDTH;

      const horizontalCollision =
        obstacleRight > playerLeft && obstacleLeft < playerRight;

      const verticalCollision =
        playerBottom < GROUND_HEIGHT + OBSTACLE_HEIGHT + 20;

      if (horizontalCollision && !isJumping && verticalCollision) {
        setGameOver(true);
      }
    };

    const collisionInterval = setInterval(checkCollision, 10);
    return () => clearInterval(collisionInterval);
  }, [obstaclePosition, isJumping, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleJump]);

  const resetGame = () => {
    setGameOver(false);
    setObstaclePosition(400);
    setScore(0);
    setIsJumping(false);
  };

  return (
    <div className="game-container" role="region" aria-labelledby="gameArea">
      <div
        className="game-area"
        onClick={handleJump}
        style={{ touchAction: 'manipulation' }}
        role="button"
        aria-label="Click to jump"
      >
        <div id="gameArea" className="score-display">
          Score: {score}
        </div>

        {/* Player */}
        <div
          className="player"
          role="presentation" // Ensures it's ignored by screen readers
          style={{
            width: `${PLAYER_WIDTH}px`,
            height: `${PLAYER_HEIGHT}px`,
            bottom: isJumping ? `${JUMP_HEIGHT}px` : `${GROUND_HEIGHT}px`,
            left: `${PLAYER_LEFT}px`,
          }}
        />

        {/* Obstacle */}
        <div
          className="obstacle"
          role="presentation" // Ensures it's ignored by screen readers
          style={{
            left: `${obstaclePosition}px`,
            bottom: `${GROUND_HEIGHT}px`,
            width: `${OBSTACLE_WIDTH}px`,
            height: `${OBSTACLE_HEIGHT}px`,
          }}
        />

        <div className="ground-line" />

        {gameOver && (
          <div
            className="game-over-overlay"
            role="dialog"
            aria-labelledby="gameOverTitle"
          >
            <div className="game-over-modal">
              <h2 id="gameOverTitle" className="game-over-title">
                Game Over!
              </h2>
              <p className="game-over-score">Final Score: {score}</p>
              <button
                className="restart-button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                aria-label="Restart the game"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="controls-hint"
        role="alert"
        aria-live="assertive"
        aria-label="Press spacebar or click/tap to jump"
      >
        Press SPACE or click/tap to jump
      </div>
    </div>
  );
};

export default OfflineGame;
