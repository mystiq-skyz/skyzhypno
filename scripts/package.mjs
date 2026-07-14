import { readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { basename, resolve } from "node:path";

const root = process.cwd();
const parent = resolve(root, "..");
const releaseZip = resolve(parent, "SkyzHypno-release.zip");
const sourceZip = resolve(parent, "SkyzHypno-source.zip");
const checksums = resolve(parent, "SkyzHypno-SHA256SUMS.txt");
const distChecksums = resolve(root, "dist", "SHA256SUMS.txt");

for (const file of [releaseZip, sourceZip, checksums, distChecksums]) await rm(file, { force: true });

const sha256 = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const distFiles = ["dist/SkyzHypno.user.js", "dist/SkyzHypno-loader.user.js", "dist/skyz-hypno.iife.js", "dist/skyz-hypno.es.js"];
await writeFile(distChecksums, (await Promise.all(distFiles.map(async (file) => `${await sha256(resolve(root, file))}  ${basename(file)}`))).join("\n") + "\n");

function zip(output, entries) {
  const result = spawnSync("zip", ["-r", output, ...entries], { cwd: root, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

zip(releaseZip, ["dist", "README.md", "LICENSE", "docs", "loader"]);
zip(sourceZip, ["src", "tests", "scripts", ".github", "docs", "loader", "dist", "README.md", "LICENSE", ".gitignore", "package.json", "package-lock.json", "tsconfig.json", "vite.config.ts", "vitest.config.ts"]);

const finalFiles = [
  { file: releaseZip, label: basename(releaseZip) },
  { file: sourceZip, label: basename(sourceZip) },
  { file: resolve(root, "dist", "SkyzHypno.user.js"), label: "SkyzHypno/dist/SkyzHypno.user.js" },
];
await writeFile(checksums, (await Promise.all(finalFiles.map(async ({ file, label }) => `${await sha256(file)}  ${label}`))).join("\n") + "\n");
console.log(`Release: ${releaseZip}`);
console.log(`Source:  ${sourceZip}`);
console.log(`Hashes:  ${checksums}`);
