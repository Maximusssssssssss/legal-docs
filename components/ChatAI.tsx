'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Download } from 'lucide-react';
import { ChatMessage } from '@/types';
import { exportDocument, makeDocumentFilename } from '@/lib/export';
import { getExtractedData } from '@/lib/personData';

interface ChatAIProps {
  onDocumentReady?: (data: Record<string, string>, templateId?: string) => void;
}

export default function ChatAI({ onDocumentReady }: ChatAIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Здравствуйте! Я помогу вам создать юридический документ. Опишите какой документ вам нужен, и я задам уточняющие вопросы.\n\nНапример:\n• "Хочу составить договор купли-продажи"\n• "Мне нужна расписка о передаче денег"\n• "Составьте трудовой договор"',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const looksLikeDocument = (content: string) => {
    const keywords = [
      'ДОГОВОР', 'СОГЛАШЕНИЕ', 'РАСПИСКА', 'ДОВЕРЕННОСТЬ',
      'ЗАЯВЛЕНИЕ', 'АКТ', 'УСТАВ', 'ПРИКАЗ', 'ПРОТОКОЛ',
      'КОНТРАКТ', 'ПРЕТЕНЗИЯ', 'ОФЕРТА',
    ];
    return keywords.some(k => content.includes(k));
  };

  const handleDocumentDownload = async (message: ChatMessage, format: 'docx' | 'pdf') => {
    setExportingId(`${message.id}-${format}`);
    try {
      const filename = makeDocumentFilename('документ');
      await exportDocument(message.content, format, filename);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `${message.id}-export-error`,
        role: 'assistant',
        content: `Ошибка экспорта: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}.`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setExportingId(null);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
            messages: [...messages, userMessage].map(m => ({
              role: m.role,
              content: m.content,
            })),
            personData: getExtractedData() || {},
            type: 'chat',
          }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка сервера');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}. Попробуйте ещё раз.`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
            )}
            <div className={message.role === 'assistant' ? 'max-w-[80%] flex flex-col gap-2' : ''}>
              <div
                className={`p-3 rounded-lg whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                {message.content}
              </div>
              {message.role === 'assistant' && looksLikeDocument(message.content) && (
                <div className="flex gap-2 pl-3">
                  <button
                    onClick={() => handleDocumentDownload(message, 'docx')}
                    disabled={!!exportingId}
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {exportingId === `${message.id}-docx` ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    Скачать DOC
                  </button>
                  <button
                    onClick={() => handleDocumentDownload(message, 'pdf')}
                    disabled={!!exportingId}
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {exportingId === `${message.id}-pdf` ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    Скачать PDF
                  </button>
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Опишите какой документ вам нужен..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
