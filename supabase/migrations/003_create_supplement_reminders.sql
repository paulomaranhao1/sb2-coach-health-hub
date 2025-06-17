
-- Criar tabela para lembretes de suplemento
CREATE TABLE supplement_reminders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text,
  times_per_day integer DEFAULT 1,
  reminder_times text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela para registros de tomada de suplemento
CREATE TABLE supplement_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  supplement_id uuid REFERENCES supplement_reminders(id) ON DELETE CASCADE,
  taken_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL
);

-- Criar índices
CREATE INDEX idx_supplement_reminders_user_id ON supplement_reminders(user_id);
CREATE INDEX idx_supplement_logs_user_id ON supplement_logs(user_id);
CREATE INDEX idx_supplement_logs_date ON supplement_logs(date DESC);

-- Habilitar RLS
ALTER TABLE supplement_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para supplement_reminders
CREATE POLICY "Users can view own supplement reminders" ON supplement_reminders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own supplement reminders" ON supplement_reminders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own supplement reminders" ON supplement_reminders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own supplement reminders" ON supplement_reminders
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para supplement_logs
CREATE POLICY "Users can view own supplement logs" ON supplement_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own supplement logs" ON supplement_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger para atualizar updated_at em supplement_reminders
CREATE TRIGGER update_supplement_reminders_updated_at
    BEFORE UPDATE ON supplement_reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
