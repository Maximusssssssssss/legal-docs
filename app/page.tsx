import Link from 'next/link';
import Footer from '@/components/Footer';
import { FileUp, FilePlus, FileText, Shield, Zap, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ДоксМастер</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/upload" className="text-gray-600 hover:text-gray-900 font-medium">
              Загрузить
            </Link>
            <Link href="/create" className="text-gray-600 hover:text-gray-900 font-medium">
              Создать
            </Link>
            <Link href="/templates" className="text-gray-600 hover:text-gray-900 font-medium">
              Шаблоны
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
              Мои документы
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Юридические документы
            <span className="text-blue-600"> для ИП и самозанятых</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Создавайте договоры, расписки, заявления и другие документы за минуты.
            Загрузите существующий документ для извлечения данных или создайте новый с помощью ИИ.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Link
            href="/upload"
            className="group p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <FileUp className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Загрузить</h2>
            <p className="text-gray-600">
              Загрузите PDF или скан документа. ИИ извлечёт все данные: ФИО, ИНН, адрес и другую информацию.
            </p>
          </Link>

          <Link
            href="/create"
            className="group p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <FilePlus className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Создать</h2>
            <p className="text-gray-600">
              Опишите какой документ нужен, и ИИ поможет его составить. Выберите шаблон или создайте индивидуальный документ.
            </p>
          </Link>

          <Link
            href="/templates"
            className="group p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <FileText className="w-7 h-7 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Шаблоны</h2>
            <p className="text-gray-600">
              Готовые шаблоны для самых популярных документов: договоры, расписки, заявления, доверенности и другие.
            </p>
          </Link>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Почему ДоксМастер?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Быстро</h3>
                <p className="text-gray-400 text-sm">Документ за 2-3 минуты вместо похода к юристу</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Безопасно</h3>
                <p className="text-gray-400 text-sm">Ваши данные зашифрованы и не передаются третьим лицам</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">24/7</h3>
                <p className="text-gray-400 text-sm">Доступен в любое время без записи и ожидания</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">
            <strong>Дисклеймер:</strong> Сервис предоставляет шаблоны и помогает в оформлении документов.
            Не является юридической консультацией. Для сложных правовых ситуаций рекомендуем обратиться к юристу.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
