# MCP Debug Scenarios — Design

Date: 2026-07-25
Branch: `demo/mcp-debug-scenarios`

## Purpose

Give the ethui demo app a set of deliberately planted, realistic smart-contract
bugs that showcase an agent connecting to ethui over MCP and using live chain
state to find the root cause.

The demo audience is developers who already have a debugger and a terminal. The
claim being demonstrated is not "an agent can read code" — it is "an agent
wired to your running wallet can see the state your code can't tell you about."

## Governing constraint

**No scenario may be diagnosable from source alone.**

Where the bug lives in source (scenarios 3 and 5), the source must look
idiomatic, and a plausible competing explanation must exist that only on-chain
state can rule out. If a reviewer reading the diff can name the bug with
confidence, the scenario has failed its purpose and must be reworked.

## Available MCP surface

From `ethui/app/packages/mcp/src/tools.ts`:

- Reads: `get_accounts`, `get_chain`, `get_balance`, `get_transaction`,
  `call`, `get_contract_abi`, `resolve_alias`
- Writes (approval-gated): `send_transaction`, `sign_message`,
  `sign_typed_data`
- State-changing, no dialog: `switch_network`
- Generic: `list_rpc_methods`, `rpc_call` — reaches `eth_getStorageAt`,
  `eth_getCode`, `eth_getLogs`, `eth_getTransactionReceipt`,
  `eth_estimateGas`, and the rest of the registered catalog

**There are no trace tools.** `debug_traceTransaction` and the `anvil_*` family
are not registered. Every scenario must therefore be diagnosable from state
reads, logs, and receipts — never from stepping a call tree. This rules out
reentrancy and most control-flow bugs as demo material.

## Scenarios

Each scenario mixes the bug's location across categories, so the agent cannot
know from the symptom whether the contract, the frontend, or the wallet
environment is at fault.

### 1. Stale address (environment)

**Setup.** The route hardcodes a contract address left over from a previous
anvil run.

**Symptom.** Every read returns empty. No revert reason.

**Agent path.** `eth_getCode(address)` returns `0x` — nothing is deployed
there. One call.

**Why source is not enough.** An address literal cannot be judged wrong by
inspection.

**Fix.** Point the route at the current deployment.

**Role.** 30-second warm-up. Establishes that the agent can reach the chain at
all.

### 2. Wrong active account (wallet)

**Setup.** `OwnedRegistry.setValue()` is `onlyOwner`. `BugsDeploy.s.sol`
transfers ownership to **bob**. ethui's active account is **alice**. Both the
contract and the route are correct.

**Symptom.** The write reverts, or gas estimation fails, with no useful
message.

**Agent path.** `get_accounts` returns alice; `call owner()` returns bob;
`resolve_alias` on both yields human names that visibly differ.

**Why source is not enough.** Ownership is assigned at deploy time and appears
nowhere in the contract or route source.

**Fix.** Switch the active account in ethui.

**Role.** The uniquely-ethui scenario. Wallet identity is the bug, and MCP is
what can see the wallet.

### 3. Decimals mismatch (frontend)

**Setup.** `SixDecimalToken` reports `decimals() = 6`. The route calls
`parseEther(amount)` — carried over from the repo's existing 18-decimal
`Token.sol`.

**Symptom.** Transferring "100" reverts for insufficient balance despite a
visible balance of 100.

**Agent path.** `call decimals()` returns 6; `call balanceOf(alice)` returns
`100000000`; both contradict the 1e18 value the route encodes.

**Why source is not enough.** `parseEther` reads as ordinary, correct code.
Only the on-chain `decimals()` convicts it.

**Fix.** `parseUnits(amount, 6)`, or read decimals at runtime.

### 4. Missing allowance (wallet / flow)

**Setup.** `Vault.deposit()` pulls tokens with `transferFrom`. The route never
calls `approve`.

**Symptom.** Deposit reverts.

**Agent path.** `call allowance(alice, vault)` returns 0.

**Fix.** The agent submits `approve` via `send_transaction`, which opens
ethui's approval dialog on screen, then retries the deposit.

**Role.** The climax. It is the only scenario ending in a write, and the
approval dialog is the human-in-the-loop story made visible.

### 5. Silent failure (contract) — reserve

**Setup.** `Forwarder.forward(target, data)` performs `target.call(data)`,
ignores the returned success flag, and emits `Forwarded` unconditionally.

**Symptom.** The transaction succeeds, the UI goes green, and nothing
happened.

**Agent path.** `eth_getTransactionReceipt` shows status `0x1` and a
`Forwarded` log; reading the target's getter shows unchanged state. The inner
call reverted and was swallowed.

**Why source is not enough.** Reading `Forwarder.sol` raises suspicion but
cannot distinguish "the inner call reverted" from "the target is a no-op". The
receipt plus the state read decide it.

**Fix.** Check the success flag and revert.

**Role.** Held in reserve. It is the deepest scenario and the slowest to
narrate; run it only if the audience wants one.

### Demo order

1 → 2 → 3 → 4, with 5 in reserve.

## Structure

**`contracts/bugs/`** — `SixDecimalToken.sol`, `OwnedRegistry.sol`,
`Vault.sol`, `Forwarder.sol`. Each is small, and each is individually correct
except `Forwarder`, whose unchecked call is the bug in scenario 5.

**`contracts/scripts/BugsDeploy.s.sol`** — deploys the above and seeds the
broken state: ownership transferred to bob, tokens minted to the test
accounts, no approvals granted. Kept separate from `DevDeploy.s.sol` so the
existing demo is unaffected.

**`src/routes/bugs/`** — `index.tsx` listing the scenarios, plus one route per
scenario, following the existing wagmi generated-hook style. Each route states
its intended behavior, exposes a button, and prints the raw error verbatim.
Routes give no hint about the cause; the printed error is the evidence the
presenter hands to the agent.

**`wagmi.config.ts`** — regenerated so `src/wagmi.generated.ts` picks up the
new ABIs.

**`docs/mcp-debug-runbook.md`** — per scenario: symptom, expected agent path,
expected MCP calls, fix, and reset. Serves as both the presenter's script and
the success criteria for judging whether the agent actually solved it.

## Data flow

The agent's evidence chain for every scenario is the same shape:

1. The presenter triggers the route and pastes the raw error.
2. The agent reads the relevant source and forms competing hypotheses.
3. The agent queries ethui over MCP for the state that discriminates between
   them.
4. The agent names the root cause and proposes the fix.

Scenario 4 extends this with a fifth step: the agent submits a transaction,
ethui prompts, a human approves.

## Error handling

Routes must surface raw revert data rather than catching and prettifying it. A
swallowed error destroys the demo's starting evidence. Where wagmi wraps the
error, the route renders the full wrapped message including the cause chain.

## Reset

Restart anvil, then `yarn eth-deploy`. mprocs already runs anvil and the
contract watcher, so this is one process restart plus one command. The runbook
documents it as the between-demos step.

## Testing

`contracts/test/bugs/` holds forge tests asserting that each bug still
reproduces: `testSetValueRevertsForNonOwner`,
`testDepositRevertsWithoutApproval`, `testForwardSwallowsFailure`, and a
decimals test asserting `decimals() == 6`.

These tests are inverted from normal ones — they pass when the bug is present.
Their purpose is to stop a future refactor from silently repairing a scenario
and leaving the demo with nothing to find. Each test file carries a comment
saying so, so a reader does not "fix" the test.

Scenario 1 has no forge test; a stale frontend address is not observable from
Solidity.
