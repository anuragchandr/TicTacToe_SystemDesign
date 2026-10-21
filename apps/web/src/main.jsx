import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createGame, makeMove } from '@ttt/game-engine';
import './styles.css';

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function getWinner(board) {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

// Stage 1 baseline only: deterministic tactical rules, not reinforcement learning.
function chooseConventionalMove(board) {
  const tryMove = (mark) => {
    for (let position = 0; position < 9; position += 1) {
      if (board[position] !== null) continue;
      const nextBoard = [...board];
      nextBoard[position] = mark;
      if (getWinner(nextBoard) === mark) return position;
    }
    return null;
  };

  const winningMove = tryMove('O');
  if (winningMove !== null) return winningMove;

  const blockingMove = tryMove('X');
  if (blockingMove !== null) return blockingMove;

  if (board[4] === null) return 4;
  for (const position of [0, 2, 6, 8]) {
    if (board[position] === null) return position;
  }
  for (const position of [1, 3, 5, 7]) {
    if (board[position] === null) return position;
  }
  return null;
}

function getStatus(game) {
  if (game.winner === 'X') return 'You won this round.';
  if (game.winner === 'O') return 'The conventional AI won this round.';
  if (game.status === 'COMPLETED') return 'It’s a draw.';
  return game.currentPlayer === 'X' ? 'Your turn — you play X.' : 'Conventional AI is thinking…';
}

function App() {
  const [game, setGame] = useState(createGame);
  const [round, setRound] = useState(1);

  function playHuman(position) {
    if (game.status !== 'IN_PROGRESS' || game.currentPlayer !== 'X' || game.board[position] !== null) return;

    let nextGame;
    try {
      nextGame = makeMove(game, 'X', position);
    } catch {
      return;
    }

    setGame(nextGame);
    if (nextGame.status === 'COMPLETED') return;

    const aiPosition = chooseConventionalMove(nextGame.board);
    if (aiPosition === null) return;

    // A short delay makes the opponent's move visible; the rules still run locally.
    window.setTimeout(() => {
      setGame((latestGame) => {
        if (latestGame.status !== 'IN_PROGRESS' || latestGame.currentPlayer !== 'O') return latestGame;
        return makeMove(latestGame, 'O', aiPosition);
      });
    }, 280);
  }

  function restartGame() {
    setGame(createGame());
    setRound((currentRound) => currentRound + 1);
  }

  const completed = game.status === 'COMPLETED';

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Tic-Tac-Toe Systems Lab home">
          <span className="brand-mark">T3</span>
          <span>Systems Lab <span className="brand-divider">/</span> 01</span>
        </a>
        <span className="stage-pill"><span className="status-dot" /> STAGE 01 · BASELINE</span>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow">A SYSTEM DESIGN STUDY</p>
        <h1>Small game.<br /><span>Serious engineering.</span></h1>
        <p className="intro">A staged exploration of building a Tic-Tac-Toe platform, starting with a conventional opponent and progressing toward a scalable reinforcement-learning system.</p>
      </section>

      <section className="workbench" aria-label="Tic-Tac-Toe game">
        <div className="game-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">PLAYGROUND / {String(round).padStart(2, '0')}</p>
              <h2>Human <span className="versus">vs</span> Conventional AI</h2>
            </div>
            <span className={`game-state ${completed ? 'finished' : ''}`}>{completed ? 'ROUND COMPLETE' : 'LIVE ROUND'}</span>
          </div>

          <div className="board" role="group" aria-label="Tic-Tac-Toe board">
            {game.board.map((cell, position) => (
              <button
                className={`cell ${cell === 'X' ? 'cell-x' : ''} ${cell === 'O' ? 'cell-o' : ''}`}
                key={position}
                onClick={() => playHuman(position)}
                disabled={cell !== null || game.currentPlayer !== 'X' || completed}
                aria-label={`Cell ${position + 1}${cell ? `, ${cell}` : ', empty'}`}
              >
                {cell || <span className="cell-index">{position + 1}</span>}
              </button>
            ))}
          </div>

          <div className="game-footer">
            <div className="turn-indicator">
              <span className={`turn-symbol ${game.currentPlayer === 'X' && !completed ? 'active-x' : ''}`}>X</span>
              <span className={`turn-symbol ${game.currentPlayer === 'O' && !completed ? 'active-o' : ''}`}>O</span>
              <div><strong>{getStatus(game)}</strong><small>{completed ? 'Start a new round to play again.' : 'Moves are validated by the game engine.'}</small></div>
            </div>
            <button className="restart-button" onClick={restartGame}>{completed ? 'Play again ↗' : 'Restart round ↻'}</button>
          </div>
        </div>

        <aside className="study-panel">
          <p className="eyebrow">CURRENT EXPERIMENT</p>
          <h3>Establish the baseline.</h3>
          <p className="study-copy">Before introducing reinforcement learning or distributed infrastructure, we need a correct, measurable game with explicit rules.</p>
          <div className="study-divider" />
          <div className="study-metric"><span>Opponent</span><strong>Rule-based</strong></div>
          <div className="study-metric"><span>Execution</span><strong>Local browser</strong></div>
          <div className="study-metric"><span>Network calls</span><strong>None</strong></div>
          <div className="study-metric"><span>Game state</span><strong>In memory</strong></div>
          <div className="baseline-note"><span className="note-mark">i</span><p>This is a conventional tactical baseline, <strong>not an RL model</strong>. Later stages will replace the opponent with a trained Q-learning agent.</p></div>
        </aside>
      </section>

      <section className="architecture-section">
        <div className="section-title">
          <div><p className="eyebrow">ARCHITECTURE / 01</p><h2>Start with the smallest valid system.</h2></div>
          <p>One runtime. One game engine. No network or database yet.</p>
        </div>
        <div className="architecture-flow">
          <div className="architecture-node"><span>01</span><strong>Human input</strong><small>Browser UI</small></div>
          <div className="flow-arrow">→</div>
          <div className="architecture-node primary-node"><span>02</span><strong>Game engine</strong><small>Rules + state</small></div>
          <div className="flow-arrow">→</div>
          <div className="architecture-node"><span>03</span><strong>Rule-based AI</strong><small>Move selection</small></div>
        </div>
      </section>

      <footer className="footer"><span>TIC-TAC-TOE SYSTEM DESIGN</span><span>CHAPTER 01 · LOCAL BASELINE</span></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
