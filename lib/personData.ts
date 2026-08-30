import { DocumentTemplate } from '@/types';

const STORAGE_KEY = 'extractedPersonData';

export function saveExtractedData(data: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage недоступен — игнорируем
  }
}

export function getExtractedData(): Record<string, string> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearExtractedData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage недоступен — игнорируем
  }
}

const FIELD_RULES: Array<{ key: string; test: (label: string) => boolean }> = [
  { key: 'ИНН', test: (l) => /инн/i.test(l) },
  { key: 'Паспорт', test: (l) => /паспорт/i.test(l) },
  { key: 'Телефон', test: (l) => /телефон|тел\b/i.test(l) },
  { key: 'Email', test: (l) => /email|e-mail|электронн|почт/i.test(l) },
  { key: 'Адрес', test: (l) => /адрес|адресу|место (жительств|регистрации)|прописк/i.test(l) },
  { key: 'ОГРНИП', test: (l) => /огрн/i.test(l) },
  { key: 'Дата рождения', test: (l) => /дата рождения/i.test(l) },
  { key: 'ФИО', test: (l) => /фио|\(ф\.?и\.?о\.?\)|\(ф\.и\.о/i.test(l) },
];

export function buildPrefill(
  template: DocumentTemplate,
  extracted: Record<string, string>
): Record<string, string> {
  const prefill: Record<string, string> = {};

  for (const field of template.fields) {
    const rule = FIELD_RULES.find((r) => r.test(field.label));
    const value = rule && extracted[rule.key];
    if (value) prefill[field.name] = value;
  }

  return prefill;
}