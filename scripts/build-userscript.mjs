import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const bundle = await readFile(resolve(root, "dist/skyz-hypno.iife.js"), "utf8");

const repository = "https://github.com/mystiq-skyz/skyzhypno";
const rawRoot = "https://raw.githubusercontent.com/mystiq-skyz/skyzhypno/main";
const pagesRoot = "https://mystiq-skyz.github.io/skyzhypno";

const metadata = `// ==UserScript==\n// @name         SkyzHypno (SH)\n// @namespace    ${repository}\n// @version      ${pkg.version}\n// @description  Modern audiovisual hypnosis, suggestions and multiplayer sessions for Bondage Club.\n// @author       Sky\n// @homepageURL  ${repository}\n// @supportURL   ${repository}/issues\n// @updateURL    ${rawRoot}/dist/SkyzHypno.user.js\n// @downloadURL  ${rawRoot}/dist/SkyzHypno.user.js\n// @match        https://bondageprojects.elementfx.com/*\n// @match        https://www.bondageprojects.elementfx.com/*\n// @match        https://bondage-europe.com/*\n// @match        https://www.bondage-europe.com/*\n// @run-at       document-idle\n// @grant        none\n// ==/UserScript==\n\n`;
await writeFile(resolve(root, "dist/SkyzHypno.user.js"), metadata + bundle);

const loaderMetadata = `// ==UserScript==\n// @name         SkyzHypno (SH) Loader\n// @namespace    ${repository}\n// @version      ${pkg.version}\n// @description  Remote loader for SkyzHypno, an audiovisual hypnosis and suggestion addon for Bondage Club.\n// @author       Sky\n// @homepageURL  ${repository}\n// @supportURL   ${repository}/issues\n// @updateURL    ${rawRoot}/dist/SkyzHypno-loader.user.js\n// @downloadURL  ${rawRoot}/dist/SkyzHypno-loader.user.js\n// @match        https://bondageprojects.elementfx.com/*\n// @match        https://www.bondageprojects.elementfx.com/*\n// @match        https://bondage-europe.com/*\n// @match        https://www.bondage-europe.com/*\n// @run-at       document-idle\n// @grant        GM_xmlhttpRequest\n// @grant        unsafeWindow\n// @connect      mystiq-skyz.github.io\n// @connect      raw.githubusercontent.com\n// ==/UserScript==\n\n`;
const loaderBody = `(() => {\n  \"use strict\";\n\n  const version = \"${pkg.version}\";\n  const pageUrl = \"${pagesRoot}/skyz-hypno.iife.js\";\n  const fallbackUrls = [\n    \`${'${pageUrl}'}?v=${'${version}'}\`,\n    \`${rawRoot}/dist/skyz-hypno.iife.js?v=${'${version}'}\`,\n  ];\n\n  const alreadyLoaded = () => Boolean(unsafeWindow.SkyzHypno || unsafeWindow.SH);\n\n  const executeBundle = (code, sourceUrl) => {\n    if (alreadyLoaded()) return true;\n    try {\n      unsafeWindow.eval(\`${'${code}'}\n//# sourceURL=${'${sourceUrl}'}\`);\n      return true;\n    } catch (error) {\n      console.error(\"[SkyzHypno] Bundle execution failed\", sourceUrl, error);\n      return false;\n    }\n  };\n\n  const loadWithGM = (index = 0) => {\n    const url = fallbackUrls[index];\n    if (!url) {\n      console.error(\"[SkyzHypno] All bundle sources failed\", fallbackUrls);\n      return;\n    }\n\n    GM_xmlhttpRequest({\n      method: \"GET\",\n      url,\n      timeout: 30000,\n      onload: (response) => {\n        const ok = response.status >= 200 && response.status < 300 && Boolean(response.responseText);\n        if (!ok || !executeBundle(response.responseText, url)) {\n          console.warn(\"[SkyzHypno] Loader source failed, trying fallback\", url, response.status);\n          loadWithGM(index + 1);\n        }\n      },\n      onerror: () => loadWithGM(index + 1),\n      ontimeout: () => loadWithGM(index + 1),\n    });\n  };\n\n  // A classic cross-origin script does not need CORS. Do not set script.crossOrigin here.\n  const directScript = document.createElement(\"script\");\n  directScript.src = fallbackUrls[0];\n  directScript.async = false;\n  directScript.onload = () => {\n    if (!alreadyLoaded()) {\n      console.warn(\"[SkyzHypno] Direct bundle loaded but SH did not initialize; trying userscript fallback.\");\n      loadWithGM();\n    }\n  };\n  directScript.onerror = () => {\n    directScript.remove();\n    loadWithGM();\n  };\n  (document.head || document.documentElement).appendChild(directScript);\n})();\n`;
const loader = loaderMetadata + loaderBody;
await writeFile(resolve(root, "loader/SkyzHypno.user.js"), loader);
await writeFile(resolve(root, "dist/SkyzHypno-loader.user.js"), loader);

await writeFile(resolve(root, "dist/fusam-manifest.json"), JSON.stringify({
  id: "skyz-hypno",
  name: "SkyzHypno",
  description: pkg.description,
  author: "Sky",
  tags: ["hypnosis", "effects", "multiplayer", "suggestions"],
  type: "script",
  distribution: {
    stable: `${pagesRoot}/skyz-hypno.iife.js`,
    beta: `${pagesRoot}/beta/skyz-hypno.iife.js`,
    dev: `${pagesRoot}/dev/skyz-hypno.iife.js`,
  },
}, null, 2));

await writeFile(resolve(root, "dist/pcm-plugin.json"), JSON.stringify({
  id: "SkyzHypno",
  name: "SkyzHypno",
  type: "scr",
  url: `${pagesRoot}/skyz-hypno.iife.js`,
  repo: repository,
}, null, 2));
