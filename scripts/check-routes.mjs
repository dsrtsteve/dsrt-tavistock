// Run against a running dev or production server. Only follows local page links.
const base = new URL(process.argv[2] || "http://localhost:3000");
const queue = ["/"];
const visited = new Set();
const failures = [];

while (queue.length) {
  const path = queue.shift();
  if (visited.has(path)) continue;
  visited.add(path);
  const response = await fetch(new URL(path, base));
  const html = await response.text();
  if (response.status !== 200)
    failures.push(`${path}: HTTP ${response.status}`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1)
    failures.push(`${path}: expected exactly one h1`);
  for (const match of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const target = new URL(href, base);
    if (!visited.has(target.pathname)) queue.push(target.pathname);
  }
}

const missing = await fetch(new URL("/this-page-does-not-exist", base));
if (missing.status !== 404)
  failures.push(`Unknown route returned ${missing.status}, expected 404`);

console.log(`Checked ${visited.size} linked pages and the 404 response.`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    "All routes returned 200 with one main heading. Unknown routes return 404.",
  );
}
