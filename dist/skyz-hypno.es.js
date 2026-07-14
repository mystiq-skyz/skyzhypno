class Ht {
  handlers = /* @__PURE__ */ new Map();
  on(e, t) {
    const s = this.handlers.get(e) ?? /* @__PURE__ */ new Set();
    return s.add(t), this.handlers.set(e, s), () => s.delete(t);
  }
  once(e, t) {
    const s = this.on(e, (i) => {
      s(), t(i);
    });
    return s;
  }
  emit(e, t) {
    for (const s of this.handlers.get(e) ?? [])
      try {
        s(t);
      } catch (i) {
        console.error(`[SkyzHypno] event handler failed: ${String(e)}`, i);
      }
  }
  clear() {
    this.handlers.clear();
  }
}
function It(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var ze = { exports: {} }, dt;
function qt() {
  return dt || (dt = 1, (function(a) {
    var e = (function() {
      var t = String.fromCharCode, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", r = {};
      function n(c, d) {
        if (!r[c]) {
          r[c] = {};
          for (var l = 0; l < c.length; l++)
            r[c][c.charAt(l)] = l;
        }
        return r[c][d];
      }
      var o = {
        compressToBase64: function(c) {
          if (c == null) return "";
          var d = o._compress(c, 6, function(l) {
            return s.charAt(l);
          });
          switch (d.length % 4) {
            // To produce valid Base64
            default:
            // When could this happen ?
            case 0:
              return d;
            case 1:
              return d + "===";
            case 2:
              return d + "==";
            case 3:
              return d + "=";
          }
        },
        decompressFromBase64: function(c) {
          return c == null ? "" : c == "" ? null : o._decompress(c.length, 32, function(d) {
            return n(s, c.charAt(d));
          });
        },
        compressToUTF16: function(c) {
          return c == null ? "" : o._compress(c, 15, function(d) {
            return t(d + 32);
          }) + " ";
        },
        decompressFromUTF16: function(c) {
          return c == null ? "" : c == "" ? null : o._decompress(c.length, 16384, function(d) {
            return c.charCodeAt(d) - 32;
          });
        },
        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function(c) {
          for (var d = o.compress(c), l = new Uint8Array(d.length * 2), h = 0, f = d.length; h < f; h++) {
            var $ = d.charCodeAt(h);
            l[h * 2] = $ >>> 8, l[h * 2 + 1] = $ % 256;
          }
          return l;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function(c) {
          if (c == null)
            return o.decompress(c);
          for (var d = new Array(c.length / 2), l = 0, h = d.length; l < h; l++)
            d[l] = c[l * 2] * 256 + c[l * 2 + 1];
          var f = [];
          return d.forEach(function($) {
            f.push(t($));
          }), o.decompress(f.join(""));
        },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function(c) {
          return c == null ? "" : o._compress(c, 6, function(d) {
            return i.charAt(d);
          });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function(c) {
          return c == null ? "" : c == "" ? null : (c = c.replace(/ /g, "+"), o._decompress(c.length, 32, function(d) {
            return n(i, c.charAt(d));
          }));
        },
        compress: function(c) {
          return o._compress(c, 16, function(d) {
            return t(d);
          });
        },
        _compress: function(c, d, l) {
          if (c == null) return "";
          var h, f, $ = {}, E = {}, U = "", C = "", M = "", D = 2, u = 3, y = 2, g = [], p = 0, b = 0, x;
          for (x = 0; x < c.length; x += 1)
            if (U = c.charAt(x), Object.prototype.hasOwnProperty.call($, U) || ($[U] = u++, E[U] = !0), C = M + U, Object.prototype.hasOwnProperty.call($, C))
              M = C;
            else {
              if (Object.prototype.hasOwnProperty.call(E, M)) {
                if (M.charCodeAt(0) < 256) {
                  for (h = 0; h < y; h++)
                    p = p << 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++;
                  for (f = M.charCodeAt(0), h = 0; h < 8; h++)
                    p = p << 1 | f & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, f = f >> 1;
                } else {
                  for (f = 1, h = 0; h < y; h++)
                    p = p << 1 | f, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, f = 0;
                  for (f = M.charCodeAt(0), h = 0; h < 16; h++)
                    p = p << 1 | f & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, f = f >> 1;
                }
                D--, D == 0 && (D = Math.pow(2, y), y++), delete E[M];
              } else
                for (f = $[M], h = 0; h < y; h++)
                  p = p << 1 | f & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, f = f >> 1;
              D--, D == 0 && (D = Math.pow(2, y), y++), $[C] = u++, M = String(U);
            }
          if (M !== "") {
            if (Object.prototype.hasOwnProperty.call(E, M)) {
              if (M.charCodeAt(0) < 256) {
                for (h = 0; h < y; h++)
                  p = p << 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++;
                for (f = M.charCodeAt(0), h = 0; h < 8; h++)
                  p = p << 1 | f & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, f = f >> 1;
              } else {
                for (f = 1, h = 0; h < y; h++)
                  p = p << 1 | f, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, f = 0;
                for (f = M.charCodeAt(0), h = 0; h < 16; h++)
                  p = p << 1 | f & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, f = f >> 1;
              }
              D--, D == 0 && (D = Math.pow(2, y), y++), delete E[M];
            } else
              for (f = $[M], h = 0; h < y; h++)
                p = p << 1 | f & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, f = f >> 1;
            D--, D == 0 && (D = Math.pow(2, y), y++);
          }
          for (f = 2, h = 0; h < y; h++)
            p = p << 1 | f & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, f = f >> 1;
          for (; ; )
            if (p = p << 1, b == d - 1) {
              g.push(l(p));
              break;
            } else b++;
          return g.join("");
        },
        decompress: function(c) {
          return c == null ? "" : c == "" ? null : o._decompress(c.length, 32768, function(d) {
            return c.charCodeAt(d);
          });
        },
        _decompress: function(c, d, l) {
          var h = [], f = 4, $ = 4, E = 3, U = "", C = [], M, D, u, y, g, p, b, x = { val: l(0), position: d, index: 1 };
          for (M = 0; M < 3; M += 1)
            h[M] = M;
          for (u = 0, g = Math.pow(2, 2), p = 1; p != g; )
            y = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = d, x.val = l(x.index++)), u |= (y > 0 ? 1 : 0) * p, p <<= 1;
          switch (u) {
            case 0:
              for (u = 0, g = Math.pow(2, 8), p = 1; p != g; )
                y = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = d, x.val = l(x.index++)), u |= (y > 0 ? 1 : 0) * p, p <<= 1;
              b = t(u);
              break;
            case 1:
              for (u = 0, g = Math.pow(2, 16), p = 1; p != g; )
                y = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = d, x.val = l(x.index++)), u |= (y > 0 ? 1 : 0) * p, p <<= 1;
              b = t(u);
              break;
            case 2:
              return "";
          }
          for (h[3] = b, D = b, C.push(b); ; ) {
            if (x.index > c)
              return "";
            for (u = 0, g = Math.pow(2, E), p = 1; p != g; )
              y = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = d, x.val = l(x.index++)), u |= (y > 0 ? 1 : 0) * p, p <<= 1;
            switch (b = u) {
              case 0:
                for (u = 0, g = Math.pow(2, 8), p = 1; p != g; )
                  y = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = d, x.val = l(x.index++)), u |= (y > 0 ? 1 : 0) * p, p <<= 1;
                h[$++] = t(u), b = $ - 1, f--;
                break;
              case 1:
                for (u = 0, g = Math.pow(2, 16), p = 1; p != g; )
                  y = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = d, x.val = l(x.index++)), u |= (y > 0 ? 1 : 0) * p, p <<= 1;
                h[$++] = t(u), b = $ - 1, f--;
                break;
              case 2:
                return C.join("");
            }
            if (f == 0 && (f = Math.pow(2, E), E++), h[b])
              U = h[b];
            else if (b === $)
              U = D + D.charAt(0);
            else
              return null;
            C.push(U), h[$++] = D + U.charAt(0), f--, D = U, f == 0 && (f = Math.pow(2, E), E++);
          }
        }
      };
      return o;
    })();
    a != null ? a.exports = e : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return e;
    });
  })(ze)), ze.exports;
}
var Bt = qt();
const ye = /* @__PURE__ */ It(Bt);
function lt(a) {
  if (!(typeof a != "string" || !a)) {
    for (const e of [ye.decompressFromBase64, ye.decompressFromUTF16])
      try {
        const t = e(a);
        if (t) return JSON.parse(t);
      } catch {
      }
    try {
      return JSON.parse(a);
    } catch {
      return;
    }
  }
}
const Se = (a) => Array.isArray(a) ? [...new Set(a.filter((e) => typeof e == "string" && e.trim().length > 0).map((e) => e.trim()))] : [];
class Ut {
  constructor(e, t) {
    this.runtime = e, this.store = t;
  }
  runtime;
  store;
  detect() {
    const e = [];
    return window.Liko?.HSC && e.push("HSC is loaded; disable its effect/trigger modules when using SH replacement mode."), window.LSCG_Loaded && e.push("LSCG is loaded; disable LSCG Hypnosis while keeping other LSCG modules if desired."), window.WCE && e.push("WCE detected; SH will avoid replacing WCE functions and only add SDK hooks."), window.bcx && e.push("BCX detected; [Voice] integration is available."), this.runtime.diagnostics.conflicts.push(...e), e;
  }
  migrateOnce() {
    const e = `SkyzHypno_${this.runtime.memberNumber}_migrated_0_1`;
    if (localStorage.getItem(e)) return;
    const t = this.store.value;
    let s = !1;
    t.compatibility.importHSC && (s = this.importHSC(t) || s), t.compatibility.importLSCG && (s = this.importLSCG(t) || s), s && this.store.update(() => {
    }, !0), localStorage.setItem(e, (/* @__PURE__ */ new Date()).toISOString());
  }
  importHSC(e) {
    const t = this.runtime.player?.ExtensionSettings?.HSC, s = lt(t);
    if (!s || typeof s != "object") return !1;
    let i = !1;
    const r = Se(s.customTexts?.trigger ?? s.triggerWords ?? s.triggers), n = Se(s.customTexts?.wake ?? s.wakeWords ?? s.awakeners);
    for (const c of r) i = this.addImportedTrigger(e, c, "trigger", "HSC") || i;
    for (const c of n) i = this.addImportedTrigger(e, c, "wake", "HSC") || i;
    const o = Se(s.sounds ?? s.soundUrls);
    for (const c of o)
      e.audio.sounds.some((d) => d.url === c) || (e.audio.sounds.push({
        id: crypto.randomUUID(),
        name: "Imported HSC sound",
        category: "trigger",
        url: c,
        enabled: !0,
        volume: 0.5,
        loop: !1,
        playbackRate: 1,
        pan: 0,
        reverb: 0.2,
        echo: 0.1,
        builtIn: !1
      }), i = !0);
    return i;
  }
  importLSCG(e) {
    const t = this.runtime.player?.ExtensionSettings?.LSCG ?? this.runtime.player?.OnlineSettings?.LSCG, i = (lt(t) ?? this.runtime.player?.LSCG)?.HypnoModule;
    if (!i || typeof i != "object") return !1;
    let r = !1;
    const n = typeof i.overrideWords == "string" ? i.overrideWords.split(",") : [i.trigger], o = typeof i.awakeners == "string" ? i.awakeners.split(",") : [];
    for (const c of Se(n)) r = this.addImportedTrigger(e, c, "trigger", "LSCG") || r;
    for (const c of Se(o)) r = this.addImportedTrigger(e, c, "wake", "LSCG") || r;
    if (Array.isArray(i.influence))
      for (const c of i.influence) {
        if (!Number.isInteger(c?.memberId) || c.memberId <= 0 || e.influence.some((l) => l.memberId === c.memberId)) continue;
        const d = Math.max(0, Math.min(100, Number(c.influence) || 0));
        e.influence.push({
          memberId: c.memberId,
          memberName: String(c.memberName ?? `#${c.memberId}`),
          trigger: d,
          suggestion: d,
          deepen: d,
          wake: 0,
          lastChangedAt: Date.now()
        }), r = !0;
      }
    return r;
  }
  addImportedTrigger(e, t, s, i) {
    return t = t.trim(), !t || e.triggers.some((r) => r.phrase.toLocaleLowerCase() === t.toLocaleLowerCase() && r.kind === s) ? !1 : (e.triggers.push({
      id: crypto.randomUUID(),
      name: `Imported ${i} ${s}`,
      phrase: t,
      kind: s,
      enabled: !0,
      source: ["chat", "whisper", "voice"],
      minDepth: 0,
      maxDepth: 100,
      depthDelta: s === "wake" ? 0 : 25,
      cooldownMs: 5e3,
      delayMs: 0,
      requiredRepeats: 1,
      repeatWindowMs: 3e4,
      comboPhrases: [],
      allowedMemberIds: [],
      requireNameMention: !1,
      oneShot: !1
    }), !0);
  }
}
class zt {
  cleanups = [];
  stopped = !1;
  add(e) {
    if (e) {
      if (this.stopped) {
        e();
        return;
      }
      this.cleanups.push(e);
    }
  }
  timeout(e, t) {
    const s = window.setTimeout(e, t);
    return this.add(() => window.clearTimeout(s)), s;
  }
  interval(e, t) {
    const s = window.setInterval(e, t);
    return this.add(() => window.clearInterval(s)), s;
  }
  listen(e, t, s, i) {
    e.addEventListener(t, s, i), this.add(() => e.removeEventListener(t, s, i));
  }
  stop() {
    if (!this.stopped) {
      this.stopped = !0;
      for (const e of this.cleanups.splice(0).reverse())
        try {
          e();
        } catch (t) {
          console.error("[SkyzHypno] cleanup failed", t);
        }
    }
  }
}
class Zt {
  constructor(e, t) {
    this.runtime = e, this.getSettings = t;
  }
  runtime;
  getSettings;
  can(e) {
    if (e.sender === this.runtime.memberNumber) return !0;
    const t = this.getSettings();
    if (!t.remote.enabled || t.remote.blockedMemberIds.includes(e.sender)) return !1;
    const s = t.remote.capabilities[e.capability];
    return !s?.enabled || e.depth < s.minDepth || s.requireTrance && !e.trance || s.requireActiveHypnotizer && e.activeBy !== e.sender ? !1 : this.matchesRule(e.sender, s);
  }
  matchesRule(e, t) {
    if (t.memberIds.includes(e)) return !0;
    const s = this.runtime.character(e), i = this.runtime.player;
    return t.roles.some((r) => {
      switch (r) {
        case "self":
          return e === this.runtime.memberNumber;
        case "whitelist":
          return t.memberIds.includes(e);
        case "everyone":
          return !0;
        case "owner":
          return !!i?.IsOwnedByMemberNumber?.(e);
        case "lover":
          return !!i?.IsLoverOfMemberNumber?.(e);
        case "friend":
          return !!i?.FriendList?.includes(e);
        case "itemPermission":
          try {
            return !!(s && i && ServerChatRoomGetAllowItem(s, i));
          } catch {
            return !1;
          }
        default:
          return !1;
      }
    });
  }
}
var Ze = {}, ut;
function Ft() {
  return ut || (ut = 1, (function(a) {
    (function() {
      const e = "1.2.0";
      function t(u) {
        alert(`Mod ERROR:
` + u);
        const y = new Error(u);
        throw console.error(y), y;
      }
      const s = new TextEncoder();
      function i(u) {
        return !!u && typeof u == "object" && !Array.isArray(u);
      }
      function r(u) {
        const y = /* @__PURE__ */ new Set();
        return u.filter(((g) => !y.has(g) && y.add(g)));
      }
      const n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
      function c(u) {
        o.has(u) || (o.add(u), console.warn(u));
      }
      function d(u) {
        const y = [], g = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Set();
        for (const O of $.values()) {
          const H = O.patching.get(u.name);
          if (H) {
            y.push(...H.hooks);
            for (const [N, S] of H.patches.entries()) g.has(N) && g.get(N) !== S && c(`ModSDK: Mod '${O.name}' is patching function ${u.name} with same pattern that is already applied by different mod, but with different pattern:
Pattern:
${N}
Patch1:
${g.get(N) || ""}
Patch2:
${S}`), g.set(N, S), p.add(O.name);
          }
        }
        y.sort(((O, H) => H.priority - O.priority));
        const b = (function(O, H) {
          if (H.size === 0) return O;
          let N = O.toString().replaceAll(`\r
`, `
`);
          for (const [S, L] of H.entries()) N.includes(S) || c(`ModSDK: Patching ${O.name}: Patch ${S} not applied`), N = N.replaceAll(S, L);
          return (0, eval)(`(${N})`);
        })(u.original, g);
        let x = function(O) {
          var H, N;
          const S = (N = (H = M.errorReporterHooks).hookChainExit) === null || N === void 0 ? void 0 : N.call(H, u.name, p), L = b.apply(this, O);
          return S?.(), L;
        };
        for (let O = y.length - 1; O >= 0; O--) {
          const H = y[O], N = x;
          x = function(S) {
            var L, V;
            const J = (V = (L = M.errorReporterHooks).hookEnter) === null || V === void 0 ? void 0 : V.call(L, u.name, H.mod), Y = H.hook.apply(this, [S, (te) => {
              if (arguments.length !== 1 || !Array.isArray(S)) throw new Error(`Mod ${H.mod} failed to call next hook: Expected args to be array, got ${typeof te}`);
              return N.call(this, te);
            }]);
            return J?.(), Y;
          };
        }
        return { hooks: y, patches: g, patchesSources: p, enter: x, final: b };
      }
      function l(u, y = !1) {
        let g = n.get(u);
        if (g) y && (g.precomputed = d(g));
        else {
          let p = window;
          const b = u.split(".");
          for (let N = 0; N < b.length - 1; N++) if (p = p[b[N]], !i(p)) throw new Error(`ModSDK: Function ${u} to be patched not found; ${b.slice(0, N + 1).join(".")} is not object`);
          const x = p[b[b.length - 1]];
          if (typeof x != "function") throw new Error(`ModSDK: Function ${u} to be patched not found`);
          const O = (function(N) {
            let S = -1;
            for (const L of s.encode(N)) {
              let V = 255 & (S ^ L);
              for (let J = 0; J < 8; J++) V = 1 & V ? -306674912 ^ V >>> 1 : V >>> 1;
              S = S >>> 8 ^ V;
            }
            return ((-1 ^ S) >>> 0).toString(16).padStart(8, "0").toUpperCase();
          })(x.toString().replaceAll(`\r
`, `
`)), H = { name: u, original: x, originalHash: O };
          g = Object.assign(Object.assign({}, H), { precomputed: d(H), router: () => {
          }, context: p, contextProperty: b[b.length - 1] }), g.router = /* @__PURE__ */ (function(N) {
            return function(...S) {
              return N.precomputed.enter.apply(this, [S]);
            };
          })(g), n.set(u, g), p[g.contextProperty] = g.router;
        }
        return g;
      }
      function h() {
        for (const u of n.values()) u.precomputed = d(u);
      }
      function f() {
        const u = /* @__PURE__ */ new Map();
        for (const [y, g] of n) u.set(y, { name: y, original: g.original, originalHash: g.originalHash, sdkEntrypoint: g.router, currentEntrypoint: g.context[g.contextProperty], hookedByMods: r(g.precomputed.hooks.map(((p) => p.mod))), patchedByMods: Array.from(g.precomputed.patchesSources) });
        return u;
      }
      const $ = /* @__PURE__ */ new Map();
      function E(u) {
        $.get(u.name) !== u && t(`Failed to unload mod '${u.name}': Not registered`), $.delete(u.name), u.loaded = !1, h();
      }
      function U(u, y) {
        u && typeof u == "object" || t("Failed to register mod: Expected info object, got " + typeof u), typeof u.name == "string" && u.name || t("Failed to register mod: Expected name to be non-empty string, got " + typeof u.name);
        let g = `'${u.name}'`;
        typeof u.fullName == "string" && u.fullName || t(`Failed to register mod ${g}: Expected fullName to be non-empty string, got ${typeof u.fullName}`), g = `'${u.fullName} (${u.name})'`, typeof u.version != "string" && t(`Failed to register mod ${g}: Expected version to be string, got ${typeof u.version}`), u.repository || (u.repository = void 0), u.repository !== void 0 && typeof u.repository != "string" && t(`Failed to register mod ${g}: Expected repository to be undefined or string, got ${typeof u.version}`), y == null && (y = {}), y && typeof y == "object" || t(`Failed to register mod ${g}: Expected options to be undefined or object, got ${typeof y}`);
        const p = y.allowReplace === !0, b = $.get(u.name);
        b && (b.allowReplace && p || t(`Refusing to load mod ${g}: it is already loaded and doesn't allow being replaced.
Was the mod loaded multiple times?`), E(b));
        const x = (S) => {
          let L = N.patching.get(S.name);
          return L || (L = { hooks: [], patches: /* @__PURE__ */ new Map() }, N.patching.set(S.name, L)), L;
        }, O = (S, L) => (...V) => {
          var J, Y;
          const te = (Y = (J = M.errorReporterHooks).apiEndpointEnter) === null || Y === void 0 ? void 0 : Y.call(J, S, N.name);
          N.loaded || t(`Mod ${g} attempted to call SDK function after being unloaded`);
          const Ne = L(...V);
          return te?.(), Ne;
        }, H = { unload: O("unload", (() => E(N))), hookFunction: O("hookFunction", ((S, L, V) => {
          typeof S == "string" && S || t(`Mod ${g} failed to patch a function: Expected function name string, got ${typeof S}`);
          const J = l(S), Y = x(J);
          typeof L != "number" && t(`Mod ${g} failed to hook function '${S}': Expected priority number, got ${typeof L}`), typeof V != "function" && t(`Mod ${g} failed to hook function '${S}': Expected hook function, got ${typeof V}`);
          const te = { mod: N.name, priority: L, hook: V };
          return Y.hooks.push(te), h(), () => {
            const Ne = Y.hooks.indexOf(te);
            Ne >= 0 && (Y.hooks.splice(Ne, 1), h());
          };
        })), patchFunction: O("patchFunction", ((S, L) => {
          typeof S == "string" && S || t(`Mod ${g} failed to patch a function: Expected function name string, got ${typeof S}`);
          const V = l(S), J = x(V);
          i(L) || t(`Mod ${g} failed to patch function '${S}': Expected patches object, got ${typeof L}`);
          for (const [Y, te] of Object.entries(L)) typeof te == "string" ? J.patches.set(Y, te) : te === null ? J.patches.delete(Y) : t(`Mod ${g} failed to patch function '${S}': Invalid format of patch '${Y}'`);
          h();
        })), removePatches: O("removePatches", ((S) => {
          typeof S == "string" && S || t(`Mod ${g} failed to patch a function: Expected function name string, got ${typeof S}`);
          const L = l(S);
          x(L).patches.clear(), h();
        })), callOriginal: O("callOriginal", ((S, L, V) => {
          typeof S == "string" && S || t(`Mod ${g} failed to call a function: Expected function name string, got ${typeof S}`);
          const J = l(S);
          return Array.isArray(L) || t(`Mod ${g} failed to call a function: Expected args array, got ${typeof L}`), J.original.apply(V ?? globalThis, L);
        })), getOriginalHash: O("getOriginalHash", ((S) => (typeof S == "string" && S || t(`Mod ${g} failed to get hash: Expected function name string, got ${typeof S}`), l(S).originalHash))) }, N = { name: u.name, fullName: u.fullName, version: u.version, repository: u.repository, allowReplace: p, api: H, loaded: !0, patching: /* @__PURE__ */ new Map() };
        return $.set(u.name, N), Object.freeze(H);
      }
      function C() {
        const u = [];
        for (const y of $.values()) u.push({ name: y.name, fullName: y.fullName, version: y.version, repository: y.repository });
        return u;
      }
      let M;
      const D = window.bcModSdk === void 0 ? window.bcModSdk = (function() {
        const u = { version: e, apiVersion: 1, registerMod: U, getModsInfo: C, getPatchingInfo: f, errorReporterHooks: Object.seal({ apiEndpointEnter: null, hookEnter: null, hookChainExit: null }) };
        return M = u, Object.freeze(u);
      })() : (i(window.bcModSdk) || t("Failed to init Mod SDK: Name already in use"), window.bcModSdk.apiVersion !== 1 && t(`Failed to init Mod SDK: Different version already loaded ('1.2.0' vs '${window.bcModSdk.version}')`), window.bcModSdk.version !== e && alert(`Mod SDK warning: Loading different but compatible versions ('1.2.0' vs '${window.bcModSdk.version}')
One of mods you are using is using an old version of SDK. It will work for now but please inform author to update`), window.bcModSdk);
      return Object.defineProperty(a, "__esModule", { value: !0 }), a.default = D, D;
    })();
  })(Ze)), Ze;
}
var Vt = Ft();
const Wt = /* @__PURE__ */ It(Vt);
class Gt {
  sdk = Wt.registerMod({
    name: "SkyzHypno",
    fullName: "SkyzHypno",
    version: "0.2.0",
    repository: "https://github.com/mystiq-skyz/skyzhypno"
  });
  diagnostics = {
    hooks: [],
    conflicts: [],
    lastErrors: [],
    networkPacketsReceived: 0,
    networkPacketsRejected: 0
  };
  hookCleanups = [];
  audit = [];
  exists(e) {
    return this.get(e) !== void 0;
  }
  get(e) {
    let t = globalThis;
    for (const s of e.split(".")) {
      if (t == null || !(s in t)) return;
      t = t[s];
    }
    return t;
  }
  hook(e, t, s) {
    if (!this.exists(e))
      return this.diagnostics.conflicts.push(`Missing hook target: ${e}`), () => {
      };
    try {
      const i = this.sdk.hookFunction(e, t, s);
      return this.hookCleanups.push(i), this.diagnostics.hooks.push(e), i;
    } catch (i) {
      return this.recordError(`Hook ${e}`, i), () => {
      };
    }
  }
  callOriginal(e, t) {
    return this.sdk.callOriginal(e, t);
  }
  unload() {
    for (const e of this.hookCleanups.splice(0).reverse())
      try {
        e();
      } catch (t) {
        this.recordError("hook cleanup", t);
      }
    try {
      this.sdk.unload();
    } catch (e) {
      this.recordError("sdk unload", e);
    }
  }
  recordError(e, t) {
    const s = `${e}: ${t instanceof Error ? t.message : String(t)}`;
    this.diagnostics.lastErrors.unshift(s), this.diagnostics.lastErrors.length = Math.min(this.diagnostics.lastErrors.length, 20), console.error(`[SkyzHypno] ${s}`, t);
  }
  get player() {
    return typeof Player > "u" ? void 0 : Player;
  }
  get memberNumber() {
    return this.player?.MemberNumber ?? -1;
  }
  get playerName() {
    const e = this.player;
    if (!e) return "Unknown";
    try {
      return typeof CharacterNickname == "function" ? CharacterNickname(e) : e.Nickname || e.Name || "Unknown";
    } catch {
      return e.Nickname || e.Name || "Unknown";
    }
  }
  character(e) {
    return e === this.memberNumber ? this.player : typeof ChatRoomCharacter > "u" ? void 0 : ChatRoomCharacter.find((t) => t.MemberNumber === e);
  }
  characterName(e) {
    const t = this.character(e);
    if (!t) return `#${e}`;
    try {
      return CharacterNickname(t);
    } catch {
      return t.Nickname || t.Name || `#${e}`;
    }
  }
  inChatRoom() {
    return typeof CurrentScreen < "u" && CurrentScreen === "ChatRoom";
  }
  sendHidden(e, t) {
    if (typeof ServerSend != "function") return;
    const s = [{ Tag: "SkyzHypno", message: e }];
    ServerSend("ChatRoomChat", { Type: "Hidden", Content: "SkyzHypno", Target: t, Dictionary: s });
  }
  sendAction(e) {
    typeof ServerSend == "function" && ServerSend("ChatRoomChat", {
      Type: "Action",
      Content: "Beep",
      Dictionary: [{ Tag: "Beep", Text: "msg" }, { Tag: "msg", Text: e }]
    });
  }
  localMessage(e, t = "info") {
    const s = document.querySelector("#TextAreaChatLog") ?? document.querySelector("#ChatRoomChatLog"), i = document.createElement("div");
    i.className = `ChatMessage ChatMessageLocalMessage sh-local sh-${t}`, i.textContent = `[SH] ${e}`, s ? s.appendChild(i) : console[t === "error" ? "error" : t === "warn" ? "warn" : "info"](`[SH] ${e}`);
  }
  auditEntry(e) {
    this.audit.unshift(e), this.audit.length = Math.min(200, this.audit.length);
  }
  getAudit() {
    return this.audit;
  }
  syncExtensionSettings() {
    try {
      typeof ServerPlayerExtensionSettingsSync == "function" && ServerPlayerExtensionSettingsSync("SkyzHypno");
    } catch (e) {
      this.recordError("settings sync", e);
    }
  }
  syncOnlineSettings() {
    try {
      typeof ServerPlayerOnlineSync == "function" && ServerPlayerOnlineSync();
    } catch (e) {
      this.recordError("online settings sync", e);
    }
  }
}
var j;
(function(a) {
  a.assertEqual = (i) => {
  };
  function e(i) {
  }
  a.assertIs = e;
  function t(i) {
    throw new Error();
  }
  a.assertNever = t, a.arrayToEnum = (i) => {
    const r = {};
    for (const n of i)
      r[n] = n;
    return r;
  }, a.getValidEnumValues = (i) => {
    const r = a.objectKeys(i).filter((o) => typeof i[i[o]] != "number"), n = {};
    for (const o of r)
      n[o] = i[o];
    return a.objectValues(n);
  }, a.objectValues = (i) => a.objectKeys(i).map(function(r) {
    return i[r];
  }), a.objectKeys = typeof Object.keys == "function" ? (i) => Object.keys(i) : (i) => {
    const r = [];
    for (const n in i)
      Object.prototype.hasOwnProperty.call(i, n) && r.push(n);
    return r;
  }, a.find = (i, r) => {
    for (const n of i)
      if (r(n))
        return n;
  }, a.isInteger = typeof Number.isInteger == "function" ? (i) => Number.isInteger(i) : (i) => typeof i == "number" && Number.isFinite(i) && Math.floor(i) === i;
  function s(i, r = " | ") {
    return i.map((n) => typeof n == "string" ? `'${n}'` : n).join(r);
  }
  a.joinValues = s, a.jsonStringifyReplacer = (i, r) => typeof r == "bigint" ? r.toString() : r;
})(j || (j = {}));
var ht;
(function(a) {
  a.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(ht || (ht = {}));
const w = j.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), le = (a) => {
  switch (typeof a) {
    case "undefined":
      return w.undefined;
    case "string":
      return w.string;
    case "number":
      return Number.isNaN(a) ? w.nan : w.number;
    case "boolean":
      return w.boolean;
    case "function":
      return w.function;
    case "bigint":
      return w.bigint;
    case "symbol":
      return w.symbol;
    case "object":
      return Array.isArray(a) ? w.array : a === null ? w.null : a.then && typeof a.then == "function" && a.catch && typeof a.catch == "function" ? w.promise : typeof Map < "u" && a instanceof Map ? w.map : typeof Set < "u" && a instanceof Set ? w.set : typeof Date < "u" && a instanceof Date ? w.date : w.object;
    default:
      return w.unknown;
  }
}, m = j.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class de extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (s) => {
      this.issues = [...this.issues, s];
    }, this.addIssues = (s = []) => {
      this.issues = [...this.issues, ...s];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(r) {
      return r.message;
    }, s = { _errors: [] }, i = (r) => {
      for (const n of r.issues)
        if (n.code === "invalid_union")
          n.unionErrors.map(i);
        else if (n.code === "invalid_return_type")
          i(n.returnTypeError);
        else if (n.code === "invalid_arguments")
          i(n.argumentsError);
        else if (n.path.length === 0)
          s._errors.push(t(n));
        else {
          let o = s, c = 0;
          for (; c < n.path.length; ) {
            const d = n.path[c];
            c === n.path.length - 1 ? (o[d] = o[d] || { _errors: [] }, o[d]._errors.push(t(n))) : o[d] = o[d] || { _errors: [] }, o = o[d], c++;
          }
        }
    };
    return i(this), s;
  }
  static assert(e) {
    if (!(e instanceof de))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, j.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, s = [];
    for (const i of this.issues)
      i.path.length > 0 ? (t[i.path[0]] = t[i.path[0]] || [], t[i.path[0]].push(e(i))) : s.push(e(i));
    return { formErrors: s, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
de.create = (a) => new de(a);
const Xe = (a, e) => {
  let t;
  switch (a.code) {
    case m.invalid_type:
      a.received === w.undefined ? t = "Required" : t = `Expected ${a.expected}, received ${a.received}`;
      break;
    case m.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(a.expected, j.jsonStringifyReplacer)}`;
      break;
    case m.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${j.joinValues(a.keys, ", ")}`;
      break;
    case m.invalid_union:
      t = "Invalid input";
      break;
    case m.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${j.joinValues(a.options)}`;
      break;
    case m.invalid_enum_value:
      t = `Invalid enum value. Expected ${j.joinValues(a.options)}, received '${a.received}'`;
      break;
    case m.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case m.invalid_return_type:
      t = "Invalid function return type";
      break;
    case m.invalid_date:
      t = "Invalid date";
      break;
    case m.invalid_string:
      typeof a.validation == "object" ? "includes" in a.validation ? (t = `Invalid input: must include "${a.validation.includes}"`, typeof a.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${a.validation.position}`)) : "startsWith" in a.validation ? t = `Invalid input: must start with "${a.validation.startsWith}"` : "endsWith" in a.validation ? t = `Invalid input: must end with "${a.validation.endsWith}"` : j.assertNever(a.validation) : a.validation !== "regex" ? t = `Invalid ${a.validation}` : t = "Invalid";
      break;
    case m.too_small:
      a.type === "array" ? t = `Array must contain ${a.exact ? "exactly" : a.inclusive ? "at least" : "more than"} ${a.minimum} element(s)` : a.type === "string" ? t = `String must contain ${a.exact ? "exactly" : a.inclusive ? "at least" : "over"} ${a.minimum} character(s)` : a.type === "number" ? t = `Number must be ${a.exact ? "exactly equal to " : a.inclusive ? "greater than or equal to " : "greater than "}${a.minimum}` : a.type === "date" ? t = `Date must be ${a.exact ? "exactly equal to " : a.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(a.minimum))}` : t = "Invalid input";
      break;
    case m.too_big:
      a.type === "array" ? t = `Array must contain ${a.exact ? "exactly" : a.inclusive ? "at most" : "less than"} ${a.maximum} element(s)` : a.type === "string" ? t = `String must contain ${a.exact ? "exactly" : a.inclusive ? "at most" : "under"} ${a.maximum} character(s)` : a.type === "number" ? t = `Number must be ${a.exact ? "exactly" : a.inclusive ? "less than or equal to" : "less than"} ${a.maximum}` : a.type === "bigint" ? t = `BigInt must be ${a.exact ? "exactly" : a.inclusive ? "less than or equal to" : "less than"} ${a.maximum}` : a.type === "date" ? t = `Date must be ${a.exact ? "exactly" : a.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(a.maximum))}` : t = "Invalid input";
      break;
    case m.custom:
      t = "Invalid input";
      break;
    case m.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case m.not_multiple_of:
      t = `Number must be a multiple of ${a.multipleOf}`;
      break;
    case m.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, j.assertNever(a);
  }
  return { message: t };
};
let Kt = Xe;
function Jt() {
  return Kt;
}
const Xt = (a) => {
  const { data: e, path: t, errorMaps: s, issueData: i } = a, r = [...t, ...i.path || []], n = {
    ...i,
    path: r
  };
  if (i.message !== void 0)
    return {
      ...i,
      path: r,
      message: i.message
    };
  let o = "";
  const c = s.filter((d) => !!d).slice().reverse();
  for (const d of c)
    o = d(n, { data: e, defaultError: o }).message;
  return {
    ...i,
    path: r,
    message: o
  };
};
function v(a, e) {
  const t = Jt(), s = Xt({
    issueData: e,
    data: a.data,
    path: a.path,
    errorMaps: [
      a.common.contextualErrorMap,
      // contextual error map is first priority
      a.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === Xe ? void 0 : Xe
      // then global default map
    ].filter((i) => !!i)
  });
  a.common.issues.push(s);
}
class X {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const s = [];
    for (const i of t) {
      if (i.status === "aborted")
        return I;
      i.status === "dirty" && e.dirty(), s.push(i.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const i of t) {
      const r = await i.key, n = await i.value;
      s.push({
        key: r,
        value: n
      });
    }
    return X.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const i of t) {
      const { key: r, value: n } = i;
      if (r.status === "aborted" || n.status === "aborted")
        return I;
      r.status === "dirty" && e.dirty(), n.status === "dirty" && e.dirty(), r.value !== "__proto__" && (typeof n.value < "u" || i.alwaysSet) && (s[r.value] = n.value);
    }
    return { status: e.value, value: s };
  }
}
const I = Object.freeze({
  status: "aborted"
}), Ce = (a) => ({ status: "dirty", value: a }), se = (a) => ({ status: "valid", value: a }), pt = (a) => a.status === "aborted", mt = (a) => a.status === "dirty", ve = (a) => a.status === "valid", De = (a) => typeof Promise < "u" && a instanceof Promise;
var k;
(function(a) {
  a.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, a.toString = (e) => typeof e == "string" ? e : e?.message;
})(k || (k = {}));
class oe {
  constructor(e, t, s, i) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = i;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const ft = (a, e) => {
  if (ve(e))
    return { success: !0, data: e.value };
  if (!a.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new de(a.common.issues);
      return this._error = t, this._error;
    }
  };
};
function R(a) {
  if (!a)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: i } = a;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: i } : { errorMap: (n, o) => {
    const { message: c } = a;
    return n.code === "invalid_enum_value" ? { message: c ?? o.defaultError } : typeof o.data > "u" ? { message: c ?? s ?? o.defaultError } : n.code !== "invalid_type" ? { message: o.defaultError } : { message: c ?? t ?? o.defaultError };
  }, description: i };
}
class P {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return le(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: le(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new X(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: le(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (De(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const s = this.safeParse(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  safeParse(e, t) {
    const s = {
      common: {
        issues: [],
        async: t?.async ?? !1,
        contextualErrorMap: t?.errorMap
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: le(e)
    }, i = this._parseSync({ data: e, path: s.path, parent: s });
    return ft(s, i);
  }
  "~validate"(e) {
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: le(e)
    };
    if (!this["~standard"].async)
      try {
        const s = this._parseSync({ data: e, path: [], parent: t });
        return ve(s) ? {
          value: s.value
        } : {
          issues: t.common.issues
        };
      } catch (s) {
        s?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((s) => ve(s) ? {
      value: s.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const s = await this.safeParseAsync(e, t);
    if (s.success)
      return s.data;
    throw s.error;
  }
  async safeParseAsync(e, t) {
    const s = {
      common: {
        issues: [],
        contextualErrorMap: t?.errorMap,
        async: !0
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: le(e)
    }, i = this._parse({ data: e, path: s.path, parent: s }), r = await (De(i) ? i : Promise.resolve(i));
    return ft(s, r);
  }
  refine(e, t) {
    const s = (i) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(i) : t;
    return this._refinement((i, r) => {
      const n = e(i), o = () => r.addIssue({
        code: m.custom,
        ...s(i)
      });
      return typeof Promise < "u" && n instanceof Promise ? n.then((c) => c ? !0 : (o(), !1)) : n ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((s, i) => e(s) ? !0 : (i.addIssue(typeof t == "function" ? t(s, i) : t), !1));
  }
  _refinement(e) {
    return new xe({
      schema: this,
      typeName: T.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return ue.create(this, this._def);
  }
  nullable() {
    return ke.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ne.create(this);
  }
  promise() {
    return qe.create(this, this._def);
  }
  or(e) {
    return Le.create([this, e], this._def);
  }
  and(e) {
    return je.create(this, e, this._def);
  }
  transform(e) {
    return new xe({
      ...R(this._def),
      schema: this,
      typeName: T.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new it({
      ...R(this._def),
      innerType: this,
      defaultValue: t,
      typeName: T.ZodDefault
    });
  }
  brand() {
    return new ws({
      typeName: T.ZodBranded,
      type: this,
      ...R(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new rt({
      ...R(this._def),
      innerType: this,
      catchValue: t,
      typeName: T.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return ct.create(this, e);
  }
  readonly() {
    return at.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Qt = /^c[^\s-]{8,}$/i, Yt = /^[0-9a-z]+$/, es = /^[0-9A-HJKMNP-TV-Z]{26}$/i, ts = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, ss = /^[a-z0-9_-]{21}$/i, is = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, rs = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, as = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, ns = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Fe;
const os = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, cs = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, ds = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, ls = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, us = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, hs = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Et = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", ps = new RegExp(`^${Et}$`);
function Nt(a) {
  let e = "[0-5]\\d";
  a.precision ? e = `${e}\\.\\d{${a.precision}}` : a.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = a.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function ms(a) {
  return new RegExp(`^${Nt(a)}$`);
}
function fs(a) {
  let e = `${Et}T${Nt(a)}`;
  const t = [];
  return t.push(a.local ? "Z?" : "Z"), a.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function gs(a, e) {
  return !!((e === "v4" || !e) && os.test(a) || (e === "v6" || !e) && ds.test(a));
}
function ys(a, e) {
  if (!is.test(a))
    return !1;
  try {
    const [t] = a.split("."), s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), i = JSON.parse(atob(s));
    return !(typeof i != "object" || i === null || "typ" in i && i?.typ !== "JWT" || !i.alg || e && i.alg !== e);
  } catch {
    return !1;
  }
}
function vs(a, e) {
  return !!((e === "v4" || !e) && cs.test(a) || (e === "v6" || !e) && ls.test(a));
}
class ce extends P {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== w.string) {
      const r = this._getOrReturnCtx(e);
      return v(r, {
        code: m.invalid_type,
        expected: w.string,
        received: r.parsedType
      }), I;
    }
    const s = new X();
    let i;
    for (const r of this._def.checks)
      if (r.kind === "min")
        e.data.length < r.value && (i = this._getOrReturnCtx(e, i), v(i, {
          code: m.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), s.dirty());
      else if (r.kind === "max")
        e.data.length > r.value && (i = this._getOrReturnCtx(e, i), v(i, {
          code: m.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), s.dirty());
      else if (r.kind === "length") {
        const n = e.data.length > r.value, o = e.data.length < r.value;
        (n || o) && (i = this._getOrReturnCtx(e, i), n ? v(i, {
          code: m.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }) : o && v(i, {
          code: m.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }), s.dirty());
      } else if (r.kind === "email")
        as.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "email",
          code: m.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "emoji")
        Fe || (Fe = new RegExp(ns, "u")), Fe.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "emoji",
          code: m.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "uuid")
        ts.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "uuid",
          code: m.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "nanoid")
        ss.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "nanoid",
          code: m.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "cuid")
        Qt.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "cuid",
          code: m.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "cuid2")
        Yt.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "cuid2",
          code: m.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "ulid")
        es.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "ulid",
          code: m.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "url")
        try {
          new URL(e.data);
        } catch {
          i = this._getOrReturnCtx(e, i), v(i, {
            validation: "url",
            code: m.invalid_string,
            message: r.message
          }), s.dirty();
        }
      else r.kind === "regex" ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "regex",
        code: m.invalid_string,
        message: r.message
      }), s.dirty())) : r.kind === "trim" ? e.data = e.data.trim() : r.kind === "includes" ? e.data.includes(r.value, r.position) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: m.invalid_string,
        validation: { includes: r.value, position: r.position },
        message: r.message
      }), s.dirty()) : r.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : r.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : r.kind === "startsWith" ? e.data.startsWith(r.value) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: m.invalid_string,
        validation: { startsWith: r.value },
        message: r.message
      }), s.dirty()) : r.kind === "endsWith" ? e.data.endsWith(r.value) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: m.invalid_string,
        validation: { endsWith: r.value },
        message: r.message
      }), s.dirty()) : r.kind === "datetime" ? fs(r).test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: m.invalid_string,
        validation: "datetime",
        message: r.message
      }), s.dirty()) : r.kind === "date" ? ps.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: m.invalid_string,
        validation: "date",
        message: r.message
      }), s.dirty()) : r.kind === "time" ? ms(r).test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: m.invalid_string,
        validation: "time",
        message: r.message
      }), s.dirty()) : r.kind === "duration" ? rs.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "duration",
        code: m.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "ip" ? gs(e.data, r.version) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "ip",
        code: m.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "jwt" ? ys(e.data, r.alg) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "jwt",
        code: m.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "cidr" ? vs(e.data, r.version) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "cidr",
        code: m.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "base64" ? us.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "base64",
        code: m.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "base64url" ? hs.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "base64url",
        code: m.invalid_string,
        message: r.message
      }), s.dirty()) : j.assertNever(r);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((i) => e.test(i), {
      validation: t,
      code: m.invalid_string,
      ...k.errToObj(s)
    });
  }
  _addCheck(e) {
    return new ce({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...k.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...k.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...k.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...k.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...k.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...k.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...k.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...k.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...k.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...k.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...k.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...k.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...k.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      offset: e?.offset ?? !1,
      local: e?.local ?? !1,
      ...k.errToObj(e?.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      ...k.errToObj(e?.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...k.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...k.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t?.position,
      ...k.errToObj(t?.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...k.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...k.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...k.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...k.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...k.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, k.errToObj(e));
  }
  trim() {
    return new ce({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ce({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ce({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
ce.create = (a) => new ce({
  checks: [],
  typeName: T.ZodString,
  coerce: a?.coerce ?? !1,
  ...R(a)
});
function bs(a, e) {
  const t = (a.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, i = t > s ? t : s, r = Number.parseInt(a.toFixed(i).replace(".", "")), n = Number.parseInt(e.toFixed(i).replace(".", ""));
  return r % n / 10 ** i;
}
class be extends P {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== w.number) {
      const r = this._getOrReturnCtx(e);
      return v(r, {
        code: m.invalid_type,
        expected: w.number,
        received: r.parsedType
      }), I;
    }
    let s;
    const i = new X();
    for (const r of this._def.checks)
      r.kind === "int" ? j.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
        code: m.invalid_type,
        expected: "integer",
        received: "float",
        message: r.message
      }), i.dirty()) : r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (s = this._getOrReturnCtx(e, s), v(s, {
        code: m.too_small,
        minimum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), i.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (s = this._getOrReturnCtx(e, s), v(s, {
        code: m.too_big,
        maximum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), i.dirty()) : r.kind === "multipleOf" ? bs(e.data, r.value) !== 0 && (s = this._getOrReturnCtx(e, s), v(s, {
        code: m.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), i.dirty()) : r.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
        code: m.not_finite,
        message: r.message
      }), i.dirty()) : j.assertNever(r);
    return { status: i.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, k.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, k.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, k.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, k.toString(t));
  }
  setLimit(e, t, s, i) {
    return new be({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: k.toString(i)
        }
      ]
    });
  }
  _addCheck(e) {
    return new be({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: k.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: k.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: k.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: k.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: k.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: k.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: k.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: k.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: k.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && j.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const s of this._def.checks) {
      if (s.kind === "finite" || s.kind === "int" || s.kind === "multipleOf")
        return !0;
      s.kind === "min" ? (t === null || s.value > t) && (t = s.value) : s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
be.create = (a) => new be({
  checks: [],
  typeName: T.ZodNumber,
  coerce: a?.coerce || !1,
  ...R(a)
});
class Te extends P {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== w.bigint)
      return this._getInvalidInput(e);
    let s;
    const i = new X();
    for (const r of this._def.checks)
      r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (s = this._getOrReturnCtx(e, s), v(s, {
        code: m.too_small,
        type: "bigint",
        minimum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), i.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (s = this._getOrReturnCtx(e, s), v(s, {
        code: m.too_big,
        type: "bigint",
        maximum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), i.dirty()) : r.kind === "multipleOf" ? e.data % r.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), v(s, {
        code: m.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), i.dirty()) : j.assertNever(r);
    return { status: i.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return v(t, {
      code: m.invalid_type,
      expected: w.bigint,
      received: t.parsedType
    }), I;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, k.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, k.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, k.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, k.toString(t));
  }
  setLimit(e, t, s, i) {
    return new Te({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: s,
          message: k.toString(i)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Te({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: k.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: k.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: k.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: k.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: k.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
Te.create = (a) => new Te({
  checks: [],
  typeName: T.ZodBigInt,
  coerce: a?.coerce ?? !1,
  ...R(a)
});
class Qe extends P {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== w.boolean) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: m.invalid_type,
        expected: w.boolean,
        received: s.parsedType
      }), I;
    }
    return se(e.data);
  }
}
Qe.create = (a) => new Qe({
  typeName: T.ZodBoolean,
  coerce: a?.coerce || !1,
  ...R(a)
});
class Oe extends P {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== w.date) {
      const r = this._getOrReturnCtx(e);
      return v(r, {
        code: m.invalid_type,
        expected: w.date,
        received: r.parsedType
      }), I;
    }
    if (Number.isNaN(e.data.getTime())) {
      const r = this._getOrReturnCtx(e);
      return v(r, {
        code: m.invalid_date
      }), I;
    }
    const s = new X();
    let i;
    for (const r of this._def.checks)
      r.kind === "min" ? e.data.getTime() < r.value && (i = this._getOrReturnCtx(e, i), v(i, {
        code: m.too_small,
        message: r.message,
        inclusive: !0,
        exact: !1,
        minimum: r.value,
        type: "date"
      }), s.dirty()) : r.kind === "max" ? e.data.getTime() > r.value && (i = this._getOrReturnCtx(e, i), v(i, {
        code: m.too_big,
        message: r.message,
        inclusive: !0,
        exact: !1,
        maximum: r.value,
        type: "date"
      }), s.dirty()) : j.assertNever(r);
    return {
      status: s.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new Oe({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: k.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: k.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
Oe.create = (a) => new Oe({
  checks: [],
  coerce: a?.coerce || !1,
  typeName: T.ZodDate,
  ...R(a)
});
class gt extends P {
  _parse(e) {
    if (this._getType(e) !== w.symbol) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: m.invalid_type,
        expected: w.symbol,
        received: s.parsedType
      }), I;
    }
    return se(e.data);
  }
}
gt.create = (a) => new gt({
  typeName: T.ZodSymbol,
  ...R(a)
});
class yt extends P {
  _parse(e) {
    if (this._getType(e) !== w.undefined) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: m.invalid_type,
        expected: w.undefined,
        received: s.parsedType
      }), I;
    }
    return se(e.data);
  }
}
yt.create = (a) => new yt({
  typeName: T.ZodUndefined,
  ...R(a)
});
class vt extends P {
  _parse(e) {
    if (this._getType(e) !== w.null) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: m.invalid_type,
        expected: w.null,
        received: s.parsedType
      }), I;
    }
    return se(e.data);
  }
}
vt.create = (a) => new vt({
  typeName: T.ZodNull,
  ...R(a)
});
class Ye extends P {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return se(e.data);
  }
}
Ye.create = (a) => new Ye({
  typeName: T.ZodAny,
  ...R(a)
});
class et extends P {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return se(e.data);
  }
}
et.create = (a) => new et({
  typeName: T.ZodUnknown,
  ...R(a)
});
class pe extends P {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return v(t, {
      code: m.invalid_type,
      expected: w.never,
      received: t.parsedType
    }), I;
  }
}
pe.create = (a) => new pe({
  typeName: T.ZodNever,
  ...R(a)
});
class bt extends P {
  _parse(e) {
    if (this._getType(e) !== w.undefined) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: m.invalid_type,
        expected: w.void,
        received: s.parsedType
      }), I;
    }
    return se(e.data);
  }
}
bt.create = (a) => new bt({
  typeName: T.ZodVoid,
  ...R(a)
});
class ne extends P {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), i = this._def;
    if (t.parsedType !== w.array)
      return v(t, {
        code: m.invalid_type,
        expected: w.array,
        received: t.parsedType
      }), I;
    if (i.exactLength !== null) {
      const n = t.data.length > i.exactLength.value, o = t.data.length < i.exactLength.value;
      (n || o) && (v(t, {
        code: n ? m.too_big : m.too_small,
        minimum: o ? i.exactLength.value : void 0,
        maximum: n ? i.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: i.exactLength.message
      }), s.dirty());
    }
    if (i.minLength !== null && t.data.length < i.minLength.value && (v(t, {
      code: m.too_small,
      minimum: i.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.minLength.message
    }), s.dirty()), i.maxLength !== null && t.data.length > i.maxLength.value && (v(t, {
      code: m.too_big,
      maximum: i.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((n, o) => i.type._parseAsync(new oe(t, n, t.path, o)))).then((n) => X.mergeArray(s, n));
    const r = [...t.data].map((n, o) => i.type._parseSync(new oe(t, n, t.path, o)));
    return X.mergeArray(s, r);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new ne({
      ...this._def,
      minLength: { value: e, message: k.toString(t) }
    });
  }
  max(e, t) {
    return new ne({
      ...this._def,
      maxLength: { value: e, message: k.toString(t) }
    });
  }
  length(e, t) {
    return new ne({
      ...this._def,
      exactLength: { value: e, message: k.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
ne.create = (a, e) => new ne({
  type: a,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: T.ZodArray,
  ...R(e)
});
function ge(a) {
  if (a instanceof W) {
    const e = {};
    for (const t in a.shape) {
      const s = a.shape[t];
      e[t] = ue.create(ge(s));
    }
    return new W({
      ...a._def,
      shape: () => e
    });
  } else return a instanceof ne ? new ne({
    ...a._def,
    type: ge(a.element)
  }) : a instanceof ue ? ue.create(ge(a.unwrap())) : a instanceof ke ? ke.create(ge(a.unwrap())) : a instanceof fe ? fe.create(a.items.map((e) => ge(e))) : a;
}
class W extends P {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = j.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== w.object) {
      const d = this._getOrReturnCtx(e);
      return v(d, {
        code: m.invalid_type,
        expected: w.object,
        received: d.parsedType
      }), I;
    }
    const { status: s, ctx: i } = this._processInputParams(e), { shape: r, keys: n } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof pe && this._def.unknownKeys === "strip"))
      for (const d in i.data)
        n.includes(d) || o.push(d);
    const c = [];
    for (const d of n) {
      const l = r[d], h = i.data[d];
      c.push({
        key: { status: "valid", value: d },
        value: l._parse(new oe(i, h, i.path, d)),
        alwaysSet: d in i.data
      });
    }
    if (this._def.catchall instanceof pe) {
      const d = this._def.unknownKeys;
      if (d === "passthrough")
        for (const l of o)
          c.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: i.data[l] }
          });
      else if (d === "strict")
        o.length > 0 && (v(i, {
          code: m.unrecognized_keys,
          keys: o
        }), s.dirty());
      else if (d !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const d = this._def.catchall;
      for (const l of o) {
        const h = i.data[l];
        c.push({
          key: { status: "valid", value: l },
          value: d._parse(
            new oe(i, h, i.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in i.data
        });
      }
    }
    return i.common.async ? Promise.resolve().then(async () => {
      const d = [];
      for (const l of c) {
        const h = await l.key, f = await l.value;
        d.push({
          key: h,
          value: f,
          alwaysSet: l.alwaysSet
        });
      }
      return d;
    }).then((d) => X.mergeObjectSync(s, d)) : X.mergeObjectSync(s, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return k.errToObj, new W({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, s) => {
          const i = this._def.errorMap?.(t, s).message ?? s.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: k.errToObj(e).message ?? i
          } : {
            message: i
          };
        }
      } : {}
    });
  }
  strip() {
    return new W({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new W({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new W({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new W({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: T.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new W({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const s of j.objectKeys(e))
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    return new W({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const s of j.objectKeys(this.shape))
      e[s] || (t[s] = this.shape[s]);
    return new W({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return ge(this);
  }
  partial(e) {
    const t = {};
    for (const s of j.objectKeys(this.shape)) {
      const i = this.shape[s];
      e && !e[s] ? t[s] = i : t[s] = i.optional();
    }
    return new W({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const s of j.objectKeys(this.shape))
      if (e && !e[s])
        t[s] = this.shape[s];
      else {
        let r = this.shape[s];
        for (; r instanceof ue; )
          r = r._def.innerType;
        t[s] = r;
      }
    return new W({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Rt(j.objectKeys(this.shape));
  }
}
W.create = (a, e) => new W({
  shape: () => a,
  unknownKeys: "strip",
  catchall: pe.create(),
  typeName: T.ZodObject,
  ...R(e)
});
W.strictCreate = (a, e) => new W({
  shape: () => a,
  unknownKeys: "strict",
  catchall: pe.create(),
  typeName: T.ZodObject,
  ...R(e)
});
W.lazycreate = (a, e) => new W({
  shape: a,
  unknownKeys: "strip",
  catchall: pe.create(),
  typeName: T.ZodObject,
  ...R(e)
});
class Le extends P {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function i(r) {
      for (const o of r)
        if (o.result.status === "valid")
          return o.result;
      for (const o of r)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const n = r.map((o) => new de(o.ctx.common.issues));
      return v(t, {
        code: m.invalid_union,
        unionErrors: n
      }), I;
    }
    if (t.common.async)
      return Promise.all(s.map(async (r) => {
        const n = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await r._parseAsync({
            data: t.data,
            path: t.path,
            parent: n
          }),
          ctx: n
        };
      })).then(i);
    {
      let r;
      const n = [];
      for (const c of s) {
        const d = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, l = c._parseSync({
          data: t.data,
          path: t.path,
          parent: d
        });
        if (l.status === "valid")
          return l;
        l.status === "dirty" && !r && (r = { result: l, ctx: d }), d.common.issues.length && n.push(d.common.issues);
      }
      if (r)
        return t.common.issues.push(...r.ctx.common.issues), r.result;
      const o = n.map((c) => new de(c));
      return v(t, {
        code: m.invalid_union,
        unionErrors: o
      }), I;
    }
  }
  get options() {
    return this._def.options;
  }
}
Le.create = (a, e) => new Le({
  options: a,
  typeName: T.ZodUnion,
  ...R(e)
});
function tt(a, e) {
  const t = le(a), s = le(e);
  if (a === e)
    return { valid: !0, data: a };
  if (t === w.object && s === w.object) {
    const i = j.objectKeys(e), r = j.objectKeys(a).filter((o) => i.indexOf(o) !== -1), n = { ...a, ...e };
    for (const o of r) {
      const c = tt(a[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      n[o] = c.data;
    }
    return { valid: !0, data: n };
  } else if (t === w.array && s === w.array) {
    if (a.length !== e.length)
      return { valid: !1 };
    const i = [];
    for (let r = 0; r < a.length; r++) {
      const n = a[r], o = e[r], c = tt(n, o);
      if (!c.valid)
        return { valid: !1 };
      i.push(c.data);
    }
    return { valid: !0, data: i };
  } else return t === w.date && s === w.date && +a == +e ? { valid: !0, data: a } : { valid: !1 };
}
class je extends P {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), i = (r, n) => {
      if (pt(r) || pt(n))
        return I;
      const o = tt(r.value, n.value);
      return o.valid ? ((mt(r) || mt(n)) && t.dirty(), { status: t.value, value: o.data }) : (v(s, {
        code: m.invalid_intersection_types
      }), I);
    };
    return s.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      }),
      this._def.right._parseAsync({
        data: s.data,
        path: s.path,
        parent: s
      })
    ]).then(([r, n]) => i(r, n)) : i(this._def.left._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }), this._def.right._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }));
  }
}
je.create = (a, e, t) => new je({
  left: a,
  right: e,
  typeName: T.ZodIntersection,
  ...R(t)
});
class fe extends P {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== w.array)
      return v(s, {
        code: m.invalid_type,
        expected: w.array,
        received: s.parsedType
      }), I;
    if (s.data.length < this._def.items.length)
      return v(s, {
        code: m.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), I;
    !this._def.rest && s.data.length > this._def.items.length && (v(s, {
      code: m.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const r = [...s.data].map((n, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new oe(s, n, s.path, o)) : null;
    }).filter((n) => !!n);
    return s.common.async ? Promise.all(r).then((n) => X.mergeArray(t, n)) : X.mergeArray(t, r);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new fe({
      ...this._def,
      rest: e
    });
  }
}
fe.create = (a, e) => {
  if (!Array.isArray(a))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new fe({
    items: a,
    typeName: T.ZodTuple,
    rest: null,
    ...R(e)
  });
};
class He extends P {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== w.object)
      return v(s, {
        code: m.invalid_type,
        expected: w.object,
        received: s.parsedType
      }), I;
    const i = [], r = this._def.keyType, n = this._def.valueType;
    for (const o in s.data)
      i.push({
        key: r._parse(new oe(s, o, s.path, o)),
        value: n._parse(new oe(s, s.data[o], s.path, o)),
        alwaysSet: o in s.data
      });
    return s.common.async ? X.mergeObjectAsync(t, i) : X.mergeObjectSync(t, i);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, s) {
    return t instanceof P ? new He({
      keyType: e,
      valueType: t,
      typeName: T.ZodRecord,
      ...R(s)
    }) : new He({
      keyType: ce.create(),
      valueType: e,
      typeName: T.ZodRecord,
      ...R(t)
    });
  }
}
class wt extends P {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== w.map)
      return v(s, {
        code: m.invalid_type,
        expected: w.map,
        received: s.parsedType
      }), I;
    const i = this._def.keyType, r = this._def.valueType, n = [...s.data.entries()].map(([o, c], d) => ({
      key: i._parse(new oe(s, o, s.path, [d, "key"])),
      value: r._parse(new oe(s, c, s.path, [d, "value"]))
    }));
    if (s.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of n) {
          const d = await c.key, l = await c.value;
          if (d.status === "aborted" || l.status === "aborted")
            return I;
          (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of n) {
        const d = c.key, l = c.value;
        if (d.status === "aborted" || l.status === "aborted")
          return I;
        (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
      }
      return { status: t.value, value: o };
    }
  }
}
wt.create = (a, e, t) => new wt({
  valueType: e,
  keyType: a,
  typeName: T.ZodMap,
  ...R(t)
});
class Ie extends P {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== w.set)
      return v(s, {
        code: m.invalid_type,
        expected: w.set,
        received: s.parsedType
      }), I;
    const i = this._def;
    i.minSize !== null && s.data.size < i.minSize.value && (v(s, {
      code: m.too_small,
      minimum: i.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.minSize.message
    }), t.dirty()), i.maxSize !== null && s.data.size > i.maxSize.value && (v(s, {
      code: m.too_big,
      maximum: i.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.maxSize.message
    }), t.dirty());
    const r = this._def.valueType;
    function n(c) {
      const d = /* @__PURE__ */ new Set();
      for (const l of c) {
        if (l.status === "aborted")
          return I;
        l.status === "dirty" && t.dirty(), d.add(l.value);
      }
      return { status: t.value, value: d };
    }
    const o = [...s.data.values()].map((c, d) => r._parse(new oe(s, c, s.path, d)));
    return s.common.async ? Promise.all(o).then((c) => n(c)) : n(o);
  }
  min(e, t) {
    return new Ie({
      ...this._def,
      minSize: { value: e, message: k.toString(t) }
    });
  }
  max(e, t) {
    return new Ie({
      ...this._def,
      maxSize: { value: e, message: k.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Ie.create = (a, e) => new Ie({
  valueType: a,
  minSize: null,
  maxSize: null,
  typeName: T.ZodSet,
  ...R(e)
});
class xt extends P {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
xt.create = (a, e) => new xt({
  getter: a,
  typeName: T.ZodLazy,
  ...R(e)
});
class st extends P {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return v(t, {
        received: t.data,
        code: m.invalid_literal,
        expected: this._def.value
      }), I;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
st.create = (a, e) => new st({
  value: a,
  typeName: T.ZodLiteral,
  ...R(e)
});
function Rt(a, e) {
  return new we({
    values: a,
    typeName: T.ZodEnum,
    ...R(e)
  });
}
class we extends P {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return v(t, {
        expected: j.joinValues(s),
        received: t.parsedType,
        code: m.invalid_type
      }), I;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return v(t, {
        received: t.data,
        code: m.invalid_enum_value,
        options: s
      }), I;
    }
    return se(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return we.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return we.create(this.options.filter((s) => !e.includes(s)), {
      ...this._def,
      ...t
    });
  }
}
we.create = Rt;
class kt extends P {
  _parse(e) {
    const t = j.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== w.string && s.parsedType !== w.number) {
      const i = j.objectValues(t);
      return v(s, {
        expected: j.joinValues(i),
        received: s.parsedType,
        code: m.invalid_type
      }), I;
    }
    if (this._cache || (this._cache = new Set(j.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const i = j.objectValues(t);
      return v(s, {
        received: s.data,
        code: m.invalid_enum_value,
        options: i
      }), I;
    }
    return se(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
kt.create = (a, e) => new kt({
  values: a,
  typeName: T.ZodNativeEnum,
  ...R(e)
});
class qe extends P {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== w.promise && t.common.async === !1)
      return v(t, {
        code: m.invalid_type,
        expected: w.promise,
        received: t.parsedType
      }), I;
    const s = t.parsedType === w.promise ? t.data : Promise.resolve(t.data);
    return se(s.then((i) => this._def.type.parseAsync(i, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
qe.create = (a, e) => new qe({
  type: a,
  typeName: T.ZodPromise,
  ...R(e)
});
class xe extends P {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === T.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), i = this._def.effect || null, r = {
      addIssue: (n) => {
        v(s, n), n.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (r.addIssue = r.addIssue.bind(r), i.type === "preprocess") {
      const n = i.transform(s.data, r);
      if (s.common.async)
        return Promise.resolve(n).then(async (o) => {
          if (t.value === "aborted")
            return I;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: s.path,
            parent: s
          });
          return c.status === "aborted" ? I : c.status === "dirty" || t.value === "dirty" ? Ce(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return I;
        const o = this._def.schema._parseSync({
          data: n,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? I : o.status === "dirty" || t.value === "dirty" ? Ce(o.value) : o;
      }
    }
    if (i.type === "refinement") {
      const n = (o) => {
        const c = i.refinement(o, r);
        if (s.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (s.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? I : (o.status === "dirty" && t.dirty(), n(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => o.status === "aborted" ? I : (o.status === "dirty" && t.dirty(), n(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (i.type === "transform")
      if (s.common.async === !1) {
        const n = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!ve(n))
          return I;
        const o = i.transform(n.value, r);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((n) => ve(n) ? Promise.resolve(i.transform(n.value, r)).then((o) => ({
          status: t.value,
          value: o
        })) : I);
    j.assertNever(i);
  }
}
xe.create = (a, e, t) => new xe({
  schema: a,
  typeName: T.ZodEffects,
  effect: e,
  ...R(t)
});
xe.createWithPreprocess = (a, e, t) => new xe({
  schema: e,
  effect: { type: "preprocess", transform: a },
  typeName: T.ZodEffects,
  ...R(t)
});
class ue extends P {
  _parse(e) {
    return this._getType(e) === w.undefined ? se(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ue.create = (a, e) => new ue({
  innerType: a,
  typeName: T.ZodOptional,
  ...R(e)
});
class ke extends P {
  _parse(e) {
    return this._getType(e) === w.null ? se(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ke.create = (a, e) => new ke({
  innerType: a,
  typeName: T.ZodNullable,
  ...R(e)
});
class it extends P {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let s = t.data;
    return t.parsedType === w.undefined && (s = this._def.defaultValue()), this._def.innerType._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
it.create = (a, e) => new it({
  innerType: a,
  typeName: T.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...R(e)
});
class rt extends P {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, i = this._def.innerType._parse({
      data: s.data,
      path: s.path,
      parent: {
        ...s
      }
    });
    return De(i) ? i.then((r) => ({
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new de(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new de(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
rt.create = (a, e) => new rt({
  innerType: a,
  typeName: T.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...R(e)
});
class St extends P {
  _parse(e) {
    if (this._getType(e) !== w.nan) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: m.invalid_type,
        expected: w.nan,
        received: s.parsedType
      }), I;
    }
    return { status: "valid", value: e.data };
  }
}
St.create = (a) => new St({
  typeName: T.ZodNaN,
  ...R(a)
});
class ws extends P {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = t.data;
    return this._def.type._parse({
      data: s,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class ct extends P {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.common.async)
      return (async () => {
        const r = await this._def.in._parseAsync({
          data: s.data,
          path: s.path,
          parent: s
        });
        return r.status === "aborted" ? I : r.status === "dirty" ? (t.dirty(), Ce(r.value)) : this._def.out._parseAsync({
          data: r.value,
          path: s.path,
          parent: s
        });
      })();
    {
      const i = this._def.in._parseSync({
        data: s.data,
        path: s.path,
        parent: s
      });
      return i.status === "aborted" ? I : i.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: i.value
      }) : this._def.out._parseSync({
        data: i.value,
        path: s.path,
        parent: s
      });
    }
  }
  static create(e, t) {
    return new ct({
      in: e,
      out: t,
      typeName: T.ZodPipeline
    });
  }
}
class at extends P {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (i) => (ve(i) && (i.value = Object.freeze(i.value)), i);
    return De(t) ? t.then((i) => s(i)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
at.create = (a, e) => new at({
  innerType: a,
  typeName: T.ZodReadonly,
  ...R(e)
});
var T;
(function(a) {
  a.ZodString = "ZodString", a.ZodNumber = "ZodNumber", a.ZodNaN = "ZodNaN", a.ZodBigInt = "ZodBigInt", a.ZodBoolean = "ZodBoolean", a.ZodDate = "ZodDate", a.ZodSymbol = "ZodSymbol", a.ZodUndefined = "ZodUndefined", a.ZodNull = "ZodNull", a.ZodAny = "ZodAny", a.ZodUnknown = "ZodUnknown", a.ZodNever = "ZodNever", a.ZodVoid = "ZodVoid", a.ZodArray = "ZodArray", a.ZodObject = "ZodObject", a.ZodUnion = "ZodUnion", a.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", a.ZodIntersection = "ZodIntersection", a.ZodTuple = "ZodTuple", a.ZodRecord = "ZodRecord", a.ZodMap = "ZodMap", a.ZodSet = "ZodSet", a.ZodFunction = "ZodFunction", a.ZodLazy = "ZodLazy", a.ZodLiteral = "ZodLiteral", a.ZodEnum = "ZodEnum", a.ZodEffects = "ZodEffects", a.ZodNativeEnum = "ZodNativeEnum", a.ZodOptional = "ZodOptional", a.ZodNullable = "ZodNullable", a.ZodDefault = "ZodDefault", a.ZodCatch = "ZodCatch", a.ZodPromise = "ZodPromise", a.ZodBranded = "ZodBranded", a.ZodPipeline = "ZodPipeline", a.ZodReadonly = "ZodReadonly";
})(T || (T = {}));
const K = ce.create, z = be.create, re = Qe.create, _t = Ye.create, Ue = et.create;
pe.create;
const Ee = ne.create, F = W.create;
Le.create;
je.create;
fe.create;
const Pt = He.create, xs = st.create, he = we.create;
qe.create;
ue.create;
ke.create;
const Dt = 1, ks = 1, G = (a) => `${a}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`, Ss = () => ({
  enabled: !1,
  roles: ["whitelist"],
  memberIds: [],
  minDepth: 0,
  requireTrance: !1,
  requireActiveHypnotizer: !1
}), _s = [
  "viewStatus",
  "trigger",
  "deepen",
  "wake",
  "testEffect",
  "installSuggestion",
  "editOwnSuggestion",
  "removeOwnSuggestion",
  "editSettings",
  "startSession",
  "controlSession",
  "controlIndicator"
], $s = () => [
  { id: G("sound"), name: "Induction shimmer", category: "induction", url: "builtin:sweep:760:180", enabled: !0, volume: 0.42, loop: !1, playbackRate: 1, pan: 0, reverb: 0.48, echo: 0.16, builtIn: !0 },
  { id: G("sound"), name: "Soft trigger chime", category: "trigger", url: "builtin:chime:523.25", enabled: !0, volume: 0.55, loop: !1, playbackRate: 1, pan: 0, reverb: 0.2, echo: 0.08, builtIn: !0 },
  { id: G("sound"), name: "Deepening pulse", category: "deepen", url: "builtin:pulse:110", enabled: !0, volume: 0.45, loop: !1, playbackRate: 1, pan: 0, reverb: 0.35, echo: 0.18, builtIn: !0 },
  { id: G("sound"), name: "Trance drop", category: "trance", url: "builtin:sweep:420:72", enabled: !0, volume: 0.65, loop: !1, playbackRate: 1, pan: 0, reverb: 0.5, echo: 0.15, builtIn: !0 },
  { id: G("sound"), name: "Suggestion bell", category: "suggestion", url: "builtin:chime:659.25", enabled: !0, volume: 0.5, loop: !1, playbackRate: 1, pan: 0.1, reverb: 0.4, echo: 0.2, builtIn: !0 },
  { id: G("sound"), name: "Wake shimmer", category: "wake", url: "builtin:sweep:180:720", enabled: !0, volume: 0.55, loop: !1, playbackRate: 1, pan: 0, reverb: 0.4, echo: 0.1, builtIn: !0 },
  { id: G("sound"), name: "Low ambient drone", category: "ambient", url: "builtin:drone:55", enabled: !0, volume: 0.18, loop: !0, playbackRate: 1, pan: 0, reverb: 0.6, echo: 0.05, builtIn: !0 },
  { id: G("sound"), name: "Heartbeat", category: "heartbeat", url: "builtin:heartbeat:68", enabled: !0, volume: 0.3, loop: !0, playbackRate: 1, pan: 0, reverb: 0.1, echo: 0, builtIn: !0 },
  { id: G("sound"), name: "Metronome", category: "metronome", url: "builtin:metronome:54", enabled: !0, volume: 0.2, loop: !0, playbackRate: 1, pan: 0, reverb: 0.05, echo: 0, builtIn: !0 },
  { id: G("sound"), name: "Dark glitch", category: "glitch", url: "builtin:noise:0.35", enabled: !0, volume: 0.2, loop: !1, playbackRate: 1, pan: 0, reverb: 0.2, echo: 0.12, builtIn: !0 }
], Ms = () => [
  {
    id: G("trigger"),
    name: "Default induction",
    phrase: "sink for me",
    kind: "trigger",
    enabled: !0,
    source: ["chat", "whisper", "voice", "remote"],
    minDepth: 0,
    maxDepth: 100,
    depthDelta: 35,
    cooldownMs: 1e4,
    delayMs: 0,
    requiredRepeats: 1,
    repeatWindowMs: 3e4,
    comboPhrases: [],
    allowedMemberIds: [],
    requireNameMention: !1,
    oneShot: !1,
    effectPresetId: "preset-soft-induction"
  },
  {
    id: G("trigger"),
    name: "Default deepener",
    phrase: "deeper",
    kind: "deepen",
    enabled: !0,
    source: ["chat", "whisper", "voice", "remote"],
    minDepth: 10,
    maxDepth: 100,
    depthDelta: 18,
    cooldownMs: 4e3,
    delayMs: 0,
    requiredRepeats: 1,
    repeatWindowMs: 2e4,
    comboPhrases: [],
    allowedMemberIds: [],
    requireNameMention: !1,
    oneShot: !1,
    effectPresetId: "preset-deep-trance"
  },
  {
    id: G("trigger"),
    name: "Default awakener",
    phrase: "wide awake",
    kind: "wake",
    enabled: !0,
    source: ["chat", "whisper", "voice", "remote"],
    minDepth: 0,
    maxDepth: 100,
    depthDelta: 0,
    cooldownMs: 1e3,
    delayMs: 0,
    requiredRepeats: 1,
    repeatWindowMs: 2e4,
    comboPhrases: [],
    allowedMemberIds: [],
    requireNameMention: !1,
    oneShot: !1,
    effectPresetId: "preset-wake"
  }
], Cs = () => [
  {
    id: "preset-soft-induction",
    name: "Soft Induction",
    description: "Gentle pink glow, soft spiral and a calm chime.",
    effects: { spiral: !0, vignette: !0, particles: !0, blur: !0, intensity: 0.35, glitch: !1 },
    soundCategory: "induction",
    durationMs: 12e3,
    depthDelta: 10
  },
  {
    id: "preset-deep-trance",
    name: "Deep Trance",
    description: "Dark tunnel, double vision, waves and a deep pulse.",
    theme: { mode: "hybrid", darkness: 0.75, glow: 0.85 },
    effects: { spiral: !0, tunnelVision: !0, doubleVision: !0, waves: !0, vignette: !0, blur: !0, intensity: 0.78 },
    soundCategory: "deepen",
    durationMs: 18e3,
    depthDelta: 18
  },
  {
    id: "preset-dream",
    name: "Dream Mode",
    description: "Soft drifting text, particles and memory fragments.",
    effects: { dreamMode: !0, particles: !0, chatEcho: !0, memoryFragments: !0, trails: !0, intensity: 0.55 },
    soundCategory: "ambient",
    durationMs: 6e4,
    depthDelta: 8
  },
  {
    id: "preset-glitch",
    name: "Glitch Hypnosis",
    description: "Creepy chromatic distortion and sharp visual glitches.",
    theme: { mode: "dark", primary: "#ff2f92", secondary: "#3b001f", accent: "#8c4cff" },
    effects: { glitch: !0, chromatic: !0, doubleVision: !0, chatDistort: !0, eyeGlow: !0, intensity: 0.72 },
    soundCategory: "glitch",
    durationMs: 14e3,
    depthDelta: 12
  },
  {
    id: "preset-wake",
    name: "Gentle Wake",
    description: "A bright shimmer that clears visual effects.",
    effects: { spiral: !1, blur: !1, vignette: !1, particles: !0, intensity: 0.25 },
    soundCategory: "wake",
    durationMs: 4e3,
    depthDelta: -100
  }
], As = () => [
  {
    id: "session-soft",
    name: "Soft Induction",
    description: "Five-minute gradual induction with a gentle wake-up.",
    durationMs: 3e5,
    steps: [
      { id: G("step"), atMs: 0, action: "sound", config: { category: "ambient", loop: !0 } },
      { id: G("step"), atMs: 5e3, action: "effect", config: { presetId: "preset-soft-induction" } },
      { id: G("step"), atMs: 3e4, action: "depth", config: { delta: 10 } },
      { id: G("step"), atMs: 75e3, action: "effect", config: { presetId: "preset-dream" } },
      { id: G("step"), atMs: 12e4, action: "depth", config: { delta: 20 } },
      { id: G("step"), atMs: 2e5, action: "effect", config: { presetId: "preset-deep-trance" } },
      { id: G("step"), atMs: 285e3, action: "wake", config: {} }
    ]
  }
];
function Ve() {
  return {
    storageVersion: ks,
    general: { enabled: !0, language: "en", emergencyHotkey: "Alt+Shift+H", showHud: !0, diagnostics: !1 },
    theme: { mode: "hybrid", primary: "#ff58bd", secondary: "#731dff", accent: "#ff9fe2", background: "#09030f", glow: 0.8, darkness: 0.65, animations: !0 },
    hypno: { enabled: !0, depth: 0, decayPerMinute: 1.5, decayDelaySeconds: 45, autoWakeMinutes: 10, aftereffectsMinutes: 2, enterTranceAt: 100, wakeToDepth: 0, lucidTrance: !1, preserveDepthAcrossRooms: !0, showPublicStatus: !0 },
    triggers: Ms(),
    effects: {
      enabled: !0,
      intensity: 0.7,
      performance: "balanced",
      reducedMotion: !1,
      flashProtection: !0,
      spiral: !0,
      spiralStyle: "double",
      spiralSpeed: 0.65,
      reverseSpiral: !1,
      vignette: !0,
      blur: !0,
      tint: !0,
      waves: !0,
      particles: !0,
      chromatic: !0,
      doubleVision: !0,
      trails: !0,
      glitch: !0,
      tunnelVision: !0,
      focusLock: !0,
      roomAura: !0,
      dreamMode: !0,
      memoryFragments: !0,
      chatEcho: !0,
      chatDistort: !0,
      fadeOthers: !0,
      eyeGlow: !0,
      characterAura: !0,
      audioReactive: !0
    },
    audio: { enabled: !0, masterVolume: 0.7, duckGameAudio: !1, muteOnEmergency: !0, sounds: $s() },
    restrictions: {
      speech: "trance",
      walk: "off",
      pose: "suggestion",
      wardrobe: "suggestion",
      interact: "off",
      hearing: "off",
      sight: "depth",
      names: "depth",
      menus: "off",
      threshold: 75,
      replacementResponses: ["...", "Yes...", "Deeper...", "I understand."],
      allowedPhrases: ["/", "*", "(", "."]
    },
    resistance: { enabled: !0, game: "timing", baseDifficulty: 35, durationMs: 8e3, whitelistAutoAccept: [], autoAcceptCapabilities: [], autoAcceptDepth: 101, askOncePerSession: !1 },
    influence: [],
    remote: {
      enabled: !1,
      capabilities: Object.fromEntries(_s.map((a) => [a, Ss()])),
      blockedMemberIds: [],
      auditLog: !0
    },
    suggestionPolicy: {
      enabled: !0,
      allowedInstructionTypes: ["effect", "sound", "depth", "trance", "wake", "message", "expression", "pose", "activity", "follow", "say", "strip", "restriction", "wait", "random", "condition", "memory", "aftereffect", "status", "command"],
      allowSelfRemoval: !0,
      maxSuggestions: 100,
      requireTranceForInstall: !0,
      requireActiveHypnotizerForInstall: !0
    },
    suggestions: [],
    presets: Cs(),
    sessions: As(),
    accessibility: { enabled: !1, reducedMotion: !1, noFlashes: !0, maxBlur: 8, maxRotation: 2, highContrastText: !0 },
    streaming: { enabled: !1, hideMemberNumbers: !0, hideNames: !1, hideSuggestionText: !0 },
    extreme: { enabled: !1, lockQuickControls: !0, hideOwnIndicator: !1, allowRemoteIndicatorControl: !1 },
    compatibility: { replaceHSC: !0, replaceLSCGHypno: !0, importHSC: !0, importLSCG: !0, bcxVoice: !0, wceCoexistence: !0 }
  };
}
const We = F({
  storageVersion: z().int().min(1),
  general: F({ enabled: re() }).passthrough(),
  hypno: F({ depth: z().min(0).max(100) }).passthrough(),
  effects: F({ enabled: re(), intensity: z().min(0).max(1) }).passthrough(),
  audio: F({ enabled: re(), masterVolume: z().min(0).max(1), sounds: Ee(_t()) }).passthrough(),
  remote: F({ enabled: re() }).passthrough(),
  suggestions: Ee(_t()).max(100)
}).passthrough();
function Re(a) {
  return a !== null && typeof a == "object" && !Array.isArray(a);
}
function nt(a, e) {
  if (!Re(a) || !Re(e)) return e ?? a;
  const t = { ...a };
  for (const [s, i] of Object.entries(e)) {
    const r = t[s];
    t[s] = Re(r) && Re(i) ? nt(r, i) : i;
  }
  return t;
}
class Ts {
  constructor(e) {
    this.runtime = e;
  }
  runtime;
  settings = Ve();
  saveTimer;
  listeners = /* @__PURE__ */ new Set();
  get value() {
    return this.settings;
  }
  load() {
    const e = Ve(), t = this.runtime.memberNumber, s = this.runtime.player?.ExtensionSettings?.SkyzHypno, i = localStorage.getItem(`SkyzHypno_${t}_backup`), r = [s, i].filter((n) => typeof n == "string" && n.length > 0);
    for (const n of r)
      try {
        const o = ye.decompressFromBase64(n) ?? n, c = JSON.parse(o);
        if (!We.safeParse(c).success) continue;
        return this.settings = Ge(nt(e, c)), this.persistBackup(), this.settings;
      } catch (o) {
        this.runtime.recordError("settings load", o);
      }
    return this.settings = e, this.settings;
  }
  update(e, t = !1) {
    e(this.settings), this.settings = Ge(this.settings), this.notify(), this.scheduleSave(t);
  }
  replace(e, t = !0) {
    const s = We.parse(e);
    this.settings = Ge(nt(Ve(), s)), this.notify(), this.scheduleSave(t);
  }
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  export() {
    return ye.compressToBase64(JSON.stringify(this.settings));
  }
  import(e) {
    const t = ye.decompressFromBase64(e) ?? e, s = We.parse(JSON.parse(t));
    this.replace(s);
  }
  flush(e = !0) {
    this.saveTimer && window.clearTimeout(this.saveTimer), this.saveTimer = void 0;
    const t = this.export();
    this.runtime.player && (this.runtime.player.ExtensionSettings ??= {}, this.runtime.player.ExtensionSettings.SkyzHypno = t, this.persistBackup(t), this.runtime.syncExtensionSettings(), e && this.publishPublicPlaceholder());
  }
  scheduleSave(e) {
    this.saveTimer && window.clearTimeout(this.saveTimer), this.saveTimer = window.setTimeout(() => this.flush(e), 650);
  }
  persistBackup(e = this.export()) {
    localStorage.setItem(`SkyzHypno_${this.runtime.memberNumber}_backup`, e);
  }
  publishPublicPlaceholder() {
    const e = this.runtime.player;
    e && (e.OnlineSharedSettings ??= {}, e.OnlineSharedSettings.SkyzHypno = {
      version: "0.2.0",
      enabled: this.settings.general.enabled,
      theme: this.settings.theme.mode,
      remote: this.settings.remote.enabled
    }, this.runtime.syncOnlineSettings());
  }
  notify() {
    for (const e of this.listeners) e(this.settings);
  }
}
function Ge(a) {
  a.hypno.depth = ee(a.hypno.depth, 0, 100), a.effects.intensity = ee(a.effects.intensity, 0, 1), a.audio.masterVolume = ee(a.audio.masterVolume, 0, 1), a.suggestions = a.suggestions.slice(0, 100), a.triggers = a.triggers.slice(0, 200), a.influence = a.influence.slice(0, 500);
  for (const e of a.audio.sounds)
    e.volume = ee(e.volume, 0, 1), e.playbackRate = ee(e.playbackRate, 0.25, 4), e.pan = ee(e.pan, -1, 1), e.echo = ee(e.echo, 0, 1), e.reverb = ee(e.reverb, 0, 1);
  return a;
}
const ee = (a, e, t) => Math.min(t, Math.max(e, Number.isFinite(a) ? a : e));
class Is {
  constructor(e, t, s) {
    this.runtime = e, this.store = t, s.add(() => this.stopAll()), s.add(() => {
      this.context?.close();
    });
  }
  runtime;
  store;
  context;
  master;
  analyser;
  convolver;
  active = /* @__PURE__ */ new Set();
  muted = !1;
  async unlock() {
    const e = this.ensureContext();
    e && e.state === "suspended" && await e.resume();
  }
  setMuted(e) {
    this.muted = e, this.master && this.master.gain.setTargetAtTime(e ? 0 : this.store.value.audio.masterVolume, this.master.context.currentTime, 0.02);
  }
  get isMuted() {
    return this.muted;
  }
  level() {
    if (!this.analyser) return 0;
    const e = new Uint8Array(this.analyser.frequencyBinCount);
    return this.analyser.getByteFrequencyData(e), e.reduce((t, s) => t + s, 0) / Math.max(1, e.length) / 255;
  }
  async playCategory(e, t = {}) {
    if (!this.store.value.audio.enabled || this.muted) return;
    const s = this.store.value.audio.sounds.filter((r) => r.enabled && r.category === e);
    if (!s.length) return;
    const i = t.random === !1 ? s[0] : s[Math.floor(Math.random() * s.length)];
    await this.playSound({ ...i, loop: t.loop ?? i.loop });
  }
  async playSound(e) {
    if (!(!this.store.value.audio.enabled || this.muted || !e.enabled))
      try {
        await this.unlock(), e.url.startsWith("builtin:") ? this.playBuiltin(e) : await this.playExternal(e);
      } catch (t) {
        this.runtime.recordError(`audio ${e.name}`, t);
      }
  }
  stopCategory(e) {
    for (const t of [...this.active])
      t.category === e && (t.stop(), this.active.delete(t));
  }
  stopAll() {
    for (const e of this.active) e.stop();
    this.active.clear();
  }
  ensureContext() {
    if (this.context) return this.context;
    const e = window.AudioContext ?? window.webkitAudioContext;
    if (!e) return;
    const t = new e(), s = t.createGain(), i = t.createAnalyser();
    return i.fftSize = 256, s.gain.value = this.muted ? 0 : this.store.value.audio.masterVolume, s.connect(i).connect(t.destination), this.context = t, this.master = s, this.analyser = i, this.convolver = t.createConvolver(), this.convolver.buffer = this.createImpulse(t, 1.8, 2.5), t;
  }
  outputChain(e) {
    const t = this.ensureContext();
    if (!t) throw new Error("Web Audio API is unavailable");
    const s = t.createGain();
    s.gain.value = e.volume;
    const i = t.createStereoPanner();
    i.pan.value = e.pan;
    const r = t.createGain();
    r.gain.value = 1 - e.reverb * 0.55;
    const n = t.createGain();
    n.gain.value = e.reverb * 0.55;
    const o = t.createDelay(1);
    o.delayTime.value = 0.16;
    const c = t.createGain();
    return c.gain.value = e.echo * 0.6, s.connect(i), i.connect(r).connect(this.master), this.convolver && i.connect(this.convolver).connect(n).connect(this.master), i.connect(o).connect(c).connect(o), o.connect(this.master), { input: s, cleanup: () => {
      s.disconnect(), i.disconnect(), r.disconnect(), n.disconnect(), o.disconnect(), c.disconnect();
    } };
  }
  playBuiltin(e) {
    const t = this.ensureContext();
    if (!t) {
      this.runtime.localMessage("Built-in sounds require Web Audio support.", "warn");
      return;
    }
    const [s, i, r, n] = e.url.split(":"), o = Number(r) || 220, c = Number(n) || 110, d = this.outputChain(e), l = [], h = [];
    let f = !1;
    const $ = (C, M, D = "sine", u = t.currentTime) => {
      const y = t.createOscillator(), g = t.createGain();
      y.type = D, y.frequency.setValueAtTime(C, u), g.gain.setValueAtTime(1e-4, u), g.gain.exponentialRampToValueAtTime(0.9, u + 0.02), g.gain.exponentialRampToValueAtTime(1e-4, u + M), y.connect(g).connect(d.input), y.start(u), y.stop(u + M + 0.05), l.push(y);
    }, E = (C, M) => {
      C(), e.loop && h.push(window.setInterval(C, M));
    };
    switch (i) {
      case "chime":
        $(o, 0.8, "sine"), $(o * 1.5, 0.65, "sine", t.currentTime + 0.12);
        break;
      case "pulse":
        E(() => {
          $(o, 0.28, "sine"), $(o / 2, 0.4, "triangle", t.currentTime + 0.12);
        }, 1100);
        break;
      case "sweep": {
        const C = t.createOscillator(), M = t.createGain();
        C.type = "sine", C.frequency.setValueAtTime(o, t.currentTime), C.frequency.exponentialRampToValueAtTime(Math.max(20, c), t.currentTime + 1.6), M.gain.setValueAtTime(1e-3, t.currentTime), M.gain.exponentialRampToValueAtTime(0.8, t.currentTime + 0.1), M.gain.exponentialRampToValueAtTime(1e-3, t.currentTime + 1.8), C.connect(M).connect(d.input), C.start(), C.stop(t.currentTime + 1.9), l.push(C);
        break;
      }
      case "drone": {
        const C = t.createOscillator(), M = t.createOscillator(), D = t.createGain();
        C.type = "sine", C.frequency.value = o, M.frequency.value = 0.12, D.gain.value = o * 0.05, M.connect(D).connect(C.frequency), C.connect(d.input), C.start(), M.start(), l.push(C, M), e.loop || (C.stop(t.currentTime + 8), M.stop(t.currentTime + 8));
        break;
      }
      case "heartbeat":
        E(() => {
          $(72, 0.1, "sine"), $(55, 0.13, "sine", t.currentTime + 0.18);
        }, Math.max(450, 6e4 / o));
        break;
      case "metronome":
        E(() => $(900, 0.06, "square"), Math.max(300, 6e4 / o));
        break;
      case "noise": {
        const C = Math.floor(t.sampleRate * Math.max(0.1, o)), M = t.createBuffer(1, C, t.sampleRate), D = M.getChannelData(0);
        for (let y = 0; y < C; y++) D[y] = (Math.random() * 2 - 1) * (1 - y / C);
        const u = t.createBufferSource();
        u.buffer = M, u.connect(d.input), u.start(), l.push(u);
        break;
      }
      default:
        $(o, 0.5);
    }
    const U = {
      category: e.category,
      loop: e.loop,
      stop: () => {
        f || (f = !0, h.forEach((C) => window.clearInterval(C)), l.forEach((C) => {
          try {
            C.stop();
          } catch {
          }
        }), d.cleanup());
      }
    };
    this.active.add(U), e.loop || window.setTimeout(() => {
      U.stop(), this.active.delete(U);
    }, i === "drone" ? 8500 : 3e3);
  }
  async playExternal(e) {
    const t = this.ensureContext(), s = new Audio(e.url);
    s.crossOrigin = "anonymous", s.loop = e.loop, s.playbackRate = e.playbackRate;
    let i, r;
    if (t)
      try {
        i = this.outputChain(e), r = t.createMediaElementSource(s), r.connect(i.input);
      } catch {
        i?.cleanup(), i = void 0, s.volume = e.volume * this.store.value.audio.masterVolume;
      }
    else
      s.volume = e.volume * this.store.value.audio.masterVolume;
    const n = {
      category: e.category,
      loop: e.loop,
      stop: () => {
        s.pause(), s.src = "", r?.disconnect(), i?.cleanup();
      }
    };
    this.active.add(n), s.addEventListener("ended", () => {
      n.stop(), this.active.delete(n);
    }, { once: !0 }), await s.play();
  }
  createImpulse(e, t, s) {
    const i = e.sampleRate * t, r = e.createBuffer(2, i, e.sampleRate);
    for (let n = 0; n < r.numberOfChannels; n++) {
      const o = r.getChannelData(n);
      for (let c = 0; c < i; c++) o[c] = (Math.random() * 2 - 1) * Math.pow(1 - c / i, s);
    }
    return r;
  }
}
const Es = `
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
.sh-stream-hide-suggestions #sh-preferences .instruction textarea, .sh-stream-hide-suggestions #sh-preferences [data-suggestion="trigger"] { filter:blur(8px); user-select:none; }
`;
class Ns {
  constructor(e, t, s, i, r, n) {
    this.runtime = e, this.store = t, this.hypno = s, this.audio = i, this.bus = r, this.state = s.snapshot, this.mount(), n.add(() => this.unmount()), n.add(r.on("state.changed", (o) => {
      this.state = o, this.updateDom();
    })), n.add(r.on("trigger.matched", ({ trigger: o }) => {
      this.flash(0.16), o.effectPresetId && this.playPreset(o.effectPresetId, void 0, !1);
    })), n.add(r.on("trance.enter", () => {
      this.applyCharacterEffects(), this.audio.playCategory("trance"), this.fragment("Deeper...");
    })), n.add(r.on("trance.wake", () => {
      this.restoreCharacterEffects(), this.clearPresets(), this.audio.playCategory("wake"), this.fragment("Wide awake");
    })), n.add(r.on("emergency.stop", () => {
      this.restoreCharacterEffects(), this.clearPresets();
    })), n.add(e.hook("DrawCharacter", 90, (o, c) => this.drawCharacterHook(o, c))), n.interval(() => this.expirePresets(), 500), n.add(t.subscribe(() => this.updateDom()));
  }
  runtime;
  store;
  hypno;
  audio;
  bus;
  root;
  canvas;
  ctx;
  animationFrame;
  activePresets = [];
  particles = [];
  state;
  savedExpressions;
  chatObserver;
  async playPreset(e, t, s = !0) {
    const i = this.store.value.presets.find((r) => r.id === e);
    i && (this.activePresets.push({ id: crypto.randomUUID(), preset: i, expiresAt: Date.now() + (t ?? i.durationMs) }), i.soundCategory && await this.audio.playCategory(i.soundCategory, { loop: i.soundCategory === "ambient" }), s && i.depthDelta && this.hypno.addDepth(i.depthDelta, `preset:${i.name}`), this.updateDom());
  }
  async previewPreset(e, t) {
    await this.playPreset(e, t, !1);
  }
  preview(e, t = 8e3) {
    const s = { id: crypto.randomUUID(), name: "Preview", description: "", effects: e, durationMs: t, depthDelta: 0 };
    this.activePresets.push({ id: s.id, preset: s, expiresAt: Date.now() + t }), this.updateDom();
  }
  clearPresets() {
    this.activePresets = [], this.audio.stopCategory("ambient"), this.updateDom();
  }
  fragment(e) {
    if (!this.root || !e) return;
    const t = document.createElement("div");
    t.className = "sh-fragment", t.textContent = e, this.root.appendChild(t), window.setTimeout(() => t.remove(), 4800);
  }
  flash(e = 0.25) {
    (this.store.value.accessibility.noFlashes || this.store.value.effects.flashProtection) && (e = Math.min(e, 0.12));
    const t = this.root?.querySelector(".sh-flash");
    t && (t.style.opacity = String(e), window.setTimeout(() => {
      t.style.opacity = "0";
    }, 140));
  }
  mount() {
    if (document.querySelector("#sh-overlay-root")) return;
    const e = document.createElement("style");
    e.id = "sh-styles", e.textContent = Es, document.head.appendChild(e);
    const t = document.createElement("div");
    t.id = "sh-overlay-root", t.innerHTML = '<canvas id="sh-effect-canvas"></canvas><div class="sh-blur"></div><div class="sh-tint"></div><div class="sh-room-aura"></div><div class="sh-vignette"></div><div class="sh-tunnel"></div><div class="sh-waves"></div><div class="sh-dream"></div><div class="sh-glitch"></div><div class="sh-flash"></div>', document.body.appendChild(t);
    const s = t.querySelector("#sh-effect-canvas");
    this.root = t, this.canvas = s, this.ctx = s.getContext("2d") ?? void 0, this.resize(), window.addEventListener("resize", this.resize), this.initParticles(), this.animate(0), this.observeChat(), this.updateDom();
  }
  unmount() {
    this.animationFrame && cancelAnimationFrame(this.animationFrame), window.removeEventListener("resize", this.resize), this.chatObserver?.disconnect(), this.restoreCharacterEffects(), this.root?.remove(), document.querySelector("#sh-styles")?.remove(), document.documentElement.classList.remove("sh-hide-names", "sh-stream-hide-members", "sh-trance-body", "sh-chromatic-body", "sh-high-contrast", "sh-stream-hide-suggestions");
  }
  resize = () => {
    if (!this.canvas) return;
    const e = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.floor(window.innerWidth * e), this.canvas.height = Math.floor(window.innerHeight * e), this.canvas.style.width = `${window.innerWidth}px`, this.canvas.style.height = `${window.innerHeight}px`, this.ctx?.setTransform(e, 0, 0, e, 0, 0);
  };
  effectiveEffects() {
    const e = { ...this.store.value.effects };
    for (const t of this.activePresets) Object.assign(e, t.preset.effects);
    return (this.store.value.accessibility.enabled || this.store.value.accessibility.reducedMotion) && (e.reducedMotion = !0, e.glitch = !1, e.trails = !1, e.spiralSpeed = Math.min(e.spiralSpeed, 0.25)), e;
  }
  effectiveIntensity() {
    const e = this.effectiveEffects(), t = this.activePresets.length > 0, s = !!(this.state.aftereffectsUntil && this.state.aftereffectsUntil > Date.now());
    if (this.state.depth <= 0 && !t && !s) return 0;
    const i = t ? Math.max(0.35, this.state.depth / 100) : s ? 0.22 : this.state.depth / 100;
    return Math.max(0, Math.min(1, e.intensity * i));
  }
  updateDom() {
    if (!this.root) return;
    const e = this.store.value, t = this.effectiveEffects(), s = this.activePresets.map((o) => o.preset.theme).filter(Boolean).at(-1) ?? {}, i = { ...e.theme, ...s }, r = document.documentElement.style;
    r.setProperty("--sh-primary", i.primary), r.setProperty("--sh-secondary", i.secondary), r.setProperty("--sh-accent", i.accent), r.setProperty("--sh-bg", i.background), r.setProperty("--sh-glow", String(i.glow)), r.setProperty("--sh-darkness", String(i.darkness)), r.setProperty("--sh-intensity", String(this.effectiveIntensity())), r.setProperty("--sh-depth", String(this.state.depth)), r.setProperty("--sh-max-blur", String(e.accessibility.maxBlur)), r.setProperty("--sh-max-rotation", String(e.accessibility.maxRotation));
    const n = this.effectiveIntensity();
    this.root.style.display = e.general.enabled && e.effects.enabled && n > 1e-3 ? "" : "none", this.root.querySelector(".sh-blur").style.display = t.blur ? "" : "none", this.root.querySelector(".sh-tint").style.display = t.tint ? "" : "none", this.root.querySelector(".sh-room-aura").style.display = t.roomAura ? "" : "none", this.root.querySelector(".sh-vignette").style.display = t.vignette ? "" : "none", this.root.querySelector(".sh-tunnel").style.display = t.tunnelVision ? "" : "none", this.root.querySelector(".sh-waves").style.display = t.waves ? "" : "none", this.root.querySelector(".sh-dream").style.display = t.dreamMode ? "" : "none", this.root.querySelector(".sh-glitch").style.display = t.glitch ? "" : "none", document.documentElement.classList.toggle("sh-hide-names", t.fadeOthers && this.state.depth >= e.restrictions.threshold || e.streaming.enabled && e.streaming.hideNames), document.documentElement.classList.toggle("sh-stream-hide-members", e.streaming.enabled && e.streaming.hideMemberNumbers), document.documentElement.classList.toggle("sh-trance-body", this.state.depth > 15), document.documentElement.classList.toggle("sh-chromatic-body", t.chromatic && this.state.depth >= 40), document.documentElement.classList.toggle("sh-high-contrast", e.accessibility.highContrastText), document.documentElement.classList.toggle("sh-stream-hide-suggestions", e.streaming.enabled && e.streaming.hideSuggestionText);
  }
  animate = (e) => {
    if (this.animationFrame = requestAnimationFrame(this.animate), !this.ctx || !this.canvas || !this.store.value.effects.enabled) return;
    const t = this.ctx, s = window.innerWidth, i = window.innerHeight;
    t.clearRect(0, 0, s, i);
    const r = this.effectiveEffects(), n = this.effectiveIntensity();
    if (n <= 0.01) return;
    const o = r.audioReactive ? this.audio.level() : 0;
    r.spiral && this.drawSpiral(t, s / 2, i / 2, Math.min(s, i) * (0.44 + o * 0.08), e, r, n), r.particles && this.drawParticles(t, s, i, e, n, o, r.trails), r.doubleVision && this.drawRings(t, s / 2, i / 2, e, n);
  };
  drawSpiral(e, t, s, i, r, n, o) {
    const c = n.reducedMotion || this.store.value.accessibility.reducedMotion, d = n.reverseSpiral ? -1 : 1, l = c ? 0 : r * 35e-5 * n.spiralSpeed * d, h = n.spiralStyle === "double" ? 4 : n.spiralStyle === "fracture" ? 7 : 2;
    e.save(), e.translate(t, s), e.rotate(l), e.globalCompositeOperation = "lighter";
    for (let f = 0; f < h; f++) {
      e.beginPath();
      for (let $ = 0; $ < 260; $++) {
        const E = $ / 259, U = E * Math.PI * (n.spiralStyle === "tunnel" ? 11 : 7) + f * Math.PI * 2 / h, C = E * i, M = n.spiralStyle === "rings" ? Math.sin(E * 36 + r * 2e-3) * 8 : 0, D = Math.cos(U) * (C + M), u = Math.sin(U) * (C + M);
        $ === 0 ? e.moveTo(D, u) : e.lineTo(D, u);
      }
      e.strokeStyle = f % 2 ? this.store.value.theme.primary : this.store.value.theme.secondary, e.globalAlpha = 0.16 + o * 0.36, e.lineWidth = 1.5 + o * 3, e.shadowBlur = 8 + o * 24, e.shadowColor = e.strokeStyle, e.stroke();
    }
    e.restore();
  }
  drawParticles(e, t, s, i, r, n, o) {
    e.save(), e.globalCompositeOperation = "lighter";
    const c = this.store.value.effects.performance === "low" ? 24 : this.store.value.effects.performance === "high" ? 90 : 52;
    for (let d = 0; d < Math.min(c, this.particles.length); d++) {
      const l = this.particles[d];
      l.y -= l.speed * (0.3 + r), l.x += Math.sin(i * 6e-4 + l.phase) * 0.18, l.y < -10 && (l.y = s + 10, l.x = Math.random() * t), o && (e.beginPath(), e.moveTo(l.x, l.y + 2), e.lineTo(l.x, l.y + 12 + r * 28), e.strokeStyle = d % 2 ? this.store.value.theme.primary : this.store.value.theme.accent, e.globalAlpha = 0.05 + r * 0.18, e.lineWidth = Math.max(0.5, l.size * 0.55), e.stroke()), e.beginPath(), e.arc(l.x, l.y, l.size * (1 + n * 2), 0, Math.PI * 2), e.fillStyle = d % 2 ? this.store.value.theme.primary : this.store.value.theme.accent, e.globalAlpha = 0.12 + r * 0.34, e.shadowBlur = 12, e.shadowColor = e.fillStyle, e.fill();
    }
    e.restore();
  }
  drawRings(e, t, s, i, r) {
    e.save(), e.translate(t, s), e.globalCompositeOperation = "screen";
    for (let n = 0; n < 4; n++) {
      const o = (i * 0.04 + n * 140) % 560 + 20;
      e.beginPath(), e.arc(n % 2 ? 7 : -7, 0, o, 0, Math.PI * 2), e.strokeStyle = n % 2 ? this.store.value.theme.primary : this.store.value.theme.secondary, e.globalAlpha = (1 - o / 600) * r * 0.18, e.lineWidth = 3, e.stroke();
    }
    e.restore();
  }
  initParticles() {
    this.particles = Array.from({ length: 100 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, size: 0.8 + Math.random() * 2.5, speed: 0.1 + Math.random() * 0.7, phase: Math.random() * Math.PI * 2 }));
  }
  expirePresets() {
    const e = this.activePresets.length;
    if (this.activePresets = this.activePresets.filter((t) => t.expiresAt > Date.now()), e !== this.activePresets.length && this.updateDom(), this.store.value.effects.memoryFragments && this.state.depth >= 55 && Math.random() < 0.015) {
      const t = ["Listen...", "Focus...", "Let the thoughts drift...", "Deeper with every breath...", "The glow feels familiar..."];
      this.fragment(t[Math.floor(Math.random() * t.length)]);
    }
  }
  observeChat() {
    const e = document.querySelector("#TextAreaChatLog") ?? document.querySelector("#ChatRoomChatLog") ?? document.body;
    this.chatObserver = new MutationObserver((t) => {
      const s = this.effectiveEffects();
      for (const i of t) for (const r of i.addedNodes)
        !(r instanceof HTMLElement) || !r.classList.contains("ChatMessage") || (s.chatEcho && this.state.depth >= 35 && r.classList.add("sh-chat-echo"), s.chatDistort && this.state.depth >= 55 && r.classList.add("sh-chat-distort"));
    }), this.chatObserver.observe(e, { childList: !0, subtree: !0 });
  }
  applyCharacterEffects() {
    try {
      this.savedExpressions = typeof WardrobeGetExpression == "function" ? { ...WardrobeGetExpression(Player) } : void 0, typeof CharacterSetFacialExpression == "function" && (CharacterSetFacialExpression(Player, "Eyes", "Dazed", 0), CharacterSetFacialExpression(Player, "Blush", "High", 0)), typeof CharacterRefresh == "function" && CharacterRefresh(Player, !1);
    } catch (e) {
      this.runtime.recordError("character effects", e);
    }
  }
  restoreCharacterEffects() {
    if (this.savedExpressions) {
      try {
        for (const [e, t] of Object.entries(this.savedExpressions)) CharacterSetFacialExpression(Player, e, t || null, 0);
        CharacterRefresh(Player, !1);
      } catch (e) {
        this.runtime.recordError("restore expressions", e);
      }
      this.savedExpressions = void 0;
    }
  }
  drawCharacterHook(e, t) {
    const [s, i, r, n] = e, o = this.state.focusMemberId ?? this.state.activeBy, c = this.effectiveEffects(), d = typeof MainCanvas < "u" && s?.MemberNumber && Number.isFinite(i) && Number.isFinite(r) && Number.isFinite(n), l = !!(d && o && s.MemberNumber === o && c.focusLock);
    d && o && c.focusLock && (MainCanvas.save(), !l && c.fadeOthers && (MainCanvas.globalAlpha *= Math.max(0.18, 1 - this.state.depth / 120)), l && c.characterAura && (MainCanvas.shadowColor = this.store.value.theme.primary, MainCanvas.shadowBlur = 12 + this.effectiveIntensity() * 38));
    const h = t(e);
    return d && o && c.focusLock && (l && c.eyeGlow && (MainCanvas.globalCompositeOperation = "lighter", MainCanvas.fillStyle = this.store.value.theme.accent, MainCanvas.globalAlpha = 0.12 + this.effectiveIntensity() * 0.2, MainCanvas.beginPath(), MainCanvas.arc(i + 250 * n, r + 170 * n, 90 * n, 0, Math.PI * 2), MainCanvas.fill()), MainCanvas.restore()), d && this.shouldDrawStatusIndicator(s) && this.drawStatusIndicator(i, r, n), h;
  }
  shouldDrawStatusIndicator(e) {
    const t = this.store.value;
    return (e.MemberNumber === this.runtime.memberNumber || e.IsPlayer?.() === !0) && (typeof CurrentScreen > "u" || CurrentScreen === "ChatRoom") && t.general.showHud && !t.extreme.hideOwnIndicator && (this.state.trance || this.state.depth > 0);
  }
  drawStatusIndicator(e, t, s) {
    const i = MainCanvas, r = Math.max(0, Math.min(100, this.state.depth)), n = e + 480 * s, o = t + 210 * s, c = Math.max(12, 24 * s), d = Math.max(100, 330 * s), l = d * r / 100, h = Math.max(5, 9 * s);
    if (i.save(), i.globalAlpha = 0.92, i.fillStyle = "rgba(8,3,15,.82)", i.strokeStyle = this.store.value.theme.primary, i.lineWidth = Math.max(1, 2 * s), $t(i, n, o, c, d, h), i.fill(), i.stroke(), l > 0) {
      const f = i.createLinearGradient(0, o + d, 0, o);
      f.addColorStop(0, this.store.value.theme.secondary), f.addColorStop(0.58, this.store.value.theme.primary), f.addColorStop(1, this.store.value.theme.accent), i.fillStyle = f, i.shadowColor = this.store.value.theme.primary, i.shadowBlur = Math.max(6, 14 * s), $t(i, n + 3 * s, o + d - l + 3 * s, Math.max(4, c - 6 * s), Math.max(2, l - 6 * s), Math.max(2, h - 3 * s)), i.fill();
    }
    i.shadowBlur = 0, i.fillStyle = this.store.value.theme.accent, i.font = `700 ${Math.max(9, 14 * s)}px system-ui`, i.textAlign = "center", i.textBaseline = "bottom", i.fillText("SH", n + c / 2, o - 6 * s), i.font = `600 ${Math.max(8, 11 * s)}px system-ui`, i.textBaseline = "top", i.fillText(`${Math.round(r)}%`, n + c / 2, o + d + 5 * s), i.restore();
  }
}
function $t(a, e, t, s, i, r) {
  const n = Math.max(0, Math.min(r, s / 2, i / 2));
  a.beginPath(), a.moveTo(e + n, t), a.arcTo(e + s, t, e + s, t + i, n), a.arcTo(e + s, t + i, e, t + i, n), a.arcTo(e, t + i, e, t, n), a.arcTo(e, t, e + s, t, n), a.closePath();
}
function Pe(a, e = !1) {
  return e || a >= 100 ? "trance" : a >= 80 ? "critical" : a >= 60 ? "deep" : a >= 40 ? "dazed" : a >= 20 ? "influenced" : "awake";
}
class Rs {
  constructor(e, t, s, i) {
    this.runtime = e, this.store = t, this.bus = s;
    const r = ee(t.value.hypno.depth, 0, 100);
    this.state = {
      depth: r,
      stage: Pe(r),
      trance: r >= t.value.hypno.enterTranceAt,
      lucid: t.value.hypno.lucidTrance,
      lastDepthChangeAt: Date.now(),
      speechAllowed: !0
    }, i.interval(() => this.tick(), 1e3), i.add(s.on("emergency.stop", ({ reason: n }) => this.emergencyStop(n)));
  }
  runtime;
  store;
  bus;
  state;
  get snapshot() {
    return structuredClone(this.state);
  }
  setDepth(e, t = "manual", s) {
    const i = this.state.depth, r = ee(e, 0, 100);
    return r === i || (this.state.depth = r, this.state.lastDepthChangeAt = Date.now(), this.state.stage = Pe(r, this.state.trance), this.store.update((n) => {
      n.hypno.depth = r;
    }), this.bus.emit("depth.changed", { previous: i, current: r, delta: r - i, source: s, reason: t }), !this.state.trance && r >= this.store.value.hypno.enterTranceAt && this.enterTrance(s, t), this.state.trance && r <= 0 && t === "decay" && this.wake("depth faded"), this.emitState()), r;
  }
  addDepth(e, t = "trigger", s) {
    return this.setDepth(this.state.depth + e, t, s);
  }
  enterTrance(e, t = "threshold") {
    if (this.state.trance) {
      this.extendTrance(this.store.value.hypno.autoWakeMinutes * 6e4 * 0.15);
      return;
    }
    const s = Date.now(), i = this.store.value.hypno.autoWakeMinutes;
    this.state.trance = !0, this.state.stage = "trance", this.state.activeBy = e && e > 0 ? e : void 0, this.state.activeByName = e && e > 0 ? this.runtime.characterName(e) : void 0, this.state.enteredAt = s, this.state.wakeAt = i > 0 ? s + i * 6e4 : void 0, this.state.lucid = this.store.value.hypno.lucidTrance, this.state.speechAllowed = !0, this.runtime.sendAction(`${this.runtime.playerName}'s eyes lose focus as a deep trance settles in.`), this.bus.emit("trance.enter", this.snapshot), this.bus.emit("depth.changed", { previous: this.state.depth, current: 100, delta: 100 - this.state.depth, source: e, reason: t }), this.state.depth = 100, this.store.update((r) => {
      r.hypno.depth = 100;
    }, !0), this.emitState();
  }
  extendTrance(e) {
    !this.state.trance || e <= 0 || (this.state.wakeAt = Math.max(this.state.wakeAt ?? Date.now(), Date.now()) + e, this.emitState());
  }
  wake(e = "wake", t) {
    if (!this.state.trance && this.state.depth <= this.store.value.hypno.wakeToDepth) return;
    const s = this.store.value.hypno.aftereffectsMinutes, i = this.state.depth;
    this.state.trance = !1, this.state.depth = ee(this.store.value.hypno.wakeToDepth, 0, 100), this.state.stage = Pe(this.state.depth), this.state.wakeAt = void 0, this.state.aftereffectsUntil = s > 0 ? Date.now() + s * 6e4 : void 0, this.state.speechAllowed = !0, this.state.forcedPhrase = void 0, this.state.focusMemberId = void 0, this.store.update((r) => {
      r.hypno.depth = this.state.depth;
    }, !0), this.runtime.sendAction(`${this.runtime.playerName} blinks and slowly returns to full awareness.`), this.bus.emit("trance.wake", this.snapshot), this.bus.emit("depth.changed", { previous: i, current: this.state.depth, delta: this.state.depth - i, source: t, reason: e }), this.emitState();
  }
  setSpeechAllowed(e) {
    this.state.speechAllowed = e, this.emitState();
  }
  setForcedPhrase(e) {
    this.state.forcedPhrase = e?.trim() || void 0, this.emitState();
  }
  setFocus(e) {
    this.state.focusMemberId = e, this.emitState();
  }
  setSession(e) {
    this.state.sessionId = e, this.emitState();
  }
  publicStatus(e) {
    return {
      protocol: 1,
      version: "0.2.0",
      depthBucket: Math.round(this.state.depth / 5) * 5,
      stage: this.state.stage,
      trance: this.state.trance,
      activeBy: this.state.activeBy,
      capabilities: e,
      theme: this.store.value.theme.mode
    };
  }
  emergencyStop(e) {
    this.state.trance = !1, this.state.depth = 0, this.state.stage = "awake", this.state.wakeAt = void 0, this.state.aftereffectsUntil = void 0, this.state.speechAllowed = !0, this.state.forcedPhrase = void 0, this.state.focusMemberId = void 0, this.state.sessionId = void 0, this.store.update((t) => {
      t.hypno.depth = 0;
    }, !0), this.runtime.localMessage(`Emergency stop: ${e}`, "warn"), this.emitState();
  }
  tick() {
    const e = Date.now();
    if (this.state.trance && this.state.wakeAt && e >= this.state.wakeAt) {
      this.wake("automatic timeout");
      return;
    }
    if (this.state.aftereffectsUntil && e >= this.state.aftereffectsUntil && (this.state.aftereffectsUntil = void 0, this.emitState()), this.state.trance || this.state.depth <= 0) return;
    const t = this.store.value.hypno;
    e - this.state.lastDepthChangeAt < t.decayDelaySeconds * 1e3 || t.decayPerMinute <= 0 || this.setDepth(this.state.depth - t.decayPerMinute / 60, "decay");
  }
  emitState() {
    this.state.stage = Pe(this.state.depth, this.state.trance), this.bus.emit("state.changed", this.snapshot);
  }
}
class Ps {
  constructor(e, t, s) {
    this.runtime = e, this.store = t, this.hypno = s;
  }
  runtime;
  store;
  hypno;
  get(e) {
    let t = this.store.value.influence.find((s) => s.memberId === e);
    return t || (t = {
      memberId: e,
      memberName: this.runtime.characterName(e),
      trigger: 0,
      suggestion: 0,
      deepen: 0,
      wake: 0,
      lastChangedAt: Date.now()
    }, this.store.update((s) => s.influence.push(t))), t;
  }
  value(e, t) {
    return this.store.value.influence.find((s) => s.memberId === e)?.[t] ?? 0;
  }
  change(e, t, s) {
    let i = 0;
    return this.store.update(() => {
      const r = this.get(e);
      r[t] = ee(r[t] + s, 0, 100), r.memberName = this.runtime.characterName(e), r.lastChangedAt = Date.now(), i = r[t];
    }), i;
  }
  suggestionStrength(e, t) {
    const s = this.value(e.installedBy, "suggestion"), i = this.value(t, "suggestion"), n = 0.45 + this.hypno.snapshot.depth / 100, o = this.hypno.snapshot.trance ? 1.35 : 1;
    return ee(((s + i) / 2 + e.requiredDepth * 0.15) * n * o, 0, 100);
  }
  decay() {
    this.store.update((e) => {
      e.influence = e.influence.map((t) => {
        const s = { ...t };
        for (const i of ["trigger", "suggestion", "deepen", "wake"]) {
          const r = s[i];
          s[i] = r <= 1 ? 0 : Math.max(0, r - Math.ceil(Math.log10(r)));
        }
        return s;
      }).filter((t) => t.trigger + t.suggestion + t.deepen + t.wake > 0);
    });
  }
}
class Ds {
  constructor(e, t, s) {
    this.runtime = e, this.store = t, this.hypno = s;
  }
  runtime;
  store;
  hypno;
  active;
  acceptedSessions = /* @__PURE__ */ new Set();
  request(e, t, s) {
    const i = this.store.value.resistance, r = this.hypno.snapshot;
    return !i.enabled || i.whitelistAutoAccept.includes(t) || r.depth >= i.autoAcceptDepth || i.autoAcceptCapabilities.length > 0 && e.instructions.every((n) => i.autoAcceptCapabilities.includes(n.type)) || i.askOncePerSession && r.sessionId && this.acceptedSessions.has(`${r.sessionId}:${t}`) ? Promise.resolve(!0) : this.openGame(e, t, s);
  }
  cancel() {
    this.active?.finish(!1);
  }
  openGame(e, t, s) {
    return this.active?.finish(!1), new Promise((i) => {
      const r = this.store.value.resistance, n = Math.max(0, Math.min(100, r.baseDifficulty * 0.35 + s * 0.65)), o = document.createElement("div");
      o.id = "sh-resistance", o.innerHTML = `
        <style>
          #sh-resistance{position:fixed;inset:0;z-index:1000000;display:grid;place-items:center;background:radial-gradient(circle,rgba(86,10,75,.48),rgba(0,0,0,.92));backdrop-filter:blur(9px);font-family:Inter,system-ui;color:white}
          #sh-resistance .card{width:min(680px,92vw);padding:28px;border-radius:28px;border:1px solid rgba(255,91,194,.5);background:linear-gradient(145deg,rgba(34,6,42,.92),rgba(7,4,15,.94));box-shadow:0 0 60px rgba(255,48,167,.25),inset 0 1px rgba(255,255,255,.12);text-align:center}
          #sh-resistance h2{margin:0;color:#ff88d4;text-shadow:0 0 18px #b72aff} #sh-resistance p{opacity:.84}
          #sh-resistance .track{position:relative;height:28px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;margin:24px 0}
          #sh-resistance .safe{position:absolute;top:0;bottom:0;background:rgba(84,255,191,.36);border:1px solid #54ffbf}
          #sh-resistance .marker{position:absolute;top:-4px;width:8px;height:36px;border-radius:8px;background:#fff;box-shadow:0 0 15px #ff58bd}
          #sh-resistance .pulse{width:150px;height:150px;margin:22px auto;border-radius:50%;border:6px solid #ff58bd;box-shadow:0 0 40px #7d25ff;transform:scale(1)}
          #sh-resistance button{border:0;border-radius:15px;padding:12px 22px;margin:6px;font-weight:800;color:white;cursor:pointer}
          #sh-resistance [data-resist]{background:linear-gradient(135deg,#5d2aff,#d81d8c)} #sh-resistance [data-submit]{background:linear-gradient(135deg,#ff4fa9,#8524ff)}
          #sh-resistance .progress{height:5px;background:rgba(255,255,255,.12);margin-top:18px;border-radius:99px;overflow:hidden}.progress i{display:block;height:100%;background:#ff58bd;width:100%}
        </style>
        <div class="card">
          <h2>${Mt(e.name)}</h2>
          <p>${Mt(this.runtime.characterName(t))}'s suggestion presses against your thoughts.</p>
          <div data-game></div>
          <button data-resist>Resist</button><button data-submit>Submit</button>
          <div class="progress"><i></i></div>
          <small>Influence ${Math.round(s)} · Difficulty ${Math.round(n)}</small>
        </div>`, document.body.appendChild(o);
      const c = o.querySelector("[data-game]"), d = o.querySelector("[data-resist]"), l = o.querySelector("[data-submit]"), h = o.querySelector(".progress i"), f = performance.now(), $ = Math.max(3e3, r.durationMs);
      let E = 0, U = !1, C = 0, M = f + 900 + Math.random() * Math.max(400, $ - 2200), D = !1;
      const u = (O) => {
        U || (U = !0, cancelAnimationFrame(E), o.remove(), this.active = void 0, O && r.askOncePerSession && this.hypno.snapshot.sessionId && this.acceptedSessions.add(`${this.hypno.snapshot.sessionId}:${t}`), i(O));
      };
      this.active = { finish: u };
      let y = 0, g = 1;
      const p = Math.max(12, 48 - n * 0.32), b = 50 - p / 2;
      r.game === "timing" || r.game === "multi" ? c.innerHTML = `<div class="track"><div class="safe" style="left:${b}%;width:${p}%"></div><div class="marker"></div></div><div data-status>${r.game === "multi" ? "Land three successful resistance hits." : "Stop the marker inside the green area."}</div>` : r.game === "pulse" ? c.innerHTML = '<div class="pulse"></div><div>Resist when the pulse is smallest.</div>' : r.game === "reaction" ? c.innerHTML = '<div class="pulse"></div><div data-status>Wait for the glow, then resist quickly.</div>' : c.innerHTML = '<div class="pulse"></div><div>Resistance compares your roll against the influence.</div>';
      const x = (O) => {
        const H = O - f;
        if (h.style.width = `${Math.max(0, 100 * (1 - H / $))}%`, H >= $) {
          u(!1);
          return;
        }
        if (r.game === "timing" || r.game === "multi") {
          y += g * (0.8 + n * 0.018), (y >= 100 || y <= 0) && (g *= -1), y = Math.max(0, Math.min(100, y));
          const N = c.querySelector(".marker");
          N && (N.style.left = `calc(${y}% - 4px)`);
        } else if (r.game === "pulse" || r.game === "reaction") {
          const N = c.querySelector(".pulse");
          if (N) {
            const S = 0.55 + (Math.sin(H * 7e-3) + 1) * 0.42;
            if (N.style.transform = `scale(${S})`, r.game === "reaction" && O >= M) {
              D = !0, N.style.background = "rgba(84,255,191,.38)";
              const L = c.querySelector("[data-status]");
              L && (L.textContent = "NOW!");
            }
          }
        }
        E = requestAnimationFrame(x);
      };
      d.addEventListener("click", () => {
        switch (r.game) {
          case "classic":
            u(Math.random() * 100 <= n);
            break;
          case "timing":
            u(!(y >= b && y <= b + p));
            break;
          case "multi": {
            if (!(y >= b && y <= b + p)) {
              u(!0);
              break;
            }
            C += 1;
            const H = c.querySelector("[data-status]");
            H && (H.textContent = `${C}/3 successful resistance hits`), C >= 3 && u(!1);
            break;
          }
          case "pulse": {
            const O = performance.now() - f, H = 0.55 + (Math.sin(O * 7e-3) + 1) * 0.42;
            u(H > 0.82 + (100 - n) * 15e-4);
            break;
          }
          case "reaction":
            u(!(D && performance.now() - M < 900));
            break;
        }
      }), l.addEventListener("click", () => u(!0)), E = requestAnimationFrame(x);
    });
  }
}
function Mt(a) {
  const e = document.createElement("span");
  return e.textContent = a, e.innerHTML;
}
class Os {
  constructor(e, t, s, i) {
    this.runtime = e, this.store = t, this.hypno = s, i.add(e.hook("ServerSend", 100, (r, n) => this.interceptServerSend(r, n))), i.add(e.hook("Player.CanTalk", 100, (r, n) => this.active("speech") ? !1 : n(r))), i.add(e.hook("Player.CanWalk", 100, (r, n) => this.active("walk") ? !1 : n(r))), i.add(e.hook("Player.CanChangeClothesOn", 100, (r, n) => this.active("wardrobe") ? !1 : n(r))), i.add(e.hook("Player.CanInteract", 100, (r, n) => this.active("interact") ? !1 : n(r))), i.add(e.hook("PoseCanChangeUnaided", 100, (r, n) => this.active("pose") ? !1 : n(r))), i.add(e.hook("Player.GetDeafLevel", 100, (r, n) => this.active("hearing") ? Math.max(4, Number(n(r)) || 0) : n(r))), i.add(e.hook("Player.GetBlindLevel", 100, (r, n) => this.active("sight") ? Math.max(2, Number(n(r)) || 0) : n(r))), i.add(e.hook("CommonSetScreen", 100, (r, n) => this.interceptScreen(r, n))), i.add(e.hook("ChatRoomSafewordRevert", 1e3, (r, n) => {
      this.clearAll();
      const o = n(r);
      return this.hypno.emergencyStop("BC safeword revert"), o;
    })), i.add(e.hook("ChatRoomSafewordRelease", 1e3, (r, n) => {
      const o = n(r);
      return this.clearAll(), this.hypno.emergencyStop("BC safeword release"), o;
    })), i.interval(() => this.expire(), 1e3);
  }
  runtime;
  store;
  hypno;
  temporary = /* @__PURE__ */ new Map();
  add(e, t, s) {
    const i = crypto.randomUUID();
    return this.temporary.set(i, { id: i, kind: e, source: s, expiresAt: t && t > 0 ? Date.now() + t : void 0 }), i;
  }
  remove(e) {
    this.temporary.delete(e);
  }
  clearAll() {
    this.temporary.clear(), this.hypno.setSpeechAllowed(!0), this.hypno.setForcedPhrase(void 0);
  }
  active(e) {
    if (this.expire(), [...this.temporary.values()].some((i) => i.kind === e)) return !0;
    const t = this.store.value.restrictions[e], s = this.hypno.snapshot;
    switch (t) {
      case "off":
        return !1;
      case "trance":
        return s.trance && !s.lucid;
      case "suggestion":
        return !1;
      case "both":
        return s.trance && !s.lucid;
      case "depth":
        return s.depth >= this.store.value.restrictions.threshold && !s.lucid;
      default:
        return !1;
    }
  }
  interceptServerSend(e, t) {
    const [s, i] = e;
    if (s !== "ChatRoomChat" || i?.Type !== "Chat") return t(e);
    const r = String(i.Content ?? "");
    if (!r || this.isControlText(r)) return t(e);
    const n = this.hypno.snapshot.forcedPhrase;
    if (n)
      return r.trim().toLocaleLowerCase() === n.trim().toLocaleLowerCase() ? (this.hypno.setForcedPhrase(void 0), t(e)) : (this.runtime.localMessage(`Your thoughts keep returning to: “${n}”`, "warn"), null);
    if (!this.hypno.snapshot.speechAllowed || this.active("speech")) {
      const o = this.store.value.restrictions.replacementResponses, c = o[Math.floor(Math.random() * o.length)] || "...";
      return this.runtime.localMessage(`Speech blocked. Intended response: ${c}`, "warn"), null;
    }
    return t(e);
  }
  interceptScreen(e, t) {
    if (!this.active("menus")) return t(e);
    const s = String(e[0] ?? ""), i = String(e[1] ?? "");
    if (i === "ChatRoom" || i.includes("Preference") || s.includes("Preference")) return t(e);
    this.runtime.localMessage("That menu is temporarily unavailable. Preferences and the emergency stop remain accessible.", "warn");
  }
  isControlText(e) {
    const t = e.trim();
    return this.store.value.restrictions.allowedPhrases.some((s) => t.startsWith(s));
  }
  expire() {
    const e = Date.now();
    for (const [t, s] of this.temporary) s.expiresAt && s.expiresAt <= e && this.temporary.delete(t);
  }
}
const Be = (a) => a.normalize("NFKC").toLocaleLowerCase(), Ls = (a) => a.replace(/\([^)]*\)/g, " ");
function Ae(a, e) {
  const t = Be(Ls(a)), s = Be(e.trim());
  if (!s) return !1;
  const i = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s|[.,!?;:'"-])${i}(?=$|\\s|[.,!?;:'"-])`, "iu").test(t);
}
class js {
  constructor(e, t, s, i, r, n) {
    this.runtime = e, this.store = t, this.hypno = s, this.permissions = i, this.bus = r, n.add(e.hook("ChatRoomMessage", 60, (o, c) => {
      const d = o[0];
      return this.handleChatMessage(d), c(o);
    })), this.installBcxVoice();
  }
  runtime;
  store;
  hypno;
  permissions;
  bus;
  cooldowns = /* @__PURE__ */ new Map();
  repeats = /* @__PURE__ */ new Map();
  comboHistory = /* @__PURE__ */ new Map();
  test(e, t = this.runtime.memberNumber, s = "api") {
    return this.process(e, t, s, !1);
  }
  executeById(e, t, s) {
    const i = this.store.value.triggers.find((n) => n.id === e);
    if (!i || !i.source.includes("remote")) return !1;
    const r = s?.trim() || i.phrase;
    return !this.isEligible(i, r, t, "remote") || !this.matchesWithRepeats(i, r, t) ? !1 : (this.execute(i, r, t, "remote"), !0);
  }
  process(e, t, s, i = !0) {
    if (!this.store.value.general.enabled || !this.store.value.hypno.enabled || !e || t <= 0) return [];
    const r = [];
    for (const n of this.store.value.triggers)
      this.isEligible(n, e, t, s) && this.matchesWithRepeats(n, e, t) && (r.push(n), i && this.execute(n, e, t, s));
    return r;
  }
  handleChatMessage(e) {
    if (!e?.Sender || e.Content === "SkyzHypno") return;
    const t = e.Type === "Chat" ? "chat" : e.Type === "Whisper" ? "whisper" : e.Type === "Activity" || e.Type === "Action" ? "activity" : void 0;
    t && this.process(e.Content, e.Sender, t);
  }
  installBcxVoice() {
    if (!(!this.store.value.compatibility.bcxVoice || !window.bcx))
      try {
        window.bcx.getModApi("SkyzHypno").on?.("bcxLocalMessage", (e) => {
          const t = e?.message;
          if (typeof t != "string" || !t.startsWith("[Voice] ")) return;
          const s = Number(e.sender) || this.findBcxReminderSender();
          s > 0 && this.process(t.slice(8), s, "voice");
        });
      } catch (e) {
        this.runtime.recordError("BCX voice hook", e);
      }
  }
  findBcxReminderSender() {
    try {
      const e = this.runtime.player?.ExtensionSettings?.BCX ?? this.runtime.player?.OnlineSettings?.BCX;
      if (typeof e != "string") return -1;
      const t = ye.decompressFromBase64(e), s = t ? JSON.parse(t) : void 0;
      return Number(s?.conditions?.rules?.conditions?.other_constant_reminder?.addedBy) || -1;
    } catch {
      return -1;
    }
  }
  isEligible(e, t, s, i) {
    const r = Date.now();
    if (!e.enabled || !e.source.includes(i) || e.expiresAt && e.expiresAt < r) return !1;
    const n = this.hypno.snapshot;
    return n.depth < e.minDepth || n.depth > e.maxDepth || (this.cooldowns.get(e.id) ?? 0) > r || e.requireNameMention && !Ae(t, this.runtime.playerName) || e.allowedMemberIds.length > 0 && !e.allowedMemberIds.includes(s) || e.allowedMemberIds.length === 0 && s !== this.runtime.memberNumber && !this.permissions.can({ sender: s, capability: e.kind === "wake" ? "wake" : e.kind === "deepen" ? "deepen" : "trigger", activeBy: n.activeBy, depth: n.depth, trance: n.trance }) || e.kind === "wake" && !n.trance && n.depth <= 0 || e.kind !== "wake" && e.kind !== "speechAllow" && n.trance && e.kind === "trigger" ? !1 : Ae(t, e.phrase) || e.kind === "combo" && e.comboPhrases.some((o) => Ae(t, o));
  }
  matchesWithRepeats(e, t, s) {
    const i = Date.now();
    if (e.kind === "combo") {
      const c = this.comboHistory.get(s) ?? [];
      for (const l of e.comboPhrases) Ae(t, l) && c.push({ phrase: Be(l), at: i });
      const d = c.filter((l) => i - l.at <= e.repeatWindowMs);
      return this.comboHistory.set(s, d), e.comboPhrases.every((l) => d.some((h) => h.phrase === Be(l)));
    }
    if (e.requiredRepeats <= 1) return !0;
    const r = `${e.id}:${s}`, n = this.repeats.get(r), o = !n || i - n.firstAt > e.repeatWindowMs ? { count: 1, firstAt: i, lastAt: i } : { count: n.count + 1, firstAt: n.firstAt, lastAt: i };
    return this.repeats.set(r, o), o.count < e.requiredRepeats ? !1 : (this.repeats.delete(r), !0);
  }
  execute(e, t, s, i) {
    const r = () => {
      switch (this.cooldowns.set(e.id, Date.now() + e.cooldownMs), e.oneShot && this.store.update((n) => {
        const o = n.triggers.find((c) => c.id === e.id);
        o && (o.enabled = !1);
      }), e.kind) {
        case "trigger":
        case "deepen":
        case "combo":
          this.hypno.addDepth(e.depthDelta, e.kind, s);
          break;
        case "wake":
          this.hypno.wake("wake trigger", s);
          break;
        case "speechBlock":
          this.hypno.setSpeechAllowed(!1);
          break;
        case "speechAllow":
          this.hypno.setSpeechAllowed(!0);
          break;
      }
      this.bus.emit("trigger.matched", { trigger: e, sender: s, source: i, message: t });
    };
    e.delayMs > 0 ? window.setTimeout(r, e.delayMs) : r();
  }
}
const Hs = [
  "hello",
  "sync",
  "permission.query",
  "permission.response",
  "trigger.request",
  "depth.request",
  "wake.request",
  "effect.request",
  "settings.patch",
  "suggestion.install",
  "suggestion.remove",
  "suggestion.trigger",
  "session.invite",
  "session.control",
  "session.leave",
  "indicator.request",
  "audit.ack"
], qs = F({
  protocol: xs(Dt),
  id: K().min(8).max(100),
  type: he(Hs),
  sender: z().int().positive(),
  target: z().int().positive().optional(),
  timestamp: z().int().positive(),
  payload: Ue()
}).strict();
function Bs(a, e, t, s) {
  return {
    protocol: Dt,
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: a,
    sender: e,
    target: s,
    timestamp: Date.now(),
    payload: t
  };
}
function Us(a, e) {
  const t = qs.safeParse(a);
  return !t.success || e !== void 0 && t.data.sender !== e || Math.abs(Date.now() - t.data.timestamp) > 9e4 ? null : t.data;
}
const zs = F({ id: K().min(1).max(100), message: K().max(500).optional() }).strict(), Zs = F({ changes: F({ autoWakeMinutes: z().min(0).max(1440).optional(), lucidTrance: re().optional(), effectIntensity: z().min(0).max(1).optional(), themeMode: he(["pinky", "dark", "hybrid"]).optional(), restrictionThreshold: z().min(0).max(100).optional(), extremeEnabled: re().optional(), lockQuickControls: re().optional() }).strict() }).strict(), Ct = F({ delta: z().min(-100).max(100), reason: K().max(120).optional() }).strict(), Fs = F({ presetId: K().min(1).max(100), durationMs: z().int().min(500).max(6e5).optional() }).strict(), Vs = F({ id: K().min(1).max(100) }).strict(), Ws = F({ id: K().min(1).max(100), command: K().max(500).optional() }).strict(), Gs = F({ hidden: re() }).strict();
class Ks {
  constructor(e, t, s, i, r, n, o, c, d) {
    this.runtime = e, this.store = t, this.hypno = s, this.permissions = i, this.effects = r, this.triggers = n, this.suggestions = o, this.bus = c, d.add(e.hook("ChatRoomMessage", 1e3, (l, h) => {
      const f = l[0];
      return f?.Type === "Hidden" && f.Content === "SkyzHypno" && this.receive(f), h(l);
    })), d.add(e.hook("ChatRoomSync", 5, (l, h) => {
      const f = h(l);
      return window.setTimeout(() => this.broadcastHello(!0), 500), f;
    })), d.interval(() => this.cleanup(), 15e3), d.add(c.on("state.changed", () => this.broadcastHello(!1)));
  }
  runtime;
  store;
  hypno;
  permissions;
  effects;
  triggers;
  suggestions;
  bus;
  seen = /* @__PURE__ */ new Map();
  statuses = /* @__PURE__ */ new Map();
  sessionHandler;
  lastHello = 0;
  attachSessionHandler(e) {
    this.sessionHandler = e;
  }
  status(e) {
    return this.statuses.get(e);
  }
  allStatuses() {
    return this.statuses;
  }
  send(e, t, s) {
    if (this.runtime.memberNumber <= 0) return;
    const i = Bs(e, this.runtime.memberNumber, t, s);
    this.runtime.sendHidden(i, s);
  }
  requestTrigger(e, t, s) {
    this.send("trigger.request", { id: t, message: s }, e);
  }
  requestSettingsPatch(e, t) {
    this.send("settings.patch", { changes: t }, e);
  }
  requestDepth(e, t, s) {
    this.send("depth.request", { delta: t, reason: s }, e);
  }
  requestWake(e) {
    this.send("wake.request", {}, e);
  }
  requestEffect(e, t, s) {
    this.send("effect.request", { presetId: t, durationMs: s }, e);
  }
  installSuggestion(e, t) {
    this.send("suggestion.install", { suggestion: t }, e);
  }
  removeSuggestion(e, t) {
    this.send("suggestion.remove", { id: t }, e);
  }
  triggerSuggestion(e, t, s) {
    this.send("suggestion.trigger", { id: t, command: s }, e);
  }
  requestIndicator(e, t) {
    this.send("indicator.request", { hidden: t }, e);
  }
  broadcastHello(e) {
    if (!this.runtime.inChatRoom() || !this.store.value.hypno.showPublicStatus) return;
    const t = Date.now();
    if (!e && t - this.lastHello < 5500) return;
    this.lastHello = t;
    const s = Object.entries(this.store.value.remote.capabilities).filter(([, i]) => this.store.value.remote.enabled && i.enabled).map(([i]) => i);
    this.send("hello", this.hypno.publicStatus(s));
  }
  receive(e) {
    const t = Number(e.Sender), s = e.Dictionary?.find((r) => r?.Tag === "SkyzHypno")?.message ?? e.Dictionary?.[0]?.message, i = Us(s, t);
    if (!i || i.target && i.target !== this.runtime.memberNumber) {
      this.runtime.diagnostics.networkPacketsRejected += 1;
      return;
    }
    this.seen.has(i.id) || (this.seen.set(i.id, Date.now()), this.runtime.diagnostics.networkPacketsReceived += 1, this.bus.emit("network.packet", i), this.dispatch(i).catch((r) => {
      this.runtime.diagnostics.networkPacketsRejected += 1, this.runtime.recordError(`network ${i.type}`, r), this.audit(i, !1, r instanceof Error ? r.message : String(r));
    }));
  }
  async dispatch(e) {
    switch (e.type) {
      case "hello":
      case "sync": {
        const t = Js.parse(e.payload);
        this.statuses.set(e.sender, t), e.type === "hello" && e.sender !== this.runtime.memberNumber && this.send("sync", this.hypno.publicStatus(this.enabledCapabilities()), e.sender);
        return;
      }
      case "permission.query":
        this.send("permission.response", { capabilities: this.enabledCapabilities() }, e.sender);
        return;
      case "permission.response":
        return;
      case "trigger.request": {
        this.require(e, "trigger");
        const t = zs.parse(e.payload);
        if (!this.triggers.executeById(t.id, e.sender, t.message)) throw new Error("Remote trigger is unavailable or ineligible");
        this.audit(e, !0, `Trigger ${t.id}`);
        return;
      }
      case "settings.patch": {
        this.require(e, "editSettings");
        const { changes: t } = Zs.parse(e.payload);
        this.store.update((s) => {
          if (t.autoWakeMinutes !== void 0 && (s.hypno.autoWakeMinutes = t.autoWakeMinutes), t.lucidTrance !== void 0 && (s.hypno.lucidTrance = t.lucidTrance), t.effectIntensity !== void 0 && (s.effects.intensity = t.effectIntensity), t.restrictionThreshold !== void 0 && (s.restrictions.threshold = t.restrictionThreshold), t.extremeEnabled !== void 0 && (s.extreme.enabled = t.extremeEnabled), t.lockQuickControls !== void 0 && (s.extreme.lockQuickControls = t.lockQuickControls), t.themeMode !== void 0) {
            s.theme.mode = t.themeMode;
            const i = t.themeMode === "pinky" ? { primary: "#ff58bd", secondary: "#b45cff", accent: "#ffd0f0", background: "#12051a", glow: 0.95, darkness: 0.42 } : t.themeMode === "dark" ? { primary: "#ff2f72", secondary: "#3b0b66", accent: "#a868ff", background: "#030106", glow: 0.62, darkness: 0.9 } : { primary: "#ff58bd", secondary: "#731dff", accent: "#ff9fe2", background: "#09030f", glow: 0.8, darkness: 0.65 };
            Object.assign(s.theme, i);
          }
        }, !0), this.audit(e, !0, "Settings patch");
        return;
      }
      case "depth.request": {
        this.require(e, Ct.parse(e.payload).delta >= 0 ? "deepen" : "wake");
        const t = Ct.parse(e.payload);
        this.hypno.addDepth(t.delta, t.reason ?? "remote request", e.sender), this.audit(e, !0, `Depth ${t.delta}`);
        return;
      }
      case "wake.request":
        this.require(e, "wake"), this.hypno.wake("remote wake", e.sender), this.audit(e, !0, "Wake");
        return;
      case "effect.request": {
        this.require(e, "testEffect");
        const t = Fs.parse(e.payload);
        await this.effects.playPreset(t.presetId, t.durationMs, !1), this.audit(e, !0, `Effect ${t.presetId}`);
        return;
      }
      case "suggestion.install": {
        const t = F({ suggestion: Ue() }).strict().parse(e.payload), s = typeof t.suggestion?.id == "string" ? t.suggestion.id : "", i = this.store.value.suggestions.some((r) => r.id === s);
        this.require(e, i ? "editOwnSuggestion" : "installSuggestion"), this.suggestions.install(t.suggestion, e.sender), this.audit(e, !0, i ? "Suggestion edit" : "Suggestion install");
        return;
      }
      case "suggestion.remove": {
        this.require(e, "removeOwnSuggestion");
        const t = Vs.parse(e.payload);
        this.suggestions.remove(t.id, e.sender), this.audit(e, !0, `Suggestion remove ${t.id}`);
        return;
      }
      case "suggestion.trigger": {
        this.require(e, "trigger");
        const t = Ws.parse(e.payload);
        await this.suggestions.trigger(t.id, e.sender, t.command ?? ""), this.audit(e, !0, `Suggestion trigger ${t.id}`);
        return;
      }
      case "session.invite":
        this.require(e, "startSession"), await this.sessionHandler?.onInvite(e.sender, e.payload), this.audit(e, !0, "Session invite");
        return;
      case "session.control":
        this.require(e, "controlSession"), await this.sessionHandler?.onControl(e.sender, e.payload), this.audit(e, !0, "Session control");
        return;
      case "session.leave":
        await this.sessionHandler?.onLeave(e.sender, e.payload);
        return;
      case "indicator.request": {
        if (this.require(e, "controlIndicator"), !this.store.value.extreme.allowRemoteIndicatorControl) throw new Error("Remote indicator control is disabled locally");
        const t = Gs.parse(e.payload);
        this.store.update((s) => {
          s.extreme.hideOwnIndicator = t.hidden;
        }, !0), this.audit(e, !0, t.hidden ? "Indicator hidden" : "Indicator shown");
        return;
      }
      case "audit.ack":
        return;
    }
  }
  require(e, t) {
    const s = this.hypno.snapshot;
    if (!this.permissions.can({ sender: e.sender, capability: t, activeBy: s.activeBy, depth: s.depth, trance: s.trance })) throw new Error(`Permission denied: ${t}`);
  }
  enabledCapabilities() {
    return this.store.value.remote.enabled ? Object.entries(this.store.value.remote.capabilities).filter(([, e]) => e.enabled).map(([e]) => e) : [];
  }
  audit(e, t, s) {
    this.store.value.remote.auditLog && this.runtime.auditEntry({
      id: e.id,
      timestamp: Date.now(),
      sender: e.sender,
      senderName: this.runtime.characterName(e.sender),
      action: e.type,
      allowed: t,
      detail: s
    });
  }
  cleanup() {
    const e = Date.now() - 12e4;
    for (const [s, i] of this.seen) i < e && this.seen.delete(s);
    const t = new Set((typeof ChatRoomCharacter > "u" ? [] : ChatRoomCharacter).map((s) => s.MemberNumber));
    for (const s of this.statuses.keys()) t.has(s) || this.statuses.delete(s);
  }
}
const Js = F({
  protocol: z().int(),
  version: K().max(50),
  depthBucket: z().min(0).max(100),
  stage: he(["awake", "influenced", "dazed", "deep", "critical", "trance"]),
  trance: re(),
  activeBy: z().int().positive().optional(),
  capabilities: Ee(he(["viewStatus", "trigger", "deepen", "wake", "testEffect", "installSuggestion", "editOwnSuggestion", "removeOwnSuggestion", "editSettings", "startSession", "controlSession", "controlIndicator"])).max(30),
  theme: he(["pinky", "dark", "hybrid", "custom"])
}).strict();
class Xs {
  constructor(e, t, s, i, r, n, o, c, d, l) {
    this.runtime = e, this.store = t, this.hypno = s, this.triggers = i, this.effects = r, this.suggestions = n, this.sessions = o, this.ui = c, this.onEmergency = d, this.onUnload = l;
  }
  runtime;
  store;
  hypno;
  triggers;
  effects;
  suggestions;
  sessions;
  ui;
  onEmergency;
  onUnload;
  version = "0.2.0";
  get state() {
    return this.hypno.snapshot;
  }
  getSettings() {
    return structuredClone(this.store.value);
  }
  open(e) {
    this.ui.open(e);
  }
  setDepth(e, t = "API") {
    return this.hypno.setDepth(e, t);
  }
  addDepth(e, t = "API", s) {
    return this.hypno.addDepth(e, t, s);
  }
  trance(e) {
    this.hypno.enterTrance(e, "API");
  }
  wake(e = "API", t) {
    this.hypno.wake(e, t);
  }
  testTrigger(e, t = this.runtime.memberNumber, s = "api") {
    return this.triggers.test(e, t, s).map((i) => i.id);
  }
  playPreset(e, t) {
    return this.effects.playPreset(e, t);
  }
  installSuggestion(e) {
    return this.suggestions.install(e, this.runtime.memberNumber);
  }
  runSuggestion(e, t = "") {
    return this.suggestions.trigger(e, this.runtime.memberNumber, t);
  }
  startSession(e) {
    this.sessions.start(e);
  }
  stopSession(e = "API") {
    this.sessions.stop(e, !0);
  }
  emergencyStop(e = "API emergency stop") {
    this.onEmergency(e);
  }
  exportSettings() {
    return this.store.export();
  }
  importSettings(e) {
    this.store.import(e);
  }
  diagnostics() {
    return { ...this.runtime.diagnostics, audit: this.runtime.getAudit() };
  }
  unload() {
    this.onUnload();
  }
}
const Qs = F({ sessionId: K().min(8).max(100), presetId: K().min(1).max(100), role: he(["hypnotist", "support", "viewer", "subject"]), hostName: K().max(100) }).strict(), Ys = F({ sessionId: K().min(8).max(100), action: he(["start", "stop", "pause", "resume", "effect", "depth", "wake", "message"]), config: Pt(Ue()).default({}) }).strict();
class ei {
  constructor(e, t, s, i, r, n, o, c, d, l) {
    this.runtime = e, this.store = t, this.hypno = s, this.effects = i, this.audio = r, this.suggestions = n, this.restrictions = o, this.network = c, this.bus = d, c.attachSessionHandler(this), l.add(() => this.stop("addon unload", !1)), l.add(d.on("emergency.stop", () => this.stop("emergency stop", !0)));
  }
  runtime;
  store;
  hypno;
  effects;
  audio;
  suggestions;
  restrictions;
  network;
  bus;
  active;
  get current() {
    return this.active;
  }
  start(e, t = this.runtime.memberNumber, s = crypto.randomUUID()) {
    const i = this.store.value.sessions.find((n) => n.id === e);
    if (!i) throw new Error("Unknown session preset");
    this.stop("new session", !1);
    const r = { id: s, presetId: e, host: t, startedAt: Date.now(), participants: /* @__PURE__ */ new Map([[t, "host"], [this.runtime.memberNumber, t === this.runtime.memberNumber ? "host" : "subject"]]), timers: [], elapsedMs: 0 };
    this.active = r, this.hypno.setSession(s), this.schedulePreset(i, r), this.runtime.localMessage(`Session “${i.name}” started.`);
  }
  invite(e, t, s = "subject") {
    const i = this.active?.id ?? crypto.randomUUID();
    this.active || this.start(t, this.runtime.memberNumber, i), this.active.participants.set(e, s), this.network.send("session.invite", { sessionId: i, presetId: t, role: s, hostName: this.runtime.playerName }, e);
  }
  control(e, t = {}) {
    if (this.active) {
      for (const s of this.active.participants.keys()) s !== this.runtime.memberNumber && this.network.send("session.control", { sessionId: this.active.id, action: e, config: t }, s);
      this.applyControl(e, t);
    }
  }
  stop(e = "stopped", t = !0) {
    const s = this.active;
    if (s) {
      if (this.clearTimers(s), t)
        for (const i of s.participants.keys()) i !== this.runtime.memberNumber && this.network.send("session.leave", { sessionId: s.id, reason: e }, i);
      this.active = void 0, this.hypno.setSession(void 0), this.audio.stopCategory("ambient"), this.runtime.localMessage(`Session ${e}.`);
    }
  }
  async onInvite(e, t) {
    const s = Qs.parse(t);
    await ti(`${s.hostName} invites you to a shared SkyzHypno session as ${s.role}.`, this.store.value.theme.primary) && (this.start(s.presetId, e, s.sessionId), this.active?.participants.set(e, "host"), this.active?.participants.set(this.runtime.memberNumber, s.role));
  }
  async onControl(e, t) {
    const s = Ys.parse(t);
    if (!this.active || this.active.id !== s.sessionId || this.active.host !== e) throw new Error("Session control does not match active host");
    if (s.action === "stop") {
      this.stop("ended by host", !1);
      return;
    }
    await this.applyControl(s.action, s.config);
  }
  onLeave(e, t) {
    !this.active || t?.sessionId !== this.active.id || (this.active.participants.delete(e), e === this.active.host && this.stop("host left", !1));
  }
  schedulePreset(e, t, s = 0) {
    this.clearTimers(t);
    for (const i of [...e.steps].sort((r, n) => r.atMs - n.atMs)) {
      if (i.atMs < s) continue;
      const r = window.setTimeout(() => {
        this.active?.id === t.id && !t.pausedAt && this.executeStep(i);
      }, Math.max(0, i.atMs - s));
      t.timers.push(r);
    }
    t.timers.push(window.setTimeout(() => {
      this.active?.id === t.id && !t.pausedAt && this.stop("completed", !0);
    }, Math.max(0, e.durationMs - s)));
  }
  clearTimers(e) {
    e.timers.forEach((t) => window.clearTimeout(t)), e.timers = [];
  }
  pause() {
    !this.active || this.active.pausedAt || (this.active.elapsedMs = Math.max(0, Date.now() - this.active.startedAt), this.active.pausedAt = Date.now(), this.clearTimers(this.active), this.runtime.localMessage("Shared session paused."));
  }
  resume() {
    if (!this.active?.pausedAt) return;
    const e = this.store.value.sessions.find((t) => t.id === this.active?.presetId);
    if (!e) {
      this.stop("preset missing", !0);
      return;
    }
    this.active.pausedAt = void 0, this.active.startedAt = Date.now() - this.active.elapsedMs, this.schedulePreset(e, this.active, this.active.elapsedMs), this.runtime.localMessage("Shared session resumed.");
  }
  async executeStep(e) {
    switch (e.action) {
      case "effect":
        await this.effects.playPreset(String(e.config.presetId ?? ""), _e(e.config.durationMs), !1);
        break;
      case "sound":
        await this.audio.playCategory(String(e.config.category ?? "ambient"), { loop: !!e.config.loop });
        break;
      case "depth":
        this.hypno.addDepth(_e(e.config.delta) ?? 0, "session", this.active?.host);
        break;
      case "message":
        this.runtime.localMessage(String(e.config.text ?? ""));
        break;
      case "suggestion":
        typeof e.config.id == "string" && this.active && await this.suggestions.trigger(e.config.id, this.active.host, String(e.config.command ?? ""));
        break;
      case "restriction":
        typeof e.config.kind == "string" && this.restrictions.add(e.config.kind, _e(e.config.durationMs), this.active?.host);
        break;
      case "wake":
        this.hypno.wake("session wake", this.active?.host);
        break;
    }
  }
  async applyControl(e, t) {
    if (e === "pause") {
      this.pause();
      return;
    }
    if (e === "resume") {
      this.resume();
      return;
    }
    if (e === "start" && this.active) {
      this.resume();
      return;
    }
    e === "effect" && typeof t.presetId == "string" ? await this.effects.playPreset(t.presetId, _e(t.durationMs), !1) : e === "depth" ? this.hypno.addDepth(_e(t.delta) ?? 0, "session remote", this.active?.host) : e === "wake" ? this.hypno.wake("session remote wake", this.active?.host) : e === "message" && this.effects.fragment(String(t.text ?? ""));
  }
}
const _e = (a) => typeof a == "number" && Number.isFinite(a) ? a : void 0;
function ti(a, e) {
  return new Promise((t) => {
    const s = document.createElement("div");
    s.style.cssText = "position:fixed;inset:0;z-index:1000001;display:grid;place-items:center;background:rgba(0,0,0,.78);backdrop-filter:blur(8px)", s.innerHTML = `<div style="width:min(520px,90vw);padding:28px;border-radius:24px;background:#100718;color:white;border:1px solid ${e};box-shadow:0 0 50px ${e}55;font-family:system-ui;text-align:center"><h2 style="color:${e}">Shared Session</h2><p></p><button data-yes style="padding:10px 20px;margin:8px;border:0;border-radius:12px;background:${e};color:white;font-weight:800">Accept</button><button data-no style="padding:10px 20px;margin:8px;border:0;border-radius:12px;background:#34243e;color:white">Decline</button></div>`, s.querySelector("p").textContent = a, document.body.appendChild(s);
    const i = (r) => {
      s.remove(), t(r);
    };
    s.querySelector("[data-yes]").addEventListener("click", () => i(!0)), s.querySelector("[data-no]").addEventListener("click", () => i(!1));
  });
}
const ot = [
  "effect",
  "sound",
  "depth",
  "trance",
  "wake",
  "message",
  "expression",
  "pose",
  "activity",
  "follow",
  "say",
  "strip",
  "restriction",
  "wait",
  "random",
  "condition",
  "memory",
  "aftereffect",
  "status",
  "command"
], Ot = F({
  id: K().min(1).max(100),
  type: he(ot),
  config: Pt(Ue())
}).strict(), si = F({
  id: K().min(1).max(100),
  name: K().min(1).max(100),
  description: K().max(500),
  trigger: K().min(1).max(160),
  installedBy: z().int().positive(),
  installedByName: K().min(1).max(100),
  installedAt: z().int().positive(),
  exclusive: re(),
  enabled: re(),
  requiredDepth: z().min(0).max(100),
  cooldownMs: z().int().min(0).max(864e5),
  expiresAt: z().int().positive().optional(),
  maxUses: z().int().min(0).max(1e5),
  uses: z().int().min(0).max(1e5),
  lastUsedAt: z().int().min(0),
  instructions: Ee(Ot).min(1).max(30)
}).strict();
function ii(a) {
  jt(a);
  let e;
  try {
    e = JSON.stringify(a);
  } catch {
    throw new Error("Suggestion must be serializable");
  }
  if (e.length > 1e5) throw new Error("Suggestion is too large");
  const t = si.parse(a);
  return Lt(t.instructions, 0, { count: 0 }), t;
}
function Lt(a, e, t = { count: 0 }) {
  if (e > 4) throw new Error("Suggestion nesting is too deep");
  if (t.count += a.length, t.count > 200) throw new Error("Suggestion contains too many instructions");
  for (const s of a) {
    if (JSON.stringify(s.config).length > 2e4) throw new Error("Instruction configuration is too large");
    for (const r of Object.keys(s.config)) if (["__proto__", "prototype", "constructor"].includes(r)) throw new Error("Unsafe instruction key");
    for (const r of ["instructions", "options", "then", "else"]) {
      const n = s.config[r];
      if (!Array.isArray(n)) continue;
      const o = Ee(Ot).max(20).parse(n);
      Lt(o, e + 1, t);
    }
  }
}
function jt(a, e = /* @__PURE__ */ new WeakSet()) {
  if (!(a === null || typeof a != "object") && !e.has(a)) {
    e.add(a);
    for (const t of Reflect.ownKeys(a)) {
      if (typeof t == "string" && ["__proto__", "prototype", "constructor"].includes(t)) throw new Error(`Unsafe key: ${t}`);
      jt(a[t], e);
    }
  }
}
class ri {
  constructor(e, t, s, i, r, n, o, c, d, l, h) {
    this.runtime = e, this.store = t, this.hypno = s, this.influence = i, this.resistance = r, this.effects = n, this.audio = o, this.restrictions = c, this.permissions = d, this.bus = l, h.add(e.hook("ChatRoomMessage", 55, (f, $) => {
      const E = f[0];
      return E?.Sender && (E.Type === "Chat" || E.Type === "Whisper") && this.checkMessage(E.Content, E.Sender), $(f);
    })), h.add(l.on("trigger.matched", ({ trigger: f, sender: $, message: E }) => {
      if (!f.suggestionId) return;
      const U = this.store.value.suggestions.find((C) => C.id === f.suggestionId);
      U && this.requestExecution(U, $, E);
    })), h.add(l.on("emergency.stop", () => this.cancelAll()));
  }
  runtime;
  store;
  hypno;
  influence;
  resistance;
  effects;
  audio;
  restrictions;
  permissions;
  bus;
  executionToken = 0;
  list() {
    return this.store.value.suggestions;
  }
  install(e, t) {
    const s = ii(e), i = this.store.value.suggestionPolicy;
    if (!i.enabled) throw new Error("Suggestions are disabled");
    if (s.installedBy !== t) throw new Error("Installer identity does not match sender");
    if (!this.store.value.suggestions.find((o) => o.id === s.id) && this.store.value.suggestions.length >= i.maxSuggestions) throw new Error("Suggestion limit reached");
    if (i.requireTranceForInstall && !this.hypno.snapshot.trance) throw new Error("Suggestion installation requires trance");
    if (i.requireActiveHypnotizerForInstall && this.hypno.snapshot.activeBy !== t && t !== this.runtime.memberNumber) throw new Error("Only the active hypnotizer may install suggestions");
    const n = s.instructions.find((o) => !i.allowedInstructionTypes.includes(o.type));
    if (n) throw new Error(`Instruction type is not allowed: ${n.type}`);
    return this.store.update((o) => {
      const c = o.suggestions.find((d) => d.id === s.id);
      if (c) {
        if (c.installedBy !== t) throw new Error("Cannot overwrite another installer's suggestion");
        Object.assign(c, s);
      } else o.suggestions.push(s);
    }, !0), this.influence.change(t, "suggestion", 8), this.runtime.localMessage(`${this.runtime.characterName(t)} installed suggestion “${s.name}”.`), s;
  }
  remove(e, t) {
    const s = this.store.value.suggestions.find((r) => r.id === e);
    if (!s) return !1;
    const i = s.installedBy === t;
    if (t !== this.runtime.memberNumber && !i) throw new Error("Cannot remove another person's suggestion");
    if (t === this.runtime.memberNumber && !this.store.value.suggestionPolicy.allowSelfRemoval && !i) throw new Error("Self-removal is disabled for this suggestion");
    return this.store.update((r) => {
      r.suggestions = r.suggestions.filter((n) => n.id !== e);
    }, !0), !0;
  }
  async trigger(e, t, s = "") {
    const i = this.store.value.suggestions.find((r) => r.id === e);
    return i ? this.requestExecution(i, t, s) : !1;
  }
  cancelAll() {
    this.executionToken += 1, this.resistance.cancel(), this.hypno.setForcedPhrase(void 0);
  }
  checkMessage(e, t) {
    if (!(!e || e.trim().startsWith("(")))
      for (const s of this.store.value.suggestions) {
        if (!s.enabled || !Ae(e, s.trigger) || s.exclusive && s.installedBy !== t) continue;
        const i = e.slice(e.toLocaleLowerCase().indexOf(s.trigger.toLocaleLowerCase()) + s.trigger.length).trim();
        this.requestExecution(s, t, i);
        break;
      }
  }
  async requestExecution(e, t, s) {
    const i = Date.now();
    if (!this.store.value.suggestionPolicy.enabled || !e.enabled || e.expiresAt && e.expiresAt < i || e.maxUses > 0 && e.uses >= e.maxUses || e.lastUsedAt + e.cooldownMs > i || this.hypno.snapshot.depth < e.requiredDepth || e.exclusive && e.installedBy !== t) return !1;
    if (t !== this.runtime.memberNumber) {
      const c = this.hypno.snapshot;
      if (!this.permissions.can({ sender: t, capability: "trigger", activeBy: c.activeBy, depth: c.depth, trance: c.trance })) return !1;
    }
    this.bus.emit("suggestion.request", { suggestion: e, sender: t, command: s });
    const r = this.influence.suggestionStrength(e, t);
    if (await this.audio.playCategory("suggestion"), !await this.resistance.request(e, t, r))
      return this.influence.change(t, "suggestion", -3), e.installedBy !== t && this.influence.change(e.installedBy, "suggestion", -2), this.runtime.localMessage(`Successfully resisted “${e.name}”.`), !1;
    const o = ++this.executionToken;
    return await this.executeInstructions(e.instructions, { suggestion: e, sender: t, command: s, token: o }), o !== this.executionToken ? !1 : (this.store.update(() => {
      e.uses += 1, e.lastUsedAt = Date.now();
    }), this.influence.change(t, "suggestion", 2), e.installedBy !== t && this.influence.change(e.installedBy, "suggestion", 1), this.bus.emit("suggestion.executed", { suggestion: e, sender: t }), !0);
  }
  async executeInstructions(e, t) {
    for (const s of e) {
      if (t.token !== this.executionToken) return;
      this.store.value.suggestionPolicy.allowedInstructionTypes.includes(s.type) && await this.executeInstruction(s, t);
    }
  }
  async executeInstruction(e, t) {
    const s = e.config;
    switch (e.type) {
      case "effect": {
        const i = Q(s.presetId);
        i ? await this.effects.playPreset(i, ie(s.durationMs), !1) : this.effects.preview(s.effects ?? {}, ie(s.durationMs) ?? 8e3);
        break;
      }
      case "sound": {
        const i = Q(s.category);
        i && await this.audio.playCategory(i, { loop: $e(s.loop) });
        break;
      }
      case "depth":
        this.hypno.addDepth(ie(s.delta) ?? 0, `suggestion:${t.suggestion.name}`, t.sender);
        break;
      case "trance":
        this.hypno.enterTrance(t.sender, `suggestion:${t.suggestion.name}`);
        break;
      case "wake":
        this.hypno.wake(`suggestion:${t.suggestion.name}`, t.sender);
        break;
      case "message": {
        const i = Me(Q(s.text) ?? t.command, t);
        i && ($e(s.public) ? this.runtime.sendAction(i) : this.runtime.localMessage(i));
        break;
      }
      case "expression":
        this.applyExpression(s);
        break;
      case "pose":
        this.applyPose(s);
        break;
      case "activity":
        this.applyActivity(s, t);
        break;
      case "follow": {
        const i = ie(s.memberId) ?? t.sender;
        this.hypno.setFocus(i);
        const r = ie(s.durationMs);
        r && window.setTimeout(() => {
          this.hypno.snapshot.focusMemberId === i && this.hypno.setFocus(void 0);
        }, r), this.runtime.sendAction(`${this.runtime.playerName}'s attention locks completely onto ${this.runtime.characterName(i)}.`);
        break;
      }
      case "say": {
        const i = Me(Q(s.text) ?? t.command, t);
        i && !/^[*!/.]/.test(i) && !i.includes("(") && this.hypno.setForcedPhrase(i);
        break;
      }
      case "strip":
        this.applyStrip(s);
        break;
      case "restriction": {
        const i = Q(s.kind);
        i && this.restrictions.add(i, ie(s.durationMs), t.sender);
        break;
      }
      case "wait":
        await ai(Math.min(6e4, Math.max(0, ie(s.durationMs) ?? 1e3)));
        break;
      case "random": {
        const i = Array.isArray(s.options) ? s.options : [];
        i.length && await this.executeInstruction(i[Math.floor(Math.random() * i.length)], t);
        break;
      }
      case "condition": {
        const r = this.evaluateCondition(s) ? s.then : s.else;
        Array.isArray(r) && await this.executeInstructions(r, t);
        break;
      }
      case "memory":
        this.effects.fragment(Me(Q(s.text) ?? "The words linger in your thoughts...", t));
        break;
      case "aftereffect": {
        const i = ie(s.durationMs) ?? 3e4;
        this.effects.preview(s.effects ?? { dreamMode: !0, vignette: !0, intensity: 0.25 }, i);
        break;
      }
      case "status": {
        const i = Me(Q(s.text) ?? `${t.suggestion.name} is active.`, t);
        $e(s.public) ? this.runtime.sendAction(i) : this.runtime.localMessage(i);
        break;
      }
      case "command": {
        const i = Q(s.mode) ?? "say", r = Me(Q(s.text) ?? t.command, t);
        if (!r) break;
        i === "say" ? !/^[*!/.]/.test(r) && !r.includes("(") && this.hypno.setForcedPhrase(r) : i === "action" ? $e(s.public) ? this.runtime.sendAction(r) : this.runtime.localMessage(r) : i === "memory" && this.effects.fragment(r);
        break;
      }
    }
  }
  applyExpression(e) {
    if (typeof CharacterSetFacialExpression != "function") return;
    const t = Q(e.group) ?? "Eyes", s = Q(e.expression) ?? "Dazed", i = ie(e.durationMs) ?? 0;
    try {
      CharacterSetFacialExpression(Player, t, s, i), CharacterRefresh(Player, !1);
    } catch (r) {
      this.runtime.recordError("suggestion expression", r);
    }
  }
  applyPose(e) {
    if (typeof PoseSetActive != "function") return;
    const t = e.pose;
    try {
      PoseSetActive(Player, t ?? null), ChatRoomCharacterUpdate(Player), CharacterLoadCanvas(Player);
    } catch (s) {
      this.runtime.recordError("suggestion pose", s);
    }
  }
  applyActivity(e, t) {
    try {
      const s = this.runtime.get("ActivityRun"), i = this.runtime.get("ActivityAllowedForGroup"), r = this.runtime.get("getActivities"), n = this.runtime.get("AssetGroup") ?? [], o = Q(e.group), c = Q(e.name), d = ie(e.targetMemberId) ?? t.sender, l = this.runtime.character(d), h = n.find((E) => E.Name === o), f = h && r?.(h).find((E) => E.Name === c);
      l && h && f && i?.(l, h.Name).some((E) => !E.Blocked && E.Activity?.Name === f.Name) && s ? s(Player, l, h, { Activity: f, Group: h.Name }, !0) : this.runtime.localMessage("The requested activity could not be performed.", "warn");
    } catch (s) {
      this.runtime.recordError("suggestion activity", s);
    }
  }
  applyStrip(e) {
    if (!Player.CanChangeOwnClothes?.()) {
      this.runtime.localMessage("Current permissions prevent clothing changes.", "warn");
      return;
    }
    const t = Array.isArray(e.groups) ? e.groups.filter((s) => typeof s == "string").slice(0, 30) : [];
    try {
      for (const s of t) InventoryRemove(Player, s, !1);
      ChatRoomCharacterUpdate(Player), CharacterLoadCanvas(Player);
    } catch (s) {
      this.runtime.recordError("suggestion strip", s);
    }
  }
  evaluateCondition(e) {
    const t = Q(e.kind) ?? "depth", s = ie(e.value) ?? 0;
    return t === "depth" ? this.hypno.snapshot.depth >= s : t === "trance" ? this.hypno.snapshot.trance === $e(e.expected, !0) : t === "random" ? Math.random() * 100 < s : t === "activeHypnotizer" ? this.hypno.snapshot.activeBy === s : !1;
  }
}
const Q = (a) => typeof a == "string" ? a.slice(0, 1e3) : void 0, ie = (a) => typeof a == "number" && Number.isFinite(a) ? a : void 0, $e = (a, e = !1) => typeof a == "boolean" ? a : e, ai = (a) => new Promise((e) => window.setTimeout(e, a));
function Me(a, e) {
  return a.replaceAll("%PLAYER%", typeof CharacterNickname == "function" ? CharacterNickname(Player) : "Player").replaceAll("%SENDER%", String(e.sender)).replaceAll("%COMMAND%", e.command).slice(0, 1e3);
}
const At = ["overview", "hypnosis", "triggers", "suggestions", "effects", "sounds", "restrictions", "resistance", "remote", "presets", "sessions", "safety", "diagnostics"];
class ni {
  constructor(e, t, s, i, r, n, o, c, d, l) {
    this.runtime = e, this.store = t, this.hypno = s, this.effects = i, this.audio = r, this.suggestions = n, this.network = o, this.sessions = c, this.bus = d, l.add(d.on("settings.open", ({ tab: h }) => this.open(h ?? "overview"))), l.add(t.subscribe(() => {
      this.root && this.render();
    })), l.add(e.hook("InformationSheetRun", 5, (h, f) => {
      const $ = f(h);
      return this.drawRemoteEntry(), $;
    })), l.add(e.hook("InformationSheetClick", 5, (h, f) => {
      if (typeof MouseIn == "function" && MouseIn(1540, 790, 410, 80)) {
        const $ = this.currentCharacter();
        $?.MemberNumber && $.MemberNumber !== this.runtime.memberNumber && this.openRemote($.MemberNumber);
        return;
      }
      return f(h);
    })), l.interval(() => this.registerExtensionSetting(), 500), this.registerExtensionSetting(), l.add(() => this.close(!1));
  }
  runtime;
  store;
  hypno;
  effects;
  audio;
  suggestions;
  network;
  sessions;
  bus;
  root;
  tab = "overview";
  selectedSuggestionId;
  remoteMember;
  extensionRegistered = !1;
  extensionContext = !1;
  open(e = "overview") {
    this.tab = At.includes(e) ? e : "overview", this.remoteMember = void 0, this.mount(), this.render();
  }
  openRemote(e) {
    this.remoteMember = e, this.tab = "remote", this.mount(), this.render();
  }
  close(e = !0) {
    if (this.root?.remove(), this.root = void 0, e && this.extensionContext) {
      this.extensionContext = !1;
      try {
        PreferenceSubscreenExtensionsClear?.();
      } catch {
      }
    }
  }
  mount() {
    if (this.root) return;
    const e = document.createElement("div");
    e.id = "sh-preferences", e.innerHTML = `<style>${hi}</style><div class="sh-shell"><aside></aside><main><header></header><section></section></main></div>`, e.addEventListener("click", (t) => this.onClick(t)), e.addEventListener("change", (t) => this.onChange(t)), e.addEventListener("input", (t) => this.onInput(t)), document.body.appendChild(e), this.root = e, this.audio.unlock();
  }
  render() {
    if (!this.root) return;
    const e = this.root.querySelector("aside"), t = this.root.querySelector("header"), s = this.root.querySelector("section");
    e.innerHTML = `<div class="brand"><b>SH</b><span>SkyzHypno<small>v0.2.0</small></span></div><nav>${At.map((i) => `<button data-tab="${i}" class="${this.tab === i ? "active" : ""}">${Tt(i)}</button>`).join("")}</nav><button class="danger" data-action="emergency">Emergency Stop</button>`, t.innerHTML = `<div><h1>${this.remoteMember ? `Remote · ${B(this.runtime.characterName(this.remoteMember))}` : Tt(this.tab)}</h1><p>${ci(this.tab)}</p></div><button data-action="close">×</button>`, s.innerHTML = this.remoteMember ? this.renderRemoteTarget(this.remoteMember) : this.renderTab();
  }
  renderTab() {
    switch (this.tab) {
      case "overview":
        return this.renderOverview();
      case "hypnosis":
        return this.renderHypnosis();
      case "triggers":
        return this.renderTriggers();
      case "suggestions":
        return this.renderSuggestions();
      case "effects":
        return this.renderEffects();
      case "sounds":
        return this.renderSounds();
      case "restrictions":
        return this.renderRestrictions();
      case "resistance":
        return this.renderResistance();
      case "remote":
        return this.renderRemoteSettings();
      case "presets":
        return this.renderPresets();
      case "sessions":
        return this.renderSessions();
      case "safety":
        return this.renderSafety();
      case "diagnostics":
        return this.renderDiagnostics();
    }
  }
  renderOverview() {
    const e = this.hypno.snapshot;
    return `<div class="hero"><div><span class="pill">${e.stage}</span><h2>${Math.round(e.depth)}% depth</h2><p>${e.trance ? `Trance active${e.activeByName ? ` · ${B(e.activeByName)}` : ""}` : "Awake and responsive"}</p></div><div class="orb" style="--depth:${e.depth}"></div></div>
      <div class="grid three">${Ke("Effects", `${this.store.value.effects.enabled ? "Enabled" : "Disabled"} · ${Math.round(this.store.value.effects.intensity * 100)}%`, "effects")}${Ke("Suggestions", `${this.store.value.suggestions.length} installed`, "suggestions")}${Ke("Remote", this.store.value.remote.enabled ? "Enabled" : "Disabled", "remote")}</div>
      <div class="panel"><h3>Quick controls</h3>${this.store.value.extreme.enabled && this.store.value.extreme.lockQuickControls ? '<p class="notice">Locked by Extreme Mode. The local emergency hotkey and BC safeword remain available.</p>' : '<div class="actions"><button data-action="depth" data-value="10">+10 depth</button><button data-action="depth" data-value="-10">−10 depth</button><button data-action="trance">Enter trance</button><button data-action="wake">Wake</button><button data-action="preview" data-value="preset-deep-trance">Preview Deep Trance</button></div>'}</div>
      <div class="panel"><h3>Compatibility</h3>${this.runtime.diagnostics.conflicts.length ? `<ul>${this.runtime.diagnostics.conflicts.map((t) => `<li>${B(t)}</li>`).join("")}</ul>` : "<p>No known conflicts detected.</p>"}</div>`;
  }
  renderHypnosis() {
    const e = this.store.value;
    return `<div class="grid two">
      ${_("Enable hypnosis", q("hypno.enabled", e.hypno.enabled), "Master switch for depth and trance logic.")}
      ${_("Current depth", me("hypno.depth", e.hypno.depth, 0, 100, 1), `${Math.round(e.hypno.depth)}%`)}
      ${_("Decay per minute", ae("hypno.decayPerMinute", e.hypno.decayPerMinute, 0, 20, 0.1), "How quickly depth fades while awake.")}
      ${_("Decay delay", ae("hypno.decayDelaySeconds", e.hypno.decayDelaySeconds, 0, 600, 1), "Seconds before decay begins.")}
      ${_("Automatic wake", ae("hypno.autoWakeMinutes", e.hypno.autoWakeMinutes, 0, 1440, 1), "0 keeps trance active until a wake action.")}
      ${_("Aftereffects", ae("hypno.aftereffectsMinutes", e.hypno.aftereffectsMinutes, 0, 120, 1), "Minutes of gentle residual effects.")}
      ${_("Enter trance at", ae("hypno.enterTranceAt", e.hypno.enterTranceAt, 1, 100, 1), "Depth threshold for trance.")}
      ${_("Lucid trance", q("hypno.lucidTrance", e.hypno.lucidTrance), "Keep interaction restrictions disabled while visuals remain active.")}
      ${_("Public status", q("hypno.showPublicStatus", e.hypno.showPublicStatus), "Share a quantized status with other SH clients.")}
      ${_("Character status indicator", q("general.showHud", e.general.showHud), "Show a compact vertical SH depth bar to the right of your character only while affected.")}
    </div>`;
  }
  renderTriggers() {
    return `<div class="toolbar"><button data-action="trigger-add">+ Add trigger</button></div><div class="stack">${this.store.value.triggers.map((e, t) => `<article class="panel block"><div class="row"><b>${B(e.name)}</b><button class="icon" data-action="trigger-delete" data-index="${t}">Delete</button></div><div class="grid three">
      ${A("Name", `<input data-trigger="name" data-index="${t}" value="${Z(e.name)}">`)}
      ${A("Phrase", `<input data-trigger="phrase" data-index="${t}" value="${Z(e.phrase)}">`)}
      ${A("Kind", `<select data-trigger="kind" data-index="${t}">${["trigger", "deepen", "wake", "speechBlock", "speechAllow", "suggestion", "combo"].map((s) => `<option ${s === e.kind ? "selected" : ""}>${s}</option>`).join("")}</select>`)}
      ${A("Sources", `<input data-trigger="source" data-index="${t}" value="${Z(e.source.join(","))}" placeholder="chat,whisper,voice,activity,item,api,remote">`)}
      ${A("Minimum depth", `<input type="number" min="0" max="100" data-trigger="minDepth" data-index="${t}" value="${e.minDepth}">`)}
      ${A("Maximum depth", `<input type="number" min="0" max="100" data-trigger="maxDepth" data-index="${t}" value="${e.maxDepth}">`)}
      ${A("Depth delta", `<input type="number" min="-100" max="100" data-trigger="depthDelta" data-index="${t}" value="${e.depthDelta}">`)}
      ${A("Delay ms", `<input type="number" min="0" max="600000" data-trigger="delayMs" data-index="${t}" value="${e.delayMs}">`)}
      ${A("Cooldown ms", `<input type="number" min="0" max="86400000" data-trigger="cooldownMs" data-index="${t}" value="${e.cooldownMs}">`)}
      ${A("Required repeats", `<input type="number" min="1" max="20" data-trigger="requiredRepeats" data-index="${t}" value="${e.requiredRepeats}">`)}
      ${A("Repeat/combo window ms", `<input type="number" min="100" max="600000" data-trigger="repeatWindowMs" data-index="${t}" value="${e.repeatWindowMs}">`)}
      ${A("Combo phrases", `<input data-trigger="comboPhrases" data-index="${t}" value="${Z(e.comboPhrases.join(" | "))}" placeholder="phrase one | phrase two">`)}
      ${A("Allowed member IDs", `<input data-trigger="allowedMemberIds" data-index="${t}" value="${e.allowedMemberIds.join(",")}">`)}
      ${A("Expires at (timestamp)", `<input type="number" min="0" data-trigger="expiresAt" data-index="${t}" value="${e.expiresAt ?? ""}">`)}
      ${A("Effect preset", `<select data-trigger="effectPresetId" data-index="${t}"><option value="">None</option>${this.store.value.presets.map((s) => `<option value="${Z(s.id)}" ${s.id === e.effectPresetId ? "selected" : ""}>${B(s.name)}</option>`).join("")}</select>`)}
      ${A("Linked suggestion", `<select data-trigger="suggestionId" data-index="${t}"><option value="">None</option>${this.store.value.suggestions.map((s) => `<option value="${Z(s.id)}" ${s.id === e.suggestionId ? "selected" : ""}>${B(s.name)}</option>`).join("")}</select>`)}
      ${A("Require name mention", `<input type="checkbox" data-trigger="requireNameMention" data-index="${t}" ${e.requireNameMention ? "checked" : ""}>`)}
      ${A("One-shot", `<input type="checkbox" data-trigger="oneShot" data-index="${t}" ${e.oneShot ? "checked" : ""}>`)}
      ${A("Enabled", `<input type="checkbox" data-trigger="enabled" data-index="${t}" ${e.enabled ? "checked" : ""}>`)}
    </div></article>`).join("")}</div>`;
  }
  renderSuggestions() {
    const e = this.store.value.suggestions;
    !this.selectedSuggestionId && e[0] && (this.selectedSuggestionId = e[0].id);
    const t = e.find((s) => s.id === this.selectedSuggestionId);
    return `<div class="split"><div class="panel list"><button data-action="suggestion-add">+ New suggestion</button><button data-action="command-add">+ New implanted command</button>${e.map((s) => `<button data-action="suggestion-select" data-value="${Z(s.id)}" class="${s.id === t?.id ? "active" : ""}"><b>${B(s.name)}</b><small>${B(s.trigger)}</small></button>`).join("") || "<p>No suggestions installed.</p>"}</div><div>${t ? this.renderSuggestionEditor(t) : '<div class="panel"><h3>Create your first suggestion</h3><p>Suggestions combine trigger phrases, effects, sounds, conditions and BC actions.</p></div>'}</div></div>`;
  }
  renderSuggestionEditor(e) {
    return `<article class="panel"><div class="row"><h3>${B(e.name)}</h3><button class="danger" data-action="suggestion-delete" data-value="${Z(e.id)}">Delete</button></div><div class="grid two">
      ${A("Name", `<input data-suggestion="name" value="${Z(e.name)}">`)}
      ${A("Trigger", `<input data-suggestion="trigger" value="${Z(e.trigger)}">`)}
      ${A("Description", `<textarea data-suggestion="description">${B(e.description)}</textarea>`)}
      ${A("Required depth", `<input type="number" min="0" max="100" data-suggestion="requiredDepth" value="${e.requiredDepth}">`)}
      ${A("Cooldown ms", `<input type="number" min="0" data-suggestion="cooldownMs" value="${e.cooldownMs}">`)}
      ${A("Maximum uses", `<input type="number" min="0" max="100000" data-suggestion="maxUses" value="${e.maxUses}">`)}
      ${A("Expires at (timestamp)", `<input type="number" min="0" data-suggestion="expiresAt" value="${e.expiresAt ?? ""}">`)}
      ${A("Exclusive installer trigger", `<input type="checkbox" data-suggestion="exclusive" ${e.exclusive ? "checked" : ""}>`)}
      ${A("Enabled", `<input type="checkbox" data-suggestion="enabled" ${e.enabled ? "checked" : ""}>`)}
    </div><h3>Instruction flow</h3><div class="flow">${e.instructions.map((t, s) => `<div class="instruction"><span>${s + 1}</span><select data-instruction="type" data-index="${s}">${ot.map((i) => `<option ${t.type === i ? "selected" : ""}>${i}</option>`).join("")}</select><textarea data-instruction="config" data-index="${s}">${B(JSON.stringify(t.config, null, 2))}</textarea><div><button data-action="instruction-up" data-index="${s}">↑</button><button data-action="instruction-down" data-index="${s}">↓</button><button data-action="instruction-delete" data-index="${s}">×</button></div></div>`).join("")}</div><button data-action="instruction-add">+ Add instruction</button><button data-action="suggestion-test" data-value="${Z(e.id)}">Test locally</button></article>`;
  }
  renderEffects() {
    const e = this.store.value.effects, t = this.store.value.theme, s = ["spiral", "vignette", "blur", "tint", "waves", "particles", "chromatic", "doubleVision", "trails", "glitch", "tunnelVision", "focusLock", "roomAura", "dreamMode", "memoryFragments", "chatEcho", "chatDistort", "fadeOthers", "eyeGlow", "characterAura", "audioReactive"];
    return `<div class="grid two">${_("Effects enabled", q("effects.enabled", e.enabled), "Master switch for the visual compositor.")}${_("Theme", `<select data-setting="theme.mode">${["pinky", "dark", "hybrid", "custom"].map((i) => `<option ${t.mode === i ? "selected" : ""}>${i}</option>`).join("")}</select>`, "Pinky glow, dark creepy or a hybrid theme.")}${_("Intensity", me("effects.intensity", e.intensity, 0, 1, 0.01), `${Math.round(e.intensity * 100)}%`)}${_("Glow", me("theme.glow", t.glow, 0, 1, 0.01), `${Math.round(t.glow * 100)}%`)}${_("Darkness", me("theme.darkness", t.darkness, 0, 1, 0.01), `${Math.round(t.darkness * 100)}%`)}${_("Performance", `<select data-setting="effects.performance">${["low", "balanced", "high"].map((i) => `<option ${e.performance === i ? "selected" : ""}>${i}</option>`).join("")}</select>`, "Controls particle count and expensive effects.")}${_("Spiral style", `<select data-setting="effects.spiralStyle">${["classic", "double", "tunnel", "fracture", "rings"].map((i) => `<option ${e.spiralStyle === i ? "selected" : ""}>${i}</option>`).join("")}</select>`, "Visual geometry of the main spiral.")}${_("Spiral speed", me("effects.spiralSpeed", e.spiralSpeed, 0, 3, 0.05), `${e.spiralSpeed.toFixed(2)}×`)}${_("Reverse spiral", q("effects.reverseSpiral", e.reverseSpiral), "Reverse the main rotation direction.")}</div>
      <div class="panel"><h3>Effect composer</h3><div class="chips">${s.map((i) => `<label><input type="checkbox" data-setting="effects.${i}" ${e[i] ? "checked" : ""}>${i}</label>`).join("")}</div><div class="colors">${["primary", "secondary", "accent", "background"].map((i) => `<label>${i}<input type="color" data-setting="theme.${i}" value="${t[i]}"></label>`).join("")}</div><div class="actions"><button data-action="preview" data-value="preset-soft-induction">Soft</button><button data-action="preview" data-value="preset-deep-trance">Deep</button><button data-action="preview" data-value="preset-dream">Dream</button><button data-action="preview" data-value="preset-glitch">Glitch</button><button data-action="preset-save-current">Save current as preset</button></div></div>`;
  }
  renderSounds() {
    const e = this.store.value.audio;
    return `<div class="grid two">${_("Audio enabled", q("audio.enabled", e.enabled), "Master switch for built-in and URL sounds.")}${_("Master volume", me("audio.masterVolume", e.masterVolume, 0, 1, 0.01), `${Math.round(e.masterVolume * 100)}%`)}${_("Mute on emergency", q("audio.muteOnEmergency", e.muteOnEmergency), "Immediately mutes and stops audio during emergency stop.")}${_("Duck game audio", q("audio.duckGameAudio", e.duckGameAudio), "Reserved for compatible game-audio mixers.")}</div><div class="toolbar"><button data-action="sound-add">+ Add URL sound</button><button data-action="audio-stop">Stop all</button><button data-action="audio-mute">${this.audio.isMuted ? "Unmute" : "Mute"}</button></div><div class="stack">${e.sounds.map((t, s) => `<article class="panel block"><div class="row"><b>${B(t.name)}</b><div><button data-action="sound-play" data-index="${s}">Play</button><button data-action="sound-delete" data-index="${s}" ${t.builtIn ? "disabled" : ""}>Delete</button></div></div><div class="grid three">${A("Name", `<input data-sound="name" data-index="${s}" value="${Z(t.name)}">`)}${A("Category", `<select data-sound="category" data-index="${s}">${oi.map((i) => `<option ${t.category === i ? "selected" : ""}>${i}</option>`).join("")}</select>`)}${A("URL", `<input data-sound="url" data-index="${s}" value="${Z(t.url)}" ${t.builtIn ? "readonly" : ""}>`)}${A("Volume", `<input type="range" min="0" max="1" step=".01" data-sound="volume" data-index="${s}" value="${t.volume}">`)}${A("Playback rate", `<input type="number" min=".25" max="4" step=".05" data-sound="playbackRate" data-index="${s}" value="${t.playbackRate}">`)}${A("Stereo pan", `<input type="number" min="-1" max="1" step=".05" data-sound="pan" data-index="${s}" value="${t.pan}">`)}${A("Reverb", `<input type="number" min="0" max="1" step=".05" data-sound="reverb" data-index="${s}" value="${t.reverb}">`)}${A("Echo", `<input type="number" min="0" max="1" step=".05" data-sound="echo" data-index="${s}" value="${t.echo}">`)}${A("Loop", `<input type="checkbox" data-sound="loop" data-index="${s}" ${t.loop ? "checked" : ""}>`)}${A("Enabled", `<input type="checkbox" data-sound="enabled" data-index="${s}" ${t.enabled ? "checked" : ""}>`)}</div></article>`).join("")}</div>`;
  }
  renderRestrictions() {
    const e = this.store.value.restrictions;
    return `<div class="grid two">${["speech", "walk", "pose", "wardrobe", "interact", "hearing", "sight", "names", "menus"].map((s) => _(s, `<select data-setting="restrictions.${s}">${["off", "trance", "suggestion", "both", "depth"].map((i) => `<option ${e[s] === i ? "selected" : ""}>${i}</option>`).join("")}</select>`, "Choose whether this applies in trance, through suggestions, both, or above the threshold.")).join("")}${_("Depth threshold", ae("restrictions.threshold", e.threshold, 0, 100, 1), "Used by depth-based restrictions.")}${_("Replacement responses", `<textarea data-setting="restrictions.replacementResponses" data-array>${B(e.replacementResponses.join(`
`))}</textarea>`, "One response per line.")}${_("Always-allowed prefixes", `<textarea data-setting="restrictions.allowedPhrases" data-array>${B(e.allowedPhrases.join(`
`))}</textarea>`, "Commands, OOC and emergency prefixes that bypass speech restrictions.")}</div>`;
  }
  renderResistance() {
    const e = this.store.value.resistance;
    return `<div class="grid two">${_("Enable minigame", q("resistance.enabled", e.enabled), "Suggestions request an interactive resistance decision.")}${_("Game type", `<select data-setting="resistance.game">${["timing", "reaction", "pulse", "classic", "multi"].map((t) => `<option ${e.game === t ? "selected" : ""}>${t}</option>`).join("")}</select>`, "Five implemented minigame variants.")}${_("Base difficulty", me("resistance.baseDifficulty", e.baseDifficulty, 0, 100, 1), `${e.baseDifficulty}`)}${_("Duration ms", ae("resistance.durationMs", e.durationMs, 3e3, 3e4, 500), "Time before the attempt safely rejects.")}${_("Auto-accept whitelist", `<input data-setting="resistance.whitelistAutoAccept" data-number-array value="${e.whitelistAutoAccept.join(",")}">`, "Member IDs that skip the minigame.")}${_("Auto-accept depth", ae("resistance.autoAcceptDepth", e.autoAcceptDepth, 0, 101, 1), "101 disables depth-based auto-accept.")}${_("Ask once per session", q("resistance.askOncePerSession", e.askOncePerSession), "After one acceptance, allow that sender for the current shared session.")}</div><div class="panel"><h3>Auto-accept instruction categories</h3><div class="chips">${ot.map((t) => `<label><input type="checkbox" data-resistance-capability="${t}" ${e.autoAcceptCapabilities.includes(t) ? "checked" : ""}>${t}</label>`).join("")}</div></div>`;
  }
  renderRemoteSettings() {
    const e = this.store.value.remote;
    return `${_("Enable multiplayer remote features", q("remote.enabled", e.enabled), "All individual capabilities still require their own explicit rule.")}<div class="stack">${Object.keys(e.capabilities).map((t) => {
      const s = e.capabilities[t];
      return `<article class="panel block"><div class="row"><b>${t}</b><input type="checkbox" data-capability="${t}" data-cap-field="enabled" ${s.enabled ? "checked" : ""}></div><div class="grid three">${A("Member IDs", `<input data-capability="${t}" data-cap-field="memberIds" value="${s.memberIds.join(",")}">`)}${A("Minimum depth", `<input type="number" min="0" max="100" data-capability="${t}" data-cap-field="minDepth" value="${s.minDepth}">`)}${A("Requires trance", `<input type="checkbox" data-capability="${t}" data-cap-field="requireTrance" ${s.requireTrance ? "checked" : ""}>`)}${A("Only active hypnotizer", `<input type="checkbox" data-capability="${t}" data-cap-field="requireActiveHypnotizer" ${s.requireActiveHypnotizer ? "checked" : ""}>`)}${A("Roles", `<div class="chips">${["owner", "lover", "friend", "itemPermission", "whitelist", "everyone"].map((i) => `<label><input type="checkbox" data-capability="${t}" data-role="${i}" ${s.roles.includes(i) ? "checked" : ""}>${i}</label>`).join("")}</div>`)}</div></article>`;
    }).join("")}</div>`;
  }
  renderRemoteTarget(e) {
    const t = this.network.status(e);
    return `<div class="panel"><h3>${B(this.runtime.characterName(e))}</h3>${t ? `<p>SH ${B(t.version)} · ${t.stage} · ${t.depthBucket}%</p><div class="chips">${t.capabilities.map((s) => `<span>${s}</span>`).join("")}</div>` : "<p>No SH status received yet. The player may not have SH or public status enabled.</p>"}<h3>Remote triggers</h3><div class="actions">${this.store.value.triggers.filter((s) => s.enabled && s.source.includes("remote")).map((s) => `<button data-remote="trigger" data-value="${Z(s.id)}">${B(s.name)}</button>`).join("") || "<small>No local trigger is marked for remote use.</small>"}</div><div class="actions"><button data-remote="depth" data-value="10">Deepen +10</button><button data-remote="depth" data-value="25">Deepen +25</button><button data-remote="wake">Wake</button>${this.store.value.presets.map((s) => `<button data-remote="effect" data-value="${Z(s.id)}">${B(s.name)}</button>`).join("")}</div><h3>Indicator controls</h3><div class="actions"><button data-remote="indicator" data-value="hide">Hide indicator</button><button data-remote="indicator" data-value="show">Show indicator</button></div><h3>Allowed settings controls</h3><div class="actions"><button data-remote="settings" data-value="soft">Soft visuals</button><button data-remote="settings" data-value="intense">Intense visuals</button><button data-remote="settings" data-value="pinky">Pinky theme</button><button data-remote="settings" data-value="dark">Dark theme</button><button data-remote="settings" data-value="lucid">Lucid trance</button><button data-remote="settings" data-value="extreme-on">Extreme on</button><button data-remote="settings" data-value="extreme-off">Extreme off</button></div><h3>Suggestions from your library</h3><div class="stack">${this.store.value.suggestions.map((s) => `<div class="row"><span><b>${B(s.name)}</b><small>${B(s.trigger)}</small></span><div><button data-remote="suggestion-install" data-value="${Z(s.id)}">Install / update</button><button data-remote="suggestion-trigger" data-value="${Z(s.id)}">Trigger</button></div></div>`).join("") || "<p>Create a suggestion locally first.</p>"}</div><div class="actions"><button data-action="close-remote">Back to settings</button></div></div>`;
  }
  renderPresets() {
    return `<div class="grid three">${this.store.value.presets.map((e) => `<article class="panel"><h3>${B(e.name)}</h3><p>${B(e.description)}</p><small>${Math.round(e.durationMs / 1e3)}s · depth ${e.depthDelta >= 0 ? "+" : ""}${e.depthDelta}</small><div><button data-action="preview" data-value="${Z(e.id)}">Preview</button></div></article>`).join("")}</div>`;
  }
  renderSessions() {
    return `<div class="toolbar"><button data-action="session-add">+ New session timeline</button></div><div class="grid two">${this.store.value.sessions.map((e, t) => `<article class="panel block"><div class="row"><h3>${B(e.name)}</h3><button class="danger" data-action="session-delete" data-index="${t}">Delete</button></div><div class="grid two">${A("Name", `<input data-session="name" data-index="${t}" value="${Z(e.name)}">`)}${A("Duration ms", `<input type="number" min="1000" max="86400000" data-session="durationMs" data-index="${t}" value="${e.durationMs}">`)}${A("Description", `<textarea data-session="description" data-index="${t}">${B(e.description)}</textarea>`)}${A("Timeline JSON", `<textarea class="timeline-json" data-session="steps" data-index="${t}">${B(JSON.stringify(e.steps, null, 2))}</textarea>`)}</div><small>${Math.round(e.durationMs / 6e4)} min · ${e.steps.length} timeline steps</small><div class="actions"><button data-action="session-start" data-value="${Z(e.id)}">Start locally</button><button data-action="session-invite" data-value="${Z(e.id)}">Invite member</button></div><ol>${e.steps.map((s) => `<li>${di(s.atMs)} — ${s.action}</li>`).join("")}</ol></article>`).join("")}</div><div class="panel"><h3>Current session</h3><p>${this.sessions.current ? `${this.sessions.current.id} · host ${this.sessions.current.host}` : "No active session"}</p><div class="actions"><button data-action="session-pause">Pause</button><button data-action="session-resume">Resume</button><button data-action="session-stop">Stop session</button></div></div>`;
  }
  renderSafety() {
    const e = this.store.value.accessibility, t = this.store.value.streaming, s = this.store.value.extreme, i = this.store.value.compatibility;
    return `<div class="panel extreme"><h3>Extreme Mode</h3><p>Immersive controls can be locked and the visible indicator can be hidden. The private emergency hotkey and Bondage Club safeword always remain functional and cannot be disabled remotely.</p><div class="grid two">${_("Enable Extreme Mode", q("extreme.enabled", s.enabled), "Opt-in immersive mode for this account.")}${_("Lock quick controls", q("extreme.lockQuickControls", s.lockQuickControls), "Disables the normal depth, trance and wake buttons while Extreme Mode is active.")}${_("Hide my indicator", q("extreme.hideOwnIndicator", s.hideOwnIndicator), "Hide the compact depth bar beside your character.")}${_("Allow trusted remote indicator control", q("extreme.allowRemoteIndicatorControl", s.allowRemoteIndicatorControl), "Allows people who also pass the controlIndicator permission rule to hide or reveal the indicator.")}</div></div><div class="grid two">${_("Emergency hotkey", `<input data-setting="general.emergencyHotkey" value="${Z(this.store.value.general.emergencyHotkey)}">`, "Always available and cannot be remotely disabled.")}${_("Accessibility mode", q("accessibility.enabled", e.enabled), "Apply all accessibility limits together.")}${_("Reduced motion", q("accessibility.reducedMotion", e.reducedMotion), "Disables rapid glitching and slows movement.")}${_("No flashes", q("accessibility.noFlashes", e.noFlashes), "Prevents strong flash effects.")}${_("Maximum blur", ae("accessibility.maxBlur", e.maxBlur, 0, 30, 0.5), "Accessibility cap used by visual presentation.")}${_("Maximum rotation", ae("accessibility.maxRotation", e.maxRotation, 0, 15, 0.5), "Accessibility cap for rotating presentation.")}${_("High contrast text", q("accessibility.highContrastText", e.highContrastText), "Improves readability over effects.")}${_("Streaming mode", q("streaming.enabled", t.enabled), "Hide sensitive names, member numbers and suggestion details.")}${_("Hide names", q("streaming.hideNames", t.hideNames), "Obscure character names in compatible UI.")}${_("Hide member numbers", q("streaming.hideMemberNumbers", t.hideMemberNumbers), "Obscure member IDs in compatible UI.")}${_("Hide suggestion text", q("streaming.hideSuggestionText", t.hideSuggestionText), "Avoid exposing suggestion details in streaming mode.")}${_("Replace HSC", q("compatibility.replaceHSC", i.replaceHSC), "Use SH as the primary visual hypnosis addon.")}${_("Replace LSCG Hypno", q("compatibility.replaceLSCGHypno", i.replaceLSCGHypno), "Use SH for hypnosis while other LSCG modules may remain.")}${_("Import HSC settings", q("compatibility.importHSC", i.importHSC), "One-time migration of recognized HSC triggers and sounds.")}${_("Import LSCG settings", q("compatibility.importLSCG", i.importLSCG), "One-time migration of recognized LSCG hypnosis settings.")}${_("BCX Voice integration", q("compatibility.bcxVoice", i.bcxVoice), "Recognize BCX [Voice] messages.")}${_("WCE coexistence", q("compatibility.wceCoexistence", i.wceCoexistence), "Avoid replacing WCE functions and use SDK hooks only.")}</div><div class="panel"><h3>Backup</h3><div class="actions"><button data-action="export">Export settings</button><button data-action="import">Import settings</button><button class="danger" data-action="reset">Reset SH</button></div></div>`;
  }
  renderDiagnostics() {
    return `<div class="grid two"><div class="panel"><h3>Hooks</h3><pre>${B(this.runtime.diagnostics.hooks.join(`
`) || "No hooks")}</pre></div><div class="panel"><h3>Network</h3><p>Accepted: ${this.runtime.diagnostics.networkPacketsReceived}</p><p>Rejected: ${this.runtime.diagnostics.networkPacketsRejected}</p></div><div class="panel"><h3>Conflicts</h3><pre>${B(this.runtime.diagnostics.conflicts.join(`
`) || "None")}</pre></div><div class="panel"><h3>Errors</h3><pre>${B(this.runtime.diagnostics.lastErrors.join(`
`) || "None")}</pre></div><div class="panel"><h3>Audit log</h3><pre>${B(this.runtime.getAudit().map((e) => `${new Date(e.timestamp).toLocaleTimeString()} ${e.allowed ? "ALLOW" : "DENY"} ${e.senderName}: ${e.action} ${e.detail}`).join(`
`) || "Empty")}</pre></div></div>`;
  }
  onClick(e) {
    const t = e.target.closest("button,[data-tab]");
    if (!t) return;
    const s = t.dataset.tab;
    if (s) {
      this.tab = s, this.remoteMember = void 0, this.render();
      return;
    }
    const i = t.dataset.action, r = t.dataset.value, n = Number(t.dataset.index);
    if (t.dataset.remote && this.remoteMember) {
      if (t.dataset.remote === "trigger" && r && this.network.requestTrigger(this.remoteMember, r), t.dataset.remote === "depth" && this.network.requestDepth(this.remoteMember, Number(r)), t.dataset.remote === "wake" && this.network.requestWake(this.remoteMember), t.dataset.remote === "effect" && r && this.network.requestEffect(this.remoteMember, r), t.dataset.remote === "indicator" && r && this.network.requestIndicator(this.remoteMember, r === "hide"), t.dataset.remote === "settings" && (r === "soft" && this.network.requestSettingsPatch(this.remoteMember, { effectIntensity: 0.35 }), r === "intense" && this.network.requestSettingsPatch(this.remoteMember, { effectIntensity: 0.9 }), (r === "pinky" || r === "dark") && this.network.requestSettingsPatch(this.remoteMember, { themeMode: r }), r === "lucid" && this.network.requestSettingsPatch(this.remoteMember, { lucidTrance: !0 }), r === "extreme-on" && this.network.requestSettingsPatch(this.remoteMember, { extremeEnabled: !0, lockQuickControls: !0 }), r === "extreme-off" && this.network.requestSettingsPatch(this.remoteMember, { extremeEnabled: !1 })), t.dataset.remote === "suggestion-install" && r) {
        const o = this.store.value.suggestions.find((c) => c.id === r);
        o && this.network.installSuggestion(this.remoteMember, { ...structuredClone(o), installedBy: this.runtime.memberNumber, installedByName: this.runtime.playerName, installedAt: Date.now(), uses: 0, lastUsedAt: 0 });
      }
      t.dataset.remote === "suggestion-trigger" && r && this.network.triggerSuggestion(this.remoteMember, r);
      return;
    }
    switch (i) {
      case "close":
        this.close();
        break;
      case "close-remote":
        this.remoteMember = void 0, this.tab = "remote", this.render();
        break;
      case "emergency":
        this.bus.emit("emergency.stop", { reason: "Preference emergency button" });
        break;
      case "depth":
        this.quickControlsLocked() || this.hypno.addDepth(Number(r), "preference control");
        break;
      case "trance":
        this.quickControlsLocked() || this.hypno.enterTrance(this.runtime.memberNumber, "preference control");
        break;
      case "wake":
        this.quickControlsLocked() || this.hypno.wake("preference control");
        break;
      case "preview":
        r && this.effects.previewPreset(r);
        break;
      case "trigger-add":
        this.addTrigger();
        break;
      case "trigger-delete":
        this.store.update((o) => o.triggers.splice(n, 1));
        break;
      case "suggestion-add":
        this.addSuggestion();
        break;
      case "command-add":
        this.addCommand();
        break;
      case "suggestion-select":
        this.selectedSuggestionId = r, this.render();
        break;
      case "suggestion-delete":
        r && (this.suggestions.remove(r, this.runtime.memberNumber), this.selectedSuggestionId = void 0);
        break;
      case "suggestion-test":
        r && this.suggestions.trigger(r, this.runtime.memberNumber, "test");
        break;
      case "instruction-add":
        this.editSelected((o) => o.instructions.push({ id: crypto.randomUUID(), type: "message", config: { text: "A thought drifts through your mind..." } }));
        break;
      case "instruction-delete":
        this.editSelected((o) => o.instructions.splice(n, 1));
        break;
      case "instruction-up":
        this.moveInstruction(n, n - 1);
        break;
      case "instruction-down":
        this.moveInstruction(n, n + 1);
        break;
      case "sound-add":
        this.addSound();
        break;
      case "sound-delete":
        this.store.value.audio.sounds[n]?.builtIn || this.store.update((o) => o.audio.sounds.splice(n, 1));
        break;
      case "sound-play": {
        const o = this.store.value.audio.sounds[n];
        o && this.audio.playSound(o);
        break;
      }
      case "audio-stop":
        this.audio.stopAll();
        break;
      case "audio-mute":
        this.audio.setMuted(!this.audio.isMuted);
        break;
      case "preset-save-current":
        this.saveCurrentPreset();
        break;
      case "session-add":
        this.addSession();
        break;
      case "session-delete":
        this.store.update((o) => o.sessions.splice(n, 1), !0);
        break;
      case "session-start":
        r && this.sessions.start(r);
        break;
      case "session-pause":
        this.sessions.control("pause");
        break;
      case "session-resume":
        this.sessions.control("resume");
        break;
      case "session-stop":
        this.sessions.control("stop"), this.sessions.stop("stopped manually", !0);
        break;
      case "session-invite":
        if (r) {
          const o = prompt("Member ID to invite"), c = Number(o), d = prompt("Role: hypnotist, support, viewer or subject", "subject");
          c > 0 && d && ["hypnotist", "support", "viewer", "subject"].includes(d) && this.sessions.invite(c, r, d);
        }
        break;
      case "export":
        this.downloadExport();
        break;
      case "import":
        this.importSettings();
        break;
      case "reset":
        confirm("Reset all SkyzHypno settings?") && (localStorage.removeItem(`SkyzHypno_${this.runtime.memberNumber}_backup`), this.runtime.player.ExtensionSettings.SkyzHypno = "", location.reload());
        break;
    }
    this.root && this.render();
  }
  onChange(e) {
    this.applyField(e.target);
  }
  onInput(e) {
    const t = e.target;
    t.type === "range" && this.applyField(t, !1);
  }
  applyField(e, t = !0) {
    const s = e.dataset.setting;
    if (s) {
      let i = e instanceof HTMLInputElement && e.type === "checkbox" ? e.checked : e.value;
      e.dataset.array !== void 0 && (i = String(i).split(/\n+/).map((r) => r.trim()).filter(Boolean)), e.dataset.numberArray !== void 0 && (i = Je(String(i))), e instanceof HTMLInputElement && ["number", "range"].includes(e.type) && (i = Number(e.value)), this.store.update((r) => {
        li(r, s, i), s === "theme.mode" && ui(r, String(i));
      });
    }
    e.dataset.trigger && this.updateTrigger(e), e.dataset.suggestion && this.updateSuggestion(e), e.dataset.instruction && this.updateInstruction(e), e.dataset.sound && this.updateSound(e), e.dataset.capability && this.updateCapability(e), e.dataset.resistanceCapability && this.updateResistanceCapability(e), e.dataset.session && this.updateSession(e), t && this.root && this.render();
  }
  updateTrigger(e) {
    const t = Number(e.dataset.index), s = e.dataset.trigger;
    this.store.update((i) => {
      const r = i.triggers[t];
      if (!r) return;
      let n = e instanceof HTMLInputElement && e.type === "checkbox" ? e.checked : e.value;
      ["minDepth", "maxDepth", "depthDelta", "delayMs", "requiredRepeats", "repeatWindowMs", "cooldownMs", "expiresAt"].includes(s) && (n = n === "" ? void 0 : Number(n)), s === "allowedMemberIds" && (n = Je(n)), s === "source" && (n = String(n).split(/[\s,]+/).filter((o) => ["chat", "whisper", "voice", "activity", "item", "api", "remote"].includes(o))), s === "comboPhrases" && (n = String(n).split("|").map((o) => o.trim()).filter(Boolean)), ["effectPresetId", "suggestionId"].includes(s) && n === "" && (n = void 0), r[s] = n;
    });
  }
  updateSuggestion(e) {
    const t = e.dataset.suggestion;
    this.editSelected((s) => {
      let i = e instanceof HTMLInputElement && e.type === "checkbox" ? e.checked : e.value;
      ["requiredDepth", "cooldownMs", "maxUses", "expiresAt"].includes(t) && (i = i === "" ? void 0 : Number(i)), s[t] = i;
    });
  }
  updateInstruction(e) {
    const t = Number(e.dataset.index), s = e.dataset.instruction;
    this.editSelected((i) => {
      const r = i.instructions[t];
      if (r && (s === "type" && (r.type = e.value), s === "config"))
        try {
          r.config = JSON.parse(e.value), e.classList.remove("invalid");
        } catch {
          e.classList.add("invalid");
        }
    });
  }
  updateSound(e) {
    const t = Number(e.dataset.index), s = e.dataset.sound;
    this.store.update((i) => {
      const r = i.audio.sounds[t];
      if (!r) return;
      let n = e instanceof HTMLInputElement && e.type === "checkbox" ? e.checked : e.value;
      ["volume", "playbackRate", "pan", "reverb", "echo"].includes(s) && (n = Number(n)), r[s] = n;
    });
  }
  updateCapability(e) {
    const t = e.dataset.capability;
    this.store.update((s) => {
      const i = s.remote.capabilities[t];
      if (!i) return;
      if (e.dataset.role) {
        const o = e.dataset.role;
        e.checked && !i.roles.includes(o) && i.roles.push(o), e.checked || (i.roles = i.roles.filter((c) => c !== o));
        return;
      }
      const r = e.dataset.capField;
      let n = e instanceof HTMLInputElement && e.type === "checkbox" ? e.checked : e.value;
      r === "memberIds" && (n = Je(n)), r === "minDepth" && (n = Number(n)), i[r] = n;
    });
  }
  updateResistanceCapability(e) {
    const t = e.dataset.resistanceCapability;
    this.store.update((s) => {
      const i = s.resistance.autoAcceptCapabilities;
      e.checked && !i.includes(t) && i.push(t), e.checked || (s.resistance.autoAcceptCapabilities = i.filter((r) => r !== t));
    });
  }
  updateSession(e) {
    const t = Number(e.dataset.index), s = e.dataset.session;
    this.store.update((i) => {
      const r = i.sessions[t];
      if (r)
        if (s === "durationMs") r.durationMs = Math.max(1e3, Number(e.value) || 1e3);
        else if (s === "steps")
          try {
            r.steps = JSON.parse(e.value), e.classList.remove("invalid");
          } catch {
            e.classList.add("invalid");
          }
        else r[s] = e.value;
    }, !0);
  }
  addSession() {
    const e = { id: crypto.randomUUID(), name: "New shared session", description: "Custom SH timeline", durationMs: 12e4, steps: [{ id: crypto.randomUUID(), atMs: 0, action: "effect", config: { presetId: "preset-soft-induction" } }, { id: crypto.randomUUID(), atMs: 11e4, action: "wake", config: {} }] };
    this.store.update((t) => t.sessions.push(e), !0);
  }
  addTrigger() {
    this.store.update((e) => e.triggers.push({ id: crypto.randomUUID(), name: "New trigger", phrase: "focus", kind: "deepen", enabled: !0, source: ["chat", "whisper", "voice"], minDepth: 0, maxDepth: 100, depthDelta: 10, cooldownMs: 5e3, delayMs: 0, requiredRepeats: 1, repeatWindowMs: 3e4, comboPhrases: [], allowedMemberIds: [], requireNameMention: !1, oneShot: !1 }));
  }
  addSuggestion() {
    const e = { id: crypto.randomUUID(), name: "New suggestion", description: "", trigger: "obey", installedBy: this.runtime.memberNumber, installedByName: this.runtime.playerName, installedAt: Date.now(), exclusive: !1, enabled: !0, requiredDepth: 0, cooldownMs: 5e3, maxUses: 0, uses: 0, lastUsedAt: 0, instructions: [{ id: crypto.randomUUID(), type: "message", config: { text: "A soft thought settles into place..." } }] };
    this.store.update((t) => t.suggestions.push(e), !0), this.selectedSuggestionId = e.id;
  }
  addCommand() {
    const e = prompt("Command trigger phrase", "obey")?.trim();
    if (!e) return;
    const t = prompt("What should the command make the person say or do?", "Yes, I understand.")?.trim();
    if (!t) return;
    const s = {
      id: crypto.randomUUID(),
      name: `Command: ${e}`,
      description: "Implanted hypnotic command",
      trigger: e,
      installedBy: this.runtime.memberNumber,
      installedByName: this.runtime.playerName,
      installedAt: Date.now(),
      exclusive: !1,
      enabled: !0,
      requiredDepth: 1,
      cooldownMs: 5e3,
      maxUses: 0,
      uses: 0,
      lastUsedAt: 0,
      instructions: [{ id: crypto.randomUUID(), type: "command", config: { mode: "say", text: t } }]
    };
    this.store.update((i) => i.suggestions.push(s), !0), this.selectedSuggestionId = s.id;
  }
  editSelected(e) {
    this.store.update((t) => {
      const s = t.suggestions.find((i) => i.id === this.selectedSuggestionId);
      s && e(s);
    }, !0);
  }
  moveInstruction(e, t) {
    this.editSelected((s) => {
      if (t < 0 || t >= s.instructions.length) return;
      const [i] = s.instructions.splice(e, 1);
      i && s.instructions.splice(t, 0, i);
    });
  }
  addSound() {
    this.store.update((e) => e.audio.sounds.push({ id: crypto.randomUUID(), name: "Custom sound", category: "trigger", url: "https://", enabled: !0, volume: 0.5, loop: !1, playbackRate: 1, pan: 0, reverb: 0.2, echo: 0.1, builtIn: !1 }));
  }
  saveCurrentPreset() {
    const e = prompt("Preset name", "My SH effect");
    e && this.store.update((t) => t.presets.push({ id: crypto.randomUUID(), name: e, description: "Custom effect-composer preset", effects: { ...t.effects }, theme: { ...t.theme }, durationMs: 15e3, depthDelta: 0 }));
  }
  downloadExport() {
    const e = new Blob([this.store.export()], { type: "text/plain" }), t = URL.createObjectURL(e), s = document.createElement("a");
    s.href = t, s.download = `SkyzHypno-${this.runtime.memberNumber}-${Date.now()}.sh`, s.click(), URL.revokeObjectURL(t);
  }
  importSettings() {
    const e = document.createElement("input");
    e.type = "file", e.accept = ".sh,.txt", e.addEventListener("change", async () => {
      const t = e.files?.[0];
      if (t)
        try {
          this.store.import(await t.text()), this.runtime.localMessage("Settings imported.");
        } catch (s) {
          this.runtime.localMessage(`Import failed: ${String(s)}`, "error");
        }
    }), e.click();
  }
  drawRemoteEntry() {
    const e = this.currentCharacter();
    !e?.MemberNumber || e.MemberNumber === this.runtime.memberNumber || typeof DrawButton == "function" && DrawButton(1540, 790, 410, 80, "SH Remote", "#731dff", "", "Open SkyzHypno remote controls");
  }
  currentCharacter() {
    return this.runtime.get("CurrentCharacter") ?? this.runtime.get("InformationSheetCharacter");
  }
  registerExtensionSetting() {
    if (this.extensionRegistered) return;
    const e = this.runtime.get("PreferenceRegisterExtensionSetting");
    typeof e == "function" && (e({
      Identifier: "SkyzHypno",
      ButtonText: "SkyzHypno",
      Image: "https://raw.githubusercontent.com/mystiq-skyz/skyzhypno/main/dist/icon.svg",
      load: () => {
        this.extensionContext = !0, this.open("overview");
      },
      run: () => {
        this.root || (this.extensionContext = !0, this.open("overview"));
      },
      click: () => {
      },
      exit: () => this.close(!1)
    }), this.extensionRegistered = !0);
  }
  quickControlsLocked() {
    return this.store.value.extreme.enabled && this.store.value.extreme.lockQuickControls;
  }
}
const oi = ["induction", "deepen", "trigger", "trance", "suggestion", "wake", "ambient", "heartbeat", "metronome", "glitch"], Tt = (a) => a.charAt(0).toUpperCase() + a.slice(1).replace(/([A-Z])/g, " $1"), ci = (a) => ({ overview: "Live status and quick controls.", hypnosis: "Depth, trance, decay and aftereffects.", triggers: "Words, combinations, activities and BCX voice triggers.", suggestions: "Visual flow editor for persistent suggestions.", effects: "Pinky glow and dark-creepy visual compositor.", sounds: "Built-in synthesis and editable URL sounds.", restrictions: "Configurable trance and suggestion restrictions.", resistance: "Interactive minigame and automatic-accept whitelist.", remote: "Receiver-validated multiplayer permissions.", presets: "Reusable audiovisual scenes.", sessions: "Timed local and shared multiplayer timelines.", safety: "Emergency, accessibility, compatibility and backups.", diagnostics: "Hooks, conflicts, networking, errors and audit log." })[a], Ke = (a, e, t) => `<button class="panel card" data-tab="${t}"><b>${a}</b><span>${e}</span></button>`, _ = (a, e, t) => `<label class="panel control"><span><b>${a}</b><small>${t}</small></span>${e}</label>`, A = (a, e) => `<label class="small"><span>${a}</span>${e}</label>`, q = (a, e) => `<input type="checkbox" data-setting="${a}" ${e ? "checked" : ""}>`, me = (a, e, t, s, i) => `<input type="range" data-setting="${a}" value="${e}" min="${t}" max="${s}" step="${i}">`, ae = (a, e, t, s, i) => `<input type="number" data-setting="${a}" value="${e}" min="${t}" max="${s}" step="${i}">`, Je = (a) => [...new Set(a.split(/[,\s]+/).map(Number).filter((e) => Number.isInteger(e) && e > 0))], di = (a) => `${Math.floor(a / 6e4)}:${String(Math.floor(a / 1e3) % 60).padStart(2, "0")}`;
function li(a, e, t) {
  const s = e.split("."), i = s.pop();
  let r = a;
  for (const n of s) r = r[n];
  r[i] = t;
}
function B(a) {
  const e = document.createElement("span");
  return e.textContent = a, e.innerHTML;
}
const Z = (a) => B(a).replaceAll('"', "&quot;");
function ui(a, e) {
  const s = {
    pinky: { primary: "#ff58bd", secondary: "#b45cff", accent: "#ffd0f0", background: "#12051a", glow: 0.95, darkness: 0.42 },
    dark: { primary: "#ff2f72", secondary: "#3b0b66", accent: "#a868ff", background: "#030106", glow: 0.62, darkness: 0.9 },
    hybrid: { primary: "#ff58bd", secondary: "#731dff", accent: "#ff9fe2", background: "#09030f", glow: 0.8, darkness: 0.65 }
  }[e];
  s && Object.assign(a.theme, s);
}
const hi = `
#sh-preferences{position:fixed;inset:0;z-index:999999;background:rgba(2,0,6,.76);backdrop-filter:blur(12px);font:14px/1.45 Inter,ui-rounded,system-ui;color:#fff;pointer-events:auto}
#sh-preferences *{box-sizing:border-box}#sh-preferences .sh-shell{display:grid;grid-template-columns:235px 1fr;width:min(1500px,96vw);height:min(900px,94vh);margin:3vh auto;border:1px solid #ff58bd55;border-radius:28px;overflow:hidden;background:linear-gradient(145deg,#15081ef2,#07040df5);box-shadow:0 0 80px #ff2f9250,inset 0 1px #ffffff18}
#sh-preferences aside{padding:20px 14px;background:#09030ecc;border-right:1px solid #ffffff12;overflow:auto}#sh-preferences .brand{display:flex;gap:12px;align-items:center;margin:2px 8px 22px}#sh-preferences .brand>b{display:grid;place-items:center;width:44px;height:44px;border-radius:15px;background:linear-gradient(135deg,#ff58bd,#731dff);box-shadow:0 0 24px #ff58bd77;font-size:18px}#sh-preferences .brand span{font-size:17px;font-weight:800}#sh-preferences .brand small{display:block;font-size:10px;opacity:.55}
#sh-preferences nav{display:grid;gap:4px}#sh-preferences nav button,#sh-preferences .list>button{border:0;border-radius:12px;padding:9px 11px;text-align:left;background:transparent;color:#ddcee4;cursor:pointer}#sh-preferences nav button:hover,#sh-preferences nav button.active,#sh-preferences .list>button.active{background:linear-gradient(90deg,#ff58bd22,#731dff25);color:#fff;box-shadow:inset 3px 0 #ff58bd}
#sh-preferences main{display:grid;grid-template-rows:auto minmax(0,1fr);min-width:0;min-height:0;overflow:hidden}#sh-preferences header{display:flex;justify-content:space-between;align-items:center;padding:22px 28px;border-bottom:1px solid #ffffff12}#sh-preferences h1,#sh-preferences h2,#sh-preferences h3{margin:0 0 7px}#sh-preferences header p{margin:0;opacity:.62}#sh-preferences header>button{font-size:30px;border:0;background:transparent;color:#fff;cursor:pointer}#sh-preferences section{overflow-y:auto;overflow-x:hidden;min-height:0;padding:24px 28px 52px;scrollbar-gutter:stable;overscroll-behavior:contain}
#sh-preferences .panel{border:1px solid #ffffff16;border-radius:18px;background:linear-gradient(145deg,#ffffff0c,#ffffff05);padding:18px;box-shadow:inset 0 1px #ffffff0d}#sh-preferences .grid{display:grid;gap:14px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}#sh-preferences section>.grid,#sh-preferences section>.panel,#sh-preferences section>.split{margin-bottom:18px}.stack{display:grid;gap:18px}.hero{display:flex;justify-content:space-between;align-items:center;padding:30px;border-radius:24px;background:radial-gradient(circle at 80%,#ff58bd29,transparent 30%),linear-gradient(120deg,#731dff24,#ff58bd17);margin-bottom:16px}.hero h2{font-size:34px}.pill{padding:4px 9px;border-radius:99px;background:#ff58bd25;color:#ff9fdf;text-transform:uppercase}.orb{width:120px;height:120px;border-radius:50%;background:conic-gradient(#ff58bd calc(var(--depth)*1%),#731dff22 0);box-shadow:0 0 50px #ff58bd55;position:relative}.orb:after{content:"";position:absolute;inset:12px;border-radius:50%;background:#0c0612}
#sh-preferences button{border:1px solid #ffffff18;border-radius:12px;padding:8px 12px;background:linear-gradient(135deg,#ff58bd35,#731dff35);color:#fff;cursor:pointer}#sh-preferences button:hover{border-color:#ff58bd88;box-shadow:0 0 18px #ff58bd33}#sh-preferences button.danger,#sh-preferences .danger{background:#7d123b80;color:#ffd2e3}.toolbar,.actions,.row{display:flex;gap:9px;align-items:center;flex-wrap:wrap}.toolbar{margin-bottom:14px}.row{justify-content:space-between}.control{display:flex;align-items:center;justify-content:space-between;gap:15px}.control span{display:grid}.control small,.small span{opacity:.58}.small{display:grid;gap:5px}.block input:not([type=checkbox]),.block select,.block textarea,.small input:not([type=checkbox]),.small select,.small textarea,#sh-preferences .control input:not([type=checkbox]),#sh-preferences .control select,#sh-preferences .control textarea{width:100%;background:#08040e;border:1px solid #ffffff18;border-radius:10px;color:#fff;padding:8px}#sh-preferences input[type=range]{accent-color:#ff58bd}#sh-preferences input[type=checkbox]{accent-color:#ff58bd;width:20px;height:20px}.chips{display:flex;flex-wrap:wrap;gap:7px}.chips label,.chips span{padding:6px 9px;border-radius:99px;background:#ffffff0b}.colors{display:flex;gap:12px;margin:14px 0}.colors label{display:grid;gap:5px}.colors input{width:70px;height:38px;background:none;border:0}.split{display:grid;grid-template-columns:260px 1fr;gap:14px}.list{display:flex;flex-direction:column;gap:5px;align-self:start}.list button{display:grid}.list small{opacity:.55}.flow{display:grid;gap:10px;margin:10px 0}.instruction{display:grid;grid-template-columns:32px 150px 1fr auto;gap:8px;align-items:start;padding:10px;border-radius:15px;background:#ffffff08}.instruction>span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#ff58bd44}.instruction textarea{min-height:95px;background:#050208;color:#ded0e5;border:1px solid #ffffff18;border-radius:10px;padding:8px;font-family:ui-monospace,monospace}.instruction textarea.invalid,.timeline-json.invalid{border-color:#ff3c6f}.timeline-json{min-height:240px;font-family:ui-monospace,monospace}.card{display:grid;text-align:left}.card span{opacity:.65}.icon{padding:4px 8px!important}.notice{padding:11px 13px;border-radius:12px;background:#ff58bd12;border:1px solid #ff58bd35;color:#ffd4ed}.extreme{border-color:#ff2f7266!important;background:linear-gradient(145deg,#3a071b55,#17042155)!important}#sh-preferences .panel>.grid{margin-top:12px}#sh-preferences article.panel>h3:not(:first-child),#sh-preferences .panel>h3:not(:first-child){margin-top:22px}.panel pre{white-space:pre-wrap;max-height:300px;overflow:auto;background:#050208;padding:10px;border-radius:10px}.panel ol{max-height:180px;overflow:auto;padding-left:20px}
@media(max-width:900px){#sh-preferences .sh-shell{grid-template-columns:1fr;height:100vh;width:100vw;margin:0;border-radius:0}#sh-preferences aside{display:none}.grid.two,.grid.three,.split{grid-template-columns:1fr}#sh-preferences section{padding:16px}.instruction{grid-template-columns:1fr}.hero .orb{display:none}}
`;
class pi {
  runtime = new Gt();
  lifecycle = new zt();
  bus = new Ht();
  store = new Ts(this.runtime);
  compatibility = new Ut(this.runtime, this.store);
  hypno;
  permissions;
  audio;
  restrictions;
  influence;
  resistance;
  effects;
  triggers;
  suggestions;
  network;
  sessions;
  ui;
  api;
  unloaded = !1;
  constructor() {
    this.store.load(), this.compatibility.detect(), this.compatibility.migrateOnce(), this.hypno = new Rs(this.runtime, this.store, this.bus, this.lifecycle), this.permissions = new Zt(this.runtime, () => this.store.value), this.audio = new Is(this.runtime, this.store, this.lifecycle), this.restrictions = new Os(this.runtime, this.store, this.hypno, this.lifecycle), this.influence = new Ps(this.runtime, this.store, this.hypno), this.resistance = new Ds(this.runtime, this.store, this.hypno), this.effects = new Ns(this.runtime, this.store, this.hypno, this.audio, this.bus, this.lifecycle), this.triggers = new js(this.runtime, this.store, this.hypno, this.permissions, this.bus, this.lifecycle), this.suggestions = new ri(this.runtime, this.store, this.hypno, this.influence, this.resistance, this.effects, this.audio, this.restrictions, this.permissions, this.bus, this.lifecycle), this.network = new Ks(this.runtime, this.store, this.hypno, this.permissions, this.effects, this.triggers, this.suggestions, this.bus, this.lifecycle), this.sessions = new ei(this.runtime, this.store, this.hypno, this.effects, this.audio, this.suggestions, this.restrictions, this.network, this.bus, this.lifecycle), this.ui = new ni(this.runtime, this.store, this.hypno, this.effects, this.audio, this.suggestions, this.network, this.sessions, this.bus, this.lifecycle), this.api = new Xs(this.runtime, this.store, this.hypno, this.triggers, this.effects, this.suggestions, this.sessions, this.ui, (e) => this.bus.emit("emergency.stop", { reason: e }), () => this.unload()), this.lifecycle.add(this.bus.on("emergency.stop", () => {
      this.restrictions.clearAll(), this.suggestions.cancelAll(), this.effects.clearPresets(), this.audio.stopAll(), this.store.value.audio.muteOnEmergency && this.audio.setMuted(!0);
    })), this.installSafetyControls(), this.network.broadcastHello(!0), this.runtime.localMessage("SkyzHypno v0.2.0 loaded.");
  }
  unload() {
    this.unloaded || (this.unloaded = !0, this.bus.emit("emergency.stop", { reason: "addon unload" }), this.store.flush(!0), this.lifecycle.stop(), this.bus.clear(), this.runtime.unload(), delete window.SkyzHypno, delete window.SH);
  }
  installSafetyControls() {
    const e = (t) => {
      mi(t, this.store.value.general.emergencyHotkey) && (t.preventDefault(), t.stopImmediatePropagation(), this.bus.emit("emergency.stop", { reason: "emergency hotkey" }));
    };
    this.lifecycle.listen(window, "keydown", e, { capture: !0 }), this.lifecycle.listen(window, "pagehide", () => this.store.flush(!0)), this.lifecycle.listen(window, "beforeunload", () => this.store.flush(!0)), this.lifecycle.interval(() => this.influence.decay(), 30 * 6e4);
  }
}
function mi(a, e) {
  const t = e.toLocaleLowerCase().split("+").map((i) => i.trim()), s = t.at(-1);
  return a.key.toLocaleLowerCase() === s && a.altKey === t.includes("alt") && a.shiftKey === t.includes("shift") && a.ctrlKey === t.includes("ctrl") && a.metaKey === t.includes("meta");
}
async function fi() {
  for (; ; ) {
    const a = globalThis.Player, e = globalThis.CurrentScreen;
    if (a?.MemberNumber && e && e !== "Login") return;
    await new Promise((t) => window.setTimeout(t, 200));
  }
}
async function gi() {
  if (!(window.SkyzHypno || window.SH))
    try {
      await fi();
      const a = new pi();
      window.SkyzHypno = a.api, window.SH = a.api;
    } catch (a) {
      console.error("[SkyzHypno] Fatal initialization error", a);
      const e = document.createElement("div");
      e.style.cssText = "position:fixed;z-index:1000000;left:10px;right:10px;top:10px;padding:14px;border-radius:12px;background:#5b0c29;color:white;font:14px system-ui", e.textContent = `SkyzHypno failed to initialize: ${a instanceof Error ? a.message : String(a)}`, document.body.appendChild(e);
    }
}
gi();
//# sourceMappingURL=skyz-hypno.es.js.map
