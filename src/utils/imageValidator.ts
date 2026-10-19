/**
 * Astra 7 — Resilient Image Validation Pipeline
 * Validates format, size, dimensions, and visual integrity before transmission
 */

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  file?: File;
  base64?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  formattedSize?: string;
  filename?: string;
}

const SUPPORTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]);

const SUPPORTED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Validates an image file or DataURL comprehensively
 */
export async function validateImageFile(file: File): Promise<ImageValidationResult> {
  // 1. File existence check
  if (!file) {
    return {
      valid: false,
      error: 'No image file was provided.'
    };
  }

  // 2. Extension & MIME Type Check
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type.toLowerCase();

  const isMimeSupported = SUPPORTED_MIME_TYPES.has(mimeType);
  const isExtSupported = SUPPORTED_EXTENSIONS.has(extension);

  if (!isMimeSupported && !isExtSupported) {
    return {
      valid: false,
      error: `Unsupported image format (${extension.toUpperCase() || 'unknown'}). Supported formats are JPG, JPEG, PNG, and WEBP.`
    };
  }

  // 3. File Size Validation (Max 20MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image size (${formatBytes(file.size)}) exceeds the maximum allowed limit of 20MB.`
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'The selected image file is empty (0 bytes).'
    };
  }

  // 4. Read File to Base64 Data URL
  let dataUrl = '';
  try {
    dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file data.'));
      reader.readAsDataURL(file);
    });
  } catch (err: any) {
    return {
      valid: false,
      error: 'Failed to read image file. Please check file permissions and try again.'
    };
  }

  // 5. Corrupted Image Detection & Dimension Extraction
  return new Promise<ImageValidationResult>((resolve) => {
    const img = new Image();
    
    // Set a timeout to prevent hanging on malformed files
    const timer = setTimeout(() => {
      resolve({
        valid: false,
        error: 'Image decoding timed out. The file may be corrupted.'
      });
    }, 8000);

    img.onload = () => {
      clearTimeout(timer);
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        resolve({
          valid: false,
          error: 'The image appears corrupted or contains zero displayable pixels.'
        });
        return;
      }

      resolve({
        valid: true,
        file,
        base64: dataUrl,
        mimeType: mimeType || `image/${extension === 'jpg' ? 'jpeg' : extension}`,
        width: img.naturalWidth,
        height: img.naturalHeight,
        sizeBytes: file.size,
        formattedSize: formatBytes(file.size),
        filename: file.name
      });
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve({
        valid: false,
        error: 'The selected image appears corrupted or unreadable. Please choose another image.'
      });
    };

    img.src = dataUrl;
  });
}
