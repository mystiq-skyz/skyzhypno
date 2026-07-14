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

const loaderMetadata = `// ==UserScript==\n// @name         SkyzHypno (SH) Loader\n// @namespace    ${repository}\n// @version      ${pkg.version}\n// @description  Remote loader for SkyzHypno, an audiovisual hypnosis and suggestion addon for Bondage Club.\n// @author       Sky\n// @homepageURL  ${repository}\n// @supportURL   ${repository}/issues\n// @updateURL    ${rawRoot}/dist/SkyzHypno-loader.user.js\n// @downloadURL  ${rawRoot}/dist/SkyzHypno-loader.user.js\n// @match        https://bondageprojects.elementfx.com/*\n// @match        https://www.bondageprojects.elementfx.com/*\n// @match        https://bondage-europe.com/*\n// @match        https://www.bondage-europe.com/*\n// @run-at       document-idle\n// @grant        none\n// ==/UserScript==\n\n`;
const loaderBody = `(() => {\n  \"use strict\";\n  const url = \"${pagesRoot}/skyz-hypno.iife.js\";\n  const script = document.createElement(\"script\");\n  script.src = \`${'${url}'}?v=${pkg.version}\`;\n  script.crossOrigin = \"anonymous\";\n  script.onerror = () => console.error(\"[SkyzHypno] Failed to load bundle\", url);\n  document.head.appendChild(script);\n})();\n`;
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
