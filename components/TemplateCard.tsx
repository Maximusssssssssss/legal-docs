'use client';

import { FileText, Briefcase, Users } from 'lucide-react';
import { DocumentTemplate } from '@/types';

interface TemplateCardProps {
  template: DocumentTemplate;
  onSelect: (template: DocumentTemplate) => void;
}

const categoryColors = {
  ip: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Для ИП' },
  selfemployed: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Для самозанятых' },
  universal: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', label: 'Универсальный' },
};

const categoryIcons = {
  ip: Briefcase,
  selfemployed: Users,
  universal: FileText,
};

export default function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const colors = categoryColors[template.category];
  const Icon = categoryIcons[template.category];

  return (
    <div
      onClick={() => onSelect(template)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${colors.border} ${colors.bg}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}>
              {colors.label}
            </span>
          </div>
          <p className="text-sm text-gray-600">{template.description}</p>
          <p className="text-xs text-gray-400 mt-2">
            {template.fields.length} полей для заполнения
          </p>
        </div>
      </div>
    </div>
  );
}
