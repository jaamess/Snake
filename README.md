# 🐍 AI Snake Game

## Overview
This project introduces an innovative rendition of the timeless Snake Game, where traditional manual control is replaced by an Artificial Intelligence (AI) algorithm. Unlike conventional gameplay, where players direct the snake's movements, the AI autonomously navigates the serpent across the game board. This AI implementation utilizes a heuristic-driven decision-making process, blending mathematical computations with strategic maneuvers.

### AI Algorithm
The core of the AI's functionality lies in its decision-making algorithm. At its heart is the A* (A-Star) search algorithm, a popular choice for pathfinding in various gaming applications. A* algorithm operates by evaluating potential paths from the snake's current position to the food, selecting the most optimal route based on a combination of factors.

### Heuristic Function
Central to the AI's decision-making process is the heuristic function. This function assesses each potential move's desirability by considering multiple factors, including:
- **Distance to Food**: Measures the direct distance from the snake's current position to the food item.
- **Distance to Tail**: Evaluates the proximity of the snake's head to its tail, aiming to minimize the snake's spatial footprint.
- **Pathfinding Cost**: Calculates the cost of traversing each potential path, factoring in obstacles and the snake's body.

### Mathematical Modeling
Mathematical models underpin the AI's behavior, transforming game dynamics into quantifiable metrics. The AI employs mathematical calculations to:
- Compute distances between game entities (e.g., snake segments, food).
- Evaluate the cost of potential moves based on predefined criteria.
- Optimize pathfinding algorithms to minimize computational overhead.

By melding AI algorithms with mathematical modeling, this project is my exploration into the intersection of gaming, artificial intelligence, and mathematics.

## Features
- Classic Snake Game mechanics.
- AI-controlled snake.
- Dynamic game speed.

## How to Play
Now available at [snake.thi.digital](snake.thi.digital)!

## Code Structure
- `index.html`: The main HTML file that displays the game.
- `style.css`: Contains all the styles for the game.
- `script.js`: The JavaScript file that contains the game logic and the AI.

## Future Improvements 
- Add a feature to switch between AI and human player.
- Add a feature to play against the AI in the same grid (FL Tron-like)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
GNU GENERAL PUBLIC LICENSE
