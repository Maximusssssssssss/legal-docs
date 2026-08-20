import { NextResponse } from 'next/server';
import { documentTemplates } from '@/lib/templates';

export async function GET() {
  return NextResponse.json({ templates: documentTemplates });
}
