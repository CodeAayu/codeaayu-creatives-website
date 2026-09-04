import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, normalize, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const publicDir = join(dist, "server", "public");
const execFileAsync = promisify(execFile);
const checkOnly = process.argv.slice(2).includes("--check");

if (process.argv.slice(2).some((argument) => argument !== "--check")) {
  throw new Error("Unknown argument. Use --check for source validation or omit it to build.");
}

const staticEntries = [
  "index.html",
  "about.html",
  "photography.html",
  "contact.html",
  "styles.css",
  "script.js",
  "css/celestial-effects.css",
  "js/celestial-effects.js",
  "data/portfolio.json",
  "data/gallery.json",
  "components-loader.js",
  "robots.txt",
  "sitemap.xml",
  "CNAME"
];

const imageAssets = [
  "images/gallery",
  "images/kinetic",
  "images/logos/logo-black.png",
  "images/logos/logo-white.png",
  "images/thumbnails/about/personality-photo-1.jpg",
  "images/thumbnails/about/personality-photo-2.jpg",
  "images/about/final-edits-airport-lights.jpg",
  "images/about/final-edits-blr-airport.jpg",
  "images/thumbnails/portfolio/Black Winged Stilt.jpg",
  "images/thumbnails/portfolio/Blue Dragon.JPG",
  "images/thumbnails/portfolio/Fire_nubra.JPG",
  "images/thumbnails/portfolio/Flower with sun.jpg",
  "images/thumbnails/portfolio/Peacock.jpg",
  "images/thumbnails/portfolio/Pine Forest.jpg",
  "images/thumbnails/portfolio/Purple_heron.jpg",
  "images/thumbnails/portfolio/Spotted_owl.jpg",
  "images/thumbnails/portfolio/Sunrise.jpg",
  "images/thumbnails/portfolio/eagle_fly.jpg",
  "images/thumbnails/portfolio/pamban_sunset.jpg",
  "images/thumbnails/portfolio/portrait-1.jpg",
  "images/thumbnails/portfolio/portrait-5.jpg",
  "images/thumbnails/portfolio/portrait-8.jpg",
  "images/thumbnails/portfolio/vivekanand_memorial.jpg",
  "images/thumbnails/portfolio/wave_splashing.jpg"
];

const lightboxAssets = [
  "Black Winged Stilt.jpg",
  "Blue Dragon.JPG",
  "Fire_nubra.JPG",
  "Flower with sun.jpg",
  "Peacock.jpg",
  "Pine Forest.jpg",
  "Purple_heron.jpg",
  "Spotted_owl.jpg",
  "Sunrise.jpg",
  "eagle_fly.jpg",
  "pamban_sunset.jpg",
  "portrait-1.jpg",
  "portrait-5.jpg",
  "portrait-8.jpg",
  "vivekanand_memorial.jpg",
  "wave_splashing.jpg"
];

const sourcePublic = join(root, "public");
const hostingConfig = join(root, ".openai", "hosting.json");
const manifestFiles = ["data/portfolio.json", "data/gallery.json"];

const checkableJsonFiles = [
  "package.json",
  ".openai/hosting.json",
  ...manifestFiles
];

const checkableSourceExtensions = new Set([".html", ".css", ".js", ".mjs"]);

function displayPath(path) {
  return relative(root, path) || ".";
}

async function listFiles(directory, files = []) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if ([".git", "dist", "node_modules"].includes(entry.name)) {
      continue;
    }

    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      await listFiles(entryPath, files);
    } else if (checkableSourceExtensions.has(extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files;
}

function isExternalReference(reference) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference.trim());
}

function stripUrlSuffix(reference) {
  return reference.trim().split(/[?#]/, 1)[0];
}

function sourceRelativePath(owner, reference) {
  const cleanReference = stripUrlSuffix(reference);
  if (!cleanReference) {
    return null;
  }

  const ownerDirectory = owner === root ? root : dirname(owner);
  const resolvedPath = cleanReference.startsWith("/")
    ? resolve(root, `.${cleanReference}`)
    : resolve(ownerDirectory, cleanReference);
  const rootRelative = relative(root, resolvedPath).split(sep).join("/");

  if (rootRelative === "" || rootRelative.endsWith("/")) {
    return "index.html";
  }

  if (rootRelative === ".") {
    return "index.html";
  }

  if (rootRelative.startsWith("../") || rootRelative === ".." || resolve(root, rootRelative) !== resolvedPath) {
    return null;
  }

  return normalize(rootRelative).split(sep).join("/");
}

async function findCaseSensitivePath(rootRelativePath) {
  const parts = rootRelativePath.split("/").filter((part) => part && part !== ".");
  let currentDirectory = root;

  for (const part of parts) {
    if (part === "..") {
      return { kind: "outside" };
    }

    let entries;
    try {
      entries = await readdir(currentDirectory);
    } catch (error) {
      return { kind: "missing", error };
    }

    if (!entries.includes(part)) {
      const caseInsensitiveMatch = entries.find((entry) => entry.toLowerCase() === part.toLowerCase());
      return caseInsensitiveMatch
        ? { kind: "case-mismatch", actual: caseInsensitiveMatch }
        : { kind: "missing" };
    }

    currentDirectory = join(currentDirectory, part);
  }

  try {
    const details = await stat(currentDirectory);
    return { kind: details.isDirectory() ? "directory" : "file" };
  } catch (error) {
    return { kind: "missing", error };
  }
}

function addReferenceError(errors, owner, reference, details) {
  const ownerPath = displayPath(owner);
  const rootRelativePath = sourceRelativePath(owner, reference);

  if (!rootRelativePath) {
    errors.push(`${ownerPath}: local reference escapes the site root: ${reference}`);
    return;
  }

  if (details.kind === "case-mismatch") {
    errors.push(`${ownerPath}: case-sensitive reference mismatch: ${reference} (actual path entry: ${details.actual})`);
  } else if (details.kind === "outside") {
    errors.push(`${ownerPath}: local reference escapes the site root: ${reference}`);
  } else if (details.kind === "missing") {
    errors.push(`${ownerPath}: missing local reference: ${reference} (resolved as ${rootRelativePath})`);
  } else if (details.kind === "directory") {
    errors.push(`${ownerPath}: local reference points to a directory instead of a file: ${reference}`);
  }
}

async function validateReference(errors, owner, reference, { allowDirectory = false } = {}) {
  if (typeof reference !== "string" || !reference.trim() || isExternalReference(reference)) {
    return;
  }

  const rootRelativePath = sourceRelativePath(owner, reference);
  if (!rootRelativePath) {
    errors.push(`${displayPath(owner)}: local reference escapes the site root: ${reference}`);
    return;
  }

  const details = await findCaseSensitivePath(rootRelativePath);
  if (details.kind === "directory" && allowDirectory) {
    return;
  }

  addReferenceError(errors, owner, reference, details);
}

async function validateSyntax(errors) {
  const jsonPaths = checkableJsonFiles.map((file) => join(root, file));
  const sourcePaths = await listFiles(root);

  for (const file of jsonPaths) {
    try {
      JSON.parse(await readFile(file, "utf8"));
    } catch (error) {
      errors.push(`${displayPath(file)}: invalid JSON: ${error.message}`);
    }
  }

  for (const file of sourcePaths.filter((path) => [".js", ".mjs"].includes(extname(path).toLowerCase()))) {
    try {
      await execFileAsync(process.execPath, ["--check", file]);
    } catch (error) {
      const detail = error.stderr?.trim() || error.stdout?.trim() || error.message;
      errors.push(`${displayPath(file)}: invalid JavaScript: ${detail}`);
    }
  }
}

async function validateBuildInputs(errors) {
  const requiredFiles = [
    ...staticEntries,
    ...imageAssets,
    ".openai/hosting.json"
  ];

  for (const file of requiredFiles) {
    const details = await findCaseSensitivePath(file);
    if (details.kind !== "file" && details.kind !== "directory") {
      addReferenceError(errors, root, file, details);
    }
  }

  const publicDetails = await findCaseSensitivePath("public");
  if (publicDetails.kind !== "directory") {
    addReferenceError(errors, root, "public", publicDetails);
  }

  for (const fileName of lightboxAssets) {
    const optimizedPath = `images/thumbnails/portfolio/${fileName}`;
    const originalPath = `images/portfolio/${fileName}`;
    const optimized = await findCaseSensitivePath(optimizedPath);
    const original = await findCaseSensitivePath(originalPath);

    if (optimized.kind !== "file" && original.kind !== "file") {
      errors.push(`lightbox asset is missing in both supported locations: ${optimizedPath} and ${originalPath}`);
    }
  }

  const hostingDetails = await findCaseSensitivePath(".openai/hosting.json");
  if (hostingDetails.kind !== "file") {
    errors.push(".openai/hosting.json: required hosting configuration is missing");
  }
}

async function validateLocalReferences(errors) {
  const sourcePaths = await listFiles(root);

  for (const file of sourcePaths) {
    if (file === fileURLToPath(import.meta.url)) {
      continue;
    }

    const contents = await readFile(file, "utf8");
    const extension = extname(file).toLowerCase();

    if (extension === ".html") {
      // Component fragments are injected into root pages, so their URLs resolve
      // relative to the page rather than the components directory.
      const referenceOwner = displayPath(file).startsWith("components/") ? root : file;
      const attributePattern = /\b(?:src|href|poster|data-lightbox)\s*=\s*(["'])(.*?)\1/gi;
      for (const match of contents.matchAll(attributePattern)) {
        await validateReference(errors, referenceOwner, match[2]);
      }

      const refreshPattern = /\bcontent\s*=\s*(["'])[^"']*?\burl\s*=\s*([^;"']+)\1/gi;
      for (const match of contents.matchAll(refreshPattern)) {
        await validateReference(errors, referenceOwner, match[2]);
      }
    }

    if (extension === ".css") {
      const cssUrlPattern = /url\(\s*(["']?)(.*?)\1\s*\)/gi;
      for (const match of contents.matchAll(cssUrlPattern)) {
        await validateReference(errors, file, match[2]);
      }
    }

    if ([".js", ".mjs"].includes(extension)) {
      const referenceOwner = root;
      const fetchPattern = /\bfetch\(\s*(["'`])([^"'`]+)\1/gi;
      for (const match of contents.matchAll(fetchPattern)) {
        await validateReference(errors, referenceOwner, match[2]);
      }

      const pathPattern = /(["'`])((?:\.{0,2}\/)?(?:assets|components|data|images|js|css)\/[^"'`?#\s]+)\1/gi;
      for (const match of contents.matchAll(pathPattern)) {
        await validateReference(errors, referenceOwner, match[2]);
      }
    }
  }

  for (const manifestFile of manifestFiles) {
    const manifestPath = join(root, manifestFile);
    let manifest;
    try {
      manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    } catch {
      continue;
    }

    async function walkManifest(value) {
      if (Array.isArray(value)) {
        for (const item of value) {
          await walkManifest(item);
        }
        return;
      }

      if (!value || typeof value !== "object") {
        return;
      }

      for (const [key, child] of Object.entries(value)) {
        if (typeof child === "string" && /^(?:thumb|full|src|image|asset|icon|logo)$/i.test(key)) {
          await validateReference(errors, root, child);
        } else {
          await walkManifest(child);
        }
      }
    }

    await walkManifest(manifest);
  }
}

function normalizeSiteUrl(value, baseOrigin) {
  try {
    const url = new URL(value, baseOrigin);
    if (url.origin !== baseOrigin) {
      return null;
    }
    url.hash = "";
    url.search = "";
    return url.toString();
  } catch {
    return null;
  }
}

async function validateSitemap(errors) {
  const sitemapPath = join(root, "sitemap.xml");
  let sitemap;
  try {
    sitemap = await readFile(sitemapPath, "utf8");
  } catch (error) {
    errors.push(`sitemap.xml: cannot read sitemap: ${error.message}`);
    return;
  }
  const locs = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1]);
  const htmlPaths = (await listFiles(root)).filter((path) => extname(path).toLowerCase() === ".html");
  const canonicalValues = [];

  for (const file of htmlPaths) {
    const contents = await readFile(file, "utf8");
    const canonical = contents.match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i)
      || contents.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["'][^>]*>/i);
    if (canonical) {
      canonicalValues.push(canonical[1]);
    }
  }

  if (locs.length === 0) {
    errors.push("sitemap.xml: no <loc> entries found");
    return;
  }

  const baseOrigin = (() => {
    try {
      return new URL(canonicalValues[0]).origin;
    } catch {
      return null;
    }
  })();

  if (!baseOrigin) {
    errors.push("sitemap.xml: cannot determine the canonical site origin");
    return;
  }

  const normalizedLocs = locs.map((loc) => normalizeSiteUrl(loc, baseOrigin));
  if (normalizedLocs.some((loc) => !loc)) {
    errors.push("sitemap.xml: every <loc> must use the same canonical site origin");
  }

  const uniqueLocs = new Set(normalizedLocs.filter(Boolean));
  if (uniqueLocs.size !== normalizedLocs.length) {
    errors.push("sitemap.xml: duplicate <loc> entries found");
  }

  for (const loc of uniqueLocs) {
    const url = new URL(loc);
    const pagePath = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\//, "");
    const details = await findCaseSensitivePath(pagePath);
    if (details.kind !== "file") {
      addReferenceError(errors, sitemapPath, url.pathname, details);
    }
  }

  const canonicalUrls = new Set(
    canonicalValues
      .map((value) => normalizeSiteUrl(value, baseOrigin))
      .filter(Boolean)
  );
  const missingFromSitemap = [...canonicalUrls].filter((url) => !uniqueLocs.has(url));
  const extraInSitemap = [...uniqueLocs].filter((url) => !canonicalUrls.has(url));

  if (missingFromSitemap.length > 0) {
    errors.push(`sitemap.xml: canonical page(s) missing from sitemap: ${missingFromSitemap.join(", ")}`);
  }
  if (extraInSitemap.length > 0) {
    errors.push(`sitemap.xml: URL(s) do not match a page canonical: ${extraInSitemap.join(", ")}`);
  }
}

async function runChecks() {
  const errors = [];
  await validateSyntax(errors);
  await validateBuildInputs(errors);
  await validateLocalReferences(errors);
  await validateSitemap(errors);

  if (errors.length > 0) {
    throw new Error(`Static validation failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  }

  console.log("Static validation passed: JSON/JS syntax, case-sensitive local references, sitemap, and build inputs.");
}

const workerSource = `const cacheHeaders = {
  "Cache-Control": "public, max-age=300"
};

function candidatePaths(pathname) {
  const normalized = pathname.replace(/\\/+/g, "/");

  if (normalized === "/" || normalized === "") {
    return ["/index.html"];
  }

  const candidates = [normalized];
  const lastSegment = normalized.split("/").pop() || "";

  if (normalized.endsWith("/")) {
    candidates.push(normalized + "index.html");
  } else if (!lastSegment.includes(".")) {
    candidates.push(normalized + ".html", normalized + "/index.html");
  }

  return candidates;
}

async function fetchAsset(request, env, pathname) {
  if (!env.ASSETS) {
    return null;
  }

  for (const candidate of candidatePaths(pathname)) {
    const assetUrl = new URL(request.url);
    assetUrl.pathname = candidate;

    const assetRequest = new Request(assetUrl, request);
    const response = await env.ASSETS.fetch(assetRequest);

    if (response.status !== 404) {
      return response;
    }
  }

  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await fetchAsset(request, env, url.pathname);

    if (!response) {
      return new Response("Static asset binding is unavailable.", {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    if (response.status === 404) {
      return new Response("Not found", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    const headers = new Headers(response.headers);
    if (!headers.has("Cache-Control")) {
      for (const [key, value] of Object.entries(cacheHeaders)) {
        headers.set(key, value);
      }
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
`;

async function copyEntry(source, destination) {
  const details = await stat(source);

  if (details.isDirectory()) {
    await mkdir(destination, { recursive: true });
    const children = await readdir(source);

    for (const child of children) {
      if (child === ".DS_Store") {
        continue;
      }
      await copyEntry(join(source, child), join(destination, child));
    }
    return;
  }

  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination);
}

await runChecks();

if (checkOnly) {
  process.exit(0);
}

await rm(dist, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });

for (const entry of staticEntries) {
  const source = join(root, entry);
  await copyEntry(source, join(publicDir, entry));
}

for (const entry of imageAssets) {
  const source = join(root, entry);
  await copyEntry(source, join(publicDir, entry));
}

for (const fileName of lightboxAssets) {
  const optimizedSource = join(root, "images", "thumbnails", "portfolio", fileName);
  const originalSource = join(root, "images", "portfolio", fileName);
  const optimizedDetails = await findCaseSensitivePath(`images/thumbnails/portfolio/${fileName}`);
  const source = optimizedDetails.kind === "file" ? optimizedSource : originalSource;

  await copyEntry(source, join(publicDir, "images", "portfolio", fileName));
}

const publicEntries = await readdir(sourcePublic);
for (const entry of publicEntries) {
  if (entry === ".DS_Store") {
    continue;
  }
  await copyEntry(join(sourcePublic, entry), join(publicDir, entry));
}

await mkdir(join(dist, "server"), { recursive: true });
await writeFile(join(dist, "server", "index.js"), workerSource);

await mkdir(join(dist, ".openai"), { recursive: true });
await cp(hostingConfig, join(dist, ".openai", "hosting.json"));
