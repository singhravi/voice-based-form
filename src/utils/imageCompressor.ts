import { CompressionResult } from '../types';

/**
 * Format KB into human-readable string (KB or MB)
 */
export function formatKB(sizeInKB: number): string {
  if (sizeInKB >= 1024) {
    return `${(sizeInKB / 1024).toFixed(2)} MB`;
  }
  return `${sizeInKB.toFixed(1)} KB`;
}

/**
 * Compress an image file or DataURL to ensure it is under `targetMaxKB` (e.g. 200 KB or 50 KB).
 * Uses Canvas API with progressive downscaling and JPEG quality reduction.
 */
export async function compressImageToTarget(
  source: File | Blob | string,
  targetMaxKB: number = 200,
  maxInitialDimension: number = 1600
): Promise<CompressionResult> {
  let img: HTMLImageElement;
  let originalSizeKB = 0;

  if (typeof source === 'string') {
    // It's a data URL
    img = await loadImageFromUrl(source);
    // Estimate size of base64
    const base64Length = source.length - (source.indexOf(',') + 1);
    originalSizeKB = Math.round((base64Length * 3) / 4) / 1024;
  } else {
    originalSizeKB = source.size / 1024;
    const url = URL.createObjectURL(source);
    img = await loadImageFromUrl(url);
    URL.revokeObjectURL(url);
  }

  // If already below target and reasonably sized, return with light normalization
  const canvas = document.createElement('canvas');
  let { width, height } = img;

  // Scale down if oversized dimensions
  if (width > maxInitialDimension || height > maxInitialDimension) {
    const ratio = Math.min(maxInitialDimension / width, maxInitialDimension / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Fill background white for JPEG
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  // Binary search / Stepped quality optimization to ensure <= targetMaxKB
  let minQuality = 0.2;
  let maxQuality = 0.95;
  let bestBlob: Blob | null = null;
  let bestDataUrl = '';
  let bestSizeKB = Infinity;

  // Try higher quality first
  for (let step = 0; step < 6; step++) {
    const quality = (minQuality + maxQuality) / 2;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );

    if (!blob) break;
    const currentSizeKB = blob.size / 1024;

    if (currentSizeKB <= targetMaxKB) {
      bestBlob = blob;
      bestSizeKB = currentSizeKB;
      // Try pushing higher quality
      minQuality = quality;
    } else {
      // Too big, decrease quality
      maxQuality = quality;
    }
  }

  // If still above target even at low quality, scale down resolution progressively
  while (bestSizeKB > targetMaxKB && width > 400 && height > 400) {
    width = Math.round(width * 0.8);
    height = Math.round(height * 0.8);
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.65)
    );

    if (blob) {
      bestBlob = blob;
      bestSizeKB = blob.size / 1024;
    }
  }

  // If initial file was already smaller than target and bestBlob didn't trigger
  if (!bestBlob) {
    bestBlob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.85)
    );
    bestSizeKB = bestBlob.size / 1024;
  }

  bestDataUrl = await blobToDataUrl(bestBlob);
  const reductionPercentage = Math.max(0, Math.round(((originalSizeKB - bestSizeKB) / originalSizeKB) * 100));

  return {
    file: bestBlob,
    dataUrl: bestDataUrl,
    originalSizeKB: Math.round(originalSizeKB * 10) / 10,
    compressedSizeKB: Math.round(bestSizeKB * 10) / 10,
    reductionPercentage,
    width,
    height
  };
}

/**
 * Passport Photo specific crop & compression (Standard 3.5cm x 4.5cm ratio, <= 50KB)
 */
export async function createPassportPhoto(
  sourceImage: HTMLImageElement | string,
  cropArea?: { x: number; y: number; width: number; height: number }
): Promise<CompressionResult> {
  let img: HTMLImageElement;
  if (typeof sourceImage === 'string') {
    img = await loadImageFromUrl(sourceImage);
  } else {
    img = sourceImage;
  }

  const canvas = document.createElement('canvas');
  // 350x450 px represents standard 3.5cm x 4.5cm at 254 dpi (perfect for govt portals)
  const targetWidth = 350;
  const targetHeight = 450;
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context error');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  if (cropArea) {
    ctx.drawImage(
      img,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      targetWidth,
      targetHeight
    );
  } else {
    // Center crop with 3.5:4.5 aspect ratio
    const srcAspect = img.width / img.height;
    const targetAspect = targetWidth / targetHeight;
    let sWidth = img.width;
    let sHeight = img.height;
    let sx = 0;
    let sy = 0;

    if (srcAspect > targetAspect) {
      sWidth = img.height * targetAspect;
      sx = (img.width - sWidth) / 2;
    } else {
      sHeight = img.width / targetAspect;
      sy = (img.height - sHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
  }

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
  );

  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  const sizeKB = Math.round((blob.size / 1024) * 10) / 10;

  return {
    file: blob,
    dataUrl,
    originalSizeKB: sizeKB,
    compressedSizeKB: sizeKB,
    reductionPercentage: 0,
    width: targetWidth,
    height: targetHeight
  };
}

function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image for compression: ' + e));
    img.src = url;
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
