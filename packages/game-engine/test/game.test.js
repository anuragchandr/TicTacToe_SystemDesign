import test from "node:test";
import assert from "node:assert/strict";
import { createGame, checkWinner, makeMove } from "../src/game.js";

function playMoves(moves) {
  let game = createGame();
  for (const [player, position] of moves) {
    game = makeMove(game, player, position);
  }
  return game;
}

test("creates a new game with an empty board and X first", () => {
  const game = createGame();
  assert.deepEqual(game.board, Array(9).fill(null));
  assert.equal(game.currentPlayer, "X");
  assert.equal(game.status, "IN_PROGRESS");
  assert.equal(game.winner, null);
  assert.equal(game.moveCount, 0);
});

test("accepts a valid move and alternates turns", () => {
  const firstGame = makeMove(createGame(), "X", 4);
  assert.equal(firstGame.board[4], "X");
  assert.equal(firstGame.currentPlayer, "O");
  assert.equal(firstGame.moveCount, 1);
});

test("rejects a move from the wrong player", () => {
  assert.throws(() => makeMove(createGame(), "O", 0), { message: "NOT_YOUR_TURN" });
});

test("rejects an occupied cell", () => {
  const game = makeMove(createGame(), "X", 0);
  assert.throws(() => makeMove(game, "O", 0), { message: "CELL_OCCUPIED" });
});

test("rejects positions outside 0 through 8 and non-integers", () => {
  for (const position of [-1, 9, 1.5, "2"]) {
    assert.throws(() => makeMove(createGame(), "X", position), { message: "INVALID_POSITION" });
  }
});

test("rejects an invalid player", () => {
  assert.throws(() => makeMove(createGame(), "Y", 0), { message: "INVALID_PLAYER" });
});

test("detects a row win", () => {
  const game = playMoves([["X", 0], ["O", 3], ["X", 1], ["O", 4], ["X", 2]]);
  assert.equal(game.status, "COMPLETED");
  assert.equal(game.winner, "X");
  assert.equal(game.currentPlayer, null);
});

test("detects a column win", () => {
  const game = playMoves([["X", 0], ["O", 1], ["X", 3], ["O", 2], ["X", 6]]);
  assert.equal(game.winner, "X");
});

test("detects a diagonal win", () => {
  const game = playMoves([["X", 0], ["O", 1], ["X", 4], ["O", 2], ["X", 8]]);
  assert.equal(game.winner, "X");
});

test("detects a draw", () => {
  const game = playMoves([
    ["X", 0], ["O", 1], ["X", 2],
    ["O", 4], ["X", 3], ["O", 5],
    ["X", 7], ["O", 6], ["X", 8]
  ]);
  assert.equal(game.status, "COMPLETED");
  assert.equal(game.winner, null);
  assert.equal(game.currentPlayer, null);
  assert.equal(game.moveCount, 9);
});

test("rejects moves after the game has ended", () => {
  const game = playMoves([["X", 0], ["O", 3], ["X", 1], ["O", 4], ["X", 2]]);
  assert.throws(() => makeMove(game, "O", 5), { message: "GAME_FINISHED" });
});

test("does not mutate the previous game state", () => {
  const originalGame = createGame();
  const nextGame = makeMove(originalGame, "X", 0);
  assert.equal(originalGame.board[0], null);
  assert.equal(nextGame.board[0], "X");
});

test("checkWinner returns null when there is no winning line", () => {
  assert.equal(checkWinner(["X", "O", "X", "X", "O", "O", "O", "X", "X"]), null);
});
