'use client';

import { useState } from 'react';
import { X, Loader2, Download, Check, AlertCircle } from 'lucide-react';
import { DocumentTemplate, DocumentField } from '@/types';
import { validateINN } from '@/lib/validators';
import { saveDocument } from '@/lib/supabase';
import { exportDocument, makeDocumentFilename } from '@/lib/export';

interface DocumentFormProps {
  template: DocumentTemplate;
  prefilledData?: Record<string, string>;
  onClose: () => void;
}

export default function DocumentForm({ template, prefilledData = {}, onClose }: DocumentFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(prefilledData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const newValidationErrors: string[] = [];

    template.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} обязательно для заполнения`;
      }

      if (field.name.toLowerCase().includes('inn') && formData[field.name]) {
        if (!validateINN(formData[field.name])) {
          newValidationErrors.push(`ИНН "${formData[field.name]}" некорректен`);
        }
      }
    });

    setErrors(newErrors);
    setValidationErrors(newValidationErrors);

    return Object.keys(newErrors).length === 0 && newValidationErrors.length === 0;
  };

  const generateDocument = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'document',
          templateId: template.id,
          templateContent: template.template,
          data: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка генерации');
      }

      setGeneratedDoc(data.document);

      const saved = {
        id: Date.now().toString(),
        title: template.name,
        content: data.document,
        templateId: template.id,
        createdAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('generatedDocuments') || '[]');
      existing.unshift(saved);
      localStorage.setItem('generatedDocuments', JSON.stringify(existing));

      try {
        await saveDocument({
          template_id: template.id,
          title: template.name,
          content: data.document,
          data: formData,
        });
      } catch {
        // Supabase save failed, localStorage already has the document
      }
    } catch (err) {
      setValidationErrors([err instanceof Error ? err.message : 'Ошибка генерации']);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDocument = async (format: 'docx' | 'pdf') => {
    if (!generatedDoc) return;

    try {
      const filename = makeDocumentFilename(template.name);
      await exportDocument(generatedDoc, format, filename);
    } catch (err) {
      setValidationErrors([err instanceof Error ? err.message : 'Ошибка экспорта']);
    }
  };

  if (generatedDoc) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Документ готов!
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
              {generatedDoc}
            </pre>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={() => downloadDocument('docx')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Скачать DOC
            </button>
            <button
              onClick={() => downloadDocument('pdf')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Скачать PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{template.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {validationErrors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              {validationErrors.map((err, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  {err}
                </div>
              ))}
            </div>
          )}

          {template.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[field.name] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              ) : field.type === 'select' && field.options ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[field.name] ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Выберите...</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[field.name] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              )}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={generateDocument}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Генерация...
              </>
            ) : (
              'Создать документ'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
