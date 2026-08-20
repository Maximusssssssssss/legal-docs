'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Check, Loader2, AlertCircle } from 'lucide-react';
import { savePerson } from '@/lib/supabase';

interface FileUploaderProps {
  onParsed?: (data: Record<string, string>) => void;
}

export default function FileUploader({ onParsed }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка обработки файла');
      }

      setResult(data.fields);
      onParsed?.(data.fields);

      try {
        await savePerson({
          fullName: data.fields['ФИО'] || data.fields['full_name'] || 'Неизвестно',
          inn: data.fields['ИНН'] || data.fields['inn'] || '',
          address: data.fields['Адрес'] || data.fields['address'] || '',
          phone: data.fields['Телефон'] || data.fields['phone'] || '',
          email: data.fields['Email'] || data.fields['email'] || '',
          passport: data.fields['Паспорт'] || data.fields['passport'] || '',
          dateOfBirth: data.fields['Дата рождения'] || data.fields['date_of_birth'] || '',
          ogrnip: data.fields['ОГРНИП'] || data.fields['ogrnip'] || '',
        });
      } catch {
        // Supabase save failed
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.tiff"
          onChange={handleChange}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              Перетащите файл сюда или нажмите для выбора
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Поддерживаются: PDF, PNG, JPG, TIFF
            </p>
          </div>
        </label>
      </div>

      {file && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{file.name}</span>
            <span className="text-xs text-gray-400">
              ({(file.size / 1024).toFixed(1)} КБ)
            </span>
          </div>
          <button
            onClick={processFile}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Обработка...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Извлечь данные
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Данные извлечены успешно!</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(result).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="bg-white p-2 rounded border border-green-100">
                  <span className="text-gray-500">{key}:</span>
                  <span className="ml-2 font-medium">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
