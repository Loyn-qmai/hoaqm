export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscountPercentage(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If the input is plain text (e.g. flower name from a hyperlink text), it's not a valid image URL
  if (!/^(https?:\/\/|data:image)/i.test(trimmed)) {
    return '';
  }

  if (
    trimmed.includes('drive.google.com') ||
    trimmed.includes('docs.google.com') ||
    trimmed.includes('googleusercontent.com')
  ) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // Use Google direct CDN endpoint for primary rendering
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  return trimmed;
}

export function parsePrice(val: any): number {
  if (typeof val === 'number') {
    if (val < 1000 && val > 0) return Math.round(val * 1000);
    return Math.round(val);
  }
  if (!val) return 200000;
  let str = String(val).toLowerCase().trim();
  if (!str) return 200000;

  // Handle "165k5", "165k", "165,5k", "165.5k"
  if (str.includes('k')) {
    let kStr = str.replace(/k/g, '.').replace(',', '.');
    if (kStr.endsWith('.')) kStr = kStr.slice(0, -1);
    const num = parseFloat(kStr.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 200000 : Math.round(num * 1000);
  }

  // Handle "1.5tr", "1,5tr", "1m5"
  if (str.includes('tr') || str.includes('m')) {
    let trStr = str.replace(/tr|m/g, '.').replace(',', '.');
    if (trStr.endsWith('.')) trStr = trStr.slice(0, -1);
    const num = parseFloat(trStr.replace(/[^\d.]/g, ''));
    return isNaN(num) ? 200000 : Math.round(num * 1000000);
  }

  // Check if standard formatted string with dots/commas e.g. "225.000", "225,000", "225.500"
  if (/^\d{1,3}([.,]\d{3})+$/.test(str.replace(/[^\d.,]/g, ''))) {
    const cleaned = str.replace(/[^\d]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 200000 : num;
  }

  // Check if comma/dot as decimal e.g. "225,5" or "225.5" or "165,5"
  const cleanDotComma = str.replace(/[^\d.,]/g, '');
  if (/^\d+[.,]\d{1,3}$/.test(cleanDotComma)) {
    const num = parseFloat(cleanDotComma.replace(',', '.'));
    if (!isNaN(num)) {
      return num < 1000 ? Math.round(num * 1000) : Math.round(num);
    }
  }

  // Fallback: strip non-digits
  const cleaned = str.replace(/[^\d]/g, '');
  const num = parseInt(cleaned, 10);
  if (isNaN(num)) return 200000;

  if (num < 1000 && num > 0) {
    return num * 1000;
  }

  return num;
}
