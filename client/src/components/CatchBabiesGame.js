import React, { useEffect, useRef, useReducer, useCallback } from 'react';

// --- Constants ---
const GRID_SIZE = 15;
const CELL_SIZE = 30;
const CANVAS_WIDTH = GRID_SIZE * CELL_SIZE;
const CANVAS_HEIGHT = GRID_SIZE * CELL_SIZE;
const PLAYER_WIDTH = 100;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED_PER_SECOND = 800;
const BABY_RADIUS = CELL_SIZE / 3;  // Adjust the size of the baby if needed
const BABY_GENERATION_INTERVAL_MS = 800;
const INITIAL_LIVES = 3;

// --- Game State Reducer Actions ---
const gameActionTypes = {
    GAME_TICK: 'GAME_TICK',
    KEY_DOWN: 'KEY_DOWN',
    KEY_UP: 'KEY_UP',
    RESET_GAME: 'RESET_GAME',
};

// --- Initial State ---
const initialState = {
    babies: [],
    playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    lives: INITIAL_LIVES,  // Start with 3 lives
    score: 0,
    gameOver: false,
    lastBabyAddTime: performance.now(),
    keysPressed: {},
    babyFallSpeed: 200, // Initial speed of baby fall
};

// --- gameReducer function ---
function gameReducer(state, action) {
    switch (action.type) {
        case gameActionTypes.KEY_DOWN:
            return { ...state, keysPressed: { ...state.keysPressed, [action.key]: true } };
        case gameActionTypes.KEY_UP:
            const { [action.key]: _, ...remainingKeys } = state.keysPressed;
            return { ...state, keysPressed: remainingKeys };

        case gameActionTypes.GAME_TICK: {
            if (state.gameOver) return state;

            const { deltaTimeInSeconds, currentTimeMs } = action.payload;

            // --- 1. Player Movement ---
            let newPlayerX = state.playerX;
            const playerMoveDistance = PLAYER_SPEED_PER_SECOND * deltaTimeInSeconds;
            if (state.keysPressed['ArrowLeft']) {
                newPlayerX = Math.max(0, state.playerX - playerMoveDistance);
            }
            if (state.keysPressed['ArrowRight']) {
                newPlayerX = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, state.playerX + playerMoveDistance);
            }

            // --- 2. Baby Updates (Movement, Collision, Missed) ---
            let newBabies = [...state.babies];
            let currentLives = state.lives;
            let currentScore = state.score;

            const playerY = CANVAS_HEIGHT - PLAYER_HEIGHT;

            newBabies = newBabies.map(baby => {
                const newY = baby.y + state.babyFallSpeed * deltaTimeInSeconds; // Speed of the falling baby

                // Collision Detection (Player catching the baby)
                if (newY + BABY_RADIUS >= playerY && baby.y < playerY) {
                    if (baby.x + BABY_RADIUS > newPlayerX && baby.x - BABY_RADIUS < newPlayerX + PLAYER_WIDTH) {
                        currentScore++;
                        return null; // Baby caught
                    }
                }

                // Missed Detection (Baby goes off the screen)
                if (newY - BABY_RADIUS > CANVAS_HEIGHT) {
                    currentLives--;
                    return null; // Baby missed
                }

                return { ...baby, y: newY };
            }).filter(baby => baby !== null);

            // --- 3. Baby Generation ---
            let newLastBabyAddTime = state.lastBabyAddTime;
            const babyGenerationFrequency = Math.max(600 - currentScore * 10, 100); // Faster baby generation as score increases
            if (currentTimeMs - state.lastBabyAddTime > babyGenerationFrequency) {
                if (Math.random() > 0.2) {  // Reduced probability for baby spawn to make it more frequent as the score increases
                    const newBaby = {
                        id: currentTimeMs + Math.random(),
                        x: Math.random() * (CANVAS_WIDTH - BABY_RADIUS * 2) + BABY_RADIUS,
                        y: -BABY_RADIUS, // Start above canvas
                    };
                    newBabies.push(newBaby);
                }
                newLastBabyAddTime = currentTimeMs;
            }

            // --- 4. Gradual Baby Fall Speed Increase ---
            const speedIncreaseFactor = Math.min(currentScore * 5, 400); // Increment the speed smoothly with each baby caught
            state.babyFallSpeed = Math.max(200, 200 + speedIncreaseFactor); // Set the minimum and maximum speed limits

            // --- 5. Check Game Over ---
            const isGameOver = currentLives <= 0;

            // --- 6. Return Updated State ---
            return {
                ...state,
                playerX: newPlayerX,
                babies: newBabies,
                lives: currentLives,
                score: currentScore,
                gameOver: isGameOver,
                lastBabyAddTime: newLastBabyAddTime,
            };
        }

        case gameActionTypes.RESET_GAME:
            return { ...initialState, keysPressed: {}, lastBabyAddTime: performance.now() };

        default:
            console.warn(`Unhandled action type: ${action.type}`);
            return state;
    }
}

// --- The Component ---
const CatchBabiesGame = () => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const lastUpdateTimeRef = useRef(performance.now());

    const { babies, playerX, lives, score, gameOver } = state;

    // --- Main Game Loop ---
    const gameLoop = useCallback((currentTime) => {
        if (!lastUpdateTimeRef.current) {
            lastUpdateTimeRef.current = currentTime;
        }
        const deltaTimeMs = currentTime - lastUpdateTimeRef.current;
        lastUpdateTimeRef.current = currentTime;
        const deltaTimeInSeconds = deltaTimeMs / 1000.0;

        if (!gameOver) {
            dispatch({
                type: gameActionTypes.GAME_TICK,
                payload: { deltaTimeInSeconds, currentTimeMs: currentTime }
            });
        }

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // --- Draw Pickup Truck (Player) ---
            ctx.fillStyle = '#4682B4'; // Pickup truck color
            ctx.fillRect(playerX, CANVAS_HEIGHT - PLAYER_HEIGHT, PLAYER_WIDTH, 20); // Truck bed
            ctx.fillStyle = '#D3D3D3'; // Truck wheels
            ctx.beginPath();
            ctx.arc(playerX + 20, CANVAS_HEIGHT - 10, 10, 0, Math.PI * 2);
            ctx.arc(playerX + PLAYER_WIDTH - 20, CANVAS_HEIGHT - 10, 10, 0, Math.PI * 2);
            ctx.fill();

            // --- Draw Babies ---
            babies.forEach(baby => {
                // Baby's Head (Circle)
                ctx.fillStyle = '#FFDAB9'; // Skin color (light peach)
                ctx.beginPath();
                ctx.arc(baby.x, baby.y, 10, 0, Math.PI * 2); // Smaller head
                ctx.fill();

                // Baby's Body (Oval)
                ctx.fillStyle = '#FFB6C1'; // Baby body color
                ctx.beginPath();
                ctx.ellipse(baby.x, baby.y + 15, 12, 15, 0, 0, Math.PI * 2); // Smaller body
                ctx.fill();

                // Baby's Arms (Using lines)
                ctx.strokeStyle = '#FFDAB9'; // Skin color
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(baby.x - 12, baby.y + 3); // Left arm
                ctx.lineTo(baby.x - 22, baby.y + 10);
                ctx.moveTo(baby.x + 12, baby.y + 3); // Right arm
                ctx.lineTo(baby.x + 22, baby.y + 10);
                ctx.stroke();

                // Baby's Legs (Using lines)
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(baby.x - 8, baby.y + 30); // Left leg
                ctx.lineTo(baby.x - 8, baby.y + 45);
                ctx.moveTo(baby.x + 8, baby.y + 30); // Right leg
                ctx.lineTo(baby.x + 8, baby.y + 45);
                ctx.stroke();

                // Baby's Face (Eyes and Smile)
                ctx.fillStyle = '#000000'; // Eyes
                ctx.beginPath();
                ctx.arc(baby.x - 4, baby.y - 3, 1.5, 0, Math.PI * 2); // Left eye
                ctx.arc(baby.x + 4, baby.y - 3, 1.5, 0, Math.PI * 2); // Right eye
                ctx.fill();

                // Baby's Smile
                ctx.strokeStyle = '#000000'; // Smile color
                ctx.beginPath();
                ctx.arc(baby.x, baby.y + 3, 3, 0, Math.PI); // Smile
                ctx.stroke();
            });
        }

        animationFrameId.current = requestAnimationFrame(gameLoop);

    }, [gameOver, babies, playerX]);

    useEffect(() => {
        lastUpdateTimeRef.current = performance.now();
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [gameLoop]);

    // --- Keyboard Event Handlers ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                dispatch({ type: gameActionTypes.KEY_DOWN, key: e.key });
            }
        };
        const handleKeyUp = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                dispatch({ type: gameActionTypes.KEY_UP, key: e.key });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleResetGame = () => {
        dispatch({ type: gameActionTypes.RESET_GAME });
    };

    return (
        <div className="snake-game-container-themed" style={{ textAlign: 'center' }}>
            <h3>Catch the Babies!</h3>
            <p>Score: {score} | Lives: {lives} / {INITIAL_LIVES}</p>
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{ border: '1px solid rgb(0, 36, 1)', background: '#000' }}
            />
            {gameOver && (
                <div className="game-over-themed" style={{ marginTop: '15px' }}>
                    Game Over!
                    <button
                        onClick={handleResetGame}
                        className="restart-button-themed"
                        style={{ marginLeft: '15px', padding: '8px 15px', cursor: 'pointer' }}
                    >
                        Play Again
                    </button>
                </div>
            )}
            {!gameOver && (
                <p className="controls-info-themed" style={{ marginTop: '10px' }}>
                    Use Arrow Keys to Move
                </p>
            )}
        </div>
    );
};

export default CatchBabiesGame;
