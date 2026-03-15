import {
  GRID_SIZE,
  createInitialState,
  queueDirection,
  stepGame,
  positionsEqual,
} from "./logic.js";

const TICK_MS = 140;
const KEY_TO_DIRECTION = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  a: "left",
  A: "left",
  s: "down",
  S: "down",
  d: "right",
  D: "right",
};

const board = document.querySelector("#board");
const scoreValue = document.querySelector("#score");
const statusValue = document.querySelector("#status");
const startButton = document.querySelector("#start-button");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector("#restart-button");
const controlButtons = document.querySelectorAll("[data-direction]");

let state = createInitialState();
let loopId = null;
let hasStarted = false;

renderBoard();
render();

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    if (hasStarted) {
      togglePause();
    }
    return;
  }

  const nextDirection = KEY_TO_DIRECTION[event.key];
  if (!nextDirection || state.isGameOver) {
    return;
  }

  event.preventDefault();
  state = {
    ...state,
    queuedDirection: queueDirection(state.direction, nextDirection),
  };
});

startButton.addEventListener("click", () => {
  if (hasStarted && !state.isGameOver) {
    return;
  }

  hasStarted = true;
  state = {
    ...state,
    isPaused: false,
  };
  render();
  startLoop();
});

pauseButton.addEventListener("click", () => {
  togglePause();
});

restartButton.addEventListener("click", () => {
  state = createInitialState();
  hasStarted = false;
  stopLoop();
  render();
});

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (state.isGameOver) {
      return;
    }

    const nextDirection = button.dataset.direction;
    state = {
      ...state,
      queuedDirection: queueDirection(state.direction, nextDirection),
    };
  });
});

function startLoop() {
  stopLoop();
  loopId = window.setInterval(() => {
    state = stepGame(state);
    render();

    if (state.isGameOver) {
      stopLoop();
    }
  }, TICK_MS);
}

function stopLoop() {
  if (loopId !== null) {
    window.clearInterval(loopId);
    loopId = null;
  }
}

function togglePause() {
  if (state.isGameOver || !hasStarted) {
    return;
  }

  state = {
    ...state,
    isPaused: !state.isPaused,
  };

  if (state.isPaused) {
    stopLoop();
  } else {
    startLoop();
  }

  render();
}

function renderBoard() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("role", "gridcell");
    fragment.appendChild(cell);
  }

  board.appendChild(fragment);
}

function render() {
  const cells = board.children;

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const cell = cells[y * GRID_SIZE + x];
      cell.className = "cell";

      if (state.snake.some((segment) => segment.x === x && segment.y === y)) {
        cell.classList.add("snake");
      } else if (positionsEqual(state.food, { x, y })) {
        cell.classList.add("food");
      }
    }
  }

  scoreValue.textContent = String(state.score);
  statusValue.textContent = getStatusLabel();
  startButton.disabled = hasStarted && !state.isGameOver;
  pauseButton.textContent = state.isPaused ? "Resume" : "Pause";
  pauseButton.disabled = !hasStarted || state.isGameOver;
}

function getStatusLabel() {
  if (!hasStarted) {
    return "Waiting to Start";
  }

  if (state.isGameOver) {
    return "Game Over";
  }

  if (state.isPaused) {
    return "Paused";
  }

  return "Running";
}
