import assert from "node:assert/strict";
import {
  createInitialState,
  hitsBoundary,
  placeFood,
  queueDirection,
  stepGame,
} from "../src/logic.js";

function runTests() {
  testInitialMove();
  testGrowthAndScore();
  testBoundaryCollision();
  testSelfCollision();
  testFoodPlacementAvoidsSnake();
  testDirectionQueuePreventsReverse();
}

function testInitialMove() {
  const initial = createInitialState(() => 0);
  const next = stepGame(initial, () => 0);

  assert.deepEqual(next.snake[0], { x: 3, y: 8 });
  assert.equal(next.score, 0);
}

function testGrowthAndScore() {
  const initial = createInitialState(() => 0);
  const readyToEat = {
    ...initial,
    food: { x: 3, y: 8 },
  };

  const next = stepGame(readyToEat, () => 0);

  assert.equal(next.score, 1);
  assert.equal(next.snake.length, initial.snake.length + 1);
  assert.notDeepEqual(next.food, { x: 3, y: 8 });
}

function testBoundaryCollision() {
  const initial = createInitialState(() => 0);
  const atEdge = {
    ...initial,
    snake: [{ x: 15, y: 8 }, { x: 14, y: 8 }, { x: 13, y: 8 }],
    food: { x: 0, y: 0 },
  };

  const next = stepGame(atEdge, () => 0);

  assert.equal(next.isGameOver, true);
  assert.equal(hitsBoundary({ x: 16, y: 8 }, next.gridSize), true);
}

function testSelfCollision() {
  const state = {
    gridSize: 16,
    snake: [
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ],
    direction: "up",
    queuedDirection: "left",
    food: { x: 10, y: 10 },
    score: 0,
    isGameOver: false,
    isPaused: false,
  };

  const next = stepGame(state, () => 0);
  assert.equal(next.isGameOver, true);
}

function testFoodPlacementAvoidsSnake() {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  const food = placeFood(4, snake, () => 0);

  assert.deepEqual(food, { x: 3, y: 0 });
}

function testDirectionQueuePreventsReverse() {
  assert.equal(queueDirection("right", "left"), "right");
  assert.equal(queueDirection("up", "left"), "left");
}

runTests();
console.log("All logic tests passed.");
