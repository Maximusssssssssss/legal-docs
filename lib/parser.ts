import { validateINN, validatePhone } from './validators';

const PHONE_PATTERN = /(?<![0-9])(\+7|8)[\s\-()]*\d{3}[\s\-()]*\d{3}[\s\-()]*\d{2}[\s\-()]*\d{2}(?!\d)/;

const EMAIL_PATTERN = /(?<![A-Za-z0-9._%+-])[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?![A-Za-z0-9])/;

function passportPattern(): RegExp {
  return /(?<![0-9])\d{2}\s?\d{2}\s?(?:№|N\.?)?\s?\d{6}(?!\d)/g;
}

function extractPassport(text: string): string {
  const labelIndex = text.search(/паспорт|серия|кем выдан|выдан\s/i);
  if (labelIndex < 0) return '';

  const nearLabel = text.slice(labelIndex, labelIndex + 140).match(passportPattern());
  if (nearLabel && !validateINN(nearLabel[0])) {
    return nearLabel[0].replace(/№/g, '').replace(/\s+/g, ' ');
  }

  return '';
}

function innCandidatePattern(): RegExp {
  return /(?<![0-9+])(\d{12}|\d{10})(?!\d)/g;
}

function extractINN(text: string): string {
  const labelIndex = text.search(/\bИНН\b/i);
  if (labelIndex >= 0) {
    const nearLabel = text.slice(labelIndex, labelIndex + 120).match(innCandidatePattern());
    if (nearLabel && validateINN(nearLabel[0])) return nearLabel[0];
  }

  for (const match of text.matchAll(innCandidatePattern())) {
    if (validateINN(match[0])) return match[0];
  }

  return '';
}

function extractPhone(text: string): string {
  const m = text.match(PHONE_PATTERN);
  if (!m) return '';

  const cleaned = m[0].replace(/[\s\-()]/g, '');
  return validatePhone(cleaned) ? m[0] : '';
}

export function parseFieldsFromText(text: string): Record<string, string> {
  const fields: Record<string, string> = {};

  const inn = extractINN(text);
  if (inn) fields['ИНН'] = inn;

  const phone = extractPhone(text);
  if (phone) fields['Телефон'] = phone;

  const emailMatch = text.match(EMAIL_PATTERN);
  if (emailMatch) fields['Email'] = emailMatch[0];

  const passport = extractPassport(text);
  if (passport) fields['Паспорт'] = passport;

  const nameMatch = text.match(/(?:Ф\.?\s*И\.?\s*О\.?|ФИО|ф\.и\.о\.?)[\s:]+([А-ЯЁа-яё]+\s+[А-ЯЁа-яё]+\s+[А-ЯЁа-яё]+)/i);
  if (nameMatch) fields['ФИО'] = nameMatch[1].trim();

  const addressMatch = text.match(/(?:адрес|место жительства|место регистрации)[\s:]+([^\n]{10,})/i);
  if (addressMatch) fields['Адрес'] = addressMatch[1].replace(/[,;\s]+$/, '').trim();

  const ogrnipMatch = text.match(/ОГРНИП[\s:]*(\d{15})(?!\d)/i);
  if (ogrnipMatch) fields['ОГРНИП'] = ogrnipMatch[1];

  const dateMatch = text.match(/(?:дата рождения|рождения)[\s:]+(\d{2}[\.\-\/]\d{2}[\.\-\/]\d{4})/i);
  if (dateMatch) fields['Дата рождения'] = dateMatch[1];

  return fields;
}