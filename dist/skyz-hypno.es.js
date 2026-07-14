class Lt {
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
function Tt(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Ue = { exports: {} }, dt;
function Ht() {
  return dt || (dt = 1, (function(n) {
    var e = (function() {
      var t = String.fromCharCode, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", r = {};
      function a(c, d) {
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
            return a(s, c.charAt(d));
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
          for (var d = o.compress(c), l = new Uint8Array(d.length * 2), h = 0, m = d.length; h < m; h++) {
            var S = d.charCodeAt(h);
            l[h * 2] = S >>> 8, l[h * 2 + 1] = S % 256;
          }
          return l;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function(c) {
          if (c == null)
            return o.decompress(c);
          for (var d = new Array(c.length / 2), l = 0, h = d.length; l < h; l++)
            d[l] = c[l * 2] * 256 + c[l * 2 + 1];
          var m = [];
          return d.forEach(function(S) {
            m.push(t(S));
          }), o.decompress(m.join(""));
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
            return a(i, c.charAt(d));
          }));
        },
        compress: function(c) {
          return o._compress(c, 16, function(d) {
            return t(d);
          });
        },
        _compress: function(c, d, l) {
          if (c == null) return "";
          var h, m, S = {}, I = {}, B = "", C = "", $ = "", D = 2, u = 3, y = 2, g = [], p = 0, b = 0, x;
          for (x = 0; x < c.length; x += 1)
            if (B = c.charAt(x), Object.prototype.hasOwnProperty.call(S, B) || (S[B] = u++, I[B] = !0), C = $ + B, Object.prototype.hasOwnProperty.call(S, C))
              $ = C;
            else {
              if (Object.prototype.hasOwnProperty.call(I, $)) {
                if ($.charCodeAt(0) < 256) {
                  for (h = 0; h < y; h++)
                    p = p << 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++;
                  for (m = $.charCodeAt(0), h = 0; h < 8; h++)
                    p = p << 1 | m & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, m = m >> 1;
                } else {
                  for (m = 1, h = 0; h < y; h++)
                    p = p << 1 | m, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, m = 0;
                  for (m = $.charCodeAt(0), h = 0; h < 16; h++)
                    p = p << 1 | m & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, m = m >> 1;
                }
                D--, D == 0 && (D = Math.pow(2, y), y++), delete I[$];
              } else
                for (m = S[$], h = 0; h < y; h++)
                  p = p << 1 | m & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, m = m >> 1;
              D--, D == 0 && (D = Math.pow(2, y), y++), S[C] = u++, $ = String(B);
            }
          if ($ !== "") {
            if (Object.prototype.hasOwnProperty.call(I, $)) {
              if ($.charCodeAt(0) < 256) {
                for (h = 0; h < y; h++)
                  p = p << 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++;
                for (m = $.charCodeAt(0), h = 0; h < 8; h++)
                  p = p << 1 | m & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, m = m >> 1;
              } else {
                for (m = 1, h = 0; h < y; h++)
                  p = p << 1 | m, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, m = 0;
                for (m = $.charCodeAt(0), h = 0; h < 16; h++)
                  p = p << 1 | m & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, m = m >> 1;
              }
              D--, D == 0 && (D = Math.pow(2, y), y++), delete I[$];
            } else
              for (m = S[$], h = 0; h < y; h++)
                p = p << 1 | m & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, m = m >> 1;
            D--, D == 0 && (D = Math.pow(2, y), y++);
          }
          for (m = 2, h = 0; h < y; h++)
            p = p << 1 | m & 1, b == d - 1 ? (b = 0, g.push(l(p)), p = 0) : b++, m = m >> 1;
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
          var h = [], m = 4, S = 4, I = 3, B = "", C = [], $, D, u, y, g, p, b, x = { val: l(0), position: d, index: 1 };
          for ($ = 0; $ < 3; $ += 1)
            h[$] = $;
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
            for (u = 0, g = Math.pow(2, I), p = 1; p != g; )
              y = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = d, x.val = l(x.index++)), u |= (y > 0 ? 1 : 0) * p, p <<= 1;
            switch (b = u) {
              case 0:
                for (u = 0, g = Math.pow(2, 8), p = 1; p != g; )
                  y = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = d, x.val = l(x.index++)), u |= (y > 0 ? 1 : 0) * p, p <<= 1;
                h[S++] = t(u), b = S - 1, m--;
                break;
              case 1:
                for (u = 0, g = Math.pow(2, 16), p = 1; p != g; )
                  y = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = d, x.val = l(x.index++)), u |= (y > 0 ? 1 : 0) * p, p <<= 1;
                h[S++] = t(u), b = S - 1, m--;
                break;
              case 2:
                return C.join("");
            }
            if (m == 0 && (m = Math.pow(2, I), I++), h[b])
              B = h[b];
            else if (b === S)
              B = D + D.charAt(0);
            else
              return null;
            C.push(B), h[S++] = D + B.charAt(0), m--, D = B, m == 0 && (m = Math.pow(2, I), I++);
          }
        }
      };
      return o;
    })();
    n != null ? n.exports = e : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return e;
    });
  })(Ue)), Ue.exports;
}
var qt = Ht();
const ye = /* @__PURE__ */ Tt(qt);
function lt(n) {
  if (!(typeof n != "string" || !n)) {
    for (const e of [ye.decompressFromBase64, ye.decompressFromUTF16])
      try {
        const t = e(n);
        if (t) return JSON.parse(t);
      } catch {
      }
    try {
      return JSON.parse(n);
    } catch {
      return;
    }
  }
}
const Se = (n) => Array.isArray(n) ? [...new Set(n.filter((e) => typeof e == "string" && e.trim().length > 0).map((e) => e.trim()))] : [];
class Bt {
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
    const r = Se(s.customTexts?.trigger ?? s.triggerWords ?? s.triggers), a = Se(s.customTexts?.wake ?? s.wakeWords ?? s.awakeners);
    for (const c of r) i = this.addImportedTrigger(e, c, "trigger", "HSC") || i;
    for (const c of a) i = this.addImportedTrigger(e, c, "wake", "HSC") || i;
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
    const a = typeof i.overrideWords == "string" ? i.overrideWords.split(",") : [i.trigger], o = typeof i.awakeners == "string" ? i.awakeners.split(",") : [];
    for (const c of Se(a)) r = this.addImportedTrigger(e, c, "trigger", "LSCG") || r;
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
class Ut {
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
function Zt() {
  return ut || (ut = 1, (function(n) {
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
      const a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
      function c(u) {
        o.has(u) || (o.add(u), console.warn(u));
      }
      function d(u) {
        const y = [], g = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Set();
        for (const O of S.values()) {
          const H = O.patching.get(u.name);
          if (H) {
            y.push(...H.hooks);
            for (const [N, _] of H.patches.entries()) g.has(N) && g.get(N) !== _ && c(`ModSDK: Mod '${O.name}' is patching function ${u.name} with same pattern that is already applied by different mod, but with different pattern:
Pattern:
${N}
Patch1:
${g.get(N) || ""}
Patch2:
${_}`), g.set(N, _), p.add(O.name);
          }
        }
        y.sort(((O, H) => H.priority - O.priority));
        const b = (function(O, H) {
          if (H.size === 0) return O;
          let N = O.toString().replaceAll(`\r
`, `
`);
          for (const [_, j] of H.entries()) N.includes(_) || c(`ModSDK: Patching ${O.name}: Patch ${_} not applied`), N = N.replaceAll(_, j);
          return (0, eval)(`(${N})`);
        })(u.original, g);
        let x = function(O) {
          var H, N;
          const _ = (N = (H = $.errorReporterHooks).hookChainExit) === null || N === void 0 ? void 0 : N.call(H, u.name, p), j = b.apply(this, O);
          return _?.(), j;
        };
        for (let O = y.length - 1; O >= 0; O--) {
          const H = y[O], N = x;
          x = function(_) {
            var j, F;
            const J = (F = (j = $.errorReporterHooks).hookEnter) === null || F === void 0 ? void 0 : F.call(j, u.name, H.mod), Y = H.hook.apply(this, [_, (ee) => {
              if (arguments.length !== 1 || !Array.isArray(_)) throw new Error(`Mod ${H.mod} failed to call next hook: Expected args to be array, got ${typeof ee}`);
              return N.call(this, ee);
            }]);
            return J?.(), Y;
          };
        }
        return { hooks: y, patches: g, patchesSources: p, enter: x, final: b };
      }
      function l(u, y = !1) {
        let g = a.get(u);
        if (g) y && (g.precomputed = d(g));
        else {
          let p = window;
          const b = u.split(".");
          for (let N = 0; N < b.length - 1; N++) if (p = p[b[N]], !i(p)) throw new Error(`ModSDK: Function ${u} to be patched not found; ${b.slice(0, N + 1).join(".")} is not object`);
          const x = p[b[b.length - 1]];
          if (typeof x != "function") throw new Error(`ModSDK: Function ${u} to be patched not found`);
          const O = (function(N) {
            let _ = -1;
            for (const j of s.encode(N)) {
              let F = 255 & (_ ^ j);
              for (let J = 0; J < 8; J++) F = 1 & F ? -306674912 ^ F >>> 1 : F >>> 1;
              _ = _ >>> 8 ^ F;
            }
            return ((-1 ^ _) >>> 0).toString(16).padStart(8, "0").toUpperCase();
          })(x.toString().replaceAll(`\r
`, `
`)), H = { name: u, original: x, originalHash: O };
          g = Object.assign(Object.assign({}, H), { precomputed: d(H), router: () => {
          }, context: p, contextProperty: b[b.length - 1] }), g.router = /* @__PURE__ */ (function(N) {
            return function(..._) {
              return N.precomputed.enter.apply(this, [_]);
            };
          })(g), a.set(u, g), p[g.contextProperty] = g.router;
        }
        return g;
      }
      function h() {
        for (const u of a.values()) u.precomputed = d(u);
      }
      function m() {
        const u = /* @__PURE__ */ new Map();
        for (const [y, g] of a) u.set(y, { name: y, original: g.original, originalHash: g.originalHash, sdkEntrypoint: g.router, currentEntrypoint: g.context[g.contextProperty], hookedByMods: r(g.precomputed.hooks.map(((p) => p.mod))), patchedByMods: Array.from(g.precomputed.patchesSources) });
        return u;
      }
      const S = /* @__PURE__ */ new Map();
      function I(u) {
        S.get(u.name) !== u && t(`Failed to unload mod '${u.name}': Not registered`), S.delete(u.name), u.loaded = !1, h();
      }
      function B(u, y) {
        u && typeof u == "object" || t("Failed to register mod: Expected info object, got " + typeof u), typeof u.name == "string" && u.name || t("Failed to register mod: Expected name to be non-empty string, got " + typeof u.name);
        let g = `'${u.name}'`;
        typeof u.fullName == "string" && u.fullName || t(`Failed to register mod ${g}: Expected fullName to be non-empty string, got ${typeof u.fullName}`), g = `'${u.fullName} (${u.name})'`, typeof u.version != "string" && t(`Failed to register mod ${g}: Expected version to be string, got ${typeof u.version}`), u.repository || (u.repository = void 0), u.repository !== void 0 && typeof u.repository != "string" && t(`Failed to register mod ${g}: Expected repository to be undefined or string, got ${typeof u.version}`), y == null && (y = {}), y && typeof y == "object" || t(`Failed to register mod ${g}: Expected options to be undefined or object, got ${typeof y}`);
        const p = y.allowReplace === !0, b = S.get(u.name);
        b && (b.allowReplace && p || t(`Refusing to load mod ${g}: it is already loaded and doesn't allow being replaced.
Was the mod loaded multiple times?`), I(b));
        const x = (_) => {
          let j = N.patching.get(_.name);
          return j || (j = { hooks: [], patches: /* @__PURE__ */ new Map() }, N.patching.set(_.name, j)), j;
        }, O = (_, j) => (...F) => {
          var J, Y;
          const ee = (Y = (J = $.errorReporterHooks).apiEndpointEnter) === null || Y === void 0 ? void 0 : Y.call(J, _, N.name);
          N.loaded || t(`Mod ${g} attempted to call SDK function after being unloaded`);
          const Ee = j(...F);
          return ee?.(), Ee;
        }, H = { unload: O("unload", (() => I(N))), hookFunction: O("hookFunction", ((_, j, F) => {
          typeof _ == "string" && _ || t(`Mod ${g} failed to patch a function: Expected function name string, got ${typeof _}`);
          const J = l(_), Y = x(J);
          typeof j != "number" && t(`Mod ${g} failed to hook function '${_}': Expected priority number, got ${typeof j}`), typeof F != "function" && t(`Mod ${g} failed to hook function '${_}': Expected hook function, got ${typeof F}`);
          const ee = { mod: N.name, priority: j, hook: F };
          return Y.hooks.push(ee), h(), () => {
            const Ee = Y.hooks.indexOf(ee);
            Ee >= 0 && (Y.hooks.splice(Ee, 1), h());
          };
        })), patchFunction: O("patchFunction", ((_, j) => {
          typeof _ == "string" && _ || t(`Mod ${g} failed to patch a function: Expected function name string, got ${typeof _}`);
          const F = l(_), J = x(F);
          i(j) || t(`Mod ${g} failed to patch function '${_}': Expected patches object, got ${typeof j}`);
          for (const [Y, ee] of Object.entries(j)) typeof ee == "string" ? J.patches.set(Y, ee) : ee === null ? J.patches.delete(Y) : t(`Mod ${g} failed to patch function '${_}': Invalid format of patch '${Y}'`);
          h();
        })), removePatches: O("removePatches", ((_) => {
          typeof _ == "string" && _ || t(`Mod ${g} failed to patch a function: Expected function name string, got ${typeof _}`);
          const j = l(_);
          x(j).patches.clear(), h();
        })), callOriginal: O("callOriginal", ((_, j, F) => {
          typeof _ == "string" && _ || t(`Mod ${g} failed to call a function: Expected function name string, got ${typeof _}`);
          const J = l(_);
          return Array.isArray(j) || t(`Mod ${g} failed to call a function: Expected args array, got ${typeof j}`), J.original.apply(F ?? globalThis, j);
        })), getOriginalHash: O("getOriginalHash", ((_) => (typeof _ == "string" && _ || t(`Mod ${g} failed to get hash: Expected function name string, got ${typeof _}`), l(_).originalHash))) }, N = { name: u.name, fullName: u.fullName, version: u.version, repository: u.repository, allowReplace: p, api: H, loaded: !0, patching: /* @__PURE__ */ new Map() };
        return S.set(u.name, N), Object.freeze(H);
      }
      function C() {
        const u = [];
        for (const y of S.values()) u.push({ name: y.name, fullName: y.fullName, version: y.version, repository: y.repository });
        return u;
      }
      let $;
      const D = window.bcModSdk === void 0 ? window.bcModSdk = (function() {
        const u = { version: e, apiVersion: 1, registerMod: B, getModsInfo: C, getPatchingInfo: m, errorReporterHooks: Object.seal({ apiEndpointEnter: null, hookEnter: null, hookChainExit: null }) };
        return $ = u, Object.freeze(u);
      })() : (i(window.bcModSdk) || t("Failed to init Mod SDK: Name already in use"), window.bcModSdk.apiVersion !== 1 && t(`Failed to init Mod SDK: Different version already loaded ('1.2.0' vs '${window.bcModSdk.version}')`), window.bcModSdk.version !== e && alert(`Mod SDK warning: Loading different but compatible versions ('1.2.0' vs '${window.bcModSdk.version}')
One of mods you are using is using an old version of SDK. It will work for now but please inform author to update`), window.bcModSdk);
      return Object.defineProperty(n, "__esModule", { value: !0 }), n.default = D, D;
    })();
  })(Ze)), Ze;
}
var Ft = Zt();
const Vt = /* @__PURE__ */ Tt(Ft);
class Wt {
  sdk = Vt.registerMod({
    name: "SkyzHypno",
    fullName: "SkyzHypno",
    version: "0.1.0",
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
var L;
(function(n) {
  n.assertEqual = (i) => {
  };
  function e(i) {
  }
  n.assertIs = e;
  function t(i) {
    throw new Error();
  }
  n.assertNever = t, n.arrayToEnum = (i) => {
    const r = {};
    for (const a of i)
      r[a] = a;
    return r;
  }, n.getValidEnumValues = (i) => {
    const r = n.objectKeys(i).filter((o) => typeof i[i[o]] != "number"), a = {};
    for (const o of r)
      a[o] = i[o];
    return n.objectValues(a);
  }, n.objectValues = (i) => n.objectKeys(i).map(function(r) {
    return i[r];
  }), n.objectKeys = typeof Object.keys == "function" ? (i) => Object.keys(i) : (i) => {
    const r = [];
    for (const a in i)
      Object.prototype.hasOwnProperty.call(i, a) && r.push(a);
    return r;
  }, n.find = (i, r) => {
    for (const a of i)
      if (r(a))
        return a;
  }, n.isInteger = typeof Number.isInteger == "function" ? (i) => Number.isInteger(i) : (i) => typeof i == "number" && Number.isFinite(i) && Math.floor(i) === i;
  function s(i, r = " | ") {
    return i.map((a) => typeof a == "string" ? `'${a}'` : a).join(r);
  }
  n.joinValues = s, n.jsonStringifyReplacer = (i, r) => typeof r == "bigint" ? r.toString() : r;
})(L || (L = {}));
var ht;
(function(n) {
  n.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(ht || (ht = {}));
const w = L.arrayToEnum([
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
]), de = (n) => {
  switch (typeof n) {
    case "undefined":
      return w.undefined;
    case "string":
      return w.string;
    case "number":
      return Number.isNaN(n) ? w.nan : w.number;
    case "boolean":
      return w.boolean;
    case "function":
      return w.function;
    case "bigint":
      return w.bigint;
    case "symbol":
      return w.symbol;
    case "object":
      return Array.isArray(n) ? w.array : n === null ? w.null : n.then && typeof n.then == "function" && n.catch && typeof n.catch == "function" ? w.promise : typeof Map < "u" && n instanceof Map ? w.map : typeof Set < "u" && n instanceof Set ? w.set : typeof Date < "u" && n instanceof Date ? w.date : w.object;
    default:
      return w.unknown;
  }
}, f = L.arrayToEnum([
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
class ce extends Error {
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
      for (const a of r.issues)
        if (a.code === "invalid_union")
          a.unionErrors.map(i);
        else if (a.code === "invalid_return_type")
          i(a.returnTypeError);
        else if (a.code === "invalid_arguments")
          i(a.argumentsError);
        else if (a.path.length === 0)
          s._errors.push(t(a));
        else {
          let o = s, c = 0;
          for (; c < a.path.length; ) {
            const d = a.path[c];
            c === a.path.length - 1 ? (o[d] = o[d] || { _errors: [] }, o[d]._errors.push(t(a))) : o[d] = o[d] || { _errors: [] }, o = o[d], c++;
          }
        }
    };
    return i(this), s;
  }
  static assert(e) {
    if (!(e instanceof ce))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, L.jsonStringifyReplacer, 2);
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
ce.create = (n) => new ce(n);
const Xe = (n, e) => {
  let t;
  switch (n.code) {
    case f.invalid_type:
      n.received === w.undefined ? t = "Required" : t = `Expected ${n.expected}, received ${n.received}`;
      break;
    case f.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(n.expected, L.jsonStringifyReplacer)}`;
      break;
    case f.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${L.joinValues(n.keys, ", ")}`;
      break;
    case f.invalid_union:
      t = "Invalid input";
      break;
    case f.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${L.joinValues(n.options)}`;
      break;
    case f.invalid_enum_value:
      t = `Invalid enum value. Expected ${L.joinValues(n.options)}, received '${n.received}'`;
      break;
    case f.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case f.invalid_return_type:
      t = "Invalid function return type";
      break;
    case f.invalid_date:
      t = "Invalid date";
      break;
    case f.invalid_string:
      typeof n.validation == "object" ? "includes" in n.validation ? (t = `Invalid input: must include "${n.validation.includes}"`, typeof n.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${n.validation.position}`)) : "startsWith" in n.validation ? t = `Invalid input: must start with "${n.validation.startsWith}"` : "endsWith" in n.validation ? t = `Invalid input: must end with "${n.validation.endsWith}"` : L.assertNever(n.validation) : n.validation !== "regex" ? t = `Invalid ${n.validation}` : t = "Invalid";
      break;
    case f.too_small:
      n.type === "array" ? t = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "more than"} ${n.minimum} element(s)` : n.type === "string" ? t = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "over"} ${n.minimum} character(s)` : n.type === "number" ? t = `Number must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${n.minimum}` : n.type === "date" ? t = `Date must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(n.minimum))}` : t = "Invalid input";
      break;
    case f.too_big:
      n.type === "array" ? t = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "less than"} ${n.maximum} element(s)` : n.type === "string" ? t = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "under"} ${n.maximum} character(s)` : n.type === "number" ? t = `Number must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "bigint" ? t = `BigInt must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "date" ? t = `Date must be ${n.exact ? "exactly" : n.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(n.maximum))}` : t = "Invalid input";
      break;
    case f.custom:
      t = "Invalid input";
      break;
    case f.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case f.not_multiple_of:
      t = `Number must be a multiple of ${n.multipleOf}`;
      break;
    case f.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, L.assertNever(n);
  }
  return { message: t };
};
let Gt = Xe;
function Kt() {
  return Gt;
}
const Jt = (n) => {
  const { data: e, path: t, errorMaps: s, issueData: i } = n, r = [...t, ...i.path || []], a = {
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
    o = d(a, { data: e, defaultError: o }).message;
  return {
    ...i,
    path: r,
    message: o
  };
};
function v(n, e) {
  const t = Kt(), s = Jt({
    issueData: e,
    data: n.data,
    path: n.path,
    errorMaps: [
      n.common.contextualErrorMap,
      // contextual error map is first priority
      n.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === Xe ? void 0 : Xe
      // then global default map
    ].filter((i) => !!i)
  });
  n.common.issues.push(s);
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
        return E;
      i.status === "dirty" && e.dirty(), s.push(i.value);
    }
    return { status: e.value, value: s };
  }
  static async mergeObjectAsync(e, t) {
    const s = [];
    for (const i of t) {
      const r = await i.key, a = await i.value;
      s.push({
        key: r,
        value: a
      });
    }
    return X.mergeObjectSync(e, s);
  }
  static mergeObjectSync(e, t) {
    const s = {};
    for (const i of t) {
      const { key: r, value: a } = i;
      if (r.status === "aborted" || a.status === "aborted")
        return E;
      r.status === "dirty" && e.dirty(), a.status === "dirty" && e.dirty(), r.value !== "__proto__" && (typeof a.value < "u" || i.alwaysSet) && (s[r.value] = a.value);
    }
    return { status: e.value, value: s };
  }
}
const E = Object.freeze({
  status: "aborted"
}), $e = (n) => ({ status: "dirty", value: n }), se = (n) => ({ status: "valid", value: n }), pt = (n) => n.status === "aborted", ft = (n) => n.status === "dirty", ve = (n) => n.status === "valid", De = (n) => typeof Promise < "u" && n instanceof Promise;
var k;
(function(n) {
  n.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, n.toString = (e) => typeof e == "string" ? e : e?.message;
})(k || (k = {}));
class ae {
  constructor(e, t, s, i) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = s, this._key = i;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const mt = (n, e) => {
  if (ve(e))
    return { success: !0, data: e.value };
  if (!n.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new ce(n.common.issues);
      return this._error = t, this._error;
    }
  };
};
function R(n) {
  if (!n)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: s, description: i } = n;
  if (e && (t || s))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: i } : { errorMap: (a, o) => {
    const { message: c } = n;
    return a.code === "invalid_enum_value" ? { message: c ?? o.defaultError } : typeof o.data > "u" ? { message: c ?? s ?? o.defaultError } : a.code !== "invalid_type" ? { message: o.defaultError } : { message: c ?? t ?? o.defaultError };
  }, description: i };
}
class P {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return de(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: de(e.data),
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
        parsedType: de(e.data),
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
      parsedType: de(e)
    }, i = this._parseSync({ data: e, path: s.path, parent: s });
    return mt(s, i);
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
      parsedType: de(e)
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
      parsedType: de(e)
    }, i = this._parse({ data: e, path: s.path, parent: s }), r = await (De(i) ? i : Promise.resolve(i));
    return mt(s, r);
  }
  refine(e, t) {
    const s = (i) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(i) : t;
    return this._refinement((i, r) => {
      const a = e(i), o = () => r.addIssue({
        code: f.custom,
        ...s(i)
      });
      return typeof Promise < "u" && a instanceof Promise ? a.then((c) => c ? !0 : (o(), !1)) : a ? !0 : (o(), !1);
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
    return je.create([this, e], this._def);
  }
  and(e) {
    return Le.create(this, e, this._def);
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
    return new bs({
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
    return nt.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Xt = /^c[^\s-]{8,}$/i, Yt = /^[0-9a-z]+$/, Qt = /^[0-9A-HJKMNP-TV-Z]{26}$/i, es = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, ts = /^[a-z0-9_-]{21}$/i, ss = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, is = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, rs = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, ns = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Fe;
const as = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, os = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, cs = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, ds = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, ls = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, us = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Et = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", hs = new RegExp(`^${Et}$`);
function It(n) {
  let e = "[0-5]\\d";
  n.precision ? e = `${e}\\.\\d{${n.precision}}` : n.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = n.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function ps(n) {
  return new RegExp(`^${It(n)}$`);
}
function fs(n) {
  let e = `${Et}T${It(n)}`;
  const t = [];
  return t.push(n.local ? "Z?" : "Z"), n.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function ms(n, e) {
  return !!((e === "v4" || !e) && as.test(n) || (e === "v6" || !e) && cs.test(n));
}
function gs(n, e) {
  if (!ss.test(n))
    return !1;
  try {
    const [t] = n.split("."), s = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), i = JSON.parse(atob(s));
    return !(typeof i != "object" || i === null || "typ" in i && i?.typ !== "JWT" || !i.alg || e && i.alg !== e);
  } catch {
    return !1;
  }
}
function ys(n, e) {
  return !!((e === "v4" || !e) && os.test(n) || (e === "v6" || !e) && ds.test(n));
}
class oe extends P {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== w.string) {
      const r = this._getOrReturnCtx(e);
      return v(r, {
        code: f.invalid_type,
        expected: w.string,
        received: r.parsedType
      }), E;
    }
    const s = new X();
    let i;
    for (const r of this._def.checks)
      if (r.kind === "min")
        e.data.length < r.value && (i = this._getOrReturnCtx(e, i), v(i, {
          code: f.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), s.dirty());
      else if (r.kind === "max")
        e.data.length > r.value && (i = this._getOrReturnCtx(e, i), v(i, {
          code: f.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), s.dirty());
      else if (r.kind === "length") {
        const a = e.data.length > r.value, o = e.data.length < r.value;
        (a || o) && (i = this._getOrReturnCtx(e, i), a ? v(i, {
          code: f.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }) : o && v(i, {
          code: f.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }), s.dirty());
      } else if (r.kind === "email")
        rs.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "email",
          code: f.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "emoji")
        Fe || (Fe = new RegExp(ns, "u")), Fe.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "emoji",
          code: f.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "uuid")
        es.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "uuid",
          code: f.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "nanoid")
        ts.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "nanoid",
          code: f.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "cuid")
        Xt.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "cuid",
          code: f.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "cuid2")
        Yt.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "cuid2",
          code: f.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "ulid")
        Qt.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
          validation: "ulid",
          code: f.invalid_string,
          message: r.message
        }), s.dirty());
      else if (r.kind === "url")
        try {
          new URL(e.data);
        } catch {
          i = this._getOrReturnCtx(e, i), v(i, {
            validation: "url",
            code: f.invalid_string,
            message: r.message
          }), s.dirty();
        }
      else r.kind === "regex" ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "regex",
        code: f.invalid_string,
        message: r.message
      }), s.dirty())) : r.kind === "trim" ? e.data = e.data.trim() : r.kind === "includes" ? e.data.includes(r.value, r.position) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: f.invalid_string,
        validation: { includes: r.value, position: r.position },
        message: r.message
      }), s.dirty()) : r.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : r.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : r.kind === "startsWith" ? e.data.startsWith(r.value) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: f.invalid_string,
        validation: { startsWith: r.value },
        message: r.message
      }), s.dirty()) : r.kind === "endsWith" ? e.data.endsWith(r.value) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: f.invalid_string,
        validation: { endsWith: r.value },
        message: r.message
      }), s.dirty()) : r.kind === "datetime" ? fs(r).test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: f.invalid_string,
        validation: "datetime",
        message: r.message
      }), s.dirty()) : r.kind === "date" ? hs.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: f.invalid_string,
        validation: "date",
        message: r.message
      }), s.dirty()) : r.kind === "time" ? ps(r).test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        code: f.invalid_string,
        validation: "time",
        message: r.message
      }), s.dirty()) : r.kind === "duration" ? is.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "duration",
        code: f.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "ip" ? ms(e.data, r.version) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "ip",
        code: f.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "jwt" ? gs(e.data, r.alg) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "jwt",
        code: f.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "cidr" ? ys(e.data, r.version) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "cidr",
        code: f.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "base64" ? ls.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "base64",
        code: f.invalid_string,
        message: r.message
      }), s.dirty()) : r.kind === "base64url" ? us.test(e.data) || (i = this._getOrReturnCtx(e, i), v(i, {
        validation: "base64url",
        code: f.invalid_string,
        message: r.message
      }), s.dirty()) : L.assertNever(r);
    return { status: s.value, value: e.data };
  }
  _regex(e, t, s) {
    return this.refinement((i) => e.test(i), {
      validation: t,
      code: f.invalid_string,
      ...k.errToObj(s)
    });
  }
  _addCheck(e) {
    return new oe({
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
    return new oe({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new oe({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new oe({
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
oe.create = (n) => new oe({
  checks: [],
  typeName: T.ZodString,
  coerce: n?.coerce ?? !1,
  ...R(n)
});
function vs(n, e) {
  const t = (n.toString().split(".")[1] || "").length, s = (e.toString().split(".")[1] || "").length, i = t > s ? t : s, r = Number.parseInt(n.toFixed(i).replace(".", "")), a = Number.parseInt(e.toFixed(i).replace(".", ""));
  return r % a / 10 ** i;
}
class be extends P {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== w.number) {
      const r = this._getOrReturnCtx(e);
      return v(r, {
        code: f.invalid_type,
        expected: w.number,
        received: r.parsedType
      }), E;
    }
    let s;
    const i = new X();
    for (const r of this._def.checks)
      r.kind === "int" ? L.isInteger(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
        code: f.invalid_type,
        expected: "integer",
        received: "float",
        message: r.message
      }), i.dirty()) : r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (s = this._getOrReturnCtx(e, s), v(s, {
        code: f.too_small,
        minimum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), i.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (s = this._getOrReturnCtx(e, s), v(s, {
        code: f.too_big,
        maximum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), i.dirty()) : r.kind === "multipleOf" ? vs(e.data, r.value) !== 0 && (s = this._getOrReturnCtx(e, s), v(s, {
        code: f.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), i.dirty()) : r.kind === "finite" ? Number.isFinite(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
        code: f.not_finite,
        message: r.message
      }), i.dirty()) : L.assertNever(r);
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
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && L.isInteger(e.value));
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
be.create = (n) => new be({
  checks: [],
  typeName: T.ZodNumber,
  coerce: n?.coerce || !1,
  ...R(n)
});
class Ce extends P {
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
        code: f.too_small,
        type: "bigint",
        minimum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), i.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (s = this._getOrReturnCtx(e, s), v(s, {
        code: f.too_big,
        type: "bigint",
        maximum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), i.dirty()) : r.kind === "multipleOf" ? e.data % r.value !== BigInt(0) && (s = this._getOrReturnCtx(e, s), v(s, {
        code: f.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), i.dirty()) : L.assertNever(r);
    return { status: i.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return v(t, {
      code: f.invalid_type,
      expected: w.bigint,
      received: t.parsedType
    }), E;
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
    return new Ce({
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
    return new Ce({
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
Ce.create = (n) => new Ce({
  checks: [],
  typeName: T.ZodBigInt,
  coerce: n?.coerce ?? !1,
  ...R(n)
});
class Ye extends P {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== w.boolean) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: f.invalid_type,
        expected: w.boolean,
        received: s.parsedType
      }), E;
    }
    return se(e.data);
  }
}
Ye.create = (n) => new Ye({
  typeName: T.ZodBoolean,
  coerce: n?.coerce || !1,
  ...R(n)
});
class Oe extends P {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== w.date) {
      const r = this._getOrReturnCtx(e);
      return v(r, {
        code: f.invalid_type,
        expected: w.date,
        received: r.parsedType
      }), E;
    }
    if (Number.isNaN(e.data.getTime())) {
      const r = this._getOrReturnCtx(e);
      return v(r, {
        code: f.invalid_date
      }), E;
    }
    const s = new X();
    let i;
    for (const r of this._def.checks)
      r.kind === "min" ? e.data.getTime() < r.value && (i = this._getOrReturnCtx(e, i), v(i, {
        code: f.too_small,
        message: r.message,
        inclusive: !0,
        exact: !1,
        minimum: r.value,
        type: "date"
      }), s.dirty()) : r.kind === "max" ? e.data.getTime() > r.value && (i = this._getOrReturnCtx(e, i), v(i, {
        code: f.too_big,
        message: r.message,
        inclusive: !0,
        exact: !1,
        maximum: r.value,
        type: "date"
      }), s.dirty()) : L.assertNever(r);
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
Oe.create = (n) => new Oe({
  checks: [],
  coerce: n?.coerce || !1,
  typeName: T.ZodDate,
  ...R(n)
});
class gt extends P {
  _parse(e) {
    if (this._getType(e) !== w.symbol) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: f.invalid_type,
        expected: w.symbol,
        received: s.parsedType
      }), E;
    }
    return se(e.data);
  }
}
gt.create = (n) => new gt({
  typeName: T.ZodSymbol,
  ...R(n)
});
class yt extends P {
  _parse(e) {
    if (this._getType(e) !== w.undefined) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: f.invalid_type,
        expected: w.undefined,
        received: s.parsedType
      }), E;
    }
    return se(e.data);
  }
}
yt.create = (n) => new yt({
  typeName: T.ZodUndefined,
  ...R(n)
});
class vt extends P {
  _parse(e) {
    if (this._getType(e) !== w.null) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: f.invalid_type,
        expected: w.null,
        received: s.parsedType
      }), E;
    }
    return se(e.data);
  }
}
vt.create = (n) => new vt({
  typeName: T.ZodNull,
  ...R(n)
});
class Qe extends P {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return se(e.data);
  }
}
Qe.create = (n) => new Qe({
  typeName: T.ZodAny,
  ...R(n)
});
class et extends P {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return se(e.data);
  }
}
et.create = (n) => new et({
  typeName: T.ZodUnknown,
  ...R(n)
});
class pe extends P {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return v(t, {
      code: f.invalid_type,
      expected: w.never,
      received: t.parsedType
    }), E;
  }
}
pe.create = (n) => new pe({
  typeName: T.ZodNever,
  ...R(n)
});
class bt extends P {
  _parse(e) {
    if (this._getType(e) !== w.undefined) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: f.invalid_type,
        expected: w.void,
        received: s.parsedType
      }), E;
    }
    return se(e.data);
  }
}
bt.create = (n) => new bt({
  typeName: T.ZodVoid,
  ...R(n)
});
class ne extends P {
  _parse(e) {
    const { ctx: t, status: s } = this._processInputParams(e), i = this._def;
    if (t.parsedType !== w.array)
      return v(t, {
        code: f.invalid_type,
        expected: w.array,
        received: t.parsedType
      }), E;
    if (i.exactLength !== null) {
      const a = t.data.length > i.exactLength.value, o = t.data.length < i.exactLength.value;
      (a || o) && (v(t, {
        code: a ? f.too_big : f.too_small,
        minimum: o ? i.exactLength.value : void 0,
        maximum: a ? i.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: i.exactLength.message
      }), s.dirty());
    }
    if (i.minLength !== null && t.data.length < i.minLength.value && (v(t, {
      code: f.too_small,
      minimum: i.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.minLength.message
    }), s.dirty()), i.maxLength !== null && t.data.length > i.maxLength.value && (v(t, {
      code: f.too_big,
      maximum: i.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.maxLength.message
    }), s.dirty()), t.common.async)
      return Promise.all([...t.data].map((a, o) => i.type._parseAsync(new ae(t, a, t.path, o)))).then((a) => X.mergeArray(s, a));
    const r = [...t.data].map((a, o) => i.type._parseSync(new ae(t, a, t.path, o)));
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
ne.create = (n, e) => new ne({
  type: n,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: T.ZodArray,
  ...R(e)
});
function ge(n) {
  if (n instanceof V) {
    const e = {};
    for (const t in n.shape) {
      const s = n.shape[t];
      e[t] = ue.create(ge(s));
    }
    return new V({
      ...n._def,
      shape: () => e
    });
  } else return n instanceof ne ? new ne({
    ...n._def,
    type: ge(n.element)
  }) : n instanceof ue ? ue.create(ge(n.unwrap())) : n instanceof ke ? ke.create(ge(n.unwrap())) : n instanceof me ? me.create(n.items.map((e) => ge(e))) : n;
}
class V extends P {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = L.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== w.object) {
      const d = this._getOrReturnCtx(e);
      return v(d, {
        code: f.invalid_type,
        expected: w.object,
        received: d.parsedType
      }), E;
    }
    const { status: s, ctx: i } = this._processInputParams(e), { shape: r, keys: a } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof pe && this._def.unknownKeys === "strip"))
      for (const d in i.data)
        a.includes(d) || o.push(d);
    const c = [];
    for (const d of a) {
      const l = r[d], h = i.data[d];
      c.push({
        key: { status: "valid", value: d },
        value: l._parse(new ae(i, h, i.path, d)),
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
          code: f.unrecognized_keys,
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
            new ae(i, h, i.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in i.data
        });
      }
    }
    return i.common.async ? Promise.resolve().then(async () => {
      const d = [];
      for (const l of c) {
        const h = await l.key, m = await l.value;
        d.push({
          key: h,
          value: m,
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
    return k.errToObj, new V({
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
    return new V({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new V({
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
    return new V({
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
    return new V({
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
    return new V({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const s of L.objectKeys(e))
      e[s] && this.shape[s] && (t[s] = this.shape[s]);
    return new V({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const s of L.objectKeys(this.shape))
      e[s] || (t[s] = this.shape[s]);
    return new V({
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
    for (const s of L.objectKeys(this.shape)) {
      const i = this.shape[s];
      e && !e[s] ? t[s] = i : t[s] = i.optional();
    }
    return new V({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const s of L.objectKeys(this.shape))
      if (e && !e[s])
        t[s] = this.shape[s];
      else {
        let r = this.shape[s];
        for (; r instanceof ue; )
          r = r._def.innerType;
        t[s] = r;
      }
    return new V({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Nt(L.objectKeys(this.shape));
  }
}
V.create = (n, e) => new V({
  shape: () => n,
  unknownKeys: "strip",
  catchall: pe.create(),
  typeName: T.ZodObject,
  ...R(e)
});
V.strictCreate = (n, e) => new V({
  shape: () => n,
  unknownKeys: "strict",
  catchall: pe.create(),
  typeName: T.ZodObject,
  ...R(e)
});
V.lazycreate = (n, e) => new V({
  shape: n,
  unknownKeys: "strip",
  catchall: pe.create(),
  typeName: T.ZodObject,
  ...R(e)
});
class je extends P {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), s = this._def.options;
    function i(r) {
      for (const o of r)
        if (o.result.status === "valid")
          return o.result;
      for (const o of r)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const a = r.map((o) => new ce(o.ctx.common.issues));
      return v(t, {
        code: f.invalid_union,
        unionErrors: a
      }), E;
    }
    if (t.common.async)
      return Promise.all(s.map(async (r) => {
        const a = {
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
            parent: a
          }),
          ctx: a
        };
      })).then(i);
    {
      let r;
      const a = [];
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
        l.status === "dirty" && !r && (r = { result: l, ctx: d }), d.common.issues.length && a.push(d.common.issues);
      }
      if (r)
        return t.common.issues.push(...r.ctx.common.issues), r.result;
      const o = a.map((c) => new ce(c));
      return v(t, {
        code: f.invalid_union,
        unionErrors: o
      }), E;
    }
  }
  get options() {
    return this._def.options;
  }
}
je.create = (n, e) => new je({
  options: n,
  typeName: T.ZodUnion,
  ...R(e)
});
function tt(n, e) {
  const t = de(n), s = de(e);
  if (n === e)
    return { valid: !0, data: n };
  if (t === w.object && s === w.object) {
    const i = L.objectKeys(e), r = L.objectKeys(n).filter((o) => i.indexOf(o) !== -1), a = { ...n, ...e };
    for (const o of r) {
      const c = tt(n[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      a[o] = c.data;
    }
    return { valid: !0, data: a };
  } else if (t === w.array && s === w.array) {
    if (n.length !== e.length)
      return { valid: !1 };
    const i = [];
    for (let r = 0; r < n.length; r++) {
      const a = n[r], o = e[r], c = tt(a, o);
      if (!c.valid)
        return { valid: !1 };
      i.push(c.data);
    }
    return { valid: !0, data: i };
  } else return t === w.date && s === w.date && +n == +e ? { valid: !0, data: n } : { valid: !1 };
}
class Le extends P {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e), i = (r, a) => {
      if (pt(r) || pt(a))
        return E;
      const o = tt(r.value, a.value);
      return o.valid ? ((ft(r) || ft(a)) && t.dirty(), { status: t.value, value: o.data }) : (v(s, {
        code: f.invalid_intersection_types
      }), E);
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
    ]).then(([r, a]) => i(r, a)) : i(this._def.left._parseSync({
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
Le.create = (n, e, t) => new Le({
  left: n,
  right: e,
  typeName: T.ZodIntersection,
  ...R(t)
});
class me extends P {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== w.array)
      return v(s, {
        code: f.invalid_type,
        expected: w.array,
        received: s.parsedType
      }), E;
    if (s.data.length < this._def.items.length)
      return v(s, {
        code: f.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), E;
    !this._def.rest && s.data.length > this._def.items.length && (v(s, {
      code: f.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const r = [...s.data].map((a, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new ae(s, a, s.path, o)) : null;
    }).filter((a) => !!a);
    return s.common.async ? Promise.all(r).then((a) => X.mergeArray(t, a)) : X.mergeArray(t, r);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new me({
      ...this._def,
      rest: e
    });
  }
}
me.create = (n, e) => {
  if (!Array.isArray(n))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new me({
    items: n,
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
        code: f.invalid_type,
        expected: w.object,
        received: s.parsedType
      }), E;
    const i = [], r = this._def.keyType, a = this._def.valueType;
    for (const o in s.data)
      i.push({
        key: r._parse(new ae(s, o, s.path, o)),
        value: a._parse(new ae(s, s.data[o], s.path, o)),
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
      keyType: oe.create(),
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
        code: f.invalid_type,
        expected: w.map,
        received: s.parsedType
      }), E;
    const i = this._def.keyType, r = this._def.valueType, a = [...s.data.entries()].map(([o, c], d) => ({
      key: i._parse(new ae(s, o, s.path, [d, "key"])),
      value: r._parse(new ae(s, c, s.path, [d, "value"]))
    }));
    if (s.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of a) {
          const d = await c.key, l = await c.value;
          if (d.status === "aborted" || l.status === "aborted")
            return E;
          (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of a) {
        const d = c.key, l = c.value;
        if (d.status === "aborted" || l.status === "aborted")
          return E;
        (d.status === "dirty" || l.status === "dirty") && t.dirty(), o.set(d.value, l.value);
      }
      return { status: t.value, value: o };
    }
  }
}
wt.create = (n, e, t) => new wt({
  valueType: e,
  keyType: n,
  typeName: T.ZodMap,
  ...R(t)
});
class Ae extends P {
  _parse(e) {
    const { status: t, ctx: s } = this._processInputParams(e);
    if (s.parsedType !== w.set)
      return v(s, {
        code: f.invalid_type,
        expected: w.set,
        received: s.parsedType
      }), E;
    const i = this._def;
    i.minSize !== null && s.data.size < i.minSize.value && (v(s, {
      code: f.too_small,
      minimum: i.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.minSize.message
    }), t.dirty()), i.maxSize !== null && s.data.size > i.maxSize.value && (v(s, {
      code: f.too_big,
      maximum: i.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.maxSize.message
    }), t.dirty());
    const r = this._def.valueType;
    function a(c) {
      const d = /* @__PURE__ */ new Set();
      for (const l of c) {
        if (l.status === "aborted")
          return E;
        l.status === "dirty" && t.dirty(), d.add(l.value);
      }
      return { status: t.value, value: d };
    }
    const o = [...s.data.values()].map((c, d) => r._parse(new ae(s, c, s.path, d)));
    return s.common.async ? Promise.all(o).then((c) => a(c)) : a(o);
  }
  min(e, t) {
    return new Ae({
      ...this._def,
      minSize: { value: e, message: k.toString(t) }
    });
  }
  max(e, t) {
    return new Ae({
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
Ae.create = (n, e) => new Ae({
  valueType: n,
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
xt.create = (n, e) => new xt({
  getter: n,
  typeName: T.ZodLazy,
  ...R(e)
});
class st extends P {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return v(t, {
        received: t.data,
        code: f.invalid_literal,
        expected: this._def.value
      }), E;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
st.create = (n, e) => new st({
  value: n,
  typeName: T.ZodLiteral,
  ...R(e)
});
function Nt(n, e) {
  return new we({
    values: n,
    typeName: T.ZodEnum,
    ...R(e)
  });
}
class we extends P {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return v(t, {
        expected: L.joinValues(s),
        received: t.parsedType,
        code: f.invalid_type
      }), E;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), s = this._def.values;
      return v(t, {
        received: t.data,
        code: f.invalid_enum_value,
        options: s
      }), E;
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
we.create = Nt;
class kt extends P {
  _parse(e) {
    const t = L.getValidEnumValues(this._def.values), s = this._getOrReturnCtx(e);
    if (s.parsedType !== w.string && s.parsedType !== w.number) {
      const i = L.objectValues(t);
      return v(s, {
        expected: L.joinValues(i),
        received: s.parsedType,
        code: f.invalid_type
      }), E;
    }
    if (this._cache || (this._cache = new Set(L.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const i = L.objectValues(t);
      return v(s, {
        received: s.data,
        code: f.invalid_enum_value,
        options: i
      }), E;
    }
    return se(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
kt.create = (n, e) => new kt({
  values: n,
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
        code: f.invalid_type,
        expected: w.promise,
        received: t.parsedType
      }), E;
    const s = t.parsedType === w.promise ? t.data : Promise.resolve(t.data);
    return se(s.then((i) => this._def.type.parseAsync(i, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
qe.create = (n, e) => new qe({
  type: n,
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
      addIssue: (a) => {
        v(s, a), a.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return s.path;
      }
    };
    if (r.addIssue = r.addIssue.bind(r), i.type === "preprocess") {
      const a = i.transform(s.data, r);
      if (s.common.async)
        return Promise.resolve(a).then(async (o) => {
          if (t.value === "aborted")
            return E;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: s.path,
            parent: s
          });
          return c.status === "aborted" ? E : c.status === "dirty" || t.value === "dirty" ? $e(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return E;
        const o = this._def.schema._parseSync({
          data: a,
          path: s.path,
          parent: s
        });
        return o.status === "aborted" ? E : o.status === "dirty" || t.value === "dirty" ? $e(o.value) : o;
      }
    }
    if (i.type === "refinement") {
      const a = (o) => {
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
        return o.status === "aborted" ? E : (o.status === "dirty" && t.dirty(), a(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((o) => o.status === "aborted" ? E : (o.status === "dirty" && t.dirty(), a(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (i.type === "transform")
      if (s.common.async === !1) {
        const a = this._def.schema._parseSync({
          data: s.data,
          path: s.path,
          parent: s
        });
        if (!ve(a))
          return E;
        const o = i.transform(a.value, r);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: s.data, path: s.path, parent: s }).then((a) => ve(a) ? Promise.resolve(i.transform(a.value, r)).then((o) => ({
          status: t.value,
          value: o
        })) : E);
    L.assertNever(i);
  }
}
xe.create = (n, e, t) => new xe({
  schema: n,
  typeName: T.ZodEffects,
  effect: e,
  ...R(t)
});
xe.createWithPreprocess = (n, e, t) => new xe({
  schema: e,
  effect: { type: "preprocess", transform: n },
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
ue.create = (n, e) => new ue({
  innerType: n,
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
ke.create = (n, e) => new ke({
  innerType: n,
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
it.create = (n, e) => new it({
  innerType: n,
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
          return new ce(s.common.issues);
        },
        input: s.data
      })
    })) : {
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new ce(s.common.issues);
        },
        input: s.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
rt.create = (n, e) => new rt({
  innerType: n,
  typeName: T.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...R(e)
});
class St extends P {
  _parse(e) {
    if (this._getType(e) !== w.nan) {
      const s = this._getOrReturnCtx(e);
      return v(s, {
        code: f.invalid_type,
        expected: w.nan,
        received: s.parsedType
      }), E;
    }
    return { status: "valid", value: e.data };
  }
}
St.create = (n) => new St({
  typeName: T.ZodNaN,
  ...R(n)
});
class bs extends P {
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
        return r.status === "aborted" ? E : r.status === "dirty" ? (t.dirty(), $e(r.value)) : this._def.out._parseAsync({
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
      return i.status === "aborted" ? E : i.status === "dirty" ? (t.dirty(), {
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
class nt extends P {
  _parse(e) {
    const t = this._def.innerType._parse(e), s = (i) => (ve(i) && (i.value = Object.freeze(i.value)), i);
    return De(t) ? t.then((i) => s(i)) : s(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
nt.create = (n, e) => new nt({
  innerType: n,
  typeName: T.ZodReadonly,
  ...R(e)
});
var T;
(function(n) {
  n.ZodString = "ZodString", n.ZodNumber = "ZodNumber", n.ZodNaN = "ZodNaN", n.ZodBigInt = "ZodBigInt", n.ZodBoolean = "ZodBoolean", n.ZodDate = "ZodDate", n.ZodSymbol = "ZodSymbol", n.ZodUndefined = "ZodUndefined", n.ZodNull = "ZodNull", n.ZodAny = "ZodAny", n.ZodUnknown = "ZodUnknown", n.ZodNever = "ZodNever", n.ZodVoid = "ZodVoid", n.ZodArray = "ZodArray", n.ZodObject = "ZodObject", n.ZodUnion = "ZodUnion", n.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", n.ZodIntersection = "ZodIntersection", n.ZodTuple = "ZodTuple", n.ZodRecord = "ZodRecord", n.ZodMap = "ZodMap", n.ZodSet = "ZodSet", n.ZodFunction = "ZodFunction", n.ZodLazy = "ZodLazy", n.ZodLiteral = "ZodLiteral", n.ZodEnum = "ZodEnum", n.ZodEffects = "ZodEffects", n.ZodNativeEnum = "ZodNativeEnum", n.ZodOptional = "ZodOptional", n.ZodNullable = "ZodNullable", n.ZodDefault = "ZodDefault", n.ZodCatch = "ZodCatch", n.ZodPromise = "ZodPromise", n.ZodBranded = "ZodBranded", n.ZodPipeline = "ZodPipeline", n.ZodReadonly = "ZodReadonly";
})(T || (T = {}));
const K = oe.create, U = be.create, le = Ye.create, _t = Qe.create, ze = et.create;
pe.create;
const Te = ne.create, G = V.create;
je.create;
Le.create;
me.create;
const Rt = He.create, ws = st.create, he = we.create;
qe.create;
ue.create;
ke.create;
const Pt = 1, xs = 1, W = (n) => `${n}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`, ks = () => ({
  enabled: !1,
  roles: ["whitelist"],
  memberIds: [],
  minDepth: 0,
  requireTrance: !1,
  requireActiveHypnotizer: !1
}), Ss = [
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
  "controlSession"
], _s = () => [
  { id: W("sound"), name: "Induction shimmer", category: "induction", url: "builtin:sweep:760:180", enabled: !0, volume: 0.42, loop: !1, playbackRate: 1, pan: 0, reverb: 0.48, echo: 0.16, builtIn: !0 },
  { id: W("sound"), name: "Soft trigger chime", category: "trigger", url: "builtin:chime:523.25", enabled: !0, volume: 0.55, loop: !1, playbackRate: 1, pan: 0, reverb: 0.2, echo: 0.08, builtIn: !0 },
  { id: W("sound"), name: "Deepening pulse", category: "deepen", url: "builtin:pulse:110", enabled: !0, volume: 0.45, loop: !1, playbackRate: 1, pan: 0, reverb: 0.35, echo: 0.18, builtIn: !0 },
  { id: W("sound"), name: "Trance drop", category: "trance", url: "builtin:sweep:420:72", enabled: !0, volume: 0.65, loop: !1, playbackRate: 1, pan: 0, reverb: 0.5, echo: 0.15, builtIn: !0 },
  { id: W("sound"), name: "Suggestion bell", category: "suggestion", url: "builtin:chime:659.25", enabled: !0, volume: 0.5, loop: !1, playbackRate: 1, pan: 0.1, reverb: 0.4, echo: 0.2, builtIn: !0 },
  { id: W("sound"), name: "Wake shimmer", category: "wake", url: "builtin:sweep:180:720", enabled: !0, volume: 0.55, loop: !1, playbackRate: 1, pan: 0, reverb: 0.4, echo: 0.1, builtIn: !0 },
  { id: W("sound"), name: "Low ambient drone", category: "ambient", url: "builtin:drone:55", enabled: !0, volume: 0.18, loop: !0, playbackRate: 1, pan: 0, reverb: 0.6, echo: 0.05, builtIn: !0 },
  { id: W("sound"), name: "Heartbeat", category: "heartbeat", url: "builtin:heartbeat:68", enabled: !0, volume: 0.3, loop: !0, playbackRate: 1, pan: 0, reverb: 0.1, echo: 0, builtIn: !0 },
  { id: W("sound"), name: "Metronome", category: "metronome", url: "builtin:metronome:54", enabled: !0, volume: 0.2, loop: !0, playbackRate: 1, pan: 0, reverb: 0.05, echo: 0, builtIn: !0 },
  { id: W("sound"), name: "Dark glitch", category: "glitch", url: "builtin:noise:0.35", enabled: !0, volume: 0.2, loop: !1, playbackRate: 1, pan: 0, reverb: 0.2, echo: 0.12, builtIn: !0 }
], $s = () => [
  {
    id: W("trigger"),
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
    id: W("trigger"),
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
    id: W("trigger"),
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
], Ms = () => [
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
], Cs = () => [
  {
    id: "session-soft",
    name: "Soft Induction",
    description: "Five-minute gradual induction with a gentle wake-up.",
    durationMs: 3e5,
    steps: [
      { id: W("step"), atMs: 0, action: "sound", config: { category: "ambient", loop: !0 } },
      { id: W("step"), atMs: 5e3, action: "effect", config: { presetId: "preset-soft-induction" } },
      { id: W("step"), atMs: 3e4, action: "depth", config: { delta: 10 } },
      { id: W("step"), atMs: 75e3, action: "effect", config: { presetId: "preset-dream" } },
      { id: W("step"), atMs: 12e4, action: "depth", config: { delta: 20 } },
      { id: W("step"), atMs: 2e5, action: "effect", config: { presetId: "preset-deep-trance" } },
      { id: W("step"), atMs: 285e3, action: "wake", config: {} }
    ]
  }
];
function Ve() {
  return {
    storageVersion: xs,
    general: { enabled: !0, language: "en", emergencyHotkey: "Alt+Shift+H", showHud: !0, diagnostics: !1 },
    theme: { mode: "hybrid", primary: "#ff58bd", secondary: "#731dff", accent: "#ff9fe2", background: "#09030f", glow: 0.8, darkness: 0.65, animations: !0 },
    hypno: { enabled: !0, depth: 0, decayPerMinute: 1.5, decayDelaySeconds: 45, autoWakeMinutes: 10, aftereffectsMinutes: 2, enterTranceAt: 100, wakeToDepth: 0, lucidTrance: !1, preserveDepthAcrossRooms: !0, showPublicStatus: !0 },
    triggers: $s(),
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
    audio: { enabled: !0, masterVolume: 0.7, duckGameAudio: !1, muteOnEmergency: !0, sounds: _s() },
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
      capabilities: Object.fromEntries(Ss.map((n) => [n, ks()])),
      blockedMemberIds: [],
      auditLog: !0
    },
    suggestionPolicy: {
      enabled: !0,
      allowedInstructionTypes: ["effect", "sound", "depth", "trance", "wake", "message", "expression", "pose", "activity", "follow", "say", "strip", "restriction", "wait", "random", "condition", "memory", "aftereffect", "status"],
      allowSelfRemoval: !0,
      maxSuggestions: 100,
      requireTranceForInstall: !0,
      requireActiveHypnotizerForInstall: !0
    },
    suggestions: [],
    presets: Ms(),
    sessions: Cs(),
    accessibility: { enabled: !1, reducedMotion: !1, noFlashes: !0, maxBlur: 8, maxRotation: 2, highContrastText: !0 },
    streaming: { enabled: !1, hideMemberNumbers: !0, hideNames: !1, hideSuggestionText: !0 },
    compatibility: { replaceHSC: !0, replaceLSCGHypno: !0, importHSC: !0, importLSCG: !0, bcxVoice: !0, wceCoexistence: !0 }
  };
}
const We = G({
  storageVersion: U().int().min(1),
  general: G({ enabled: le() }).passthrough(),
  hypno: G({ depth: U().min(0).max(100) }).passthrough(),
  effects: G({ enabled: le(), intensity: U().min(0).max(1) }).passthrough(),
  audio: G({ enabled: le(), masterVolume: U().min(0).max(1), sounds: Te(_t()) }).passthrough(),
  remote: G({ enabled: le() }).passthrough(),
  suggestions: Te(_t()).max(100)
}).passthrough();
function Ie(n) {
  return n !== null && typeof n == "object" && !Array.isArray(n);
}
function at(n, e) {
  if (!Ie(n) || !Ie(e)) return e ?? n;
  const t = { ...n };
  for (const [s, i] of Object.entries(e)) {
    const r = t[s];
    t[s] = Ie(r) && Ie(i) ? at(r, i) : i;
  }
  return t;
}
class As {
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
    const e = Ve(), t = this.runtime.memberNumber, s = this.runtime.player?.ExtensionSettings?.SkyzHypno, i = localStorage.getItem(`SkyzHypno_${t}_backup`), r = [s, i].filter((a) => typeof a == "string" && a.length > 0);
    for (const a of r)
      try {
        const o = ye.decompressFromBase64(a) ?? a, c = JSON.parse(o);
        if (!We.safeParse(c).success) continue;
        return this.settings = Ge(at(e, c)), this.persistBackup(), this.settings;
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
    this.settings = Ge(at(Ve(), s)), this.notify(), this.scheduleSave(t);
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
      version: "0.1.0",
      enabled: this.settings.general.enabled,
      theme: this.settings.theme.mode,
      remote: this.settings.remote.enabled
    }, this.runtime.syncOnlineSettings());
  }
  notify() {
    for (const e of this.listeners) e(this.settings);
  }
}
function Ge(n) {
  n.hypno.depth = Q(n.hypno.depth, 0, 100), n.effects.intensity = Q(n.effects.intensity, 0, 1), n.audio.masterVolume = Q(n.audio.masterVolume, 0, 1), n.suggestions = n.suggestions.slice(0, 100), n.triggers = n.triggers.slice(0, 200), n.influence = n.influence.slice(0, 500);
  for (const e of n.audio.sounds)
    e.volume = Q(e.volume, 0, 1), e.playbackRate = Q(e.playbackRate, 0.25, 4), e.pan = Q(e.pan, -1, 1), e.echo = Q(e.echo, 0, 1), e.reverb = Q(e.reverb, 0, 1);
  return n;
}
const Q = (n, e, t) => Math.min(t, Math.max(e, Number.isFinite(n) ? n : e));
class Ts {
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
    const a = t.createGain();
    a.gain.value = e.reverb * 0.55;
    const o = t.createDelay(1);
    o.delayTime.value = 0.16;
    const c = t.createGain();
    return c.gain.value = e.echo * 0.6, s.connect(i), i.connect(r).connect(this.master), this.convolver && i.connect(this.convolver).connect(a).connect(this.master), i.connect(o).connect(c).connect(o), o.connect(this.master), { input: s, cleanup: () => {
      s.disconnect(), i.disconnect(), r.disconnect(), a.disconnect(), o.disconnect(), c.disconnect();
    } };
  }
  playBuiltin(e) {
    const t = this.ensureContext();
    if (!t) {
      this.runtime.localMessage("Built-in sounds require Web Audio support.", "warn");
      return;
    }
    const [s, i, r, a] = e.url.split(":"), o = Number(r) || 220, c = Number(a) || 110, d = this.outputChain(e), l = [], h = [];
    let m = !1;
    const S = (C, $, D = "sine", u = t.currentTime) => {
      const y = t.createOscillator(), g = t.createGain();
      y.type = D, y.frequency.setValueAtTime(C, u), g.gain.setValueAtTime(1e-4, u), g.gain.exponentialRampToValueAtTime(0.9, u + 0.02), g.gain.exponentialRampToValueAtTime(1e-4, u + $), y.connect(g).connect(d.input), y.start(u), y.stop(u + $ + 0.05), l.push(y);
    }, I = (C, $) => {
      C(), e.loop && h.push(window.setInterval(C, $));
    };
    switch (i) {
      case "chime":
        S(o, 0.8, "sine"), S(o * 1.5, 0.65, "sine", t.currentTime + 0.12);
        break;
      case "pulse":
        I(() => {
          S(o, 0.28, "sine"), S(o / 2, 0.4, "triangle", t.currentTime + 0.12);
        }, 1100);
        break;
      case "sweep": {
        const C = t.createOscillator(), $ = t.createGain();
        C.type = "sine", C.frequency.setValueAtTime(o, t.currentTime), C.frequency.exponentialRampToValueAtTime(Math.max(20, c), t.currentTime + 1.6), $.gain.setValueAtTime(1e-3, t.currentTime), $.gain.exponentialRampToValueAtTime(0.8, t.currentTime + 0.1), $.gain.exponentialRampToValueAtTime(1e-3, t.currentTime + 1.8), C.connect($).connect(d.input), C.start(), C.stop(t.currentTime + 1.9), l.push(C);
        break;
      }
      case "drone": {
        const C = t.createOscillator(), $ = t.createOscillator(), D = t.createGain();
        C.type = "sine", C.frequency.value = o, $.frequency.value = 0.12, D.gain.value = o * 0.05, $.connect(D).connect(C.frequency), C.connect(d.input), C.start(), $.start(), l.push(C, $), e.loop || (C.stop(t.currentTime + 8), $.stop(t.currentTime + 8));
        break;
      }
      case "heartbeat":
        I(() => {
          S(72, 0.1, "sine"), S(55, 0.13, "sine", t.currentTime + 0.18);
        }, Math.max(450, 6e4 / o));
        break;
      case "metronome":
        I(() => S(900, 0.06, "square"), Math.max(300, 6e4 / o));
        break;
      case "noise": {
        const C = Math.floor(t.sampleRate * Math.max(0.1, o)), $ = t.createBuffer(1, C, t.sampleRate), D = $.getChannelData(0);
        for (let y = 0; y < C; y++) D[y] = (Math.random() * 2 - 1) * (1 - y / C);
        const u = t.createBufferSource();
        u.buffer = $, u.connect(d.input), u.start(), l.push(u);
        break;
      }
      default:
        S(o, 0.5);
    }
    const B = {
      category: e.category,
      loop: e.loop,
      stop: () => {
        m || (m = !0, h.forEach((C) => window.clearInterval(C)), l.forEach((C) => {
          try {
            C.stop();
          } catch {
          }
        }), d.cleanup());
      }
    };
    this.active.add(B), e.loop || window.setTimeout(() => {
      B.stop(), this.active.delete(B);
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
    const a = {
      category: e.category,
      loop: e.loop,
      stop: () => {
        s.pause(), s.src = "", r?.disconnect(), i?.cleanup();
      }
    };
    this.active.add(a), s.addEventListener("ended", () => {
      a.stop(), this.active.delete(a);
    }, { once: !0 }), await s.play();
  }
  createImpulse(e, t, s) {
    const i = e.sampleRate * t, r = e.createBuffer(2, i, e.sampleRate);
    for (let a = 0; a < r.numberOfChannels; a++) {
      const o = r.getChannelData(a);
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
class Is {
  constructor(e, t, s, i, r, a) {
    this.runtime = e, this.store = t, this.hypno = s, this.audio = i, this.bus = r, this.state = s.snapshot, this.mount(), a.add(() => this.unmount()), a.add(r.on("state.changed", (o) => {
      this.state = o, this.updateDom();
    })), a.add(r.on("trigger.matched", ({ trigger: o }) => {
      this.flash(0.16), o.effectPresetId && this.playPreset(o.effectPresetId, void 0, !1);
    })), a.add(r.on("trance.enter", () => {
      this.applyCharacterEffects(), this.audio.playCategory("trance"), this.fragment("Deeper...");
    })), a.add(r.on("trance.wake", () => {
      this.restoreCharacterEffects(), this.clearPresets(), this.audio.playCategory("wake"), this.fragment("Wide awake");
    })), a.add(r.on("emergency.stop", () => {
      this.restoreCharacterEffects(), this.clearPresets();
    })), a.add(e.hook("DrawCharacter", 90, (o, c) => this.drawCharacterHook(o, c))), a.interval(() => this.expirePresets(), 500), a.add(t.subscribe(() => this.updateDom()));
  }
  runtime;
  store;
  hypno;
  audio;
  bus;
  root;
  canvas;
  ctx;
  hud;
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
    t.id = "sh-overlay-root", t.innerHTML = '<canvas id="sh-effect-canvas"></canvas><div class="sh-blur"></div><div class="sh-tint"></div><div class="sh-room-aura"></div><div class="sh-vignette"></div><div class="sh-tunnel"></div><div class="sh-waves"></div><div class="sh-dream"></div><div class="sh-glitch"></div><div class="sh-flash"></div><div id="sh-hud"><div class="sh-title"><span>SkyzHypno</span><span class="sh-stage">AWAKE</span></div><div class="sh-bar"><i></i></div><button type="button" data-sh-open>Settings</button> <button type="button" data-sh-stop>Stop</button></div>', document.body.appendChild(t);
    const s = t.querySelector("#sh-effect-canvas");
    this.root = t, this.canvas = s, this.ctx = s.getContext("2d") ?? void 0, this.hud = t.querySelector("#sh-hud"), t.querySelector("[data-sh-open]")?.addEventListener("click", () => this.bus.emit("settings.open", {})), t.querySelector("[data-sh-stop]")?.addEventListener("click", () => this.bus.emit("emergency.stop", { reason: "HUD stop button" })), this.resize(), window.addEventListener("resize", this.resize), this.initParticles(), this.animate(0), this.observeChat(), this.updateDom();
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
    const e = this.effectiveEffects(), t = 0.18 + this.state.depth / 100 * 0.82, s = this.state.aftereffectsUntil ? 0.28 : 1;
    return Math.max(0, Math.min(1, e.intensity * t * s));
  }
  updateDom() {
    if (!this.root) return;
    const e = this.store.value, t = this.effectiveEffects(), s = this.activePresets.map((a) => a.preset.theme).filter(Boolean).at(-1) ?? {}, i = { ...e.theme, ...s }, r = document.documentElement.style;
    if (r.setProperty("--sh-primary", i.primary), r.setProperty("--sh-secondary", i.secondary), r.setProperty("--sh-accent", i.accent), r.setProperty("--sh-bg", i.background), r.setProperty("--sh-glow", String(i.glow)), r.setProperty("--sh-darkness", String(i.darkness)), r.setProperty("--sh-intensity", String(this.effectiveIntensity())), r.setProperty("--sh-depth", String(this.state.depth)), r.setProperty("--sh-max-blur", String(e.accessibility.maxBlur)), r.setProperty("--sh-max-rotation", String(e.accessibility.maxRotation)), this.root.style.display = e.general.enabled && e.effects.enabled ? "" : "none", this.root.querySelector(".sh-blur").style.display = t.blur ? "" : "none", this.root.querySelector(".sh-tint").style.display = t.tint ? "" : "none", this.root.querySelector(".sh-room-aura").style.display = t.roomAura ? "" : "none", this.root.querySelector(".sh-vignette").style.display = t.vignette ? "" : "none", this.root.querySelector(".sh-tunnel").style.display = t.tunnelVision ? "" : "none", this.root.querySelector(".sh-waves").style.display = t.waves ? "" : "none", this.root.querySelector(".sh-dream").style.display = t.dreamMode ? "" : "none", this.root.querySelector(".sh-glitch").style.display = t.glitch ? "" : "none", this.hud) {
      this.hud.style.display = e.general.showHud ? "" : "none";
      const a = this.hud.querySelector(".sh-stage");
      a && (a.textContent = `${this.state.stage} · ${Math.round(this.state.depth)}%`);
    }
    document.documentElement.classList.toggle("sh-hide-names", t.fadeOthers && this.state.depth >= e.restrictions.threshold || e.streaming.enabled && e.streaming.hideNames), document.documentElement.classList.toggle("sh-stream-hide-members", e.streaming.enabled && e.streaming.hideMemberNumbers), document.documentElement.classList.toggle("sh-trance-body", this.state.depth > 15), document.documentElement.classList.toggle("sh-chromatic-body", t.chromatic && this.state.depth >= 40), document.documentElement.classList.toggle("sh-high-contrast", e.accessibility.highContrastText), document.documentElement.classList.toggle("sh-stream-hide-suggestions", e.streaming.enabled && e.streaming.hideSuggestionText);
  }
  animate = (e) => {
    if (this.animationFrame = requestAnimationFrame(this.animate), !this.ctx || !this.canvas || !this.store.value.effects.enabled) return;
    const t = this.ctx, s = window.innerWidth, i = window.innerHeight;
    t.clearRect(0, 0, s, i);
    const r = this.effectiveEffects(), a = this.effectiveIntensity();
    if (a <= 0.01) return;
    const o = r.audioReactive ? this.audio.level() : 0;
    r.spiral && this.drawSpiral(t, s / 2, i / 2, Math.min(s, i) * (0.44 + o * 0.08), e, r, a), r.particles && this.drawParticles(t, s, i, e, a, o, r.trails), r.doubleVision && this.drawRings(t, s / 2, i / 2, e, a);
  };
  drawSpiral(e, t, s, i, r, a, o) {
    const c = a.reducedMotion || this.store.value.accessibility.reducedMotion, d = a.reverseSpiral ? -1 : 1, l = c ? 0 : r * 35e-5 * a.spiralSpeed * d, h = a.spiralStyle === "double" ? 4 : a.spiralStyle === "fracture" ? 7 : 2;
    e.save(), e.translate(t, s), e.rotate(l), e.globalCompositeOperation = "lighter";
    for (let m = 0; m < h; m++) {
      e.beginPath();
      for (let S = 0; S < 260; S++) {
        const I = S / 259, B = I * Math.PI * (a.spiralStyle === "tunnel" ? 11 : 7) + m * Math.PI * 2 / h, C = I * i, $ = a.spiralStyle === "rings" ? Math.sin(I * 36 + r * 2e-3) * 8 : 0, D = Math.cos(B) * (C + $), u = Math.sin(B) * (C + $);
        S === 0 ? e.moveTo(D, u) : e.lineTo(D, u);
      }
      e.strokeStyle = m % 2 ? this.store.value.theme.primary : this.store.value.theme.secondary, e.globalAlpha = 0.16 + o * 0.36, e.lineWidth = 1.5 + o * 3, e.shadowBlur = 8 + o * 24, e.shadowColor = e.strokeStyle, e.stroke();
    }
    e.restore();
  }
  drawParticles(e, t, s, i, r, a, o) {
    e.save(), e.globalCompositeOperation = "lighter";
    const c = this.store.value.effects.performance === "low" ? 24 : this.store.value.effects.performance === "high" ? 90 : 52;
    for (let d = 0; d < Math.min(c, this.particles.length); d++) {
      const l = this.particles[d];
      l.y -= l.speed * (0.3 + r), l.x += Math.sin(i * 6e-4 + l.phase) * 0.18, l.y < -10 && (l.y = s + 10, l.x = Math.random() * t), o && (e.beginPath(), e.moveTo(l.x, l.y + 2), e.lineTo(l.x, l.y + 12 + r * 28), e.strokeStyle = d % 2 ? this.store.value.theme.primary : this.store.value.theme.accent, e.globalAlpha = 0.05 + r * 0.18, e.lineWidth = Math.max(0.5, l.size * 0.55), e.stroke()), e.beginPath(), e.arc(l.x, l.y, l.size * (1 + a * 2), 0, Math.PI * 2), e.fillStyle = d % 2 ? this.store.value.theme.primary : this.store.value.theme.accent, e.globalAlpha = 0.12 + r * 0.34, e.shadowBlur = 12, e.shadowColor = e.fillStyle, e.fill();
    }
    e.restore();
  }
  drawRings(e, t, s, i, r) {
    e.save(), e.translate(t, s), e.globalCompositeOperation = "screen";
    for (let a = 0; a < 4; a++) {
      const o = (i * 0.04 + a * 140) % 560 + 20;
      e.beginPath(), e.arc(a % 2 ? 7 : -7, 0, o, 0, Math.PI * 2), e.strokeStyle = a % 2 ? this.store.value.theme.primary : this.store.value.theme.secondary, e.globalAlpha = (1 - o / 600) * r * 0.18, e.lineWidth = 3, e.stroke();
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
    const [s, i, r, a] = e, o = this.state.focusMemberId ?? this.state.activeBy, c = this.effectiveEffects();
    if (!o || !c.focusLock || !s?.MemberNumber || typeof MainCanvas > "u") return t(e);
    const d = s.MemberNumber === o;
    MainCanvas.save(), !d && c.fadeOthers && (MainCanvas.globalAlpha *= Math.max(0.18, 1 - this.state.depth / 120)), d && c.characterAura && (MainCanvas.shadowColor = this.store.value.theme.primary, MainCanvas.shadowBlur = 12 + this.effectiveIntensity() * 38);
    const l = t(e);
    return d && c.eyeGlow && Number.isFinite(i) && Number.isFinite(r) && Number.isFinite(a) && (MainCanvas.globalCompositeOperation = "lighter", MainCanvas.fillStyle = this.store.value.theme.accent, MainCanvas.globalAlpha = 0.12 + this.effectiveIntensity() * 0.2, MainCanvas.beginPath(), MainCanvas.arc(i + 250 * a, r + 170 * a, 90 * a, 0, Math.PI * 2), MainCanvas.fill()), MainCanvas.restore(), l;
  }
}
function Ne(n, e = !1) {
  return e || n >= 100 ? "trance" : n >= 80 ? "critical" : n >= 60 ? "deep" : n >= 40 ? "dazed" : n >= 20 ? "influenced" : "awake";
}
class Ns {
  constructor(e, t, s, i) {
    this.runtime = e, this.store = t, this.bus = s;
    const r = Q(t.value.hypno.depth, 0, 100);
    this.state = {
      depth: r,
      stage: Ne(r),
      trance: r >= t.value.hypno.enterTranceAt,
      lucid: t.value.hypno.lucidTrance,
      lastDepthChangeAt: Date.now(),
      speechAllowed: !0
    }, i.interval(() => this.tick(), 1e3), i.add(s.on("emergency.stop", ({ reason: a }) => this.emergencyStop(a)));
  }
  runtime;
  store;
  bus;
  state;
  get snapshot() {
    return structuredClone(this.state);
  }
  setDepth(e, t = "manual", s) {
    const i = this.state.depth, r = Q(e, 0, 100);
    return r === i || (this.state.depth = r, this.state.lastDepthChangeAt = Date.now(), this.state.stage = Ne(r, this.state.trance), this.store.update((a) => {
      a.hypno.depth = r;
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
    this.state.trance = !1, this.state.depth = Q(this.store.value.hypno.wakeToDepth, 0, 100), this.state.stage = Ne(this.state.depth), this.state.wakeAt = void 0, this.state.aftereffectsUntil = s > 0 ? Date.now() + s * 6e4 : void 0, this.state.speechAllowed = !0, this.state.forcedPhrase = void 0, this.state.focusMemberId = void 0, this.store.update((r) => {
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
      version: "0.1.0",
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
    this.state.stage = Ne(this.state.depth, this.state.trance), this.bus.emit("state.changed", this.snapshot);
  }
}
class Rs {
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
      r[t] = Q(r[t] + s, 0, 100), r.memberName = this.runtime.characterName(e), r.lastChangedAt = Date.now(), i = r[t];
    }), i;
  }
  suggestionStrength(e, t) {
    const s = this.value(e.installedBy, "suggestion"), i = this.value(t, "suggestion"), a = 0.45 + this.hypno.snapshot.depth / 100, o = this.hypno.snapshot.trance ? 1.35 : 1;
    return Q(((s + i) / 2 + e.requiredDepth * 0.15) * a * o, 0, 100);
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
class Ps {
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
    return !i.enabled || i.whitelistAutoAccept.includes(t) || r.depth >= i.autoAcceptDepth || i.autoAcceptCapabilities.length > 0 && e.instructions.every((a) => i.autoAcceptCapabilities.includes(a.type)) || i.askOncePerSession && r.sessionId && this.acceptedSessions.has(`${r.sessionId}:${t}`) ? Promise.resolve(!0) : this.openGame(e, t, s);
  }
  cancel() {
    this.active?.finish(!1);
  }
  openGame(e, t, s) {
    return this.active?.finish(!1), new Promise((i) => {
      const r = this.store.value.resistance, a = Math.max(0, Math.min(100, r.baseDifficulty * 0.35 + s * 0.65)), o = document.createElement("div");
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
          <h2>${$t(e.name)}</h2>
          <p>${$t(this.runtime.characterName(t))}'s suggestion presses against your thoughts.</p>
          <div data-game></div>
          <button data-resist>Resist</button><button data-submit>Submit</button>
          <div class="progress"><i></i></div>
          <small>Influence ${Math.round(s)} · Difficulty ${Math.round(a)}</small>
        </div>`, document.body.appendChild(o);
      const c = o.querySelector("[data-game]"), d = o.querySelector("[data-resist]"), l = o.querySelector("[data-submit]"), h = o.querySelector(".progress i"), m = performance.now(), S = Math.max(3e3, r.durationMs);
      let I = 0, B = !1, C = 0, $ = m + 900 + Math.random() * Math.max(400, S - 2200), D = !1;
      const u = (O) => {
        B || (B = !0, cancelAnimationFrame(I), o.remove(), this.active = void 0, O && r.askOncePerSession && this.hypno.snapshot.sessionId && this.acceptedSessions.add(`${this.hypno.snapshot.sessionId}:${t}`), i(O));
      };
      this.active = { finish: u };
      let y = 0, g = 1;
      const p = Math.max(12, 48 - a * 0.32), b = 50 - p / 2;
      r.game === "timing" || r.game === "multi" ? c.innerHTML = `<div class="track"><div class="safe" style="left:${b}%;width:${p}%"></div><div class="marker"></div></div><div data-status>${r.game === "multi" ? "Land three successful resistance hits." : "Stop the marker inside the green area."}</div>` : r.game === "pulse" ? c.innerHTML = '<div class="pulse"></div><div>Resist when the pulse is smallest.</div>' : r.game === "reaction" ? c.innerHTML = '<div class="pulse"></div><div data-status>Wait for the glow, then resist quickly.</div>' : c.innerHTML = '<div class="pulse"></div><div>Resistance compares your roll against the influence.</div>';
      const x = (O) => {
        const H = O - m;
        if (h.style.width = `${Math.max(0, 100 * (1 - H / S))}%`, H >= S) {
          u(!1);
          return;
        }
        if (r.game === "timing" || r.game === "multi") {
          y += g * (0.8 + a * 0.018), (y >= 100 || y <= 0) && (g *= -1), y = Math.max(0, Math.min(100, y));
          const N = c.querySelector(".marker");
          N && (N.style.left = `calc(${y}% - 4px)`);
        } else if (r.game === "pulse" || r.game === "reaction") {
          const N = c.querySelector(".pulse");
          if (N) {
            const _ = 0.55 + (Math.sin(H * 7e-3) + 1) * 0.42;
            if (N.style.transform = `scale(${_})`, r.game === "reaction" && O >= $) {
              D = !0, N.style.background = "rgba(84,255,191,.38)";
              const j = c.querySelector("[data-status]");
              j && (j.textContent = "NOW!");
            }
          }
        }
        I = requestAnimationFrame(x);
      };
      d.addEventListener("click", () => {
        switch (r.game) {
          case "classic":
            u(Math.random() * 100 <= a);
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
            const O = performance.now() - m, H = 0.55 + (Math.sin(O * 7e-3) + 1) * 0.42;
            u(H > 0.82 + (100 - a) * 15e-4);
            break;
          }
          case "reaction":
            u(!(D && performance.now() - $ < 900));
            break;
        }
      }), l.addEventListener("click", () => u(!0)), I = requestAnimationFrame(x);
    });
  }
}
function $t(n) {
  const e = document.createElement("span");
  return e.textContent = n, e.innerHTML;
}
class Ds {
  constructor(e, t, s, i) {
    this.runtime = e, this.store = t, this.hypno = s, i.add(e.hook("ServerSend", 100, (r, a) => this.interceptServerSend(r, a))), i.add(e.hook("Player.CanTalk", 100, (r, a) => this.active("speech") ? !1 : a(r))), i.add(e.hook("Player.CanWalk", 100, (r, a) => this.active("walk") ? !1 : a(r))), i.add(e.hook("Player.CanChangeClothesOn", 100, (r, a) => this.active("wardrobe") ? !1 : a(r))), i.add(e.hook("Player.CanInteract", 100, (r, a) => this.active("interact") ? !1 : a(r))), i.add(e.hook("PoseCanChangeUnaided", 100, (r, a) => this.active("pose") ? !1 : a(r))), i.add(e.hook("Player.GetDeafLevel", 100, (r, a) => this.active("hearing") ? Math.max(4, Number(a(r)) || 0) : a(r))), i.add(e.hook("Player.GetBlindLevel", 100, (r, a) => this.active("sight") ? Math.max(2, Number(a(r)) || 0) : a(r))), i.add(e.hook("CommonSetScreen", 100, (r, a) => this.interceptScreen(r, a))), i.add(e.hook("ChatRoomSafewordRevert", 1e3, (r, a) => {
      this.clearAll();
      const o = a(r);
      return this.hypno.emergencyStop("BC safeword revert"), o;
    })), i.add(e.hook("ChatRoomSafewordRelease", 1e3, (r, a) => {
      const o = a(r);
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
    const a = this.hypno.snapshot.forcedPhrase;
    if (a)
      return r.trim().toLocaleLowerCase() === a.trim().toLocaleLowerCase() ? (this.hypno.setForcedPhrase(void 0), t(e)) : (this.runtime.localMessage(`Your thoughts keep returning to: “${a}”`, "warn"), null);
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
const Be = (n) => n.normalize("NFKC").toLocaleLowerCase(), Os = (n) => n.replace(/\([^)]*\)/g, " ");
function Me(n, e) {
  const t = Be(Os(n)), s = Be(e.trim());
  if (!s) return !1;
  const i = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s|[.,!?;:'"-])${i}(?=$|\\s|[.,!?;:'"-])`, "iu").test(t);
}
class js {
  constructor(e, t, s, i, r, a) {
    this.runtime = e, this.store = t, this.hypno = s, this.permissions = i, this.bus = r, a.add(e.hook("ChatRoomMessage", 60, (o, c) => {
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
    const i = this.store.value.triggers.find((a) => a.id === e);
    if (!i || !i.source.includes("remote")) return !1;
    const r = s?.trim() || i.phrase;
    return !this.isEligible(i, r, t, "remote") || !this.matchesWithRepeats(i, r, t) ? !1 : (this.execute(i, r, t, "remote"), !0);
  }
  process(e, t, s, i = !0) {
    if (!this.store.value.general.enabled || !this.store.value.hypno.enabled || !e || t <= 0) return [];
    const r = [];
    for (const a of this.store.value.triggers)
      this.isEligible(a, e, t, s) && this.matchesWithRepeats(a, e, t) && (r.push(a), i && this.execute(a, e, t, s));
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
    const a = this.hypno.snapshot;
    return a.depth < e.minDepth || a.depth > e.maxDepth || (this.cooldowns.get(e.id) ?? 0) > r || e.requireNameMention && !Me(t, this.runtime.playerName) || e.allowedMemberIds.length > 0 && !e.allowedMemberIds.includes(s) || e.allowedMemberIds.length === 0 && s !== this.runtime.memberNumber && !this.permissions.can({ sender: s, capability: e.kind === "wake" ? "wake" : e.kind === "deepen" ? "deepen" : "trigger", activeBy: a.activeBy, depth: a.depth, trance: a.trance }) || e.kind === "wake" && !a.trance && a.depth <= 0 || e.kind !== "wake" && e.kind !== "speechAllow" && a.trance && e.kind === "trigger" ? !1 : Me(t, e.phrase) || e.kind === "combo" && e.comboPhrases.some((o) => Me(t, o));
  }
  matchesWithRepeats(e, t, s) {
    const i = Date.now();
    if (e.kind === "combo") {
      const c = this.comboHistory.get(s) ?? [];
      for (const l of e.comboPhrases) Me(t, l) && c.push({ phrase: Be(l), at: i });
      const d = c.filter((l) => i - l.at <= e.repeatWindowMs);
      return this.comboHistory.set(s, d), e.comboPhrases.every((l) => d.some((h) => h.phrase === Be(l)));
    }
    if (e.requiredRepeats <= 1) return !0;
    const r = `${e.id}:${s}`, a = this.repeats.get(r), o = !a || i - a.firstAt > e.repeatWindowMs ? { count: 1, firstAt: i, lastAt: i } : { count: a.count + 1, firstAt: a.firstAt, lastAt: i };
    return this.repeats.set(r, o), o.count < e.requiredRepeats ? !1 : (this.repeats.delete(r), !0);
  }
  execute(e, t, s, i) {
    const r = () => {
      switch (this.cooldowns.set(e.id, Date.now() + e.cooldownMs), e.oneShot && this.store.update((a) => {
        const o = a.triggers.find((c) => c.id === e.id);
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
const Ls = [
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
  "audit.ack"
], Hs = G({
  protocol: ws(Pt),
  id: K().min(8).max(100),
  type: he(Ls),
  sender: U().int().positive(),
  target: U().int().positive().optional(),
  timestamp: U().int().positive(),
  payload: ze()
}).strict();
function qs(n, e, t, s) {
  return {
    protocol: Pt,
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: n,
    sender: e,
    target: s,
    timestamp: Date.now(),
    payload: t
  };
}
function Bs(n, e) {
  const t = Hs.safeParse(n);
  return !t.success || e !== void 0 && t.data.sender !== e || Math.abs(Date.now() - t.data.timestamp) > 9e4 ? null : t.data;
}
const zs = G({ id: K().min(1).max(100), message: K().max(500).optional() }).strict(), Us = G({ changes: G({ autoWakeMinutes: U().min(0).max(1440).optional(), lucidTrance: le().optional(), effectIntensity: U().min(0).max(1).optional(), themeMode: he(["pinky", "dark", "hybrid"]).optional(), restrictionThreshold: U().min(0).max(100).optional() }).strict() }).strict(), Mt = G({ delta: U().min(-100).max(100), reason: K().max(120).optional() }).strict(), Zs = G({ presetId: K().min(1).max(100), durationMs: U().int().min(500).max(6e5).optional() }).strict(), Fs = G({ id: K().min(1).max(100) }).strict(), Vs = G({ id: K().min(1).max(100), command: K().max(500).optional() }).strict();
class Ws {
  constructor(e, t, s, i, r, a, o, c, d) {
    this.runtime = e, this.store = t, this.hypno = s, this.permissions = i, this.effects = r, this.triggers = a, this.suggestions = o, this.bus = c, d.add(e.hook("ChatRoomMessage", 1e3, (l, h) => {
      const m = l[0];
      return m?.Type === "Hidden" && m.Content === "SkyzHypno" && this.receive(m), h(l);
    })), d.add(e.hook("ChatRoomSync", 5, (l, h) => {
      const m = h(l);
      return window.setTimeout(() => this.broadcastHello(!0), 500), m;
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
    const i = qs(e, this.runtime.memberNumber, t, s);
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
  broadcastHello(e) {
    if (!this.runtime.inChatRoom() || !this.store.value.hypno.showPublicStatus) return;
    const t = Date.now();
    if (!e && t - this.lastHello < 5500) return;
    this.lastHello = t;
    const s = Object.entries(this.store.value.remote.capabilities).filter(([, i]) => this.store.value.remote.enabled && i.enabled).map(([i]) => i);
    this.send("hello", this.hypno.publicStatus(s));
  }
  receive(e) {
    const t = Number(e.Sender), s = e.Dictionary?.find((r) => r?.Tag === "SkyzHypno")?.message ?? e.Dictionary?.[0]?.message, i = Bs(s, t);
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
        const t = Gs.parse(e.payload);
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
        const { changes: t } = Us.parse(e.payload);
        this.store.update((s) => {
          if (t.autoWakeMinutes !== void 0 && (s.hypno.autoWakeMinutes = t.autoWakeMinutes), t.lucidTrance !== void 0 && (s.hypno.lucidTrance = t.lucidTrance), t.effectIntensity !== void 0 && (s.effects.intensity = t.effectIntensity), t.restrictionThreshold !== void 0 && (s.restrictions.threshold = t.restrictionThreshold), t.themeMode !== void 0) {
            s.theme.mode = t.themeMode;
            const i = t.themeMode === "pinky" ? { primary: "#ff58bd", secondary: "#b45cff", accent: "#ffd0f0", background: "#12051a", glow: 0.95, darkness: 0.42 } : t.themeMode === "dark" ? { primary: "#ff2f72", secondary: "#3b0b66", accent: "#a868ff", background: "#030106", glow: 0.62, darkness: 0.9 } : { primary: "#ff58bd", secondary: "#731dff", accent: "#ff9fe2", background: "#09030f", glow: 0.8, darkness: 0.65 };
            Object.assign(s.theme, i);
          }
        }, !0), this.audit(e, !0, "Settings patch");
        return;
      }
      case "depth.request": {
        this.require(e, Mt.parse(e.payload).delta >= 0 ? "deepen" : "wake");
        const t = Mt.parse(e.payload);
        this.hypno.addDepth(t.delta, t.reason ?? "remote request", e.sender), this.audit(e, !0, `Depth ${t.delta}`);
        return;
      }
      case "wake.request":
        this.require(e, "wake"), this.hypno.wake("remote wake", e.sender), this.audit(e, !0, "Wake");
        return;
      case "effect.request": {
        this.require(e, "testEffect");
        const t = Zs.parse(e.payload);
        await this.effects.playPreset(t.presetId, t.durationMs, !1), this.audit(e, !0, `Effect ${t.presetId}`);
        return;
      }
      case "suggestion.install": {
        const t = G({ suggestion: ze() }).strict().parse(e.payload), s = typeof t.suggestion?.id == "string" ? t.suggestion.id : "", i = this.store.value.suggestions.some((r) => r.id === s);
        this.require(e, i ? "editOwnSuggestion" : "installSuggestion"), this.suggestions.install(t.suggestion, e.sender), this.audit(e, !0, i ? "Suggestion edit" : "Suggestion install");
        return;
      }
      case "suggestion.remove": {
        this.require(e, "removeOwnSuggestion");
        const t = Fs.parse(e.payload);
        this.suggestions.remove(t.id, e.sender), this.audit(e, !0, `Suggestion remove ${t.id}`);
        return;
      }
      case "suggestion.trigger": {
        this.require(e, "trigger");
        const t = Vs.parse(e.payload);
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
const Gs = G({
  protocol: U().int(),
  version: K().max(50),
  depthBucket: U().min(0).max(100),
  stage: he(["awake", "influenced", "dazed", "deep", "critical", "trance"]),
  trance: le(),
  activeBy: U().int().positive().optional(),
  capabilities: Te(he(["viewStatus", "trigger", "deepen", "wake", "testEffect", "installSuggestion", "editOwnSuggestion", "removeOwnSuggestion", "editSettings", "startSession", "controlSession"])).max(30),
  theme: he(["pinky", "dark", "hybrid", "custom"])
}).strict();
class Ks {
  constructor(e, t, s, i, r, a, o, c, d, l) {
    this.runtime = e, this.store = t, this.hypno = s, this.triggers = i, this.effects = r, this.suggestions = a, this.sessions = o, this.ui = c, this.onEmergency = d, this.onUnload = l;
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
  version = "0.1.0";
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
const Js = G({ sessionId: K().min(8).max(100), presetId: K().min(1).max(100), role: he(["hypnotist", "support", "viewer", "subject"]), hostName: K().max(100) }).strict(), Xs = G({ sessionId: K().min(8).max(100), action: he(["start", "stop", "pause", "resume", "effect", "depth", "wake", "message"]), config: Rt(ze()).default({}) }).strict();
class Ys {
  constructor(e, t, s, i, r, a, o, c, d, l) {
    this.runtime = e, this.store = t, this.hypno = s, this.effects = i, this.audio = r, this.suggestions = a, this.restrictions = o, this.network = c, this.bus = d, c.attachSessionHandler(this), l.add(() => this.stop("addon unload", !1)), l.add(d.on("emergency.stop", () => this.stop("emergency stop", !0)));
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
    const i = this.store.value.sessions.find((a) => a.id === e);
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
    const s = Js.parse(t);
    await Qs(`${s.hostName} invites you to a shared SkyzHypno session as ${s.role}.`, this.store.value.theme.primary) && (this.start(s.presetId, e, s.sessionId), this.active?.participants.set(e, "host"), this.active?.participants.set(this.runtime.memberNumber, s.role));
  }
  async onControl(e, t) {
    const s = Xs.parse(t);
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
    for (const i of [...e.steps].sort((r, a) => r.atMs - a.atMs)) {
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
const _e = (n) => typeof n == "number" && Number.isFinite(n) ? n : void 0;
function Qs(n, e) {
  return new Promise((t) => {
    const s = document.createElement("div");
    s.style.cssText = "position:fixed;inset:0;z-index:1000001;display:grid;place-items:center;background:rgba(0,0,0,.78);backdrop-filter:blur(8px)", s.innerHTML = `<div style="width:min(520px,90vw);padding:28px;border-radius:24px;background:#100718;color:white;border:1px solid ${e};box-shadow:0 0 50px ${e}55;font-family:system-ui;text-align:center"><h2 style="color:${e}">Shared Session</h2><p></p><button data-yes style="padding:10px 20px;margin:8px;border:0;border-radius:12px;background:${e};color:white;font-weight:800">Accept</button><button data-no style="padding:10px 20px;margin:8px;border:0;border-radius:12px;background:#34243e;color:white">Decline</button></div>`, s.querySelector("p").textContent = n, document.body.appendChild(s);
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
  "status"
], Dt = G({
  id: K().min(1).max(100),
  type: he(ot),
  config: Rt(ze())
}).strict(), ei = G({
  id: K().min(1).max(100),
  name: K().min(1).max(100),
  description: K().max(500),
  trigger: K().min(1).max(160),
  installedBy: U().int().positive(),
  installedByName: K().min(1).max(100),
  installedAt: U().int().positive(),
  exclusive: le(),
  enabled: le(),
  requiredDepth: U().min(0).max(100),
  cooldownMs: U().int().min(0).max(864e5),
  expiresAt: U().int().positive().optional(),
  maxUses: U().int().min(0).max(1e5),
  uses: U().int().min(0).max(1e5),
  lastUsedAt: U().int().min(0),
  instructions: Te(Dt).min(1).max(30)
}).strict();
function ti(n) {
  jt(n);
  let e;
  try {
    e = JSON.stringify(n);
  } catch {
    throw new Error("Suggestion must be serializable");
  }
  if (e.length > 1e5) throw new Error("Suggestion is too large");
  const t = ei.parse(n);
  return Ot(t.instructions, 0, { count: 0 }), t;
}
function Ot(n, e, t = { count: 0 }) {
  if (e > 4) throw new Error("Suggestion nesting is too deep");
  if (t.count += n.length, t.count > 200) throw new Error("Suggestion contains too many instructions");
  for (const s of n) {
    if (JSON.stringify(s.config).length > 2e4) throw new Error("Instruction configuration is too large");
    for (const r of Object.keys(s.config)) if (["__proto__", "prototype", "constructor"].includes(r)) throw new Error("Unsafe instruction key");
    for (const r of ["instructions", "options", "then", "else"]) {
      const a = s.config[r];
      if (!Array.isArray(a)) continue;
      const o = Te(Dt).max(20).parse(a);
      Ot(o, e + 1, t);
    }
  }
}
function jt(n, e = /* @__PURE__ */ new WeakSet()) {
  if (!(n === null || typeof n != "object") && !e.has(n)) {
    e.add(n);
    for (const t of Reflect.ownKeys(n)) {
      if (typeof t == "string" && ["__proto__", "prototype", "constructor"].includes(t)) throw new Error(`Unsafe key: ${t}`);
      jt(n[t], e);
    }
  }
}
class si {
  constructor(e, t, s, i, r, a, o, c, d, l, h) {
    this.runtime = e, this.store = t, this.hypno = s, this.influence = i, this.resistance = r, this.effects = a, this.audio = o, this.restrictions = c, this.permissions = d, this.bus = l, h.add(e.hook("ChatRoomMessage", 55, (m, S) => {
      const I = m[0];
      return I?.Sender && (I.Type === "Chat" || I.Type === "Whisper") && this.checkMessage(I.Content, I.Sender), S(m);
    })), h.add(l.on("trigger.matched", ({ trigger: m, sender: S, message: I }) => {
      if (!m.suggestionId) return;
      const B = this.store.value.suggestions.find((C) => C.id === m.suggestionId);
      B && this.requestExecution(B, S, I);
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
    const s = ti(e), i = this.store.value.suggestionPolicy;
    if (!i.enabled) throw new Error("Suggestions are disabled");
    if (s.installedBy !== t) throw new Error("Installer identity does not match sender");
    if (!this.store.value.suggestions.find((o) => o.id === s.id) && this.store.value.suggestions.length >= i.maxSuggestions) throw new Error("Suggestion limit reached");
    if (i.requireTranceForInstall && !this.hypno.snapshot.trance) throw new Error("Suggestion installation requires trance");
    if (i.requireActiveHypnotizerForInstall && this.hypno.snapshot.activeBy !== t && t !== this.runtime.memberNumber) throw new Error("Only the active hypnotizer may install suggestions");
    const a = s.instructions.find((o) => !i.allowedInstructionTypes.includes(o.type));
    if (a) throw new Error(`Instruction type is not allowed: ${a.type}`);
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
      r.suggestions = r.suggestions.filter((a) => a.id !== e);
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
        if (!s.enabled || !Me(e, s.trigger) || s.exclusive && s.installedBy !== t) continue;
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
        const i = te(s.presetId);
        i ? await this.effects.playPreset(i, ie(s.durationMs), !1) : this.effects.preview(s.effects ?? {}, ie(s.durationMs) ?? 8e3);
        break;
      }
      case "sound": {
        const i = te(s.category);
        i && await this.audio.playCategory(i, { loop: Re(s.loop) });
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
        const i = Pe(te(s.text) ?? t.command, t);
        i && (Re(s.public) ? this.runtime.sendAction(i) : this.runtime.localMessage(i));
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
        const i = Pe(te(s.text) ?? t.command, t);
        i && !/^[*!/.]/.test(i) && !i.includes("(") && this.hypno.setForcedPhrase(i);
        break;
      }
      case "strip":
        this.applyStrip(s);
        break;
      case "restriction": {
        const i = te(s.kind);
        i && this.restrictions.add(i, ie(s.durationMs), t.sender);
        break;
      }
      case "wait":
        await ii(Math.min(6e4, Math.max(0, ie(s.durationMs) ?? 1e3)));
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
        this.effects.fragment(Pe(te(s.text) ?? "The words linger in your thoughts...", t));
        break;
      case "aftereffect": {
        const i = ie(s.durationMs) ?? 3e4;
        this.effects.preview(s.effects ?? { dreamMode: !0, vignette: !0, intensity: 0.25 }, i);
        break;
      }
      case "status": {
        const i = Pe(te(s.text) ?? `${t.suggestion.name} is active.`, t);
        Re(s.public) ? this.runtime.sendAction(i) : this.runtime.localMessage(i);
        break;
      }
    }
  }
  applyExpression(e) {
    if (typeof CharacterSetFacialExpression != "function") return;
    const t = te(e.group) ?? "Eyes", s = te(e.expression) ?? "Dazed", i = ie(e.durationMs) ?? 0;
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
      const s = this.runtime.get("ActivityRun"), i = this.runtime.get("ActivityAllowedForGroup"), r = this.runtime.get("getActivities"), a = this.runtime.get("AssetGroup") ?? [], o = te(e.group), c = te(e.name), d = ie(e.targetMemberId) ?? t.sender, l = this.runtime.character(d), h = a.find((I) => I.Name === o), m = h && r?.(h).find((I) => I.Name === c);
      l && h && m && i?.(l, h.Name).some((I) => !I.Blocked && I.Activity?.Name === m.Name) && s ? s(Player, l, h, { Activity: m, Group: h.Name }, !0) : this.runtime.localMessage("The requested activity could not be performed.", "warn");
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
    const t = te(e.kind) ?? "depth", s = ie(e.value) ?? 0;
    return t === "depth" ? this.hypno.snapshot.depth >= s : t === "trance" ? this.hypno.snapshot.trance === Re(e.expected, !0) : t === "random" ? Math.random() * 100 < s : t === "activeHypnotizer" ? this.hypno.snapshot.activeBy === s : !1;
  }
}
const te = (n) => typeof n == "string" ? n.slice(0, 1e3) : void 0, ie = (n) => typeof n == "number" && Number.isFinite(n) ? n : void 0, Re = (n, e = !1) => typeof n == "boolean" ? n : e, ii = (n) => new Promise((e) => window.setTimeout(e, n));
function Pe(n, e) {
  return n.replaceAll("%PLAYER%", typeof CharacterNickname == "function" ? CharacterNickname(Player) : "Player").replaceAll("%SENDER%", String(e.sender)).replaceAll("%COMMAND%", e.command).slice(0, 1e3);
}
const Ct = ["overview", "hypnosis", "triggers", "suggestions", "effects", "sounds", "restrictions", "resistance", "remote", "presets", "sessions", "safety", "diagnostics"];
class ri {
  constructor(e, t, s, i, r, a, o, c, d, l) {
    this.runtime = e, this.store = t, this.hypno = s, this.effects = i, this.audio = r, this.suggestions = a, this.network = o, this.sessions = c, this.bus = d, l.add(d.on("settings.open", ({ tab: h }) => this.open(h ?? "overview"))), l.add(t.subscribe(() => {
      this.root && this.render();
    })), l.add(e.hook("PreferenceRun", 5, (h, m) => {
      const S = m(h);
      return this.drawPreferenceEntry(), S;
    })), l.add(e.hook("PreferenceClick", 5, (h, m) => {
      if (typeof MouseIn == "function" && MouseIn(1540, 880, 410, 80)) {
        this.open();
        return;
      }
      return m(h);
    })), l.add(e.hook("InformationSheetRun", 5, (h, m) => {
      const S = m(h);
      return this.drawRemoteEntry(), S;
    })), l.add(e.hook("InformationSheetClick", 5, (h, m) => {
      if (typeof MouseIn == "function" && MouseIn(1540, 790, 410, 80)) {
        const S = this.currentCharacter();
        S?.MemberNumber && S.MemberNumber !== this.runtime.memberNumber && this.openRemote(S.MemberNumber);
        return;
      }
      return m(h);
    })), l.interval(() => this.ensurePreferenceDomEntry(), 700), l.add(() => {
      this.close(), this.entryButton?.remove();
    });
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
  entryButton;
  open(e = "overview") {
    this.tab = Ct.includes(e) ? e : "overview", this.remoteMember = void 0, this.mount(), this.render();
  }
  openRemote(e) {
    this.remoteMember = e, this.tab = "remote", this.mount(), this.render();
  }
  close() {
    this.root?.remove(), this.root = void 0;
  }
  mount() {
    if (this.root) return;
    const e = document.createElement("div");
    e.id = "sh-preferences", e.innerHTML = `<style>${li}</style><div class="sh-shell"><aside></aside><main><header></header><section></section></main></div>`, e.addEventListener("click", (t) => this.onClick(t)), e.addEventListener("change", (t) => this.onChange(t)), e.addEventListener("input", (t) => this.onInput(t)), document.body.appendChild(e), this.root = e, this.audio.unlock();
  }
  render() {
    if (!this.root) return;
    const e = this.root.querySelector("aside"), t = this.root.querySelector("header"), s = this.root.querySelector("section");
    e.innerHTML = `<div class="brand"><b>SH</b><span>SkyzHypno<small>v0.1.0</small></span></div><nav>${Ct.map((i) => `<button data-tab="${i}" class="${this.tab === i ? "active" : ""}">${At(i)}</button>`).join("")}</nav><button class="danger" data-action="emergency">Emergency Stop</button>`, t.innerHTML = `<div><h1>${this.remoteMember ? `Remote · ${q(this.runtime.characterName(this.remoteMember))}` : At(this.tab)}</h1><p>${ai(this.tab)}</p></div><button data-action="close">×</button>`, s.innerHTML = this.remoteMember ? this.renderRemoteTarget(this.remoteMember) : this.renderTab();
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
    return `<div class="hero"><div><span class="pill">${e.stage}</span><h2>${Math.round(e.depth)}% depth</h2><p>${e.trance ? `Trance active${e.activeByName ? ` · ${q(e.activeByName)}` : ""}` : "Awake and responsive"}</p></div><div class="orb" style="--depth:${e.depth}"></div></div>
      <div class="grid three">${Ke("Effects", `${this.store.value.effects.enabled ? "Enabled" : "Disabled"} · ${Math.round(this.store.value.effects.intensity * 100)}%`, "effects")}${Ke("Suggestions", `${this.store.value.suggestions.length} installed`, "suggestions")}${Ke("Remote", this.store.value.remote.enabled ? "Enabled" : "Disabled", "remote")}</div>
      <div class="panel"><h3>Quick controls</h3><div class="actions"><button data-action="depth" data-value="10">+10 depth</button><button data-action="depth" data-value="-10">−10 depth</button><button data-action="trance">Enter trance</button><button data-action="wake">Wake</button><button data-action="preview" data-value="preset-deep-trance">Preview Deep Trance</button></div></div>
      <div class="panel"><h3>Compatibility</h3>${this.runtime.diagnostics.conflicts.length ? `<ul>${this.runtime.diagnostics.conflicts.map((t) => `<li>${q(t)}</li>`).join("")}</ul>` : "<p>No known conflicts detected.</p>"}</div>`;
  }
  renderHypnosis() {
    const e = this.store.value;
    return `<div class="grid two">
      ${M("Enable hypnosis", z("hypno.enabled", e.hypno.enabled), "Master switch for depth and trance logic.")}
      ${M("Current depth", fe("hypno.depth", e.hypno.depth, 0, 100, 1), `${Math.round(e.hypno.depth)}%`)}
      ${M("Decay per minute", re("hypno.decayPerMinute", e.hypno.decayPerMinute, 0, 20, 0.1), "How quickly depth fades while awake.")}
      ${M("Decay delay", re("hypno.decayDelaySeconds", e.hypno.decayDelaySeconds, 0, 600, 1), "Seconds before decay begins.")}
      ${M("Automatic wake", re("hypno.autoWakeMinutes", e.hypno.autoWakeMinutes, 0, 1440, 1), "0 keeps trance active until a wake action.")}
      ${M("Aftereffects", re("hypno.aftereffectsMinutes", e.hypno.aftereffectsMinutes, 0, 120, 1), "Minutes of gentle residual effects.")}
      ${M("Enter trance at", re("hypno.enterTranceAt", e.hypno.enterTranceAt, 1, 100, 1), "Depth threshold for trance.")}
      ${M("Lucid trance", z("hypno.lucidTrance", e.hypno.lucidTrance), "Keep interaction restrictions disabled while visuals remain active.")}
      ${M("Public status", z("hypno.showPublicStatus", e.hypno.showPublicStatus), "Share a quantized status with other SH clients.")}
      ${M("HUD", z("general.showHud", e.general.showHud), "Show depth and emergency controls in the room.")}
    </div>`;
  }
  renderTriggers() {
    return `<div class="toolbar"><button data-action="trigger-add">+ Add trigger</button></div><div class="stack">${this.store.value.triggers.map((e, t) => `<article class="panel block"><div class="row"><b>${q(e.name)}</b><button class="icon" data-action="trigger-delete" data-index="${t}">Delete</button></div><div class="grid three">
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
      ${A("Effect preset", `<select data-trigger="effectPresetId" data-index="${t}"><option value="">None</option>${this.store.value.presets.map((s) => `<option value="${Z(s.id)}" ${s.id === e.effectPresetId ? "selected" : ""}>${q(s.name)}</option>`).join("")}</select>`)}
      ${A("Linked suggestion", `<select data-trigger="suggestionId" data-index="${t}"><option value="">None</option>${this.store.value.suggestions.map((s) => `<option value="${Z(s.id)}" ${s.id === e.suggestionId ? "selected" : ""}>${q(s.name)}</option>`).join("")}</select>`)}
      ${A("Require name mention", `<input type="checkbox" data-trigger="requireNameMention" data-index="${t}" ${e.requireNameMention ? "checked" : ""}>`)}
      ${A("One-shot", `<input type="checkbox" data-trigger="oneShot" data-index="${t}" ${e.oneShot ? "checked" : ""}>`)}
      ${A("Enabled", `<input type="checkbox" data-trigger="enabled" data-index="${t}" ${e.enabled ? "checked" : ""}>`)}
    </div></article>`).join("")}</div>`;
  }
  renderSuggestions() {
    const e = this.store.value.suggestions;
    !this.selectedSuggestionId && e[0] && (this.selectedSuggestionId = e[0].id);
    const t = e.find((s) => s.id === this.selectedSuggestionId);
    return `<div class="split"><div class="panel list"><button data-action="suggestion-add">+ New suggestion</button>${e.map((s) => `<button data-action="suggestion-select" data-value="${Z(s.id)}" class="${s.id === t?.id ? "active" : ""}"><b>${q(s.name)}</b><small>${q(s.trigger)}</small></button>`).join("") || "<p>No suggestions installed.</p>"}</div><div>${t ? this.renderSuggestionEditor(t) : '<div class="panel"><h3>Create your first suggestion</h3><p>Suggestions combine trigger phrases, effects, sounds, conditions and BC actions.</p></div>'}</div></div>`;
  }
  renderSuggestionEditor(e) {
    return `<article class="panel"><div class="row"><h3>${q(e.name)}</h3><button class="danger" data-action="suggestion-delete" data-value="${Z(e.id)}">Delete</button></div><div class="grid two">
      ${A("Name", `<input data-suggestion="name" value="${Z(e.name)}">`)}
      ${A("Trigger", `<input data-suggestion="trigger" value="${Z(e.trigger)}">`)}
      ${A("Description", `<textarea data-suggestion="description">${q(e.description)}</textarea>`)}
      ${A("Required depth", `<input type="number" min="0" max="100" data-suggestion="requiredDepth" value="${e.requiredDepth}">`)}
      ${A("Cooldown ms", `<input type="number" min="0" data-suggestion="cooldownMs" value="${e.cooldownMs}">`)}
      ${A("Maximum uses", `<input type="number" min="0" max="100000" data-suggestion="maxUses" value="${e.maxUses}">`)}
      ${A("Expires at (timestamp)", `<input type="number" min="0" data-suggestion="expiresAt" value="${e.expiresAt ?? ""}">`)}
      ${A("Exclusive installer trigger", `<input type="checkbox" data-suggestion="exclusive" ${e.exclusive ? "checked" : ""}>`)}
      ${A("Enabled", `<input type="checkbox" data-suggestion="enabled" ${e.enabled ? "checked" : ""}>`)}
    </div><h3>Instruction flow</h3><div class="flow">${e.instructions.map((t, s) => `<div class="instruction"><span>${s + 1}</span><select data-instruction="type" data-index="${s}">${ot.map((i) => `<option ${t.type === i ? "selected" : ""}>${i}</option>`).join("")}</select><textarea data-instruction="config" data-index="${s}">${q(JSON.stringify(t.config, null, 2))}</textarea><div><button data-action="instruction-up" data-index="${s}">↑</button><button data-action="instruction-down" data-index="${s}">↓</button><button data-action="instruction-delete" data-index="${s}">×</button></div></div>`).join("")}</div><button data-action="instruction-add">+ Add instruction</button><button data-action="suggestion-test" data-value="${Z(e.id)}">Test locally</button></article>`;
  }
  renderEffects() {
    const e = this.store.value.effects, t = this.store.value.theme, s = ["spiral", "vignette", "blur", "tint", "waves", "particles", "chromatic", "doubleVision", "trails", "glitch", "tunnelVision", "focusLock", "roomAura", "dreamMode", "memoryFragments", "chatEcho", "chatDistort", "fadeOthers", "eyeGlow", "characterAura", "audioReactive"];
    return `<div class="grid two">${M("Effects enabled", z("effects.enabled", e.enabled), "Master switch for the visual compositor.")}${M("Theme", `<select data-setting="theme.mode">${["pinky", "dark", "hybrid", "custom"].map((i) => `<option ${t.mode === i ? "selected" : ""}>${i}</option>`).join("")}</select>`, "Pinky glow, dark creepy or a hybrid theme.")}${M("Intensity", fe("effects.intensity", e.intensity, 0, 1, 0.01), `${Math.round(e.intensity * 100)}%`)}${M("Glow", fe("theme.glow", t.glow, 0, 1, 0.01), `${Math.round(t.glow * 100)}%`)}${M("Darkness", fe("theme.darkness", t.darkness, 0, 1, 0.01), `${Math.round(t.darkness * 100)}%`)}${M("Performance", `<select data-setting="effects.performance">${["low", "balanced", "high"].map((i) => `<option ${e.performance === i ? "selected" : ""}>${i}</option>`).join("")}</select>`, "Controls particle count and expensive effects.")}${M("Spiral style", `<select data-setting="effects.spiralStyle">${["classic", "double", "tunnel", "fracture", "rings"].map((i) => `<option ${e.spiralStyle === i ? "selected" : ""}>${i}</option>`).join("")}</select>`, "Visual geometry of the main spiral.")}${M("Spiral speed", fe("effects.spiralSpeed", e.spiralSpeed, 0, 3, 0.05), `${e.spiralSpeed.toFixed(2)}×`)}${M("Reverse spiral", z("effects.reverseSpiral", e.reverseSpiral), "Reverse the main rotation direction.")}</div>
      <div class="panel"><h3>Effect composer</h3><div class="chips">${s.map((i) => `<label><input type="checkbox" data-setting="effects.${i}" ${e[i] ? "checked" : ""}>${i}</label>`).join("")}</div><div class="colors">${["primary", "secondary", "accent", "background"].map((i) => `<label>${i}<input type="color" data-setting="theme.${i}" value="${t[i]}"></label>`).join("")}</div><div class="actions"><button data-action="preview" data-value="preset-soft-induction">Soft</button><button data-action="preview" data-value="preset-deep-trance">Deep</button><button data-action="preview" data-value="preset-dream">Dream</button><button data-action="preview" data-value="preset-glitch">Glitch</button><button data-action="preset-save-current">Save current as preset</button></div></div>`;
  }
  renderSounds() {
    const e = this.store.value.audio;
    return `<div class="grid two">${M("Audio enabled", z("audio.enabled", e.enabled), "Master switch for built-in and URL sounds.")}${M("Master volume", fe("audio.masterVolume", e.masterVolume, 0, 1, 0.01), `${Math.round(e.masterVolume * 100)}%`)}${M("Mute on emergency", z("audio.muteOnEmergency", e.muteOnEmergency), "Immediately mutes and stops audio during emergency stop.")}${M("Duck game audio", z("audio.duckGameAudio", e.duckGameAudio), "Reserved for compatible game-audio mixers.")}</div><div class="toolbar"><button data-action="sound-add">+ Add URL sound</button><button data-action="audio-stop">Stop all</button><button data-action="audio-mute">${this.audio.isMuted ? "Unmute" : "Mute"}</button></div><div class="stack">${e.sounds.map((t, s) => `<article class="panel block"><div class="row"><b>${q(t.name)}</b><div><button data-action="sound-play" data-index="${s}">Play</button><button data-action="sound-delete" data-index="${s}" ${t.builtIn ? "disabled" : ""}>Delete</button></div></div><div class="grid three">${A("Name", `<input data-sound="name" data-index="${s}" value="${Z(t.name)}">`)}${A("Category", `<select data-sound="category" data-index="${s}">${ni.map((i) => `<option ${t.category === i ? "selected" : ""}>${i}</option>`).join("")}</select>`)}${A("URL", `<input data-sound="url" data-index="${s}" value="${Z(t.url)}" ${t.builtIn ? "readonly" : ""}>`)}${A("Volume", `<input type="range" min="0" max="1" step=".01" data-sound="volume" data-index="${s}" value="${t.volume}">`)}${A("Playback rate", `<input type="number" min=".25" max="4" step=".05" data-sound="playbackRate" data-index="${s}" value="${t.playbackRate}">`)}${A("Stereo pan", `<input type="number" min="-1" max="1" step=".05" data-sound="pan" data-index="${s}" value="${t.pan}">`)}${A("Reverb", `<input type="number" min="0" max="1" step=".05" data-sound="reverb" data-index="${s}" value="${t.reverb}">`)}${A("Echo", `<input type="number" min="0" max="1" step=".05" data-sound="echo" data-index="${s}" value="${t.echo}">`)}${A("Loop", `<input type="checkbox" data-sound="loop" data-index="${s}" ${t.loop ? "checked" : ""}>`)}${A("Enabled", `<input type="checkbox" data-sound="enabled" data-index="${s}" ${t.enabled ? "checked" : ""}>`)}</div></article>`).join("")}</div>`;
  }
  renderRestrictions() {
    const e = this.store.value.restrictions;
    return `<div class="grid two">${["speech", "walk", "pose", "wardrobe", "interact", "hearing", "sight", "names", "menus"].map((s) => M(s, `<select data-setting="restrictions.${s}">${["off", "trance", "suggestion", "both", "depth"].map((i) => `<option ${e[s] === i ? "selected" : ""}>${i}</option>`).join("")}</select>`, "Choose whether this applies in trance, through suggestions, both, or above the threshold.")).join("")}${M("Depth threshold", re("restrictions.threshold", e.threshold, 0, 100, 1), "Used by depth-based restrictions.")}${M("Replacement responses", `<textarea data-setting="restrictions.replacementResponses" data-array>${q(e.replacementResponses.join(`
`))}</textarea>`, "One response per line.")}${M("Always-allowed prefixes", `<textarea data-setting="restrictions.allowedPhrases" data-array>${q(e.allowedPhrases.join(`
`))}</textarea>`, "Commands, OOC and emergency prefixes that bypass speech restrictions.")}</div>`;
  }
  renderResistance() {
    const e = this.store.value.resistance;
    return `<div class="grid two">${M("Enable minigame", z("resistance.enabled", e.enabled), "Suggestions request an interactive resistance decision.")}${M("Game type", `<select data-setting="resistance.game">${["timing", "reaction", "pulse", "classic", "multi"].map((t) => `<option ${e.game === t ? "selected" : ""}>${t}</option>`).join("")}</select>`, "Five implemented minigame variants.")}${M("Base difficulty", fe("resistance.baseDifficulty", e.baseDifficulty, 0, 100, 1), `${e.baseDifficulty}`)}${M("Duration ms", re("resistance.durationMs", e.durationMs, 3e3, 3e4, 500), "Time before the attempt safely rejects.")}${M("Auto-accept whitelist", `<input data-setting="resistance.whitelistAutoAccept" data-number-array value="${e.whitelistAutoAccept.join(",")}">`, "Member IDs that skip the minigame.")}${M("Auto-accept depth", re("resistance.autoAcceptDepth", e.autoAcceptDepth, 0, 101, 1), "101 disables depth-based auto-accept.")}${M("Ask once per session", z("resistance.askOncePerSession", e.askOncePerSession), "After one acceptance, allow that sender for the current shared session.")}</div><div class="panel"><h3>Auto-accept instruction categories</h3><div class="chips">${ot.map((t) => `<label><input type="checkbox" data-resistance-capability="${t}" ${e.autoAcceptCapabilities.includes(t) ? "checked" : ""}>${t}</label>`).join("")}</div></div>`;
  }
  renderRemoteSettings() {
    const e = this.store.value.remote;
    return `${M("Enable multiplayer remote features", z("remote.enabled", e.enabled), "All individual capabilities still require their own explicit rule.")}<div class="stack">${Object.keys(e.capabilities).map((t) => {
      const s = e.capabilities[t];
      return `<article class="panel block"><div class="row"><b>${t}</b><input type="checkbox" data-capability="${t}" data-cap-field="enabled" ${s.enabled ? "checked" : ""}></div><div class="grid three">${A("Member IDs", `<input data-capability="${t}" data-cap-field="memberIds" value="${s.memberIds.join(",")}">`)}${A("Minimum depth", `<input type="number" min="0" max="100" data-capability="${t}" data-cap-field="minDepth" value="${s.minDepth}">`)}${A("Requires trance", `<input type="checkbox" data-capability="${t}" data-cap-field="requireTrance" ${s.requireTrance ? "checked" : ""}>`)}${A("Only active hypnotizer", `<input type="checkbox" data-capability="${t}" data-cap-field="requireActiveHypnotizer" ${s.requireActiveHypnotizer ? "checked" : ""}>`)}${A("Roles", `<div class="chips">${["owner", "lover", "friend", "itemPermission", "whitelist", "everyone"].map((i) => `<label><input type="checkbox" data-capability="${t}" data-role="${i}" ${s.roles.includes(i) ? "checked" : ""}>${i}</label>`).join("")}</div>`)}</div></article>`;
    }).join("")}</div>`;
  }
  renderRemoteTarget(e) {
    const t = this.network.status(e);
    return `<div class="panel"><h3>${q(this.runtime.characterName(e))}</h3>${t ? `<p>SH ${q(t.version)} · ${t.stage} · ${t.depthBucket}%</p><div class="chips">${t.capabilities.map((s) => `<span>${s}</span>`).join("")}</div>` : "<p>No SH status received yet. The player may not have SH or public status enabled.</p>"}<h3>Remote triggers</h3><div class="actions">${this.store.value.triggers.filter((s) => s.enabled && s.source.includes("remote")).map((s) => `<button data-remote="trigger" data-value="${Z(s.id)}">${q(s.name)}</button>`).join("") || "<small>No local trigger is marked for remote use.</small>"}</div><div class="actions"><button data-remote="depth" data-value="10">Deepen +10</button><button data-remote="depth" data-value="25">Deepen +25</button><button data-remote="wake">Wake</button>${this.store.value.presets.map((s) => `<button data-remote="effect" data-value="${Z(s.id)}">${q(s.name)}</button>`).join("")}</div><h3>Allowed settings controls</h3><div class="actions"><button data-remote="settings" data-value="soft">Soft visuals</button><button data-remote="settings" data-value="intense">Intense visuals</button><button data-remote="settings" data-value="pinky">Pinky theme</button><button data-remote="settings" data-value="dark">Dark theme</button><button data-remote="settings" data-value="lucid">Lucid trance</button></div><h3>Suggestions from your library</h3><div class="stack">${this.store.value.suggestions.map((s) => `<div class="row"><span><b>${q(s.name)}</b><small>${q(s.trigger)}</small></span><div><button data-remote="suggestion-install" data-value="${Z(s.id)}">Install / update</button><button data-remote="suggestion-trigger" data-value="${Z(s.id)}">Trigger</button></div></div>`).join("") || "<p>Create a suggestion locally first.</p>"}</div><div class="actions"><button data-action="close-remote">Back to settings</button></div></div>`;
  }
  renderPresets() {
    return `<div class="grid three">${this.store.value.presets.map((e) => `<article class="panel"><h3>${q(e.name)}</h3><p>${q(e.description)}</p><small>${Math.round(e.durationMs / 1e3)}s · depth ${e.depthDelta >= 0 ? "+" : ""}${e.depthDelta}</small><div><button data-action="preview" data-value="${Z(e.id)}">Preview</button></div></article>`).join("")}</div>`;
  }
  renderSessions() {
    return `<div class="toolbar"><button data-action="session-add">+ New session timeline</button></div><div class="grid two">${this.store.value.sessions.map((e, t) => `<article class="panel block"><div class="row"><h3>${q(e.name)}</h3><button class="danger" data-action="session-delete" data-index="${t}">Delete</button></div><div class="grid two">${A("Name", `<input data-session="name" data-index="${t}" value="${Z(e.name)}">`)}${A("Duration ms", `<input type="number" min="1000" max="86400000" data-session="durationMs" data-index="${t}" value="${e.durationMs}">`)}${A("Description", `<textarea data-session="description" data-index="${t}">${q(e.description)}</textarea>`)}${A("Timeline JSON", `<textarea class="timeline-json" data-session="steps" data-index="${t}">${q(JSON.stringify(e.steps, null, 2))}</textarea>`)}</div><small>${Math.round(e.durationMs / 6e4)} min · ${e.steps.length} timeline steps</small><div class="actions"><button data-action="session-start" data-value="${Z(e.id)}">Start locally</button><button data-action="session-invite" data-value="${Z(e.id)}">Invite member</button></div><ol>${e.steps.map((s) => `<li>${oi(s.atMs)} — ${s.action}</li>`).join("")}</ol></article>`).join("")}</div><div class="panel"><h3>Current session</h3><p>${this.sessions.current ? `${this.sessions.current.id} · host ${this.sessions.current.host}` : "No active session"}</p><div class="actions"><button data-action="session-pause">Pause</button><button data-action="session-resume">Resume</button><button data-action="session-stop">Stop session</button></div></div>`;
  }
  renderSafety() {
    const e = this.store.value.accessibility, t = this.store.value.streaming, s = this.store.value.compatibility;
    return `<div class="grid two">${M("Emergency hotkey", `<input data-setting="general.emergencyHotkey" value="${Z(this.store.value.general.emergencyHotkey)}">`, "Always available and cannot be remotely disabled.")}${M("Accessibility mode", z("accessibility.enabled", e.enabled), "Apply all accessibility limits together.")}${M("Reduced motion", z("accessibility.reducedMotion", e.reducedMotion), "Disables rapid glitching and slows movement.")}${M("No flashes", z("accessibility.noFlashes", e.noFlashes), "Prevents strong flash effects.")}${M("Maximum blur", re("accessibility.maxBlur", e.maxBlur, 0, 30, 0.5), "Accessibility cap used by visual presentation.")}${M("Maximum rotation", re("accessibility.maxRotation", e.maxRotation, 0, 15, 0.5), "Accessibility cap for rotating presentation.")}${M("High contrast text", z("accessibility.highContrastText", e.highContrastText), "Improves readability over effects.")}${M("Streaming mode", z("streaming.enabled", t.enabled), "Hide sensitive names, member numbers and suggestion details.")}${M("Hide names", z("streaming.hideNames", t.hideNames), "Obscure character names in compatible UI.")}${M("Hide member numbers", z("streaming.hideMemberNumbers", t.hideMemberNumbers), "Obscure member IDs in compatible UI.")}${M("Hide suggestion text", z("streaming.hideSuggestionText", t.hideSuggestionText), "Avoid exposing suggestion details in streaming mode.")}${M("Replace HSC", z("compatibility.replaceHSC", s.replaceHSC), "Use SH as the primary visual hypnosis addon.")}${M("Replace LSCG Hypno", z("compatibility.replaceLSCGHypno", s.replaceLSCGHypno), "Use SH for hypnosis while other LSCG modules may remain.")}${M("Import HSC settings", z("compatibility.importHSC", s.importHSC), "One-time migration of recognized HSC triggers and sounds.")}${M("Import LSCG settings", z("compatibility.importLSCG", s.importLSCG), "One-time migration of recognized LSCG hypnosis settings.")}${M("BCX Voice integration", z("compatibility.bcxVoice", s.bcxVoice), "Recognize BCX [Voice] messages.")}${M("WCE coexistence", z("compatibility.wceCoexistence", s.wceCoexistence), "Avoid replacing WCE functions and use SDK hooks only.")}</div><div class="panel"><h3>Backup</h3><div class="actions"><button data-action="export">Export settings</button><button data-action="import">Import settings</button><button class="danger" data-action="reset">Reset SH</button></div></div>`;
  }
  renderDiagnostics() {
    return `<div class="grid two"><div class="panel"><h3>Hooks</h3><pre>${q(this.runtime.diagnostics.hooks.join(`
`) || "No hooks")}</pre></div><div class="panel"><h3>Network</h3><p>Accepted: ${this.runtime.diagnostics.networkPacketsReceived}</p><p>Rejected: ${this.runtime.diagnostics.networkPacketsRejected}</p></div><div class="panel"><h3>Conflicts</h3><pre>${q(this.runtime.diagnostics.conflicts.join(`
`) || "None")}</pre></div><div class="panel"><h3>Errors</h3><pre>${q(this.runtime.diagnostics.lastErrors.join(`
`) || "None")}</pre></div><div class="panel"><h3>Audit log</h3><pre>${q(this.runtime.getAudit().map((e) => `${new Date(e.timestamp).toLocaleTimeString()} ${e.allowed ? "ALLOW" : "DENY"} ${e.senderName}: ${e.action} ${e.detail}`).join(`
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
    const i = t.dataset.action, r = t.dataset.value, a = Number(t.dataset.index);
    if (t.dataset.remote && this.remoteMember) {
      if (t.dataset.remote === "trigger" && r && this.network.requestTrigger(this.remoteMember, r), t.dataset.remote === "depth" && this.network.requestDepth(this.remoteMember, Number(r)), t.dataset.remote === "wake" && this.network.requestWake(this.remoteMember), t.dataset.remote === "effect" && r && this.network.requestEffect(this.remoteMember, r), t.dataset.remote === "settings" && (r === "soft" && this.network.requestSettingsPatch(this.remoteMember, { effectIntensity: 0.35 }), r === "intense" && this.network.requestSettingsPatch(this.remoteMember, { effectIntensity: 0.9 }), (r === "pinky" || r === "dark") && this.network.requestSettingsPatch(this.remoteMember, { themeMode: r }), r === "lucid" && this.network.requestSettingsPatch(this.remoteMember, { lucidTrance: !0 })), t.dataset.remote === "suggestion-install" && r) {
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
        this.hypno.addDepth(Number(r), "preference control");
        break;
      case "trance":
        this.hypno.enterTrance(this.runtime.memberNumber, "preference control");
        break;
      case "wake":
        this.hypno.wake("preference control");
        break;
      case "preview":
        r && this.effects.previewPreset(r);
        break;
      case "trigger-add":
        this.addTrigger();
        break;
      case "trigger-delete":
        this.store.update((o) => o.triggers.splice(a, 1));
        break;
      case "suggestion-add":
        this.addSuggestion();
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
        this.editSelected((o) => o.instructions.splice(a, 1));
        break;
      case "instruction-up":
        this.moveInstruction(a, a - 1);
        break;
      case "instruction-down":
        this.moveInstruction(a, a + 1);
        break;
      case "sound-add":
        this.addSound();
        break;
      case "sound-delete":
        this.store.value.audio.sounds[a]?.builtIn || this.store.update((o) => o.audio.sounds.splice(a, 1));
        break;
      case "sound-play": {
        const o = this.store.value.audio.sounds[a];
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
        this.store.update((o) => o.sessions.splice(a, 1), !0);
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
        ci(r, s, i), s === "theme.mode" && di(r, String(i));
      });
    }
    e.dataset.trigger && this.updateTrigger(e), e.dataset.suggestion && this.updateSuggestion(e), e.dataset.instruction && this.updateInstruction(e), e.dataset.sound && this.updateSound(e), e.dataset.capability && this.updateCapability(e), e.dataset.resistanceCapability && this.updateResistanceCapability(e), e.dataset.session && this.updateSession(e), t && this.root && this.render();
  }
  updateTrigger(e) {
    const t = Number(e.dataset.index), s = e.dataset.trigger;
    this.store.update((i) => {
      const r = i.triggers[t];
      if (!r) return;
      let a = e instanceof HTMLInputElement && e.type === "checkbox" ? e.checked : e.value;
      ["minDepth", "maxDepth", "depthDelta", "delayMs", "requiredRepeats", "repeatWindowMs", "cooldownMs", "expiresAt"].includes(s) && (a = a === "" ? void 0 : Number(a)), s === "allowedMemberIds" && (a = Je(a)), s === "source" && (a = String(a).split(/[\s,]+/).filter((o) => ["chat", "whisper", "voice", "activity", "item", "api", "remote"].includes(o))), s === "comboPhrases" && (a = String(a).split("|").map((o) => o.trim()).filter(Boolean)), ["effectPresetId", "suggestionId"].includes(s) && a === "" && (a = void 0), r[s] = a;
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
      let a = e instanceof HTMLInputElement && e.type === "checkbox" ? e.checked : e.value;
      ["volume", "playbackRate", "pan", "reverb", "echo"].includes(s) && (a = Number(a)), r[s] = a;
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
      let a = e instanceof HTMLInputElement && e.type === "checkbox" ? e.checked : e.value;
      r === "memberIds" && (a = Je(a)), r === "minDepth" && (a = Number(a)), i[r] = a;
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
  drawPreferenceEntry() {
    typeof DrawButton == "function" && DrawButton(1540, 880, 410, 80, "SkyzHypno", "#ff58bd", "", "Open SkyzHypno preferences");
  }
  drawRemoteEntry() {
    const e = this.currentCharacter();
    !e?.MemberNumber || e.MemberNumber === this.runtime.memberNumber || typeof DrawButton == "function" && DrawButton(1540, 790, 410, 80, "SH Remote", "#731dff", "", "Open SkyzHypno remote controls");
  }
  currentCharacter() {
    return this.runtime.get("CurrentCharacter") ?? this.runtime.get("InformationSheetCharacter");
  }
  ensurePreferenceDomEntry() {
    if (!(typeof CurrentScreen < "u" && /Preference/i.test(CurrentScreen))) {
      this.entryButton?.remove(), this.entryButton = void 0;
      return;
    }
    if (this.entryButton?.isConnected) return;
    const t = document.createElement("button");
    t.textContent = "SkyzHypno", t.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:99989;padding:10px 16px;border:1px solid #ff58bd;border-radius:14px;background:#15091fcc;color:white;box-shadow:0 0 24px #ff58bd55;cursor:pointer", t.addEventListener("click", () => this.open()), document.body.appendChild(t), this.entryButton = t;
  }
}
const ni = ["induction", "deepen", "trigger", "trance", "suggestion", "wake", "ambient", "heartbeat", "metronome", "glitch"], At = (n) => n.charAt(0).toUpperCase() + n.slice(1).replace(/([A-Z])/g, " $1"), ai = (n) => ({ overview: "Live status and quick controls.", hypnosis: "Depth, trance, decay and aftereffects.", triggers: "Words, combinations, activities and BCX voice triggers.", suggestions: "Visual flow editor for persistent suggestions.", effects: "Pinky glow and dark-creepy visual compositor.", sounds: "Built-in synthesis and editable URL sounds.", restrictions: "Configurable trance and suggestion restrictions.", resistance: "Interactive minigame and automatic-accept whitelist.", remote: "Receiver-validated multiplayer permissions.", presets: "Reusable audiovisual scenes.", sessions: "Timed local and shared multiplayer timelines.", safety: "Emergency, accessibility, compatibility and backups.", diagnostics: "Hooks, conflicts, networking, errors and audit log." })[n], Ke = (n, e, t) => `<button class="panel card" data-tab="${t}"><b>${n}</b><span>${e}</span></button>`, M = (n, e, t) => `<label class="panel control"><span><b>${n}</b><small>${t}</small></span>${e}</label>`, A = (n, e) => `<label class="small"><span>${n}</span>${e}</label>`, z = (n, e) => `<input type="checkbox" data-setting="${n}" ${e ? "checked" : ""}>`, fe = (n, e, t, s, i) => `<input type="range" data-setting="${n}" value="${e}" min="${t}" max="${s}" step="${i}">`, re = (n, e, t, s, i) => `<input type="number" data-setting="${n}" value="${e}" min="${t}" max="${s}" step="${i}">`, Je = (n) => [...new Set(n.split(/[,\s]+/).map(Number).filter((e) => Number.isInteger(e) && e > 0))], oi = (n) => `${Math.floor(n / 6e4)}:${String(Math.floor(n / 1e3) % 60).padStart(2, "0")}`;
function ci(n, e, t) {
  const s = e.split("."), i = s.pop();
  let r = n;
  for (const a of s) r = r[a];
  r[i] = t;
}
function q(n) {
  const e = document.createElement("span");
  return e.textContent = n, e.innerHTML;
}
const Z = (n) => q(n).replaceAll('"', "&quot;");
function di(n, e) {
  const s = {
    pinky: { primary: "#ff58bd", secondary: "#b45cff", accent: "#ffd0f0", background: "#12051a", glow: 0.95, darkness: 0.42 },
    dark: { primary: "#ff2f72", secondary: "#3b0b66", accent: "#a868ff", background: "#030106", glow: 0.62, darkness: 0.9 },
    hybrid: { primary: "#ff58bd", secondary: "#731dff", accent: "#ff9fe2", background: "#09030f", glow: 0.8, darkness: 0.65 }
  }[e];
  s && Object.assign(n.theme, s);
}
const li = `
#sh-preferences{position:fixed;inset:0;z-index:999999;background:rgba(2,0,6,.76);backdrop-filter:blur(12px);font:14px/1.45 Inter,ui-rounded,system-ui;color:#fff;pointer-events:auto}
#sh-preferences *{box-sizing:border-box}#sh-preferences .sh-shell{display:grid;grid-template-columns:235px 1fr;width:min(1500px,96vw);height:min(900px,94vh);margin:3vh auto;border:1px solid #ff58bd55;border-radius:28px;overflow:hidden;background:linear-gradient(145deg,#15081ef2,#07040df5);box-shadow:0 0 80px #ff2f9250,inset 0 1px #ffffff18}
#sh-preferences aside{padding:20px 14px;background:#09030ecc;border-right:1px solid #ffffff12;overflow:auto}#sh-preferences .brand{display:flex;gap:12px;align-items:center;margin:2px 8px 22px}#sh-preferences .brand>b{display:grid;place-items:center;width:44px;height:44px;border-radius:15px;background:linear-gradient(135deg,#ff58bd,#731dff);box-shadow:0 0 24px #ff58bd77;font-size:18px}#sh-preferences .brand span{font-size:17px;font-weight:800}#sh-preferences .brand small{display:block;font-size:10px;opacity:.55}
#sh-preferences nav{display:grid;gap:4px}#sh-preferences nav button,#sh-preferences .list>button{border:0;border-radius:12px;padding:9px 11px;text-align:left;background:transparent;color:#ddcee4;cursor:pointer}#sh-preferences nav button:hover,#sh-preferences nav button.active,#sh-preferences .list>button.active{background:linear-gradient(90deg,#ff58bd22,#731dff25);color:#fff;box-shadow:inset 3px 0 #ff58bd}
#sh-preferences main{display:grid;grid-template-rows:auto 1fr;min-width:0}#sh-preferences header{display:flex;justify-content:space-between;align-items:center;padding:22px 28px;border-bottom:1px solid #ffffff12}#sh-preferences h1,#sh-preferences h2,#sh-preferences h3{margin:0 0 7px}#sh-preferences header p{margin:0;opacity:.62}#sh-preferences header>button{font-size:30px;border:0;background:transparent;color:#fff;cursor:pointer}#sh-preferences section{overflow:auto;padding:24px 28px}
#sh-preferences .panel{border:1px solid #ffffff16;border-radius:18px;background:linear-gradient(145deg,#ffffff0c,#ffffff05);padding:18px;box-shadow:inset 0 1px #ffffff0d}#sh-preferences .grid{display:grid;gap:14px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}.stack{display:grid;gap:12px}.hero{display:flex;justify-content:space-between;align-items:center;padding:30px;border-radius:24px;background:radial-gradient(circle at 80%,#ff58bd29,transparent 30%),linear-gradient(120deg,#731dff24,#ff58bd17);margin-bottom:16px}.hero h2{font-size:34px}.pill{padding:4px 9px;border-radius:99px;background:#ff58bd25;color:#ff9fdf;text-transform:uppercase}.orb{width:120px;height:120px;border-radius:50%;background:conic-gradient(#ff58bd calc(var(--depth)*1%),#731dff22 0);box-shadow:0 0 50px #ff58bd55;position:relative}.orb:after{content:"";position:absolute;inset:12px;border-radius:50%;background:#0c0612}
#sh-preferences button{border:1px solid #ffffff18;border-radius:12px;padding:8px 12px;background:linear-gradient(135deg,#ff58bd35,#731dff35);color:#fff;cursor:pointer}#sh-preferences button:hover{border-color:#ff58bd88;box-shadow:0 0 18px #ff58bd33}#sh-preferences button.danger,#sh-preferences .danger{background:#7d123b80;color:#ffd2e3}.toolbar,.actions,.row{display:flex;gap:9px;align-items:center;flex-wrap:wrap}.toolbar{margin-bottom:14px}.row{justify-content:space-between}.control{display:flex;align-items:center;justify-content:space-between;gap:15px}.control span{display:grid}.control small,.small span{opacity:.58}.small{display:grid;gap:5px}.block input:not([type=checkbox]),.block select,.block textarea,.small input:not([type=checkbox]),.small select,.small textarea,#sh-preferences .control input:not([type=checkbox]),#sh-preferences .control select,#sh-preferences .control textarea{width:100%;background:#08040e;border:1px solid #ffffff18;border-radius:10px;color:#fff;padding:8px}#sh-preferences input[type=range]{accent-color:#ff58bd}#sh-preferences input[type=checkbox]{accent-color:#ff58bd;width:20px;height:20px}.chips{display:flex;flex-wrap:wrap;gap:7px}.chips label,.chips span{padding:6px 9px;border-radius:99px;background:#ffffff0b}.colors{display:flex;gap:12px;margin:14px 0}.colors label{display:grid;gap:5px}.colors input{width:70px;height:38px;background:none;border:0}.split{display:grid;grid-template-columns:260px 1fr;gap:14px}.list{display:flex;flex-direction:column;gap:5px;align-self:start}.list button{display:grid}.list small{opacity:.55}.flow{display:grid;gap:10px;margin:10px 0}.instruction{display:grid;grid-template-columns:32px 150px 1fr auto;gap:8px;align-items:start;padding:10px;border-radius:15px;background:#ffffff08}.instruction>span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#ff58bd44}.instruction textarea{min-height:95px;background:#050208;color:#ded0e5;border:1px solid #ffffff18;border-radius:10px;padding:8px;font-family:ui-monospace,monospace}.instruction textarea.invalid,.timeline-json.invalid{border-color:#ff3c6f}.timeline-json{min-height:240px;font-family:ui-monospace,monospace}.card{display:grid;text-align:left}.card span{opacity:.65}.icon{padding:4px 8px!important}.panel pre{white-space:pre-wrap;max-height:300px;overflow:auto;background:#050208;padding:10px;border-radius:10px}.panel ol{max-height:180px;overflow:auto;padding-left:20px}
@media(max-width:900px){#sh-preferences .sh-shell{grid-template-columns:1fr;height:100vh;width:100vw;margin:0;border-radius:0}#sh-preferences aside{display:none}.grid.two,.grid.three,.split{grid-template-columns:1fr}#sh-preferences section{padding:16px}.instruction{grid-template-columns:1fr}.hero .orb{display:none}}
`;
class ui {
  runtime = new Wt();
  lifecycle = new zt();
  bus = new Lt();
  store = new As(this.runtime);
  compatibility = new Bt(this.runtime, this.store);
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
    this.store.load(), this.compatibility.detect(), this.compatibility.migrateOnce(), this.hypno = new Ns(this.runtime, this.store, this.bus, this.lifecycle), this.permissions = new Ut(this.runtime, () => this.store.value), this.audio = new Ts(this.runtime, this.store, this.lifecycle), this.restrictions = new Ds(this.runtime, this.store, this.hypno, this.lifecycle), this.influence = new Rs(this.runtime, this.store, this.hypno), this.resistance = new Ps(this.runtime, this.store, this.hypno), this.effects = new Is(this.runtime, this.store, this.hypno, this.audio, this.bus, this.lifecycle), this.triggers = new js(this.runtime, this.store, this.hypno, this.permissions, this.bus, this.lifecycle), this.suggestions = new si(this.runtime, this.store, this.hypno, this.influence, this.resistance, this.effects, this.audio, this.restrictions, this.permissions, this.bus, this.lifecycle), this.network = new Ws(this.runtime, this.store, this.hypno, this.permissions, this.effects, this.triggers, this.suggestions, this.bus, this.lifecycle), this.sessions = new Ys(this.runtime, this.store, this.hypno, this.effects, this.audio, this.suggestions, this.restrictions, this.network, this.bus, this.lifecycle), this.ui = new ri(this.runtime, this.store, this.hypno, this.effects, this.audio, this.suggestions, this.network, this.sessions, this.bus, this.lifecycle), this.api = new Ks(this.runtime, this.store, this.hypno, this.triggers, this.effects, this.suggestions, this.sessions, this.ui, (e) => this.bus.emit("emergency.stop", { reason: e }), () => this.unload()), this.lifecycle.add(this.bus.on("emergency.stop", () => {
      this.restrictions.clearAll(), this.suggestions.cancelAll(), this.effects.clearPresets(), this.audio.stopAll(), this.store.value.audio.muteOnEmergency && this.audio.setMuted(!0);
    })), this.installSafetyControls(), this.network.broadcastHello(!0), this.runtime.localMessage("SkyzHypno v0.1.0 loaded.");
  }
  unload() {
    this.unloaded || (this.unloaded = !0, this.bus.emit("emergency.stop", { reason: "addon unload" }), this.store.flush(!0), this.lifecycle.stop(), this.bus.clear(), this.runtime.unload(), delete window.SkyzHypno, delete window.SH);
  }
  installSafetyControls() {
    const e = (t) => {
      hi(t, this.store.value.general.emergencyHotkey) && (t.preventDefault(), t.stopImmediatePropagation(), this.bus.emit("emergency.stop", { reason: "emergency hotkey" }));
    };
    this.lifecycle.listen(window, "keydown", e, { capture: !0 }), this.lifecycle.listen(window, "pagehide", () => this.store.flush(!0)), this.lifecycle.listen(window, "beforeunload", () => this.store.flush(!0)), this.lifecycle.interval(() => this.influence.decay(), 30 * 6e4);
  }
}
function hi(n, e) {
  const t = e.toLocaleLowerCase().split("+").map((i) => i.trim()), s = t.at(-1);
  return n.key.toLocaleLowerCase() === s && n.altKey === t.includes("alt") && n.shiftKey === t.includes("shift") && n.ctrlKey === t.includes("ctrl") && n.metaKey === t.includes("meta");
}
async function pi() {
  for (; ; ) {
    const n = globalThis.Player, e = globalThis.CurrentScreen;
    if (n?.MemberNumber && e && e !== "Login") return;
    await new Promise((t) => window.setTimeout(t, 200));
  }
}
async function fi() {
  if (!(window.SkyzHypno || window.SH))
    try {
      await pi();
      const n = new ui();
      window.SkyzHypno = n.api, window.SH = n.api;
    } catch (n) {
      console.error("[SkyzHypno] Fatal initialization error", n);
      const e = document.createElement("div");
      e.style.cssText = "position:fixed;z-index:1000000;left:10px;right:10px;top:10px;padding:14px;border-radius:12px;background:#5b0c29;color:white;font:14px system-ui", e.textContent = `SkyzHypno failed to initialize: ${n instanceof Error ? n.message : String(n)}`, document.body.appendChild(e);
    }
}
fi();
//# sourceMappingURL=skyz-hypno.es.js.map
