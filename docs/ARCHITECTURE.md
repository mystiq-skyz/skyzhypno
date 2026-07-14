# SkyzHypno architecture

## Boot sequence

1. The userscript waits for a logged-in `Player` and a non-login screen.
2. `BCRuntime` registers SH through `bcModSdk`.
3. Settings load from `Player.ExtensionSettings.SkyzHypno`, then from an account-specific local backup.
4. HSC/LSCG compatibility information is detected and optionally migrated once.
5. The state, permission, audio, restriction, influence, effect, trigger, suggestion, network, session and UI services start.
6. A public quantized SH status is announced through a hidden room packet.

## Data boundaries

### Private account data

Stored compressed in `Player.ExtensionSettings.SkyzHypno`:

- exact trigger phrases;
- sound URLs;
- suggestions and instruction data;
- whitelists and permission rules;
- influence values;
- session and effect presets.

A copy is kept in `localStorage` under the player's member number.

### Public room data

The hidden `hello`/`sync` status only includes:

- SH protocol and version;
- quantized depth in 5% steps;
- stage and trance state;
- active hypnotizer member ID, when present;
- enabled remote capability names;
- selected theme family.

## Hook policy

All BC functions are hooked through `bcModSdk`. Each service owns its cleanup callbacks. Missing game functions are recorded as diagnostics rather than crashing initialization.

## Suggestion execution

Suggestions are data, not executable JavaScript. The receiving client validates their schema and dispatches known instruction types through a fixed handler switch. Nested branches are capped at four levels and thirty top-level instructions.

## Network permissions

The sending UI is advisory. The receiving client performs the authoritative check using:

- master remote switch;
- blocked member list;
- exact capability switch;
- exact member list and/or approved relationship roles;
- minimum depth;
- trance requirement;
- active-hypnotizer requirement.

## Safety invariants

The following are local-only and cannot be changed through the protocol:

- emergency hotkey listener;
- HUD stop button;
- BC safeword hooks;
- Preference-menu access;
- packet validation;
- blocked sender list;
- addon unload API.
