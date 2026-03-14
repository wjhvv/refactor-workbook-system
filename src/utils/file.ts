export function filterFilesByAccept(
  files: File[],
  allowedExtensions: string,
): File[] {
  const extensions = allowedExtensions
    .split(",")
    .map((t) => t.trim().toLowerCase()) // 轉換成小寫
    .map((t) => (t.startsWith(".") ? t : `.${t}`)); // 沒有 . 就自動補上

  return files.filter((file) => {
    const fileName = file.name.toLowerCase();
    return extensions.some((ext) => fileName.endsWith(ext));
  });
}
