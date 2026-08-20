-- Схема базы данных для ДоксМастер
-- Выполните этот SQL в Supabase SQL Editor (https://supabase.com/dashboard)

-- Таблица персон (извлечённые данные из документов)
CREATE TABLE IF NOT EXISTS persons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  inn TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  passport TEXT,
  date_of_birth TEXT,
  ogrnip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица документов
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed'))
);

-- Таблица сессий (для авторизации, если будет нужна)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Индексы для ускорения поиска
CREATE INDEX IF NOT EXISTS idx_persons_inn ON persons(inn);
CREATE INDEX IF NOT EXISTS idx_persons_name ON persons(full_name);
CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_template ON documents(template_id);

-- RLS (Row Level Security) - включаем для безопасности
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Политика доступа (пока разрешаем всё для тестов)
CREATE POLICY "Allow all for persons" ON persons FOR ALL USING (true);
CREATE POLICY "Allow all for documents" ON documents FOR ALL USING (true);

-- Включаем хранилище файлов
-- Перейдите в Storage в Supabase и создайте bucket "documents"
