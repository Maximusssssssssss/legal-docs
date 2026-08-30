'use client';

import { useState } from 'react';
import Link from 'next/link';
import FileUploader from '@/components/FileUploader';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FileText, ArrowLeft, Check } from 'lucide-react';

export default function UploadPage() {
  const [extractedData, setExtractedData] = useState<Record<string, string> | null>(null);

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold">Загрузка документа</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Извлечение данных из документа
          </h1>
          <p className="text-gray-600">
            Загрузите PDF, DOC, DOCX или скан документа, и ИИ автоматически извлечёт ФИО, ИНН, адрес и другие данные.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <FileUploader onParsed={setExtractedData} />
        </div>

        {extractedData && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Данные готовы к использованию</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Извлечённые данные сохранены и будут автоматически подставлены в поля шаблона или чата с ИИ при создании документов:
            </p>
            <div className="flex gap-4">
              <Link
                href="/create"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                Создать документ с этими данными
              </Link>
              <Link
                href="/templates"
                className="px-6 py-3 border border-gray-300 font-medium rounded-lg hover:bg-gray-50"
              >
                Выбрать шаблон
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-2">Как это работает?</h3>
          <ol className="text-sm text-blue-800 space-y-2">
            <li>1. Загрузите PDF, DOC, DOCX или изображение документа</li>
            <li>2. ИИ распознает текст (OCR) и структурирует данные</li>
            <li>3. ФИО, ИНН, адрес и другие данные будут автоматически извлечены</li>
            <li>4. Данные автоматически подставятся в поля выбранного шаблона</li>
          </ol>
        </div>
      </main>
      <Footer />
    </div>
    </ProtectedRoute>
  );
}
