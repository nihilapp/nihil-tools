import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';

import { createWebpArchive, getDownloadOutputName } from '~/utils/image-webp-converter';

describe('getDownloadOutputName', () => {
  it('adds the WebP extension to the typed base name and falls back to the original name when it is empty', () => {
    expect(getDownloadOutputName('final-image', 'source.png')).toBe('final-image.webp');
    expect(getDownloadOutputName('final-image.webp', 'source.png')).toBe('final-image.webp');
    expect(getDownloadOutputName('', 'source.png')).toBe('source.webp');
  });
});

describe('createWebpArchive', () => {
  it('keeps every completed WebP when output names are duplicated', async () => {
    const archive = await createWebpArchive([
      {
        id: 'first',
        outputBlob: new Blob([
          'first',
        ], { type: 'image/webp' }),
        outputName: 'sample.webp',
      },
      {
        id: 'second',
        outputBlob: new Blob([
          'second',
        ], { type: 'image/webp' }),
        outputName: 'sample.webp',
      },
      {
        id: 'third',
        outputBlob: new Blob([
          'third',
        ], { type: 'image/webp' }),
        outputName: 'sample.webp',
      },
    ]);
    const zip = await JSZip.loadAsync(archive);

    expect(Object.keys(zip.files)).toEqual([
      'sample.webp',
      'sample (2).webp',
      'sample (3).webp',
    ]);
    await expect(zip.file('sample.webp')?.async('text')).resolves.toBe('first');
    await expect(zip.file('sample (2).webp')?.async('text')).resolves.toBe('second');
    await expect(zip.file('sample (3).webp')?.async('text')).resolves.toBe('third');
  });
});
