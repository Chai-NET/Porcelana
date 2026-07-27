import catalog from "../config/catalog.json";

const assetUrls = import.meta.glob("@/shared/assets/models/*.glb", {
  eager: true,
  query: "?url",
  import: "default",
});

const urlByFileName = Object.fromEntries(
  Object.entries(assetUrls).map(([path, url]) => [path.split("/").pop(), url]),
);

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
