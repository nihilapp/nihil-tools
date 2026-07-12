import { convertibleImageMimeTypes } from '~/data/image-webp-converter.data';

export function isConvertibleImageFile(file: File): boolean {
  return convertibleImageMimeTypes.includes(file.type as typeof convertibleImageMimeTypes[number]) ||
    /\.(jpe?g|png)$/i.test(file.name);
}

export function getWebpOutputName(fileName: string): string {
  return `${fileName.replace(/\.(jpe?g|png)$/i, '')}.webp`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = [
    'KB',
    'MB',
    'GB',
  ];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10
    ? 1
    : 2)} ${units[unitIndex]}`;
}

export function getSavedPercent(sourceSize: number, outputSize: number): number {
  if (sourceSize <= 0 || outputSize <= 0) {
    return 0;
  }

  return Math.max(0, Math.round((1 - outputSize / sourceSize) * 100));
}

async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file);
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    const sourceUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(sourceUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      reject(new Error('이미지를 읽을 수 없습니다.'));
    };
    image.src = sourceUrl;
  });
}

export async function convertImageFileToWebp(file: File, quality: number): Promise<Blob> {
  const image = await loadImage(file);
  const canvas = document.createElement('canvas');

  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas를 초기화할 수 없습니다.');
  }

  context.drawImage(image, 0, 0);

  if ('close' in image) {
    image.close();
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('WebP 변환을 지원하지 않는 브라우저입니다.'));
        return;
      }

      resolve(blob);
    }, 'image/webp', quality);
  });
}
