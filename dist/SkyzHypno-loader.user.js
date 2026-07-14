// ==UserScript==
// @name         SkyzHypno (SH) Loader
// @namespace    https://github.com/mystiq-skyz/skyzhypno
// @version      0.1.0
// @description  Remote loader for SkyzHypno, an audiovisual hypnosis and suggestion addon for Bondage Club.
// @author       Sky
// @homepageURL  https://github.com/mystiq-skyz/skyzhypno
// @supportURL   https://github.com/mystiq-skyz/skyzhypno/issues
// @updateURL    https://raw.githubusercontent.com/mystiq-skyz/skyzhypno/main/dist/SkyzHypno-loader.user.js
// @downloadURL  https://raw.githubusercontent.com/mystiq-skyz/skyzhypno/main/dist/SkyzHypno-loader.user.js
// @match        https://bondageprojects.elementfx.com/*
// @match        https://www.bondageprojects.elementfx.com/*
// @match        https://bondage-europe.com/*
// @match        https://www.bondage-europe.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  "use strict";
  const url = "https://mystiq-skyz.github.io/skyzhypno/skyz-hypno.iife.js";
  const script = document.createElement("script");
  script.src = `${url}?v=0.1.0`;
  script.crossOrigin = "anonymous";
  script.onerror = () => console.error("[SkyzHypno] Failed to load bundle", url);
  document.head.appendChild(script);
})();
