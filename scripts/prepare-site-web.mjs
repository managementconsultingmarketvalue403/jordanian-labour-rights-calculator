import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = resolve(projectRoot, "www-site");
const rootFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "calculator-engine.js",
  "favicon.svg",
  "site.webmanifest",
  "robots.txt",
  "sitemap.xml",
];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const file of rootFiles) {
  await cp(resolve(projectRoot, file), resolve(outputRoot, file));
}

await cp(
  resolve(projectRoot, "docs", "screenshots"),
  resolve(outputRoot, "docs", "screenshots"),
  { recursive: true },
);

console.log("Prepared the isolated production website directory.");
