export type ExportFormat = 'docx' | 'pdf';

export async function exportDocument(
  text: string,
  format: ExportFormat,
  baseFilename: string
): Promise<void> {
  const response = await fetch('/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, format }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Ошибка экспорта документа');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${baseFilename}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*[\]]/g, '').replace(/\s+/g, '_').slice(0, 60);
}

export function makeDocumentFilename(title: string): string {
  return `${sanitizeFilename(title)}_${new Date().toLocaleDateString('ru-RU')}`;
}