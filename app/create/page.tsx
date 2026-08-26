'use client';

import { useState } from 'react';
import Link from 'next/link';
import ChatAI from '@/components/ChatAI';
import DocumentForm from '@/components/DocumentForm';
import Footer from '@/components/Footer';
import { documentTemplates } from '@/lib/templates';
import { DocumentTemplate } from '@/types';
import { ArrowLeft, FileText, FilePlus } from 'lucide-react';

export default function CreatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [mode, setMode] = useState<'choose' | 'chat' | 'form'>('choose');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" />
            <span className="text-lg font-bold">Создание документа</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {mode === 'choose' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Как вы хотите создать документ?
              </h1>
              <p className="text-gray-600">
                Выберите способ создания документа
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => setMode('chat')}
                className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all text-left"
              >
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <FilePlus className="w-7 h-7 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Чат с ИИ</h2>
                <p className="text-gray-600">
                  Опишите документ словами, и ИИ поможет его составить. Задаст уточняющие вопросы и создаст документ.
                </p>
              </button>

              <button
                onClick={() => setMode('form')}
                className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Выбрать шаблон</h2>
                <p className="text-gray-600">
                  Выберите готовый шаблон документа и заполните поля формы. Быстро и удобно.
                </p>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {documentTemplates.slice(0, 6).map((template) => (
                <button
                  key={template.id}
                  onClick={() => { setSelectedTemplate(template); setMode('form'); }}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left"
                >
                  <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'chat' && (
          <>
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={() => setMode('choose')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Чат с ИИ</h1>
            </div>
            <ChatAI />
          </>
        )}

        {mode === 'form' && !selectedTemplate && (
          <>
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={() => setMode('choose')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Выберите шаблон</h1>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {documentTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left"
                >
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                  <span className="text-xs text-gray-400 mt-2 block">{template.fields.length} полей</span>
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'form' && selectedTemplate && (
          <DocumentForm
            template={selectedTemplate}
            onClose={() => { setSelectedTemplate(null); setMode('choose'); }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
