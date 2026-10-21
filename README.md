# Tic-Tac-Toe Systems Lab

An academic, stage-by-stage system design project exploring a **Human vs AI** Tic-Tac-Toe platform. The first playable stage uses a conventional rule-based opponent. Later stages replace that opponent with a trained reinforcement-learning (tabular Q-learning) agent and evolve the platform toward a measured capacity target of up to one million concurrent users.

> Scope constraint: there is no Human-vs-Human gameplay at any stage.

## Research question
How can we design, implement, measure, and progressively scale a Human-vs-RL Tic-Tac-Toe platform from one developer laptop toward one million concurrent user connections, while validating each architectural change experimentally?

The one-million-user figure is a capacity-planning target, not a performance claim. We must define a workload, benchmark components, and measure the final system before claiming capacity.

## Academic method
Every chapter follows: problem definition → requirements → diagrams → design alternatives and trade-offs → implementation → tests/experiments → results/limitations → motivation for the next stage.

## Stage roadmap

| Stage | Focus | Opponent | Deliverable |
|---|---|---|---|
| 1 | Local baseline | Conventional tactical logic | Browser game and tested game engine |
| 2 | Requirements and architecture | Conventional logic | Context, container, component and sequence diagrams |
| 3 | Reinforcement learning | Tabular Q-learning | Training environment, Q-table, evaluation results |
| 4 | Backend and persistence | RL agent | API, game sessions, durable state |
| 5 | AI inference separation | RL agent | Separate game and inference services |
| 6 | Docker and observability | RL agent | Reproducible deployment and metrics |
| 7 | Concurrency and recovery | RL agent | Correct state transitions, retries and recovery |
| 8 | Horizontal scaling | RL agent | Multiple backend/inference instances and load balancer |
| 9 | Capacity experiments | RL agent | Load tests and measured bottlenecks |
| 10 | Distributed architecture | RL agent | Redis/messaging and game ownership only when justified |
| 11 | Million-user capacity plan | RL agent | Capacity model, headroom and failure scenarios |
| 12 | Production evaluation | RL agent | Security, observability, reliability and final report |

## Current implementation
- `packages/game-engine`: pure, framework-independent game rules.
- `apps/web`: local React + Vite browser app.
- `docs`: academic chapters and architecture diagrams.

The current opponent is a tactical baseline that prioritizes winning, blocking, center, corners, then edges. It is **not** an RL agent. This is deliberate: we need a baseline to compare against the trained Q-learning policy later.

## Requirements
- Node.js 20 or newer
- npm

## Run

```bash
npm install
npm test
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`.

For a production frontend build:

```bash
npm run build
```

## Academic artifacts
- [Chapter 1 — Problem and requirements](docs/chapter-01-problem-and-requirements.md)
- [Chapter 2 — System context and architecture](docs/chapter-02-system-context-and-architecture.md)
- [Stage 1 context diagram](docs/diagrams/stage-01-context.mmd)
- [Stage 1 sequence diagram](docs/diagrams/stage-01-move-sequence.mmd)

## Decision log
- **Human vs AI only:** no Human-vs-Human mode is included.
- **Conventional baseline first:** gives us a simple reference opponent and validates game rules before RL is introduced.
- **Tabular Q-learning later:** model training and live inference will be separate concerns.
- **Modular monolith first:** no distributed infrastructure until the workload justifies it.
- **Measure before scaling:** no capacity claims without reproducible load tests.
