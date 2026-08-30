'use client';

import { useState } from 'react';
import Link from 'next/link';
import TemplateCard from '@/components/TemplateCard';
import DocumentForm from '@/components/DocumentForm';
import Footer from '@/components/Footer';
import { documentTemplates } from '@/lib/templates';
import { getExtractedData, clearExtractedData, buildPrefill } from '@/lib/personData';
import { DocumentTemplate } from '@/types';
import { ArrowLeft, FileText, Search, UserCircle2, X } from 'lucide-react';

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [filter, setFilter] = useState<'all' | 'ip' | 'selfemployed' | 'universal'>('all');
  const [search, setSearch] = useState('');
  const [extractedData, setExtractedData] = useState<Record<string, string> | null>(() => getExtractedData());

  const handleClearData = () => {
    clearExtractedData();
    setExtractedData(null);
  };

  const filteredTemplates = documentTemplates.filter((t) => {
    if (filter !== 'all' && t.category !== filter) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            <span className="text-lg font-bold">Каталог шаблонов</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Шаблоны документов
          </h1>
          <p className="text-gray-600">
            Выберите шаблон и заполните форму для создания готового документа
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск шаблонов..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Все' },
              { value: 'ip', label: 'Для ИП' },
              { value: 'selfemployed', label: 'Самозанятые' },
              { value: 'universal', label: 'Универсальные' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as typeof filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {extractedData && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <UserCircle2 className="w-6 h-6 text-green-700 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-900">
                    Данные из загруженного документа доступны
                  </p>
                  <p className="text-sm text-green-700">
                    Будут автоматически подставлены в поля шаблона. Вы сможете их изменить.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(extractedData)
                      .filter(([, value]) => value)
                      .map(([key, value]) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-green-200 rounded-full text-xs text-green-800"
                          title={value}
                        >
                          <span className="text-green-500">{key}:</span>
                          <span className="font-medium">{value.length > 24 ? value.slice(0, 24) + '…' : value}</span>
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleClearData}
                className="px-3 py-1.5 shrink-0 border border-green-300 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 flex items-center gap-1.5"
                title="Удалить данные из загруженного документа"
              >
                <X className="w-4 h-4" />
                Очистить
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={setSelectedTemplate}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Шаблоны не найдены</p>
          </div>
        )}

        <div className="mt-12 p-6 bg-purple-50 border border-purple-200 rounded-xl">
          <h3 className="font-semibold text-purple-900 mb-2">Нужен особый документ?</h3>
          <p className="text-purple-700 text-sm mb-4">
            Если вы не нашли нужный шаблон, воспользуйтесь чатом с ИИ для создания индивидуального документа.
          </p>
          <Link
            href="/create"
            className="inline-flex px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
          >
            Перейти к созданию
          </Link>
        </div>
      </main>

      {selectedTemplate && (
        <DocumentForm
          template={selectedTemplate}
          prefilledData={buildPrefill(selectedTemplate, extractedData || {})}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
      <Footer />
    </div>
  );
}
