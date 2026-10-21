const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export function createGame() {
  return {
    board: Array(9).fill(null),
    currentPlayer: "X",
    status: "IN_PROGRESS",
    winner: null,
    moveCount: 0
  };
}

export function checkWinner(board) {
  for (const [first, second, third] of WINNING_LINES) {
    if (board[first] && board[first] === board[second] && board[first] === board[third]) {
      return board[first];
    }
  }

  return null;
}

export function makeMove(game, player, position) {
  if (!game || !Array.isArray(game.board) || game.board.length !== 9) {
    throw new Error("INVALID_GAME");
  }

  if (game.status !== "IN_PROGRESS") {
    throw new Error("GAME_FINISHED");
  }

  if (player !== "X" && player !== "O") {
    throw new Error("INVALID_PLAYER");
  }

  if (player !== game.currentPlayer) {
    throw new Error("NOT_YOUR_TURN");
  }

  if (!Number.isInteger(position) || position < 0 || position > 8) {
    throw new Error("INVALID_POSITION");
  }

  if (game.board[position] !== null) {
    throw new Error("CELL_OCCUPIED");
  }

  const nextGame = {
    ...game,
    board: [...game.board],
    moveCount: game.moveCount + 1
  };

  nextGame.board[position] = player;

  const winner = checkWinner(nextGame.board);
  if (winner) {
    nextGame.winner = winner;
    nextGame.status = "COMPLETED";
    nextGame.currentPlayer = null;
    return nextGame;
  }

  if (nextGame.moveCount === 9) {
    nextGame.status = "COMPLETED";
    nextGame.currentPlayer = null;
    return nextGame;
  }

  nextGame.currentPlayer = player === "X" ? "O" : "X";
  return nextGame;
}
