import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-gray-900">ДоксМастер</span>
            </div>
            <p className="text-sm text-gray-500">
              Сервис подготовки юридических документов для ИП и самозанятых.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Документы</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/offer" className="text-gray-500 hover:text-gray-900">Публичная оферта</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-gray-900">Политика обработки ПДн</Link></li>
              <li><Link href="/templates" className="text-gray-500 hover:text-gray-900">Шаблоны документов</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Реквизиты</h4>
            <div className="text-sm text-gray-500 space-y-1">
              <p>ИП _________________________</p>
              <p>ИНН: _________________________</p>
              <p>ОГРНИП: _________________________</p>
              <p>Адрес: _________________________</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 text-center text-gray-400 text-xs">
          © 2026 ДоксМастер. Сервис предоставляет шаблоны и помогает в оформлении документов.
          Не является юридической консультацией.
        </div>
      </div>
    </footer>
  );
}
