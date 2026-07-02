import { cp, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, "");
const dist = join(root, "dist");
const publicDir = join(dist, "server", "public");

const staticEntries = [
  "index.html",
  "about.html",
  "photography.html",
  "writing.html",
  "contact.html",
  "styles.css",
  "script.js",
  "data/portfolio.json",
  "components-loader.js",
  "robots.txt",
  "sitemap.xml",
  "CNAME"
];

const imageAssets = [
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

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

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

await rm(dist, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });

for (const entry of staticEntries) {
  const source = join(root, entry);
  if (await exists(source)) {
    await copyEntry(source, join(publicDir, entry));
  }
}

for (const entry of imageAssets) {
  const source = join(root, entry);
  if (await exists(source)) {
    await copyEntry(source, join(publicDir, entry));
  }
}

for (const fileName of lightboxAssets) {
  const optimizedSource = join(root, "images", "thumbnails", "portfolio", fileName);
  const originalSource = join(root, "images", "portfolio", fileName);
  const source = (await exists(optimizedSource)) ? optimizedSource : originalSource;

  if (await exists(source)) {
    await copyEntry(source, join(publicDir, "images", "portfolio", fileName));
  }
}

const sourcePublic = join(root, "public");
if (await exists(sourcePublic)) {
  const publicEntries = await readdir(sourcePublic);
  for (const entry of publicEntries) {
    if (entry === ".DS_Store") {
      continue;
    }
    await copyEntry(join(sourcePublic, entry), join(publicDir, entry));
  }
}

await mkdir(join(dist, "server"), { recursive: true });
await writeFile(join(dist, "server", "index.js"), workerSource);

await mkdir(join(dist, ".openai"), { recursive: true });
await cp(
  join(root, ".openai", "hosting.json"),
  join(dist, ".openai", "hosting.json")
);
