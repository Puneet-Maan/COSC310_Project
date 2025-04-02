import React, { useState, useEffect, useRef } from 'react';

const RacingGameCanvas = () => {
    const canvasRef = useRef(null);
    const [playerX, setPlayerX] = useState(250); // Centered for wider canvas
    const playerY = 420;
    const playerWidth = 40; // Compact visual size for the player's car
    const playerHeight = 70;

    const playerSpeed = 7;
    const [traffic, setTraffic] = useState([]);
    const baseTrafficSpeed = 2;
    const trafficSpeedIncreaseRate = 0.02;
    const baseSpawnRate = 0.01;
    const spawnRateIncreaseRate = 0.0003;
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const keysPressed = useRef({});
    const gameLoop = useRef(null);
    const lastTime = useRef(0);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (event) => {
            keysPressed.current[event.key] = true;
        };

        const handleKeyUp = (event) => {
            delete keysPressed.current[event.key];
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Game loop
    useEffect(() => {
        if (gameOver) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const loop = (timestamp) => {
            const deltaTime = (timestamp - lastTime.current) / 16.66;
            lastTime.current = timestamp;

            update(deltaTime);
            render(ctx);

            if (!gameOver) {
                gameLoop.current = requestAnimationFrame(loop);
            }
        };

        gameLoop.current = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(gameLoop.current);
        };
    }, [gameOver, traffic]);

    const update = (deltaTime) => {
        if (gameOver) return;

        const canvas = canvasRef.current;

        // Player movement
        if (keysPressed.current['ArrowLeft']) {
            setPlayerX((prevX) => Math.max(prevX - playerSpeed * deltaTime, 50));
        }
        if (keysPressed.current['ArrowRight']) {
            setPlayerX((prevX) => Math.min(prevX + playerSpeed * deltaTime, canvas.width - 50 - playerWidth));
        }

        // Traffic speed increase based on score
        const currentTrafficSpeed = baseTrafficSpeed + score * trafficSpeedIncreaseRate;

        // Move traffic
        setTraffic((prevTraffic) =>
            prevTraffic
                .map((car) => ({ ...car, y: car.y + currentTrafficSpeed * deltaTime }))
                .filter((car) => car.y < canvas.height)
        );

        // Increase spawn rate based on score
        const currentSpawnRate = baseSpawnRate + score * spawnRateIncreaseRate;

        // Add new traffic (cars) at a random position without overlapping
        if (Math.random() < currentSpawnRate) {
            const carWidth = Math.random() * 30 + 20; // Smaller and more realistic widths
            const carHeight = Math.random() * 40 + 30; // Smaller and more realistic heights

            const roadLeftBoundary = 50; // Adjusted for wider road
            const roadRightBoundary = canvas.width - 50 - carWidth;

            let randomX = Math.random() * (roadRightBoundary - roadLeftBoundary) + roadLeftBoundary;
            const randomY = -carHeight;

            const doesOverlap = traffic.some(
                (existingCar) =>
                    randomX < existingCar.x + existingCar.width &&
                    randomX + carWidth > existingCar.x &&
                    randomY < existingCar.y + existingCar.height &&
                    randomY + carHeight > existingCar.y
            );

            if (!doesOverlap) {
                const newCar = {
                    x: randomX,
                    y: randomY,
                    width: carWidth,
                    height: carHeight,
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                };
                setTraffic((prevTraffic) => [...prevTraffic, newCar]);
            }
        }

        // Check for collision with traffic
        for (const car of traffic) {
            if (
                playerX < car.x + car.width &&
                playerX + playerWidth > car.x &&
                playerY < car.y + car.height &&
                playerY + playerHeight > car.y
            ) {
                setGameOver(true);
                break;
            }
        }

        // Increment score
        setScore((prevScore) => prevScore + 1);
    };

    const render = (ctx) => {
        const canvas = canvasRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // No road background anymore
        // ctx.fillStyle = '#87CEEB'; // Light blue background (optional)
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw wider road
        ctx.fillStyle = '#222'; // Asphalt road
        ctx.fillRect(50, 0, canvas.width - 100, canvas.height); // Wider road

        // Lane markings
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.setLineDash([30, 30]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw player car
        drawPlayerCar(ctx, playerX, playerY, playerWidth, playerHeight);

        // Draw traffic cars
        traffic.forEach((car) => {
            drawTrafficCar(ctx, car.x, car.y, car.width, car.height, car.color);
        });

        // Show "Game Over" if applicable
        if (gameOver) {
            ctx.fillStyle = 'red';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        }
    };

    const drawPlayerCar = (ctx, x, y, width, height) => {
        ctx.fillStyle = 'lime'; // Main body
        ctx.fillRect(x, y, width, height);

        ctx.fillStyle = 'black'; // Wheels
        ctx.fillRect(x + 5, y + height - 5, 10, 5); // Rear wheel
        ctx.fillRect(x + width - 15, y + height - 5, 10, 5); // Front wheel

        ctx.fillStyle = 'skyblue'; // Windows
        ctx.fillRect(x + 5, y + 5, width - 10, height / 2);
    };

    const drawTrafficCar = (ctx, x, y, width, height, color) => {
        ctx.fillStyle = color; // Body color
        ctx.fillRect(x, y, width, height);

        ctx.fillStyle = 'black'; // Wheels
        ctx.fillRect(x + 5, y + height - 5, 10, 5); // Rear wheel
        ctx.fillRect(x + width - 15, y + height - 5, 10, 5); // Front wheel

        ctx.fillStyle = 'white'; // Windows
        ctx.fillRect(x + 5, y + 5, width - 10, height / 2);
    };

    const resetGame2 = () => {
        cancelAnimationFrame(gameLoop.current);
        setGameOver(false);
        setPlayerX(250);
        setTraffic([]);
        setScore(0);
        lastTime.current = performance.now();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const loop = (timestamp) => {
            const deltaTime = (timestamp - lastTime.current) / 16.66;
            lastTime.current = timestamp;

            update(deltaTime);
            render(ctx);

            if (!gameOver) {
                gameLoop.current = requestAnimationFrame(loop);
            }
        };

        gameLoop.current = requestAnimationFrame(loop);
    };

    return (
        <div className="snake-game-container-themed">
            <h3>Mini Racing Game</h3>
            <p>Score: {score}</p>
            <canvas
                ref={canvasRef}
                width={600}
                height={500}
                style={{ border: '1px solid rgb(0, 36, 1)' }}
            ></canvas>
            {gameOver && (
                <div className="game-over-themed">
                    Game Over! <button onClick={resetGame2} className="restart-button-themed">Play Again</button>
                </div>
            )}
            {!gameOver && <p className="controls-info-themed">Use Arrow Keys to Control</p>}
        </div>
    );
};

export default RacingGameCanvas;