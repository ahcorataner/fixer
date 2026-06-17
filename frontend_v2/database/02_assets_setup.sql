-- Execute isso no SQL Editor do Supabase

-- Cria a tabela assets
CREATE TABLE public.assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  acquisition_date DATE,
  status TEXT NOT NULL CHECK (status IN ('operational', 'maintenance', 'unavailable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativa Row Level Security (RLS)
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Gestores e Técnicos podem ver ativos
CREATE POLICY "Ativos são visíveis para todos os usuários autenticados" 
ON public.assets FOR SELECT USING (auth.role() = 'authenticated');

-- Apenas Gestores podem inserir/atualizar ativos (assumindo que gestores inserem)
-- Para simplificar neste momento, permitiremos todos autenticados, ou você pode
-- vincular com a tabela profiles. Aqui vamos deixar liberado para testes:
CREATE POLICY "Usuários autenticados podem inserir ativos" 
ON public.assets FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar ativos" 
ON public.assets FOR UPDATE USING (auth.role() = 'authenticated');
