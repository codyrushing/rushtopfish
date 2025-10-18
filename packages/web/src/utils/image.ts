const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpeg,jpg,png,gif}');

export async function getImageAsset(localPath:string) {
  localPath = localPath.replace(/^packages\/web/, "");
  if (!localPath.startsWith("/")) {
    localPath = `/${localPath}`;
  }
  if (typeof images[localPath] !== "function") {
    console.warn(`No image found for path ${localPath}. The following images were searched:\n${Object.keys(images).join("\n")}`);
    return;
  }
  return (await images[localPath]()).default;
}
