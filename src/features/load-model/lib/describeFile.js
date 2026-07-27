export const SUPPORTED_EXTENSION = "glb";

export const hasSupportedExtension = (fileName) =>
  fileName.split(".").pop().toLowerCase() === SUPPORTED_EXTENSION;

/** The file-level half of `stats`, known before the model itself is parsed. */
export const describeFile = (fileName, fileSize) => ({
  format: `.${SUPPORTED_EXTENSION}`,
  fileName,
  fileSize,
  fileSizeKB: (fileSize / 1024).toFixed(2),
  fileSizeMB: (fileSize / (1024 * 1024)).toFixed(2),
});
