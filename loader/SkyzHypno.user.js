// ==UserScript==
// @name         SkyzHypno (SH)
// @namespace    https://github.com/SkyKrempel/SkyzHypno
// @version      0.1.0
// @description  Modern audiovisual hypnosis, suggestions and multiplayer sessions for Bondage Club.
// @author       Sky
// @match        https://bondageprojects.elementfx.com/*
// @match        https://www.bondageprojects.elementfx.com/*
// @match        https://bondage-europe.com/*
// @match        https://www.bondage-europe.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(() => {
  "use strict";
  const url = "https://skykrempel.github.io/SkyzHypno/skyz-hypno.iife.js";
  const script = document.createElement("script");
  script.src = `${url}?v=0.1.0`;
  script.crossOrigin = "anonymous";
  script.onerror = () => console.error("[SkyzHypno] Failed to load bundle", url);
  document.head.appendChild(script);
})();
