import catalog from "../data/presetAssets.json";

const assetUrls = import.meta.glob("../assets/3D_assets/*.glb", {
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
      `presetAssets.json references "${asset.file}", which is missing from src/assets/3D_assets/`,
    );
    return [];
  }

  return [{ ...asset, fileName: asset.file, url }];
});
