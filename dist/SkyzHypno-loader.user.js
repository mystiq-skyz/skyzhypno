// ==UserScript==
// @name         SkyzHypno (SH) Loader
// @namespace    https://github.com/mystiq-skyz/skyzhypno
// @version      0.2.0
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
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      mystiq-skyz.github.io
// @connect      raw.githubusercontent.com
// ==/UserScript==

(() => {
  "use strict";

  const version = "0.2.0";
  const pageUrl = "https://mystiq-skyz.github.io/skyzhypno/skyz-hypno.iife.js";
  const fallbackUrls = [
    `${pageUrl}?v=${version}`,
    `https://raw.githubusercontent.com/mystiq-skyz/skyzhypno/main/dist/skyz-hypno.iife.js?v=${version}`,
  ];

  const alreadyLoaded = () => Boolean(unsafeWindow.SkyzHypno || unsafeWindow.SH);

  const executeBundle = (code, sourceUrl) => {
    if (alreadyLoaded()) return true;
    try {
      unsafeWindow.eval(`${code}
//# sourceURL=${sourceUrl}`);
      return true;
    } catch (error) {
      console.error("[SkyzHypno] Bundle execution failed", sourceUrl, error);
      return false;
    }
  };

  const loadWithGM = (index = 0) => {
    const url = fallbackUrls[index];
    if (!url) {
      console.error("[SkyzHypno] All bundle sources failed", fallbackUrls);
      return;
    }

    GM_xmlhttpRequest({
      method: "GET",
      url,
      timeout: 30000,
      onload: (response) => {
        const ok = response.status >= 200 && response.status < 300 && Boolean(response.responseText);
        if (!ok || !executeBundle(response.responseText, url)) {
          console.warn("[SkyzHypno] Loader source failed, trying fallback", url, response.status);
          loadWithGM(index + 1);
        }
      },
      onerror: () => loadWithGM(index + 1),
      ontimeout: () => loadWithGM(index + 1),
    });
  };

  // A classic cross-origin script does not need CORS. Do not set script.crossOrigin here.
  const directScript = document.createElement("script");
  directScript.src = fallbackUrls[0];
  directScript.async = false;
  directScript.onload = () => {
    if (!alreadyLoaded()) {
      console.warn("[SkyzHypno] Direct bundle loaded but SH did not initialize; trying userscript fallback.");
      loadWithGM();
    }
  };
  directScript.onerror = () => {
    directScript.remove();
    loadWithGM();
  };
  (document.head || document.documentElement).appendChild(directScript);
})();
