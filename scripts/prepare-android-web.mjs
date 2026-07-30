import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = resolve(projectRoot, "www");
const runtimeFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "calculator-engine.js",
  "favicon.svg",
  "site.webmanifest",
];

await rm(webRoot, { recursive: true, force: true });
await mkdir(webRoot, { recursive: true });

for (const file of runtimeFiles) {
  await cp(resolve(projectRoot, file), resolve(webRoot, file));
}

console.log(`Prepared ${runtimeFiles.length} web assets for Android.`);
