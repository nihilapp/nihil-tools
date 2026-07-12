export type ImageWebpConversionStatus = 'pending' | 'converting' | 'done' | 'error';

export interface ImageWebpConversionItem {
  id: string;
  sourceFile: File;
  sourceUrl: string;
  outputBlob: Blob | null;
  outputUrl: string | null;
  outputName: string;
  status: ImageWebpConversionStatus;
  errorMessage: string | null;
}
