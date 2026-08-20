const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CF_API_TOKEN || '';
const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp16';

interface AIResponse {
  text: string;
  error?: string;
}

export async function askAI(
  prompt: string,
  systemMessage?: string,
  messages?: { role: string; content: string }[]
): Promise<AIResponse> {
  try {
    const chatMessages: { role: string; content: string }[] = [];

    chatMessages.push({
      role: 'system',
      content: systemMessage || `Ты - помощник по созданию юридических документов для ИП и самозанятых в России.
Отвечай только на вопросы, связанные с юридическими документами.
Если пользователь просит что-то не связанное с документами - вежливо откажи и направь к теме сервиса.
Всегда отвечай на русском языке.`,
    });

    if (messages && messages.length > 1) {
      for (const m of messages.slice(0, -1)) {
        chatMessages.push({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        });
      }
    }

    chatMessages.push({
      role: 'user',
      content: prompt,
    });

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CF_API_TOKEN}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: chatMessages,
          temperature: 0.3,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { text: '', error: `AI error: ${response.status} ${errorText}` };
    }

    const data = await response.json();
    return { text: data.choices?.[0]?.message?.content || '' };
  } catch (error) {
    return { text: '', error: `Не удалось подключиться к AI сервису. Попробуйте позже.` };
  }
}

export async function generateDocument(
  templateContent: string,
  data: Record<string, string>
): Promise<AIResponse> {
  const prompt = `Сгенерируй готовый юридический документ на основе шаблона и данных.

ШАБЛОН:
${templateContent}

ДАННЫЕ:
${JSON.stringify(data, null, 2)}

ЗАДАЧА:
1. Заполни все поля {{...}} данными
2. Сохрани форматирование и структуру
3. Для суммы рублей пропиши числа словами
4. Добавь номер договора: ${Math.floor(Math.random() * 9000) + 1000}
5. Верни готовый документ в формате plain text`;

  return askAI(prompt, 'Ты - юридический помощник. Генерируй точные юридические документы на русском языке.');
}

export async function extractDataFromText(text: string): Promise<AIResponse> {
  const prompt = `Извлеки структурированные данные из текста документа.

ТЕКСТ:
${text}

ЗАДАЧА:
Извлеки следующие данные в формате JSON (только JSON, без пояснений):
{
  "fullName": "ФИО (если есть)",
  "inn": "ИНН (если есть, только цифры)",
  "address": "Адрес (если есть)",
  "phone": "Телефон (если есть)",
  "email": "Email (если есть)",
  "passport": "Паспорт (если есть)",
  "dateOfBirth": "Дата рождения (если есть)"
}

Если данные не найдены, поставь пустую строку "".`;

  return askAI(prompt, 'Ты - парсер юридических документов. Извлекай данные точно и аккуратно.');
}

export function isDocumentRelated(prompt: string): boolean {
  const documentKeywords = [
    'договор', 'заявление', 'расписка', 'доверенность', 'акт',
    'претензия', 'чек', 'счёт', 'накладная', 'уведомление',
    'соглашение', 'контракт', 'приказ', 'протокол',
    'купли-продажи', 'услуг', 'аренды', 'труда', 'займа',
    'самозанятый', 'ип', 'ндс', 'нпд', 'налогообложение',
    'юридический', 'документ', 'бланк', 'форма', 'образец',
    'подпис', 'печать', 'реквизит', 'ИНН', 'ОГРНИП',
  ];

  const lowerPrompt = prompt.toLowerCase();
  return documentKeywords.some(keyword => lowerPrompt.includes(keyword));
}
