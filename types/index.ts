export interface PersonData {
  id: string;
  fullName: string;
  inn: string;
  address: string;
  phone?: string;
  email?: string;
  passport?: string;
  dateOfBirth?: string;
  ogrnip?: string;
  createdAt: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: 'ip' | 'selfemployed' | 'universal';
  description: string;
  fields: DocumentField[];
  template: string;
}

export interface DocumentField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  title: string;
  content: string;
  data: Record<string, string>;
  createdAt: string;
  status: 'draft' | 'completed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ParsedDocument {
  text: string;
  fields: Record<string, string>;
  confidence: number;
}
