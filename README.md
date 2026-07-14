# SkyzHypno (SH)

SkyzHypno is a modern Bondage Club addon that combines a staged hypnosis state, HSC-inspired audiovisual presentation, LSCG-inspired triggers and persistent suggestions, receiver-validated multiplayer controls, shared sessions, configurable restrictions, and an emergency system that cannot be remotely disabled.

## Current release

This repository contains the complete **0.2.0 implementation baseline**. It builds as:

- a self-contained Tampermonkey/Violentmonkey userscript;
- a small remote userscript loader;
- an ES module bundle;
- an IIFE script bundle for FUSAM/PCM-style loaders;
- FUSAM and PCM manifest snippets.

The project passes TypeScript checking, 27 automated unit/browser-bootstrap tests, dependency auditing, and production bundling. Real Bondage Club multiplayer compatibility still requires testing with multiple accounts after each BC release because the game exposes global functions rather than a stable official addon API.

## Major features

- Hypnosis depth from 0–100 with six stages, decay, timed wake-up, lucid trance and aftereffects.
- Chat, whisper, activity, combination and BCX `[Voice]` triggers.
- Repeat counts, delays, cooldowns, one-shot triggers and per-member trigger access.
- Pink glow, dark-creepy and hybrid themes.
- Canvas spirals, tunnels, waves, particles, vignette, dream mode, glitching, chromatic presentation, double vision, chat distortion, memory fragments, focus lock and character auras.
- Web Audio engine with built-in generated sounds, URL sounds, loops, master volume, panning, echo, reverb and analyser-driven visuals.
- Persistent suggestions with nested action flows, conditions, random branches, waits and reusable effect presets.
- Instruction support for effects, sounds, depth, trance, wake, local/public messages, expressions, poses, BC activities, focus/follow presentation, compelled phrases, clothing groups, restrictions, memories, aftereffects and statuses.
- Five resistance minigames: timing, reaction, pulse, classic and multi-hit.
- Automatic acceptance whitelist, depth threshold and per-instruction automatic acceptance.
- Influence values for triggering, deepening, suggestions and waking, with gradual decay.
- Restrictions for speech, movement, poses, wardrobe, interaction, hearing, sight, names and menus.
- Native **Preferences → Extensions → SkyzHypno** registration plus a responsive, scrollable glassy settings interface.
- Visual trigger, sound, suggestion/implanted-command flow and effect-composer editors.
- Receiver-validated hidden-message protocol with replay protection, timestamps, per-capability permissions and audit logging. Remote trigger and limited settings packets are also validated at the recipient.
- Shared timed sessions, invitations, participant roles, pause/resume and remote timeline controls.
- HSC and LSCG settings migration helpers plus BCX/WCE conflict detection.
- Global emergency hotkey and Bondage Club safeword integration. The compact in-room display is a vertical depth bar beside the player character and only appears while affected.
- Streaming and accessibility modes.
- Public API through `window.SkyzHypno` and `window.SH`.

## Installation

### Recommended: self-contained userscript

Install the current build directly in Tampermonkey or Violentmonkey:

```text
https://raw.githubusercontent.com/mystiq-skyz/skyzhypno/main/dist/SkyzHypno.user.js
```

This version contains the complete bundle and does not depend on GitHub Pages. Tampermonkey updates it automatically through the `@updateURL` and `@downloadURL` metadata whenever the version in `package.json` is increased and `dist/SkyzHypno.user.js` is rebuilt and committed.

### Optional: small GitHub Pages loader

The lightweight loader is available at:

```text
https://raw.githubusercontent.com/mystiq-skyz/skyzhypno/main/dist/SkyzHypno-loader.user.js
```

It loads the runtime bundle from:

```text
https://mystiq-skyz.github.io/skyzhypno/skyz-hypno.iife.js
```

The repository includes `.github/workflows/pages.yml`. In the GitHub repository, open **Settings → Pages**, select **GitHub Actions** as the source, and run or re-run the **Deploy GitHub Pages** workflow.

## Development and release build

```bash
npm ci
npm run check
npm run package
```

Generated files are written to `dist/`. The release process also creates `SkyzHypno-release.zip`, `SkyzHypno-source.zip`, and SHA-256 checksum files in the parent directory.

When releasing an update:

1. Increase `version` in `package.json`.
2. Run `npm run package`.
3. Commit the updated source and the rebuilt `dist/` directory.
4. Push to `main`.
5. Confirm that both **Build and test** and **Deploy GitHub Pages** succeed.

Repository: `https://github.com/mystiq-skyz/skyzhypno`  
Issues: `https://github.com/mystiq-skyz/skyzhypno/issues`


## 0.2.0 interface and immersion changes

- Removed the large top-right HUD. A narrow vertical SH depth bar is drawn directly to the right of the player character and is hidden at 0% depth.
- SkyzHypno is registered through Bondage Club's native extension settings list.
- The settings shell now has independent, reliable vertical scrolling, stable scrollbars and larger spacing between cards and nested editors.
- Added opt-in **Extreme Mode**. It can lock ordinary quick controls and hide the visible indicator. A trusted remote user can toggle Extreme Mode only through the existing `editSettings` permission.
- Added a separate `controlIndicator` permission plus a local opt-in switch before another SH user may hide or reveal the status indicator.
- The emergency hotkey and Bondage Club safeword remain local and cannot be remotely disabled.
- Added an **Implanted Command** creator. Commands are stored as normal validated suggestions and may contain later triggers, forced phrases, local/public actions and other approved instruction steps.
- Fixed visual effects, including the spiral, appearing at 0% depth. Explicit preview presets still work while awake.

## First multiplayer setup

Remote functionality is deliberately off by default.

1. Open Bondage Club Preferences and choose **SkyzHypno**.
2. Open **Remote** and enable multiplayer remote features.
3. Enable only the required capabilities.
4. Add exact member IDs or approved roles.
5. Configure whether trance, minimum depth or the active hypnotizer is required.
6. Add trusted member IDs to the resistance auto-accept whitelist only when desired.

Every incoming action is checked again by the receiving client. A sender cannot bypass these checks by modifying their own UI.

## Emergency controls

- Default hotkey: `Alt+Shift+H`.
- Both Bondage Club safeword paths clear SH restrictions and trance.
- Remote packets cannot disable the hotkey, safeword handlers or Preference menu.

## Compatibility

SH is intended to replace the hypnosis portions of HSC and LSCG. WCE, BCX and unrelated LSCG modules may remain enabled. For initial testing, disable HSC effects/triggers and LSCG Hypnosis to prevent duplicate visual and chat reactions.

The compatibility importer can copy common HSC/LSCG trigger words, wake words, sound URLs and influence entries into SH. It never uninstalls another addon.

## Public API

```js
SH.open("effects");
SH.setDepth(60, "test");
SH.addDepth(10, "trigger", 12345);
SH.trance(12345);
SH.wake("manual");
SH.playPreset("preset-deep-trance");
SH.startSession("session-soft");
SH.emergencyStop();
```

## Security model

- Network packets include protocol version, sender, target, timestamp and unique ID.
- Packet sender must match the Bondage Club message sender.
- Packets older than 90 seconds are rejected.
- Duplicate packet IDs are ignored.
- Payloads use strict Zod validation.
- Suggestion trees have nesting, item-count and serialized-size limits.
- Prototype-pollution keys are rejected.
- Incoming suggestions are limited to instruction categories approved by the recipient.
- Remote settings are off by default.

## Verification scope

Automated checks validate pure logic, schemas, permission behavior, settings merging, packet replay fields, trigger matching, trance/auto-wake/emergency behavior, browser-like initialization and production builds. The repository cannot emulate Bondage Club's live server, canvas, account sync or multiple logged-in clients. A release should therefore be tested on a separate BC account pair before broad publication.


## Detailed implementation status

See `docs/FEATURE_MATRIX.md` for the exact boundary between automated verification, browser-bootstrap verification and features that still require two live Bondage Club accounts. The suggestion `follow` action is a local focus-lock presentation; this release does not claim untested cross-room leashing.
