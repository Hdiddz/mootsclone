import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "public");
const distDir = resolve(root, "frontend", "dist");

await mkdir(publicDir, { recursive: true });
await rm(resolve(publicDir, "assets"), { recursive: true, force: true });
await cp(resolve(distDir, "assets"), resolve(publicDir, "assets"), { recursive: true });
await cp(resolve(distDir, "index.html"), resolve(publicDir, "index.html"));
