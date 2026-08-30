import { NextRequest, NextResponse } from 'next/server';
import { generateDocument, askAI, isDocumentRelated } from '@/lib/ai';
import { documentTemplates } from '@/lib/templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'chat') {
      const { messages, personData } = body;

      if (!messages || !Array.isArray(messages)) {
        return NextResponse.json({ error: 'Сообщения обязательны' }, { status: 400 });
      }

      const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user');
      const assistantMessages = messages.filter((m: { role: string }) => m.role === 'assistant');

      if (lastUserMessage && assistantMessages.length === 0 && !isDocumentRelated(lastUserMessage.content)) {
        return NextResponse.json({
          response: 'Я помогаю создавать юридические документы для ИП и самозанятых. Пожалуйста, опишите какой документ вам нужен:\n\n• Договор купли-продажи\n• Договор оказания услуг\n• Расписка\n• Доверенность\n• Заявление\n• И другие юридические документы',
        });
      }

      const systemMessage = `Ты - помощник по созданию юридических документов для ИП и самозанятых в России.
Текущие доступные шаблоны:
${documentTemplates.map(t => `- ${t.name} (${t.description})`).join('\n')}
${personData && typeof personData === 'object' && Object.keys(personData).length > 0
  ? `
Данные пользователя, извлечённые из загруженного документа (используй их при заполнении полей, не спрашивай их повторно, но проверяй при необходимости):
${Object.entries(personData).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')}`
  : ''}

Правила:
1. Отвечай только на вопросы, связанные с юридическими документами
2. Если пользователь просит создать документ, помоги определиться с шаблоном и собери данные
3. Когда все данные собраны, предложи перейти к заполнению формы
4. Отвечай на русском языке
5. Будь дружелюбным и помогай`;

      const result = await askAI(
        lastUserMessage?.content || '',
        systemMessage,
        messages
      );

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ response: result.text });
    }

    if (type === 'document') {
      const { templateId, templateContent, data } = body;

      if (!templateContent || !data) {
        return NextResponse.json(
          { error: 'Шаблон и данные обязательны' },
          { status: 400 }
        );
      }

      const result = await generateDocument(templateContent, data);

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ document: result.text });
    }

    return NextResponse.json({ error: 'Неизвестный тип запроса' }, { status: 400 });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
