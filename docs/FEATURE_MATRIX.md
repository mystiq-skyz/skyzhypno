# SkyzHypno 0.1.1 feature matrix

Legend: **Automated** means covered by repeatable tests or static validation. **Built / live test required** means the implementation is present but depends on Bondage Club globals, canvas, audio permissions or multiple real accounts.

| Area | Status | Notes |
|---|---|---|
| 0–100 depth, stages, decay, timed wake, lucid trance, aftereffects | Automated | Unit tests cover stage thresholds, trance entry, automatic wake and emergency reset. |
| Chat/whisper/activity/API/remote triggers, repeats, combos, cooldowns | Automated + live test required | Matching logic is tested; BC message hooks need live verification after game updates. |
| BCX `[Voice]` integration | Built / live test required | Uses the BCX mod API when present and reads reminder ownership as a fallback. |
| HSC/LSCG settings migration | Built / live test required | Data-only migration of recognized triggers, wake words, sounds and influence entries. |
| Visual compositor | Built / browser bootstrap tested | Spiral styles, particles, trails, tint, blur, waves, tunnel, dream, glitch, chromatic, double vision, chat effects, aura and memory fragments. |
| Audio engine | Built / live user-gesture test required | Generated sounds, HTTPS URL audio, loops, rate, pan, echo, reverb and analyser output. Browser autoplay policy still applies. |
| Character expressions, poses and BC activities | Built / live test required | Dynamically checks the corresponding BC globals and fails safely when unavailable. |
| Restrictions | Built / bootstrap tested | Speech, walk, pose, wardrobe, interaction, hearing, sight, names and menus; Preferences and emergency controls stay available. |
| Suggestions and nested flows | Automated | Strict schemas, size/depth/count limits, conditions, random branches and receiver policy checks. |
| Resistance minigames | Built / browser test required | Timing, reaction, pulse, classic and multi-hit modes plus member/category/depth auto-accept. |
| Influence values and decay | Automated logic / live UI test required | Separate trigger, deepen, suggestion and wake influence. |
| Multiplayer protocol | Automated schemas + live test required | Sender/target/timestamp validation, replay protection, Zod payload validation, capability checks and audit entries. |
| Remote trigger, depth, wake, effects, suggestions and limited settings | Built / two-account test required | Every request is revalidated by the receiving client. |
| Shared session director | Built / two-account test required | Timelines, invitations, roles, pause/resume, stop, effects, depth, messages, restrictions, suggestions and wake steps. |
| Preference and profile UI | Browser bootstrap tested / live layout test required | Responsive glass UI, editors, remote panel, diagnostics and conflict inspector. |
| Emergency controls | Automated + bootstrap tested | Hotkey, HUD stop, BC safeword hooks, audio/effect/session/restriction reset. Cannot be remotely disabled. |
| Cross-room physical following/leashing | Not claimed | The `follow` instruction implements local focus lock and attention presentation. True cross-room leashing is deliberately not emulated without a stable, tested BC room-transition protocol. |

## Release boundary

The codebase is a complete implementation baseline, not a certification against the live Bondage Club service. A real release should be exercised with two disposable test accounts using `MANUAL_TEST_PLAN.md`, especially after Bondage Club changes global function names or message formats.
