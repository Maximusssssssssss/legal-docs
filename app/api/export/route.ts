import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const FONT_DIR = process.cwd() + '/lib/fonts';

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 43;
const FONT_SIZE = 12;
const LINE_HEIGHT = 18;
const MIN_Y = MARGIN;

export async function POST(request: NextRequest) {
  try {
    const { text, format } = await request.json();

    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Текст документа обязателен' }, { status: 400 });
    }

    if (format !== 'docx' && format !== 'pdf') {
      return NextResponse.json({ error: 'Формат должен быть docx или pdf' }, { status: 400 });
    }

    const firstLine = text.split('\n').map(l => l.trim()).find(Boolean) || 'Документ';

    if (format === 'docx') {
      return await createDocx(text, firstLine);
    }

    return await createPdf(text, firstLine);
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Ошибка экспорта документа' }, { status: 500 });
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*\[\]]/g, '_').replace(/\s+/g, '_').slice(0, 80);
}

function encodeFilename(raw: string): string {
  return encodeURIComponent(sanitizeFilename(raw));
}

function disposition(filename: string): string {
  return `attachment; filename="document.${filename.split('.').pop()}"; filename*=UTF-8''${encodeFilename(filename)}`;
}

async function createDocx(text: string, firstLine: string) {
  const lines = text.split('\n');

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Times New Roman', size: 24 },
          paragraph: { spacing: { after: 120, line: 360 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1134, right: 850, bottom: 1134, left: 850 },
          },
        },
        children: lines.map(line =>
          new Paragraph({ children: [new TextRun({ text: line })] })
        ),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const filename = sanitizeFilename(`${firstLine}.docx`);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': disposition(filename),
    },
  });
}

async function createPdf(text: string, firstLine: string) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const [regularBytes, boldBytes] = await Promise.all([
    fs.readFile(path.join(FONT_DIR, 'Ubuntu-R.ttf')),
    fs.readFile(path.join(FONT_DIR, 'Ubuntu-B.ttf')),
  ]);

  const regular = await pdfDoc.embedFont(regularBytes);
  const bold = await pdfDoc.embedFont(boldBytes);

  const width = PAGE_WIDTH - MARGIN * 2;
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const isBoldLine = (line: string) => {
    const letters = line.replace(/[^A-Za-zА-ЯЁа-яё]/g, '');
    return letters.length >= 3 && line === line.toUpperCase();
  };

  for (const rawLine of text.split('\n')) {
    const useBold = isBoldLine(rawLine.trim());
    const font = useBold ? bold : regular;

    if (rawLine.trim() === '') {
      y -= LINE_HEIGHT;
      continue;
    }

    for (const wrapped of wrapLine(rawLine, font, width)) {
      if (y - FONT_SIZE < MIN_Y) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN;
      }
      page.drawText(wrapped, {
        x: MARGIN,
        y: y - FONT_SIZE,
        size: FONT_SIZE,
        font,
        color: rgb(0, 0, 0),
      });
      y -= LINE_HEIGHT;
    }
  }

  const bytes = await pdfDoc.save();
  const filename = sanitizeFilename(`${firstLine}.pdf`);

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': disposition(filename),
    },
  });
}

function wrapLine(line: string, font: { widthOfTextAtSize: (t: string, s: number) => number }, width: number): string[] {
  const words = line.split(/\s+/);
  const result: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, FONT_SIZE) <= width || !current) {
      current = candidate;
    } else {
      result.push(current);
      current = word;
    }
  }

  if (current) result.push(current);
  return result;
}