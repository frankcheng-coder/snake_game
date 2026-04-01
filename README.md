# Snake Game

Welcome to a tiny Snake game.

In this game, you help a hungry snake slither around the board and eat apples. Each apple makes the snake grow longer. The game ends if the snake bumps into a wall or into itself.

## How to Play

1. Open the game in your browser.
2. Press the `Start Game` button.
3. Move the snake to the apple.
4. Try to get the highest score you can.

## Controls

- Arrow keys: move the snake
- `W`, `A`, `S`, `D`: move the snake
- `Space`: pause or resume
- `Start Game`: begin a new round
- `Restart`: reset the game

## How to Run It

Open a terminal in this project folder and run:

```bash
python3 -m http.server 8080
```

Then open this page in your browser:

```text
http://localhost:8080
```

If port `8080` is busy, you can use a different number like `8090`.

## What You Will See

- A green game board
- A blue snake
- A red apple
- Your score at the top

## Tips

- Plan your path before the snake gets too long.
- Do not turn back into your own body.
- Stay away from the walls when the snake gets big.

Have fun and see how long your snake can grow!
