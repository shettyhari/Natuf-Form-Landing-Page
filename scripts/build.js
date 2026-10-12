// Copies frontend/ and backend/ into release/ so the release folder can be uploaded to a server as-is.
// Skips node_modules and .env (secrets stay on the server).

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const release = path.join(root, "release");
const SKIP = new Set(["node_modules", ".env"]);

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

fs.rmSync(release, { recursive: true, force: true });
copyDir(path.join(root, "frontend"), path.join(release, "frontend"));
copyDir(path.join(root, "backend"), path.join(release, "backend"));

console.log("Release built in " + release);
