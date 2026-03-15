export const GRID_SIZE = 16;
export const INITIAL_DIRECTION = "right";
export const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE_DIRECTIONS = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function createInitialSnake() {
  return [
    { x: 2, y: 8 },
    { x: 1, y: 8 },
    { x: 0, y: 8 },
  ];
}

export function createInitialState(rng = Math.random) {
  const snake = createInitialSnake();
  return {
    gridSize: GRID_SIZE,
    snake,
    direction: INITIAL_DIRECTION,
    queuedDirection: INITIAL_DIRECTION,
    food: placeFood(GRID_SIZE, snake, rng),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function queueDirection(currentDirection, nextDirection) {
  if (!DIRECTION_VECTORS[nextDirection]) {
    return currentDirection;
  }

  if (OPPOSITE_DIRECTIONS[currentDirection] === nextDirection) {
    return currentDirection;
  }

  return nextDirection;
}

export function stepGame(state, rng = Math.random) {
  if (state.isGameOver || state.isPaused) {
    return state;
  }

  const direction = queueDirection(state.direction, state.queuedDirection);
  const movement = DIRECTION_VECTORS[direction];
  const head = state.snake[0];
  const nextHead = {
    x: head.x + movement.x,
    y: head.y + movement.y,
  };

  const grows = positionsEqual(nextHead, state.food);
  const trimmedSnake = grows ? state.snake : state.snake.slice(0, -1);

  if (hitsBoundary(nextHead, state.gridSize) || hitsSnake(nextHead, trimmedSnake)) {
    return {
      ...state,
      direction,
      queuedDirection: direction,
      isGameOver: true,
    };
  }

  const snake = [nextHead, ...trimmedSnake];

  return {
    ...state,
    snake,
    direction,
    queuedDirection: direction,
    food: grows ? placeFood(state.gridSize, snake, rng) : state.food,
    score: grows ? state.score + 1 : state.score,
  };
}

export function placeFood(gridSize, snake, rng = Math.random) {
  const occupied = new Set(snake.map((segment) => toKey(segment)));
  const openCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = toKey({ x, y });
      if (!occupied.has(key)) {
        openCells.push({ x, y });
      }
    }
  }

  if (openCells.length === 0) {
    return null;
  }

  const index = Math.min(openCells.length - 1, Math.floor(rng() * openCells.length));
  return openCells[index];
}

export function hitsBoundary(position, gridSize) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= gridSize ||
    position.y >= gridSize
  );
}

export function hitsSnake(position, snake) {
  return snake.some((segment) => positionsEqual(segment, position));
}

export function positionsEqual(a, b) {
  if (!a || !b) {
    return false;
  }

  return a.x === b.x && a.y === b.y;
}

function toKey(position) {
  return `${position.x},${position.y}`;
}
