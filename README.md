# StakeVault — Staking dashboard for SPL rewards

[![CI](https://img.shields.io/badge/CI-vitest-%2344cc88)](https://github.com/Waleed-Ilyas/stakevault)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A devnet-only staking dashboard prototype built to model an SPL reward vault, cooldown windows, and pool health signals. It is a polished personal project, not a claim of a live production staking program.

## Demo accounts

No real login is required. The interface uses demo wallet labels and devnet-only instructions:

- DemoStakeA — active position
- DemoStakeB — cooldown position
- DemoStakeC — ready-to-unstake position

## Features

- vault snapshot with total staked and rewards
- APR and cooldown projection cards
- wallet-by-wallet vault positions
- rate logic, risk display, and honest devnet warnings
- clear boundary between mock UI logic and future Anchor deployment work

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Vitest
- Solana devnet guidance

## Getting started

```bash
cd projects/stakevault
pnpm install
cp .env.example .env.local
pnpm dev
```

## Tests

```bash
pnpm test
pnpm build
```

## Key engineering decisions

- the staking math is deterministic and testable through a pure TypeScript helper
- the app intentionally avoids claiming a production vault deployment until a verified Anchor program and real devnet wallet flow are live
- design keeps reward math, risk modeling, and vault messaging explicit so the project remains honest to recruiters and reviewers

## What I'd improve next

- replace the simulated math with a real Anchor staking program and PDA-based vault state
- add wallet connection, devnet SOL airdrop helper, and a claim/unstake flow for live verification
- persist staking events to Postgres and show on-chain transaction history with explorer links
- add admin controls for APY tuning and emergency cooldown handling

## Author

Waleed Ilyas — https://github.com/Waleed-Ilyas
