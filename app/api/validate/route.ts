import { NextRequest, NextResponse } from 'next/server';
import { validateINN, validatePhone, validateEmail, validatePassport } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value } = body;

    let isValid = false;
    let message = '';

    switch (type) {
      case 'inn':
        isValid = validateINN(value);
        message = isValid ? 'ИНН корректен' : 'ИНН некорректен';
        break;
      case 'phone':
        isValid = validatePhone(value);
        message = isValid ? 'Телефон корректен' : 'Телефон некорректен';
        break;
      case 'email':
        isValid = validateEmail(value);
        message = isValid ? 'Email корректен' : 'Email некорректен';
        break;
      case 'passport':
        isValid = validatePassport(value);
        message = isValid ? 'Паспорт корректен' : 'Паспорт некорректен';
        break;
      default:
        return NextResponse.json(
          { error: 'Неизвестный тип валидации' },
          { status: 400 }
        );
    }

    return NextResponse.json({ isValid, message });
  } catch {
    return NextResponse.json(
      { error: 'Ошибка валидации' },
      { status: 500 }
    );
  }
}
