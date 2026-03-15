export function dataUrlToBase64(dataUrl = '') {
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : '';
}
