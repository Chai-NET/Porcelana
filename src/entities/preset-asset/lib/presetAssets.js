import catalog from "../config/catalog.json";

// JSON cannot carry a Vite `?url` import, so the catalog names files and this
// glob resolves them. `eager` resolves at build time — the JSON is inlined and
// no .json is emitted — while `?url` keeps each .glb a standalone,
// content-hashed file that is fetched only when the user picks it.
const assetUrls = import.meta.glob("@/shared/assets/models/*.glb", {
  eager: true,
  query: "?url",
  import: "default",
});

const urlByFileName = Object.fromEntries(
  Object.entries(assetUrls).map(([path, url]) => [path.split("/").pop(), url]),
);

/** A catalog entry naming a missing file is dropped — one bad row must not take the viewer down. */
export const PRESET_ASSETS = catalog.flatMap((asset) => {
  const url = urlByFileName[asset.file];

  if (!url) {
    console.error(
      `catalog.json references "${asset.file}", which is missing from src/shared/assets/models/`,
    );
    return [];
  }

  return [{ ...asset, fileName: asset.file, url }];
});
