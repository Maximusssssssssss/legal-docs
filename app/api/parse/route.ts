import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';
import Tesseract from 'tesseract.js';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Файл не загружен' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Неподдерживаемый формат файла. Используйте PDF, PNG, JPG или TIFF' },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    let text = '';

    if (file.type === 'application/pdf') {
      const result = await extractText(bytes);
      text = Array.isArray(result.text) ? result.text.join('\n') : result.text;
    } else {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await Tesseract.recognize(buffer, 'rus+eng');
      text = result.data.text;
    }

    const fields = parseFieldsFromText(text);

    return NextResponse.json({
      text,
      fields,
      confidence: Object.keys(fields).length > 0 ? 0.85 : 0.5,
    });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Ошибка обработки файла' },
      { status: 500 }
    );
  }
}

function parseFieldsFromText(text: string): Record<string, string> {
  const fields: Record<string, string> = {};

  const innMatch = text.match(/ИНН[\s:]*(\d{10,12})/i);
  if (innMatch) fields['ИНН'] = innMatch[1];

  const phoneMatch = text.match(/(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/);
  if (phoneMatch) fields['Телефон'] = phoneMatch[0];

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) fields['Email'] = emailMatch[0];

  const passportMatch = text.match(/(\d{2}\s?\d{2}\s?\d{6})/);
  if (passportMatch) fields['Паспорт'] = passportMatch[1];

  const nameMatch = text.match(/(?:Ф\.?\s*И\.?\s*О\.?|ФИО|ф\.и\.о\.?)[\s:]+([А-ЯЁа-яё]+\s+[А-ЯЁа-яё]+\s+[А-ЯЁа-яё]+)/i);
  if (nameMatch) fields['ФИО'] = nameMatch[1].trim();

  const addressMatch = text.match(/(?:адрес|место жительства|место регистрации)[\s:]+([^\n,]{10,})/i);
  if (addressMatch) fields['Адрес'] = addressMatch[1].trim();

  const ogrnipMatch = text.match(/ОГРНИП[\s:]*(\d{15})/i);
  if (ogrnipMatch) fields['ОГРНИП'] = ogrnipMatch[1];

  const dateMatch = text.match(/(?:дата рождения|рождения)[\s:]+(\d{2}[\.\-\/]\d{2}[\.\-\/]\d{4})/i);
  if (dateMatch) fields['Дата рождения'] = dateMatch[1];

  return fields;
}
