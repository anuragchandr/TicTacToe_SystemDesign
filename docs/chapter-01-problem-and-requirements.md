# Chapter 1 — Problem Statement and Requirements

## 1.1 Title
**Design and Scalable Deployment of a Reinforcement Learning-Based Tic-Tac-Toe Platform**

## 1.2 Problem statement
Design a Tic-Tac-Toe application in which one human plays against an AI opponent. Begin with a local application using conventional tactical logic, then replace the conventional opponent with a trained reinforcement-learning agent. Evolve the architecture in measurable stages toward a platform designed for up to one million concurrent user connections.

The project studies both the game-playing agent and the software system serving games. These are related but distinct concerns: RL quality is evaluated using game outcomes and policy behavior; platform scalability is evaluated using latency, throughput, connection capacity, resource use, and recovery behavior.

**Scope invariant:** the product is Human vs AI only. Human-vs-Human gameplay is excluded at every stage.

## 1.3 Research questions
1. How does a conventional tactical baseline compare with a tabular Q-learning agent?
2. How should training be separated from online inference?
3. What architectural boundaries are justified as the workload grows?
4. What are the measured bottlenecks for game sessions, AI inference, networking, and persistence?
5. What infrastructure and capacity assumptions would be required to support one million concurrent users?

## 1.4 Scope by stage
- **Stage 1:** local browser game, pure game engine, conventional tactical opponent.
- **Stage 2:** formal diagrams, requirements, design records, and system contracts.
- **Stage 3:** Q-learning environment, training pipeline, policy evaluation, and model artifact.
- **Stage 4 onward:** backend API, durable game state, AI inference service, container deployment, reliability, and scaling.

Out of scope unless separately justified: Human-vs-Human mode, payments, chat, tournaments, and multi-region active-active game ownership.

## 1.5 Functional requirements
| ID | Requirement | Planned stage |
|---|---|---|
| FR-01 | Start a new game with an empty 3×3 board | 1 |
| FR-02 | Human plays X and the AI plays O | 1 |
| FR-03 | Validate moves and reject occupied or out-of-range cells | 1 |
| FR-04 | Detect all row, column, and diagonal wins | 1 |
| FR-05 | Detect draws | 1 |
| FR-06 | Reject moves after a game ends | 1 |
| FR-07 | Select a conventional tactical move for the baseline opponent | 1 |
| FR-08 | Train a tabular Q-learning agent through self-play or a defined training opponent | 3 |
| FR-09 | Evaluate and version trained policies | 3 |
| FR-10 | Serve AI move decisions through an inference interface | 4–5 |
| FR-11 | Persist games and recover unfinished sessions | 4 onward |
| FR-12 | Support multiple concurrent Human-vs-AI games | 4 onward |
| FR-13 | Scale game and inference workloads independently where benchmarks justify it | 5 onward |

## 1.6 Non-functional requirements
- **Correctness:** every accepted move preserves game rules and state invariants.
- **AI evaluation:** report win/draw/loss rates across a defined test set; do not infer model quality from a few games.
- **Latency:** define and measure move-response percentiles under a specified workload.
- **Reliability:** define reconnect, retry, and recovery behavior when those capabilities are introduced.
- **Security:** validate identity, game ownership, payloads, and request rates in the networked stages.
- **Scalability:** measure connections, event throughput, inference latency, and resource use.
- **Maintainability:** keep game rules independent from UI, transport, persistence, and model serving.
- **Reproducibility:** record training parameters, random seeds where applicable, test workloads, and benchmark environment.

## 1.7 Initial assumptions
- The board has nine cells indexed 0–8, left to right and top to bottom.
- The human plays X; the AI plays O.
- Stage 1 runs entirely in the browser and has no network calls or persistent storage.
- The baseline AI uses explicit tactical rules. It is not minimax and is not reinforcement learning.
- The planned RL method is tabular Q-learning; its state/action representation and reward function will be specified in Chapter 3.
- One million concurrent users is a capacity-planning target, not a current capability claim.

## 1.8 Stage 1 acceptance criteria
- A human can play a full game against the conventional opponent in a browser.
- Invalid moves are not accepted.
- Wins and draws are detected correctly.
- The opponent takes a legal move and prioritizes immediate wins and blocks.
- Game engine tests pass with Node's built-in test runner.
- The application clearly labels the current opponent as conventional logic, not RL.

## 1.9 Questions to resolve before capacity planning
- What percentage of connected users are actively playing?
- What is the expected move rate per active game?
- What is the average and peak game duration?
- What are the target p50/p95/p99 move-response latencies?
- What fraction of games require durable state writes per move?
- What model size and inference runtime will be used?
- What availability, recovery point, and recovery time objectives are required?

These must be measured or explicitly marked as assumptions before estimating infrastructure.
