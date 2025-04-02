import React, { useState, useEffect, useRef } from 'react';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const gridSize = 15;
  const cellSize = 30; // Size of each grid cell
  const initialSnake = [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }];
  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(generateFood(gridSize, initialSnake));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoop = useRef(null);
  const lastUpdateTime = useRef(0);
  const gameSpeed = 150; // Higher value means slower game

  function generateFood(size, currentSnake) {
    let newFood;
    while (!newFood || currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      newFood = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
      };
    }
    return newFood;
  }

  function moveSnake(currentTime) {
    if (gameOver) return;

    if (currentTime - lastUpdateTime.current < gameSpeed) {
      gameLoop.current = requestAnimationFrame(moveSnake);
      return;
    }

    lastUpdateTime.current = currentTime;

    const head = { ...snake[snake.length - 1] };
    switch (direction) {
      case 'UP':
        head.y--;
        break;
      case 'DOWN':
        head.y++;
        break;
      case 'LEFT':
        head.x--;
        break;
      case 'RIGHT':
        head.x++;
        break;
      default:
        break;
    }

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || checkCollision(head)) {
      setGameOver(true);
      cancelAnimationFrame(gameLoop.current);
      return;
    }

    const newSnake = [...snake, head];
    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood(gridSize, newSnake));
      setScore(score + 1);
    } else {
      newSnake.shift();
    }
    setSnake(newSnake);
    gameLoop.current = requestAnimationFrame(moveSnake);
  }

  function checkCollision(head) {
    return snake.slice(0, -1).some(segment => segment.x === head.x && segment.y === head.y);
  }

  function handleKeyDown(e) {
    e.preventDefault(); // Prevent default scrolling
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  }

  const resetGame = () => {
    setSnake(initialSnake);
    setDirection('RIGHT');
    setFood(generateFood(gridSize, initialSnake));
    setGameOver(false);
    setScore(0);
    lastUpdateTime.current = performance.now();
    gameLoop.current = requestAnimationFrame(moveSnake);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    gameLoop.current = requestAnimationFrame(moveSnake);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Initial drawing
    drawGame(ctx);

    return () => {
      cancelAnimationFrame(gameLoop.current);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [snake, direction, food, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    drawGame(ctx);
  }, [snake, food, gameOver]);

  const drawGame = (ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw food (rat)
    drawRat(ctx, food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2);

    // Draw snake
    snake.forEach((segment, index) => {
      drawSnakeSegment(ctx, segment.x * cellSize, segment.y * cellSize, index === snake.length - 1);
    });
  };

  const drawSnakeSegment = (ctx, x, y, isHead) => {
    if (isHead) {
      // Draw the snake's head
      ctx.fillStyle = '#228B22'; // Dark green for the head
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Add eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x + cellSize / 4, y + cellSize / 3, cellSize / 6, 0, Math.PI * 2); // Left eye
      ctx.arc(x + (3 * cellSize) / 4, y + cellSize / 3, cellSize / 6, 0, Math.PI * 2); // Right eye
      ctx.fill();

      // Add forked tongue
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + cellSize / 2, y + cellSize); // Tongue base
      ctx.lineTo(x + cellSize / 3, y + cellSize + 10); // Left fork
      ctx.moveTo(x + cellSize / 2, y + cellSize); // Tongue base
      ctx.lineTo(x + (2 * cellSize) / 3, y + cellSize + 10); // Right fork
      ctx.stroke();
    } else {
      // Draw the snake's body
      ctx.fillStyle = '#32CD32'; // Lime green for body
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawRat = (ctx, x, y) => {
    // Draw the rat's body
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.arc(x, y, cellSize / 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw tail
    ctx.strokeStyle = 'pink';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + cellSize / 2.5);
    ctx.lineTo(x, y + cellSize);
    ctx.stroke();

    // Draw ears
    ctx.fillStyle = 'pink';
    ctx.beginPath();
    ctx.arc(x - 5, y - 10, 4, 0, Math.PI * 2); // Left ear
    ctx.arc(x + 5, y - 10, 4, 0, Math.PI * 2); // Right ear
    ctx.fill();
  };

  return (
    <div className="snake-game-container-themed">
      <h3>Mini Snake Game</h3>
      <p>Score: {score}</p>
      <canvas
        ref={canvasRef}
        width={gridSize * cellSize}
        height={gridSize * cellSize}
        style={{ border: '1px solid rgb(0, 36, 1)' }}
        ></canvas>
      {gameOver && (
        <div className="game-over-themed">
          Game Over! <button onClick={resetGame} className="restart-button-themed">Play Again</button>
        </div>
      )}
      {!gameOver && <p className="controls-info-themed">Use Arrow Keys to Control</p>}
    </div>
  );
};

export default SnakeGame;
