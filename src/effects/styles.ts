export const SH_STYLES = `
:root {
  --sh-primary: #ff58bd;
  --sh-secondary: #731dff;
  --sh-accent: #ff9fe2;
  --sh-bg: #09030f;
  --sh-intensity: .7;
  --sh-depth: 0;
  --sh-glow: .8;
  --sh-darkness: .65;
}
#sh-overlay-root { position: fixed; inset: 0; z-index: 99990; pointer-events: none; overflow: hidden; font-family: Inter, ui-rounded, system-ui, sans-serif; }
#sh-effect-canvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: calc(.12 + var(--sh-intensity) * .72); mix-blend-mode: screen; }
.sh-blur { position:absolute; inset:0; backdrop-filter:blur(min(calc(var(--sh-depth) * .055px), calc(var(--sh-max-blur, 8) * 1px))); opacity:var(--sh-intensity); }
.sh-tint { position:absolute; inset:0; background:radial-gradient(circle at center, color-mix(in srgb,var(--sh-primary) 9%,transparent), color-mix(in srgb,var(--sh-secondary) 15%,transparent)); mix-blend-mode:color; opacity:calc(var(--sh-intensity)*.65); }
.sh-room-aura { position:absolute; inset:0; box-shadow:inset 0 0 calc(50px + var(--sh-depth)*1.8px) color-mix(in srgb,var(--sh-primary) 30%,transparent), inset 0 0 calc(120px + var(--sh-depth)*2px) color-mix(in srgb,var(--sh-secondary) 18%,transparent); opacity:calc(var(--sh-intensity)*.8); animation:sh-aura 5s ease-in-out infinite; }
.sh-vignette { position:absolute; inset:-5%; background: radial-gradient(circle at center, transparent 25%, color-mix(in srgb, var(--sh-bg) calc(42% + var(--sh-darkness) * 45%), transparent) 88%); opacity:calc(.25 + var(--sh-depth) * .006); }
.sh-tunnel { position:absolute; inset:-20%; background: repeating-radial-gradient(circle, transparent 0 4%, color-mix(in srgb,var(--sh-primary) 15%,transparent) 5% 6%, transparent 7% 10%); animation:sh-tunnel 5s linear infinite; opacity:calc(var(--sh-intensity)*.55); }
.sh-waves { position:absolute; inset:-25%; background:repeating-radial-gradient(ellipse at center, transparent 0 22px, color-mix(in srgb,var(--sh-secondary) 22%,transparent) 25px 28px); animation:sh-wave 7s ease-in-out infinite; filter:blur(1px); opacity:calc(var(--sh-intensity)*.45); }
.sh-dream { position:absolute; inset:0; background:linear-gradient(125deg, color-mix(in srgb,var(--sh-primary) 10%,transparent), transparent 35%, color-mix(in srgb,var(--sh-secondary) 12%,transparent)); animation:sh-dream 9s ease-in-out infinite alternate; backdrop-filter:saturate(1.2); }
.sh-glitch { position:absolute; inset:0; opacity:0; background:linear-gradient(90deg,transparent 20%,color-mix(in srgb,var(--sh-primary) 16%,transparent) 21% 23%,transparent 24% 70%,color-mix(in srgb,var(--sh-secondary) 18%,transparent) 71% 72%,transparent 73%); animation:sh-glitch 4.8s steps(1,end) infinite; mix-blend-mode:screen; }
.sh-flash { position:absolute; inset:0; background:var(--sh-accent); opacity:0; transition:opacity .18s ease; }
.sh-fragment { position:absolute; left:50%; top:45%; transform:translate(-50%,-50%); color:white; text-shadow:0 0 8px var(--sh-primary),0 0 24px var(--sh-secondary); font-size:clamp(18px,3vw,48px); font-weight:700; letter-spacing:.08em; opacity:0; animation:sh-fragment 4.5s ease both; max-width:80vw; text-align:center; }
#sh-hud { position:absolute; right:18px; top:18px; min-width:210px; padding:12px 14px; border:1px solid color-mix(in srgb,var(--sh-primary) 42%,transparent); border-radius:18px; background:color-mix(in srgb,var(--sh-bg) 70%,transparent); box-shadow:0 0 calc(14px + var(--sh-glow)*26px) color-mix(in srgb,var(--sh-primary) 32%,transparent), inset 0 1px rgba(255,255,255,.12); backdrop-filter:blur(16px) saturate(1.35); color:white; opacity:.94; pointer-events:auto; }
#sh-hud .sh-title { display:flex; align-items:center; justify-content:space-between; font-weight:800; color:var(--sh-accent); }
#sh-hud .sh-stage { font-size:12px; opacity:.75; text-transform:uppercase; letter-spacing:.1em; }
#sh-hud .sh-bar { height:8px; border-radius:99px; overflow:hidden; margin-top:9px; background:rgba(255,255,255,.12); }
#sh-hud .sh-bar > i { display:block; height:100%; width:calc(var(--sh-depth)*1%); background:linear-gradient(90deg,var(--sh-secondary),var(--sh-primary),var(--sh-accent)); box-shadow:0 0 14px var(--sh-primary); transition:width .45s ease; }
#sh-hud button { pointer-events:auto; border:0; border-radius:10px; margin-top:9px; padding:5px 9px; color:white; background:rgba(255,255,255,.1); cursor:pointer; }
.sh-chat-echo { text-shadow: 2px 0 color-mix(in srgb,var(--sh-primary) 35%,transparent), -2px 0 color-mix(in srgb,var(--sh-secondary) 30%,transparent); }
.sh-chat-distort { animation:sh-chat-float 5s ease-in-out infinite; filter:blur(calc(var(--sh-depth)*.008px)); }
.sh-hide-names .ChatMessageName { filter:blur(7px); user-select:none; }
.sh-stream-hide-members [data-sender]::after { content:"" !important; }
.sh-trance-body { filter:saturate(calc(1 + var(--sh-intensity)*.28)) contrast(calc(1 + var(--sh-intensity)*.07)); }
.sh-chromatic-body canvas { filter:drop-shadow(2px 0 color-mix(in srgb,var(--sh-primary) 28%,transparent)) drop-shadow(-2px 0 color-mix(in srgb,var(--sh-secondary) 28%,transparent)); }
@keyframes sh-aura { 0%,100%{opacity:.3} 50%{opacity:.9} }
@keyframes sh-tunnel { from{transform:scale(.72) rotate(0)} to{transform:scale(1.3) rotate(35deg)} }
@keyframes sh-wave { 0%,100%{transform:scale(.8);opacity:.15} 50%{transform:scale(1.22);opacity:.65} }
@keyframes sh-dream { from{transform:scale(1) translate(-1%,-1%)} to{transform:scale(1.08) translate(1%,1%)} }
@keyframes sh-glitch { 0%,88%,100%{opacity:0;transform:none} 89%{opacity:.6;transform:translateX(-8px)} 90%{opacity:.25;transform:translateX(12px)} 91%{opacity:.5;transform:translateY(5px)} 92%{opacity:0} }
@keyframes sh-fragment { 0%{opacity:0;transform:translate(-50%,-40%) scale(.85);filter:blur(12px)} 20%,70%{opacity:.92;filter:blur(0)} 100%{opacity:0;transform:translate(-50%,-62%) scale(1.08);filter:blur(5px)} }
@keyframes sh-chat-float { 0%,100%{transform:translateX(0)} 50%{transform:translateX(1.5px)} }
@media (prefers-reduced-motion:reduce) { #sh-overlay-root * { animation-duration:.001ms!important; animation-iteration-count:1!important; transition-duration:.001ms!important; } }
.sh-high-contrast .ChatMessage, .sh-high-contrast #sh-hud { text-shadow:0 1px 3px #000,0 0 2px #000; }
.sh-stream-hide-suggestions #sh-preferences .instruction textarea, .sh-stream-hide-suggestions #sh-preferences [data-suggestion="trigger"] { filter:blur(8px); user-select:none; }
`;
