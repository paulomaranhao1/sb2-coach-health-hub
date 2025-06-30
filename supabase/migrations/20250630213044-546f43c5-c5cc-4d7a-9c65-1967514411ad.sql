
-- Limpar todas as tabelas de dados de usuários (manter estrutura)
DELETE FROM public.food_analyses;
DELETE FROM public.fasting_sessions;
DELETE FROM public.weight_entries;
DELETE FROM public.user_subscriptions;
DELETE FROM public.user_stats;
DELETE FROM public.user_profiles;

-- Limpar usuários da autenticação (CUIDADO: isso remove TODOS os usuários)
DELETE FROM auth.users;

-- Resetar sequências se necessário
ALTER SEQUENCE IF EXISTS public.user_profiles_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.user_stats_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.user_subscriptions_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.weight_entries_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.fasting_sessions_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS public.food_analyses_id_seq RESTART WITH 1;
