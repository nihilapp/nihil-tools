import { describe, expect, it } from 'vitest';

import { formatFileSize,
  getSavedPercent,
  getWebpOutputName,
  isConvertibleImageFile } from '~/utils/image-webp-converter';

describe('image-webp-converter', () => {
  it('accepts PNG, JPG, and JPEG files only', () => {
    expect(isConvertibleImageFile(new File([
      'png',
    ], 'map.PNG', { type: 'image/png' }))).toBe(true);
    expect(isConvertibleImageFile(new File([
      'jpg',
    ], 'portrait.jpg', { type: 'image/jpeg' }))).toBe(true);
    expect(isConvertibleImageFile(new File([
      'jpeg',
    ], 'portrait.JPEG', { type: '' }))).toBe(true);
    expect(isConvertibleImageFile(new File([
      'gif',
    ], 'motion.gif', { type: 'image/gif' }))).toBe(false);
  });

  it('creates a WebP output name and never reports a negative saving', () => {
    expect(getWebpOutputName('image.final.JPG')).toBe('image.final.webp');
    expect(getSavedPercent(100, 140)).toBe(0);
    expect(getSavedPercent(200, 150)).toBe(25);
  });

  it('formats file sizes using a readable unit', () => {
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1024)).toBe('1.00 KB');
    expect(formatFileSize(10 * 1024 * 1024)).toBe('10.0 MB');
  });
});
