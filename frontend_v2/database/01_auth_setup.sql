-- Execute isso no SQL Editor do Supabase

-- Cria a tabela profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('gestor', 'tecnico')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativa Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Permite que usuários vejam todos os perfis (para poder atribuir responsáveis)
CREATE POLICY "Profiles são visíveis para todos" 
ON public.profiles FOR SELECT USING (true);

-- Permite que usuários insiram seu próprio perfil no momento do cadastro
-- Em um app de produção com e-mail confirmation off, a sessão já existe após o signup
CREATE POLICY "Usuários podem inserir seu próprio perfil" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Permite que usuários atualizem seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger opcional para criar automaticamente se preferir:
-- Não é obrigatório se o frontend fizer o insert, mas é mais seguro.
