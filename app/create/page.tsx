'use client';

import Link from 'next/link';
import ChatAI from '@/components/ChatAI';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ArrowLeft, FileText } from 'lucide-react';

export default function CreatePage() {
  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" />
            <span className="text-lg font-bold">Чат с ИИ</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <ChatAI />
      </main>
      <Footer />
    </div>
    </ProtectedRoute>
  );
}