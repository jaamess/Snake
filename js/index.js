const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
let gameMode = '';
let gridSize;
let snake;
let food = null;
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 100;
let gameStarted = false;

function draw() {
  const fragment = document.createDocumentFragment();
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    fragment.appendChild(snakeElement);
  });
  if (gameStarted && food) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    if (gameMode === 'custom') {
      foodElement.style.backgroundImage = "url('assets/dogui.png')";
      foodElement.style.backgroundSize = 'cover';
      foodElement.style.border = 'none';
    }
    fragment.appendChild(foodElement);
  }
  board.innerHTML = '';
  board.appendChild(fragment);
  updateScore();
}

function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function generateFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * gridSize) + 1;
    y = Math.floor(Math.random() * gridSize) + 1;
  } while (isSnake({ x, y }));
  return { x, y };
}

function aiDirection() {
  if (food) {
    const path = aStar(snake[0], food);
    if (path.length === 0) return 'right';
    const nextStep = path[0];
    if (nextStep.x > snake[0].x) return 'right';
    if (nextStep.x < snake[0].x) return 'left';
    if (nextStep.y > snake[0].y) return 'down';
    if (nextStep.y < snake[0].y) return 'up';
  } else {
    return safeMove();
  }
}

function safeMove() {
  const possibleDirections = ['up', 'down', 'left', 'right'];
  for (const dir of possibleDirections) {
    if (isSafeDirection(dir)) {
      return dir;
    }
  }
  return direction;
}

function isSafeDirection(dir) {
  const head = { ...snake[0] };
  switch (dir) {
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
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    return false;
  }
  if (isSnake(head)) {
    return false;
  }
  return true;
}

function move() {
  direction = aiDirection();
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
  if (food && head.x === food.x && head.y === food.y) {
    food = null;
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
    if (gameMode === 'classic') {
      food = generateFood();
    }
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true;
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  document.getElementById('game-mode-selection').style.display = 'none';

  if (gameMode === 'custom') {
    gridSize = 20;
    board.style.gridTemplateColumns = 'repeat(20, 35px)';
    board.style.gridTemplateRows = 'repeat(20, 35px)';
    snake = [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }];
    food = null;
    board.addEventListener('click', placeFood);
  } else {
    gridSize = 25;
    board.style.gridTemplateColumns = 'repeat(25, 20px)';
    board.style.gridTemplateRows = 'repeat(25, 20px)';
    snake = [{ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }];
    food = generateFood();
  }

  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function placeFood(event) {
  const rect = board.getBoundingClientRect();
  const cellWidth = rect.width / gridSize;
  const cellHeight = rect.height / gridSize;
  const x = Math.floor((event.clientX - rect.left) / cellWidth) + 1;
  const y = Math.floor((event.clientY - rect.top) / cellHeight) + 1;
  if (x < 1 || x > gridSize || y < 1 || y > gridSize) return;
  if (!isSnake({ x, y })) {
    food = { x, y };
    draw();
  }
}

function increaseSpeed() {
  if (gameSpeedDelay > 180) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 120) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 100) {
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
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
  gameMode = '';
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
  document.getElementById('game-mode-selection').style.display = 'block';
  if (gameMode === 'custom') {
    board.removeEventListener('click', placeFood);
  }
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}

function aStar(startNode, goalNode) {
  let openNodes = [startNode];
  let closedNodes = [];
  while (openNodes.length > 0) {
    let currentNode = openNodes.sort((a, b) => a.totalCost - b.totalCost)[0];
    if (currentNode.x === goalNode.x && currentNode.y === goalNode.y) {
      let path = [];
      while (currentNode !== startNode) {
        path.unshift(currentNode);
        currentNode = currentNode.parent;
      }
      return path;
    }
    openNodes = openNodes.filter(node => node !== currentNode);
    closedNodes.push(currentNode);
    let neighbors = getNeighbors(currentNode);
    for (let neighbor of neighbors) {
      if (closedNodes.some(closedNode => closedNode.x === neighbor.x && closedNode.y === neighbor.y)) continue;
      let tentativeCost = currentNode.costFromStart + 1;
      if (openNodes.some(openNode => openNode.x === neighbor.x && openNode.y === neighbor.y)) {
        let existingNode = openNodes.find(openNode => openNode.x === neighbor.x && openNode.y === neighbor.y);
        if (tentativeCost < existingNode.costFromStart) {
          existingNode.costFromStart = tentativeCost;
          existingNode.totalCost = existingNode.costFromStart + existingNode.heuristicCost;
          existingNode.parent = currentNode;
        }
      } else {
        neighbor.costFromStart = tentativeCost;
        neighbor.heuristicCost = calculateHeuristicCost(neighbor, goalNode);
        neighbor.totalCost = neighbor.costFromStart + neighbor.heuristicCost;
        neighbor.parent = currentNode;
        openNodes.push(neighbor);
      }
    }
  }
  return [];
}

function calculateHeuristicCost(node, goalNode) {
  let distanceToGoal = Math.abs(node.x - goalNode.x) + Math.abs(node.y - goalNode.y);
  let minDistanceToTail = Infinity;
  snake.forEach(segment => {
    const distance = Math.abs(segment.x - node.x) + Math.abs(segment.y - node.y);
    if (distance < minDistanceToTail) {
      minDistanceToTail = distance;
    }
  });
  return distanceToGoal + minDistanceToTail;
}

function getNeighbors(node) {
  let neighbors = [];
  if (node.x < gridSize && !isSnake({ x: node.x + 1, y: node.y })) {
    neighbors.push({ x: node.x + 1, y: node.y, costFromStart: Infinity, heuristicCost: 0 });
  }
  if (node.x > 1 && !isSnake({ x: node.x - 1, y: node.y })) {
    neighbors.push({ x: node.x - 1, y: node.y, costFromStart: Infinity, heuristicCost: 0 });
  }
  if (node.y > 1 && !isSnake({ x: node.x, y: node.y - 1 })) {
    neighbors.push({ x: node.x, y: node.y - 1, costFromStart: Infinity, heuristicCost: 0 });
  }
  if (node.y < gridSize && !isSnake({ x: node.x, y: node.y + 1 })) {
    neighbors.push({ x: node.x, y: node.y + 1, costFromStart: Infinity, heuristicCost: 0 });
  }
  return neighbors;
}

function isSnake(position) {
  return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

document.getElementById('classic-mode-btn').addEventListener('click', () => {
  gameMode = 'classic';
  startGame();
});

document.getElementById('custom-mode-btn').addEventListener('click', () => {
  gameMode = 'custom';
  startGame();
});