
-- Criar tabela para estatísticas do usuário
CREATE TABLE user_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer DEFAULT 0,
  level integer DEFAULT 1,
  shields text[] DEFAULT '{}',
  stickers text[] DEFAULT '{}',
  streak integer DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Criar índice para consultas rápidas
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_user_stats_points ON user_stats(points DESC);

-- Criar função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar automaticamente o updated_at
CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON user_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Criar política para que usuários só possam ver/editar seus próprios dados
CREATE POLICY "Users can view own stats" ON user_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON user_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Função para inicializar estatísticas de novos usuários
CREATE OR REPLACE FUNCTION initialize_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_stats (user_id, points, level, shields, stickers, streak)
    VALUES (NEW.id, 0, 1, '{}', '{}', 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar automaticamente as estatísticas quando um novo usuário se registra
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION initialize_user_stats();

-- Criar tabela para registros de peso
CREATE TABLE weight_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  weight numeric(5,2) NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, date)
);

-- Criar índices para weight_entries
CREATE INDEX idx_weight_entries_user_id ON weight_entries(user_id);
CREATE INDEX idx_weight_entries_date ON weight_entries(date DESC);

-- Habilitar RLS para weight_entries
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para weight_entries
CREATE POLICY "Users can view own weight entries" ON weight_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight entries" ON weight_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight entries" ON weight_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight entries" ON weight_entries
    FOR DELETE USING (auth.uid() = user_id);
