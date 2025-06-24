
-- Remover políticas existentes e recriar para garantir consistência
DROP POLICY IF EXISTS "Users can view own food analyses" ON public.food_analyses;
DROP POLICY IF EXISTS "Users can insert own food analyses" ON public.food_analyses;
DROP POLICY IF EXISTS "Users can update own food analyses" ON public.food_analyses;
DROP POLICY IF EXISTS "Users can delete own food analyses" ON public.food_analyses;

-- Garantir que RLS está habilitado
ALTER TABLE public.food_analyses ENABLE ROW LEVEL SECURITY;

-- Recriar todas as políticas
CREATE POLICY "Users can view own food analyses" ON public.food_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food analyses" ON public.food_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food analyses" ON public.food_analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food analyses" ON public.food_analyses
  FOR DELETE USING (auth.uid() = user_id);
