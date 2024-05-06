// HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map, snake, food
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

// Generate snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Adds AI movement to the game
function aiDirection() {
    const head = { ...snake[0] }; // Get the current head of the snake
    if (head.x < food.x) {
      return 'right';
    } else if (head.x > food.x) {
      return 'left';
    } else if (head.y < food.y) {
      return 'down';
    } else if (head.y > food.y) {
      return 'up';
    }
  }

// Moving the snake
function move() {
    direction = aiDirection(); // Use the AI function to decide the direction
    const head = { ...snake[0] };
    switch (direction) {
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
      case 'left':
        head.x--;
        break;
      case 'right':
        head.x++;
        break;
    }
  
    snake.unshift(head);
  
    if (head.x === food.x && head.y === food.y) {
      food = generateFood();
      increaseSpeed();
      clearInterval(gameInterval); // Clear past interval
      gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
      }, gameSpeedDelay);
    } else {
      snake.pop();
    }
  }

// Start game
function startGame() {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function aiDirection() {
    const start = { x: snake[0].x, y: snake[0].y }; // Convert the snake's head to a node
    const goal = { x: food.x, y: food.y }; // Convert the food to a node
  
    const path = aStar(start, goal); // Find the path from the start to the goal
  
    if (path.length > 0) {
      const nextStep = path[0]; // The next step is the first node in the path
  
      // Convert the next step to a direction
      if (nextStep.x > start.x) {
        return 'right';
      } else if (nextStep.x < start.x) {
        return 'left';
      } else if (nextStep.y > start.y) {
        return 'down';
      } else if (nextStep.y < start.y) {
        return 'up';
      }
    }
  
    return 'right'; // Default direction
  }  

// Keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame();
  } /*else {
    
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  }*/
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}



function getNeighbors(node) {
    let neighbors = [];
  
    // Check the cell on the right
    if (node.x < gridSize) {
      neighbors.push({ x: node.x + 1, y: node.y });
    }
  
    // Check the cell on the left
    if (node.x > 1) {
      neighbors.push({ x: node.x - 1, y: node.y });
    }
  
    // Check the cell above
    if (node.y > 1) {
      neighbors.push({ x: node.x, y: node.y - 1 });
    }
  
    // Check the cell below
    if (node.y < gridSize) {
      neighbors.push({ x: node.x, y: node.y + 1 });
    }
  
    // Filter out the neighbors that are part of the snake's body
    neighbors = neighbors.filter(neighbor => !snake.some(segment => segment.x === neighbor.x && segment.y === neighbor.y));
  
    return neighbors;
  }
  