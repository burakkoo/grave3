export function urlToFileName(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Get the pathname and remove leading slash
    const path = urlObj.pathname.slice(1);
    // Get the last segment of the path which should be the filename
    const segments = path.split('/');
    return segments[segments.length - 1] || null;
  } catch {
    return null;
  }
} 