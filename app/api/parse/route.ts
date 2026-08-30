import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import WordExtractor from 'word-extractor';
import { parseFieldsFromText } from '@/lib/parser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Файл не загружен' }, { status: 400 });
    }

    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/tiff',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Неподдерживаемый формат файла. Используйте PDF, DOC, DOCX, PNG, JPG или TIFF' },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    let text = '';

    if (file.type === 'application/pdf') {
      const result = await extractText(bytes);
      text = Array.isArray(result.text) ? result.text.join('\n') : result.text;
    } else if (
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await extractDocText(bytes, file.type);
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

async function extractDocText(bytes: Uint8Array, mimeType: string): Promise<string> {
  const buffer = Buffer.from(bytes);

  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  const extractor = new WordExtractor();
  const doc = await extractor.extract(buffer);
  return doc.getBody();
}