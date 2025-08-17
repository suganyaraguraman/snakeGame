import { useEffect, useRef, useState } from "react";

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]); // Initial snake position
  const [foodItems, setFoodItems] = useState([{ x: 5, y: 5 }]); // Start with one food item
  const [velocity, setVelocity] = useState({ x: 1, y: 0 }); // Start moving right
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const gridSize = 20;
  const canvasSize = 400;
  const targetFoodCount = 10; // Target food items to eat to win
  const [eatenFoodCount, setEatenFoodCount] = useState(0); // Track number of food eaten

  // Handle keyboard events for desktop
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (velocity.y === 0) setVelocity({ x: 0, y: -1 });
        break;
      case "ArrowDown":
        if (velocity.y === 0) setVelocity({ x: 0, y: 1 });
        break;
      case "ArrowLeft":
        if (velocity.x === 0) setVelocity({ x: -1, y: 0 });
        break;
      case "ArrowRight":
        if (velocity.x === 0) setVelocity({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    const touchStart = e.touches[0];
    setTouchStart({ x: touchStart.clientX, y: touchStart.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0];
    const diffX = touchEnd.clientX - touchStart.x;
    const diffY = touchEnd.clientY - touchStart.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && velocity.x === 0) {
        setVelocity({ x: 1, y: 0 }); // Swipe Right
      } else if (diffX < 0 && velocity.x === 0) {
        setVelocity({ x: -1, y: 0 }); // Swipe Left
      }
    } else {
      if (diffY > 0 && velocity.y === 0) {
        setVelocity({ x: 0, y: 1 }); // Swipe Down
      } else if (diffY < 0 && velocity.y === 0) {
        setVelocity({ x: 0, y: -1 }); // Swipe Up
      }
    }

    setTouchStart(null);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [velocity]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const drawGame = () => {
      if (gameOver || gameWon) return;

      const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

      // Collision check: wall or self
      if (
        head.x < 0 ||
        head.x >= canvasSize / gridSize ||
        head.y < 0 ||
        head.y >= canvasSize / gridSize ||
        snake.some((s) => s.x === head.x && s.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      // Add the new head to the snake
      const newSnake = [head, ...snake];

      // Check for food collision
      const eatenFood = foodItems.filter(
        (food) => food.x === head.x && food.y === head.y
      );
      if (eatenFood.length > 0) {
        // Food eaten, remove the food from the array
        setFoodItems(foodItems.filter((food) => !eatenFood.includes(food)));
        setEatenFoodCount((prevCount) => prevCount + 1);

        // Check if player has eaten enough food to win
        if (eatenFoodCount + 1 >= targetFoodCount) {
          setGameWon(true); // Player wins
        } else {
          // No more food generation after win condition is reached
          if (!gameWon) {
            // Add new food at a random position (Only if player has not won)
            while (true) {
              const newFood = {
                x: Math.floor(Math.random() * (canvasSize / gridSize)),
                y: Math.floor(Math.random() * (canvasSize / gridSize)),
              };
              // Avoid placing food on the snake's position
              if (!snake.some((s) => s.x === newFood.x && s.y === newFood.y)) {
                setFoodItems((prevFoods) => [...prevFoods, newFood]);
                break;
              }
            }
          }
        }
      } else {
        // Remove the last segment (tail) if no food is eaten
        newSnake.pop();
      }

      setSnake(newSnake);

      // Draw everything
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      ctx.fillStyle = "lime";
      newSnake.forEach(({ x, y }) =>
        ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2)
      );

      // Draw food items
      ctx.fillStyle = "red";
      foodItems.forEach(({ x, y }) =>
        ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2)
      );
    };

    const interval = setInterval(drawGame, 400); // Draw every 150ms
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [snake, foodItems, velocity, gameOver, gameWon, eatenFoodCount]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Snake Game</h2>
      {gameOver && !gameWon && <div style={{ color: "red" }}>Game Over</div>}
      {gameWon && <div style={{ color: "green" }}>You Win!</div>}
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{ border: "2px solid white" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
};

export default SnakeGame;
