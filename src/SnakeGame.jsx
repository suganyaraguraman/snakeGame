import { useEffect, useRef, useState } from "react";

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const gridSize = 20; // Move these to the top
  const canvasSize = 400;

  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(generateFood(5)); // Start with 5 food items
  const [velocity, setVelocity] = useState({ x: 1, y: 0 }); // Start moving to the right
  const [gameOver, setGameOver] = useState(false);

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

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [velocity]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const drawGame = () => {
      if (gameOver) return;

      const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

      // Check for wall collisions or self-collision
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

      const newSnake = [head, ...snake];

      // Check if the snake eats any food
      const remainingFood = food.filter(
        (f) => f.x !== head.x || f.y !== head.y
      );

      if (remainingFood.length !== food.length) {
        setFood(generateFood(5)); // Generate more food if one was eaten
      }

      // Remove last part of the snake if no food eaten
      if (remainingFood.length === food.length) {
        newSnake.pop();
      }

      setSnake(newSnake);
      setFood(remainingFood);

      // Draw the game
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvasSize, canvasSize); // Clear the canvas

      ctx.fillStyle = "lime";
      newSnake.forEach(({ x, y }) =>
        ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2)
      );

      ctx.fillStyle = "red";
      food.forEach(({ x, y }) =>
        ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2)
      );
    };

    const interval = setInterval(drawGame, 150);
    return () => clearInterval(interval);
  }, [snake, food, velocity, gameOver]);

  // Function to generate random food positions
  function generateFood(count) {
    const foodItems = [];
    for (let i = 0; i < count; i++) {
      let foodX, foodY;
      // Ensure the food doesn't spawn on the snake's body
      do {
        foodX = Math.floor(Math.random() * (canvasSize / gridSize));
        foodY = Math.floor(Math.random() * (canvasSize / gridSize));
      } while (snake.some((s) => s.x === foodX && s.y === foodY)); // Avoid collision with snake
      foodItems.push({ x: foodX, y: foodY });
    }
    return foodItems;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Snake Game</h2>
      {gameOver && <div style={{ color: "red" }}>Game Over</div>}
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{ border: "2px solid white" }}
      />
    </div>
  );
};

export default SnakeGame;
