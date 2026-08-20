export function validateINN(inn: string): boolean {
  const cleaned = inn.replace(/\s/g, '');

  if (!/^\d{10}$|^\d{12}$/.test(cleaned)) {
    return false;
  }

  if (cleaned.length === 10) {
    const weights = [2, 4, 10, 3, 5, 9, 4, 6, 8];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * weights[i];
    }
    const checkDigit = (sum % 11) % 10;
    return checkDigit === parseInt(cleaned[9]);
  }

  if (cleaned.length === 12) {
    const weights1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
    const weights2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];

    let sum1 = 0;
    for (let i = 0; i < 10; i++) {
      sum1 += parseInt(cleaned[i]) * weights1[i];
    }
    const checkDigit1 = (sum1 % 11) % 10;

    let sum2 = 0;
    for (let i = 0; i < 11; i++) {
      sum2 += parseInt(cleaned[i]) * weights2[i];
    }
    const checkDigit2 = (sum2 % 11) % 10;

    return checkDigit1 === parseInt(cleaned[10]) && checkDigit2 === parseInt(cleaned[11]);
  }

  return false;
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+7|8)\d{10}$/.test(cleaned);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassport(passport: string): boolean {
  const cleaned = passport.replace(/\s/g, '');
  return /^\d{4}\s?\d{6}$/.test(cleaned);
}

export function formatINN(inn: string): string {
  const cleaned = inn.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d)/, '$1 $2 $3 $4');
  }
  if (cleaned.length === 12) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})(\d)/, '$1 $2 $3 $4 $5');
  }
  return cleaned;
}

export function isSafePrompt(text: string): boolean {
  const dangerousPatterns = [
    /закажи\s+(пиццу|еду|такси)/i,
    /скажи\s+(стих|рассказ)/i,
    /напиши\s+(код|программу)/i,
    /взломай/i,
    /укради/i,
    /подмени/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(text));
}
