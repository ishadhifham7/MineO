import * as ImageManipulator from "expo-image-manipulator";

/** Max pixel width/height for journal canvas images */
const JOURNAL_IMAGE_MAX_DIM = 1080;

/** Max pixel dimension for profile photos (square) */
const PROFILE_IMAGE_MAX_DIM = 512;

/** JPEG quality for all uploads (0–1) */
const JPEG_QUALITY = 0.7;

export interface CompressedImage {
  uri: string;
  /** Width in pixels after compression */
  width: number;
  /** Height in pixels after compression */
  height: number;
  /** Base64-encoded JPEG string (without data: prefix) */
  base64: string;
}

/**
 * Compress and resize an image for journal canvas uploads.
 * Resizes to max 1080px on the longest side, JPEG quality 0.7.
 */
export async function compressJournalImage(
  localUri: string,
): Promise<CompressedImage> {
  return _compressImage(localUri, JOURNAL_IMAGE_MAX_DIM);
}

/**
 * Compress and resize an image for profile photo uploads.
 * Resizes to max 512px square crop, JPEG quality 0.7.
 */
export async function compressProfileImage(
  localUri: string,
): Promise<CompressedImage> {
  return _compressImage(localUri, PROFILE_IMAGE_MAX_DIM);
}

/**
 * Internal helper: resize to maxDim on the longest side and compress.
 */
async function _compressImage(
  localUri: string,
  maxDim: number,
): Promise<CompressedImage> {
  const result = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: maxDim } }],
    {
      compress: JPEG_QUALITY,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    },
  );

  if (!result.base64) {
    throw new Error("Image compression failed: no base64 output");
  }

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
    base64: result.base64,
  };
}
