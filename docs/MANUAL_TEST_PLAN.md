# Manual release test plan

Use two test accounts with no valuable private room state.

## Installation

- Install only SH and verify login, reload and logout/login persistence.
- Test standalone userscript, remote loader, IIFE loader and ES module loader.
- Repeat with WCE and BCX enabled.
- Repeat with LSCG but its Hypnosis module disabled.

## Preferences

- Open SH from Preferences and the HUD.
- Verify every tab at desktop and narrow mobile widths.
- Edit triggers, sounds, restrictions, permissions, suggestions, presets and sessions.
- Export, reset and import settings.

## Hypnosis

- Test all six depth stages and decay.
- Test timed wake, manual wake, aftereffects and lucid trance.
- Trigger through chat, whisper, BCX voice, repeated phrases and combinations.

## Effects and audio

- Test every effect toggle individually and in combination.
- Test low/balanced/high performance.
- Test reduced-motion and no-flash modes.
- Test all built-in sounds and two HTTPS sound URLs.
- Test audio-reactive effects after a user gesture.

## Suggestions

- Install and trigger every instruction type.
- Test random and conditional nested branches.
- Test invalid JSON, excessive nesting, disallowed types and oversized configs.
- Test all five resistance games, timeout and whitelist auto-accept.

## Multiplayer

- Verify every capability is rejected while Remote is disabled.
- Enable one capability at a time and test exact member IDs, owner/lover/friend/item permission and everyone roles.
- Test minimum depth, trance and active-hypnotizer requirements.
- Modify the sender client in DevTools and confirm receiver checks still reject unauthorized packets.
- Replay a packet ID and alter sender/timestamp fields.

## Shared sessions

- Invite, accept, decline, complete and manually stop a session.
- Disconnect the host and subject.
- Test multiple participants and effect/depth/wake controls.

## Emergency

- Activate speech/menu restrictions and confirm Preferences remain reachable.
- Test the hotkey, HUD stop and both BC safeword variants.
- Confirm all audio, sessions, forced phrases and temporary restrictions end.


## 0.2.0 UI and Extreme Mode checks

1. Open Preferences → Extensions and confirm SkyzHypno is listed with the other extension addons, with no floating bottom-right entry.
2. Open SH on 1366×768 and 1920×1080, visit every tab, and verify mouse-wheel/trackpad scrolling reaches the final control.
3. At 0% depth, confirm no spiral and no status bar are visible. Use an Effect Preview and confirm the preview still appears.
4. Raise depth above 0 and confirm a slim vertical bar appears to the right of the player character instead of a screen-corner HUD.
5. Enable Extreme Mode and Lock Quick Controls. Confirm Overview controls are unavailable but Alt+Shift+H and both BC safeword flows still clear state.
6. With two test accounts, enable Remote, `controlIndicator`, its member rule, and Allow trusted remote indicator control. Confirm the trusted account can hide/show only the indicator.
7. Grant `editSettings` and confirm the trusted account can toggle Extreme Mode; revoke the permission and confirm the packet is rejected.
8. Create an Implanted Command, install it on the second account, trigger it, run the resistance game, and verify the configured command action executes only after acceptance.
