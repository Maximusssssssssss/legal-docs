import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function savePerson(person: Omit<import('@/types').PersonData, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('persons')
    .insert([{
      full_name: person.fullName,
      inn: person.inn,
      address: person.address,
      phone: person.phone || null,
      email: person.email || null,
      passport: person.passport || null,
      date_of_birth: person.dateOfBirth || null,
      ogrnip: person.ogrnip || null,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPersons() {
  const { data, error } = await supabase
    .from('persons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveDocument(doc: { template_id: string; title: string; content: string; data: Record<string, string> }) {
  const { data, error } = await supabase
    .from('documents')
    .insert([{
      ...doc,
      created_at: new Date().toISOString(),
      status: 'draft'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(path, file);

  if (error) throw error;
  return data;
}
