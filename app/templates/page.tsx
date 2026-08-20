'use client';

import { useState } from 'react';
import Link from 'next/link';
import TemplateCard from '@/components/TemplateCard';
import DocumentForm from '@/components/DocumentForm';
import { documentTemplates } from '@/lib/templates';
import { DocumentTemplate } from '@/types';
import { ArrowLeft, FileText, Search } from 'lucide-react';

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [filter, setFilter] = useState<'all' | 'ip' | 'selfemployed' | 'universal'>('all');
  const [search, setSearch] = useState('');

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
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}
