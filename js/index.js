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
  const path = dijkstra(snake[0], food); // Find the path from the snake to the food
  if (path.length === 0) return 'right'; // Default direction

  const nextStep = path[1]; // The next step is the second node in the path (first node is the snake's head)

  // Convert the next step to a direction
  if (nextStep.x > snake[0].x) return 'right';
  if (nextStep.x < snake[0].x) return 'left';
  if (nextStep.y > snake[0].y) return 'down';
  if (nextStep.y < snake[0].y) return 'up';
}

// Dijkstra's algorithm for pathfinding
function dijkstra(start, goal) {
  const distances = {}; // Stores the distances from start to each node
  const previous = {}; // Stores the previous node in the shortest path
  const queue = new PriorityQueue(); // Priority queue for nodes to visit

  // Initialize distances and queue
  Object.values(snake).forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
    queue.enqueue(node, Infinity);
  });

  distances[start] = 0;
  queue.changePriority(start, 0);

  while (!queue.isEmpty()) {
    const current = queue.dequeue();

    if (current === goal) {
      const path = [];
      let temp = goal;
      while (temp !== null) {
        path.unshift(temp);
        temp = previous[temp];
      }
      return path;
    }

    const neighbors = getNeighbors(current);
    neighbors.forEach(neighbor => {
      const alt = distances[current] + 1; // Assuming uniform cost for each move
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;
        queue.changePriority(neighbor, alt);
      }
    });
  }

  return [];
}

// Heuristic function for Dijkstra's algorithm (not used, but can be enhanced for other purposes)
function heuristic(node, goal) {
  // In Dijkstra's algorithm, heuristic is not used, but you can enhance it for other purposes
  return 0; // Default heuristic value
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

  // Check for collision with walls or snake's body
  if (isCollision(head)) {
    console.log('Collision detected.\nEnding game...');
    resetGame();
    return; // Exit the function to prevent further execution
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      move();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function isCollision(position) {
  // Check for collisions with the walls
  if (
    position.x < 1 || position.x > gridSize ||
    position.y < 1 || position.y > gridSize
  ) {
    return true;
  }

  // Check for collisions with the snake's body
  for (let i = 1; i < snake.length; i++) {
    if (position.x === snake[i].x && position.y === snake[i].y) {
      return true;
    }
  }

  return false;
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
    console.log('Collision with wall detected.\nEnding game...');
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      console.log('Collision with self detected.\nEnding game...');
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
