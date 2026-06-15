import { createClient } from '@supabase/supabase-js';

// Substitua pelas credenciais que aparecem em 'Project Settings' -> 'API' no seu painel do Supabase
const supabaseUrl = 'https://trzhedfsocwyhkenuzrw.supabase.co';
const supabaseAnonKey = 'sb_publishable_5f12esxhUO2kklBLU_THiQ_LUv7lkRW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);