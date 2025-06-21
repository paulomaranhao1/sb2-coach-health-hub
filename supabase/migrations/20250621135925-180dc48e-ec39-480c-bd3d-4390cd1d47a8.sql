
-- Habilitar RLS na tabela food_analyses
ALTER TABLE public.food_analyses ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam suas próprias análises
CREATE POLICY "Users can view own food analyses" ON public.food_analyses
  FOR SELECT USING (auth.uid() = user_id);

-- Política para permitir que usuários insiram suas próprias análises
CREATE POLICY "Users can insert own food analyses" ON public.food_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários atualizem suas próprias análises
CREATE POLICY "Users can update own food analyses" ON public.food_analyses
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para permitir que usuários deletem suas próprias análises
CREATE POLICY "Users can delete own food analyses" ON public.food_analyses
  FOR DELETE USING (auth.uid() = user_id);
