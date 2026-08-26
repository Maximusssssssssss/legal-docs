'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ArrowLeft, FileText, Download, Trash2, Calendar, FolderOpen } from 'lucide-react';
import { getDocuments } from '@/lib/supabase';

interface SavedDocument {
  id: string;
  title: string;
  content: string;
  templateId: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const docs = await getDocuments();
        if (docs && docs.length > 0) {
          setDocuments(docs.map(d => ({
            id: d.id,
            title: d.title,
            content: d.content,
            templateId: d.template_id,
            createdAt: d.created_at,
          })));
          setLoading(false);
          return;
        }
      } catch {
        // Supabase unavailable, fall through to localStorage
      }
      const saved = localStorage.getItem('generatedDocuments');
      if (saved) {
        setDocuments(JSON.parse(saved));
      }
      setLoading(false);
    }
    loadDocuments();
  }, []);

  const deleteDocument = (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    localStorage.setItem('generatedDocuments', JSON.stringify(updated));
  };

  const downloadDocument = (doc: SavedDocument) => {
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}_${new Date(doc.createdAt).toLocaleDateString('ru-RU')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold">Мои документы</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Мои документы
          </h1>
          <p className="text-gray-600">
            Все созданные вами документы в одном месте
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Загрузка...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Пока нет документов
            </h2>
            <p className="text-gray-500 mb-6">
              Создайте первый документ, и он появится здесь
            </p>
            <Link
              href="/create"
              className="inline-flex px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Создать документ
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(doc.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadDocument(doc)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Скачать"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
    </ProtectedRoute>
  );
}
