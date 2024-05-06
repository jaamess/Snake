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
    let x, y;
    do {
      x = Math.floor(Math.random() * gridSize) + 1;
      y = Math.floor(Math.random() * gridSize) + 1;
    } while (isSnake({ x, y }));
    return { x, y };
  }  

// Adds AI movement to the game
function aiDirection() {
  const path = aStar(snake[0], food); // Find the path from the snake to the food
  if (path.length === 0) return 'right'; // Default direction

  const nextStep = path[0]; // The next step is the first node in the path

  // Convert the next step to a direction
  if (nextStep.x > snake[0].x) return 'right';
  if (nextStep.x < snake[0].x) return 'left';
  if (nextStep.y > snake[0].y) return 'down';
  if (nextStep.y < snake[0].y) return 'up';
}

// Moving the snake
function move() {
  direction = aiDirection(); // Use the AI function to decide the direction
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      console.log('Move up')
      break;
    case 'down':
      head.y++;
      console.log('Move down')
      break;
    case 'left':
      head.x--;
      console.log('Move left')
      break;
    case 'right':
      head.x++;
      console.log('Move right')
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

// Keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame();
  }
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
      console.log('Collision detected.\nEnding game...')
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

function aStar(start, goal) {
  let openList = [start];
  let closedList = [];

  while (openList.length > 0) {
    let currentNode = openList.sort((a, b) => a.f - b.f)[0];

    if (currentNode.x === goal.x && currentNode.y === goal.y) {
      let path = [];
      while (currentNode !== start) {
        path.unshift(currentNode);
        currentNode = currentNode.parent;
      }
      return path;
    }

    openList = openList.filter(node => node !== currentNode);
    closedList.push(currentNode);

    let neighbors = getNeighbors(currentNode);

    for (let neighbor of neighbors) {
      if (closedList.some(closedNode => closedNode.x === neighbor.x && closedNode.y === neighbor.y)) continue;

      let tempG = currentNode.g + 1;

      if (openList.some(openNode => openNode.x === neighbor.x && openNode.y === neighbor.y)) {
        if (tempG < neighbor.g) {
          neighbor.g = tempG;
        }
      } else {
        neighbor.g = tempG;
        openList.push(neighbor);
      }

      neighbor.h = heuristic(neighbor, goal);
      neighbor.f = neighbor.g + neighbor.h;
      neighbor.parent = currentNode;
    }
  }

  return [];
}

function heuristic(node, goal) {
  // Calculate Manhattan distance from current node to goal
  let distanceToGoal = Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);

  // Calculate the distance to the tail of the snake
  let minDistanceToTail = Infinity;
  snake.forEach(segment => {
    const distance = Math.abs(segment.x - node.x) + Math.abs(segment.y - node.y);
    if (distance < minDistanceToTail) {
      minDistanceToTail = distance;
    }
  });

  // Heuristic value is a combination of distance to goal and distance to tail
  return distanceToGoal + minDistanceToTail;
}

function getNeighbors(node) {
    let neighbors = [];
  
    // Check the cell on the right
    if (node.x < gridSize && !isSnake({ x: node.x + 1, y: node.y })) {
      neighbors.push({ x: node.x + 1, y: node.y });
    }
  
    // Check the cell on the left
    if (node.x > 1 && !isSnake({ x: node.x - 1, y: node.y })) {
      neighbors.push({ x: node.x - 1, y: node.y });
    }
  
    // Check the cell above
    if (node.y > 1 && !isSnake({ x: node.x, y: node.y - 1 })) {
      neighbors.push({ x: node.x, y: node.y - 1 });
    }
  
    // Check the cell below
    if (node.y < gridSize && !isSnake({ x: node.x, y: node.y + 1 })) {
      neighbors.push({ x: node.x, y: node.y + 1 });
    }
  
    return neighbors;
  }
  
  function isSnake(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
  }