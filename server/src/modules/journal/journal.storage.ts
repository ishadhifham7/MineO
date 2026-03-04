import { storageBucket } from '../../config/firebase';
import { ImageBlock } from './journal.types';

/**
 * Upload a file buffer to Firebase Storage.
 *
 * @param buffer      Raw file bytes
 * @param storagePath Full path inside the bucket, e.g. users/{uid}/journal/{blockId}.jpg
 * @param mimeType    MIME type of the file (default: image/jpeg)
 * @returns           { imageUrl, imagePath }
 */
export async function uploadImageToStorage(
  buffer: Buffer,
  storagePath: string,
  mimeType = 'image/jpeg'
): Promise<{ imageUrl: string; imagePath: string }> {
  const file = storageBucket.file(storagePath);

  await file.save(buffer, {
    metadata: {
      contentType: mimeType,
      cacheControl: 'public, max-age=31536000', // 1 year cache
    },
  });

  // Generate a long-lived signed URL (10 years).
  // For production you may prefer Firebase Storage download tokens instead.
  const [downloadUrl] = await file.getSignedUrl({
    action: 'read',
    expires: '01-01-2035',
  });

  return { imageUrl: downloadUrl, imagePath: storagePath };
}

/**
 * Delete a single image from Firebase Storage by its stored path.
 * Silently ignores 404s (file already deleted or never uploaded).
 */
export async function deleteImageFromStorage(imagePath: string): Promise<void> {
  if (!imagePath) return;
  try {
    await storageBucket.file(imagePath).delete();
  } catch (err: any) {
    // 404 → file doesn't exist, nothing to clean up
    if (err?.code !== 404 && err?.message?.includes('No such object')) {
      console.warn(`⚠️ Could not delete storage file "${imagePath}":`, err?.message);
    }
  }
}

/**
 * Delete all image blocks belonging to a canvas from Firebase Storage.
 * Used when an entire journal entry is deleted.
 */
export async function deleteCanvasImages(blocks: ImageBlock[]): Promise<void> {
  const imagePaths = blocks
    .filter((b): b is ImageBlock & { imagePath: string } => !!b.imagePath)
    .map((b) => b.imagePath);

  await Promise.all(imagePaths.map(deleteImageFromStorage));
}

/**
 * Diff two sets of blocks and delete Storage files for any image blocks
 * that were in `oldBlocks` but are NOT in `newBlocks`.
 * Used during canvas updates (PUT /canvas).
 */
export async function deleteRemovedImages(
  oldBlocks: ImageBlock[],
  newBlocks: ImageBlock[]
): Promise<void> {
  const newIds = new Set(newBlocks.map((b) => b.id));
  const removedImages = oldBlocks.filter(
    (b) => b.type === 'image' && b.imagePath && !newIds.has(b.id)
  );
  await Promise.all(removedImages.map((b) => deleteImageFromStorage(b.imagePath!)));
}
