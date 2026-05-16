import { createClient } from '@supabase/supabase-js';

// Configuración definitiva para el proyecto con la 'z' (nluyukgkzzxzdsdbfdrk)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
