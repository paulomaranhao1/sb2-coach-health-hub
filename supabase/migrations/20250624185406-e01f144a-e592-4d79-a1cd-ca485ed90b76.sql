
-- Remover políticas existentes se já existirem e recriar todas
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;

DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;

DROP POLICY IF EXISTS "Users can view own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can insert own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can update own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can delete own weight entries" ON public.weight_entries;

DROP POLICY IF EXISTS "Users can view own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users can insert own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users can update own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users can delete own fasting sessions" ON public.fasting_sessions;

-- Agora recriar todas as políticas
-- Políticas para user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para user_stats
CREATE POLICY "Users can view own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para user_subscriptions
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para weight_entries
CREATE POLICY "Users can view own weight entries" ON public.weight_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight entries" ON public.weight_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight entries" ON public.weight_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight entries" ON public.weight_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para fasting_sessions
CREATE POLICY "Users can view own fasting sessions" ON public.fasting_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fasting sessions" ON public.fasting_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fasting sessions" ON public.fasting_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fasting sessions" ON public.fasting_sessions
  FOR DELETE USING (auth.uid() = user_id);
