
-- Verificar e limpar dados inconsistentes na base de dados

-- 1. Limpar user_profiles órfãos (sem user_id válido ou duplicados)
DELETE FROM public.user_profiles 
WHERE user_id IS NULL;

-- 2. Limpar user_stats órfãos (sem user_id válido ou duplicados)
DELETE FROM public.user_stats 
WHERE user_id IS NULL;

-- 3. Limpar user_subscriptions órfãs (sem user_id válido)
DELETE FROM public.user_subscriptions 
WHERE user_id IS NULL;

-- 4. Limpar weight_entries órfãos (sem user_id válido)
DELETE FROM public.weight_entries 
WHERE user_id IS NULL;

-- 5. Limpar fasting_sessions órfãs (sem user_id válido)
DELETE FROM public.fasting_sessions 
WHERE user_id IS NULL;

-- 6. Limpar food_analyses órfãs (sem user_id válido)
DELETE FROM public.food_analyses 
WHERE user_id IS NULL;

-- 7. Corrigir valores negativos ou inválidos em user_stats
UPDATE public.user_stats 
SET points = 0 
WHERE points < 0;

UPDATE public.user_stats 
SET level = 1 
WHERE level < 1 OR level IS NULL;

UPDATE public.user_stats 
SET streak = 0 
WHERE streak < 0 OR streak IS NULL;

-- 8. Corrigir valores inválidos em weight_entries
DELETE FROM public.weight_entries 
WHERE weight <= 0 OR weight > 1000;

-- 9. Corrigir valores inválidos em user_profiles
UPDATE public.user_profiles 
SET weight = NULL 
WHERE weight <= 0 OR weight > 1000;

UPDATE public.user_profiles 
SET height = NULL 
WHERE height <= 0 OR height > 300;

UPDATE public.user_profiles 
SET age = NULL 
WHERE age <= 0 OR age > 150;

UPDATE public.user_profiles 
SET goal_weight = NULL 
WHERE goal_weight <= 0 OR goal_weight > 1000;

-- 10. Corrigir datas futuras inválidas em weight_entries
UPDATE public.weight_entries 
SET date = CURRENT_DATE 
WHERE date > CURRENT_DATE;

-- 11. Corrigir sessões de jejum com durações inválidas
DELETE FROM public.fasting_sessions 
WHERE duration <= 0 OR duration > 2592000; -- Máximo 30 dias em segundos

-- 12. Corrigir análises de comida com calorias inválidas
DELETE FROM public.food_analyses 
WHERE total_calories < 0 OR total_calories > 50000;

-- 13. Garantir que shields e stickers sejam arrays válidos
UPDATE public.user_stats 
SET shields = '{}' 
WHERE shields IS NULL;

UPDATE public.user_stats 
SET stickers = '{}' 
WHERE stickers IS NULL;

-- 14. Corrigir subscription_type inválidos
UPDATE public.user_subscriptions 
SET subscription_type = 'free' 
WHERE subscription_type NOT IN ('free', 'premium', 'client');

-- 15. Corrigir verification_status inválidos
UPDATE public.user_subscriptions 
SET verification_status = 'pending' 
WHERE verification_status NOT IN ('pending', 'verified', 'rejected');

-- 16. Remover duplicatas de user_profiles (manter o mais recente)
DELETE FROM public.user_profiles a
USING public.user_profiles b
WHERE a.user_id = b.user_id 
AND a.created_at < b.created_at;

-- 17. Remover duplicatas de user_stats (manter o mais recente)
DELETE FROM public.user_stats a
USING public.user_stats b
WHERE a.user_id = b.user_id 
AND a.created_at < b.created_at;

-- 18. Remover duplicatas de user_subscriptions (manter o mais recente)
DELETE FROM public.user_subscriptions a
USING public.user_subscriptions b
WHERE a.user_id = b.user_id 
AND a.created_at < b.created_at;

-- 19. Remover duplicatas de weight_entries no mesmo dia (manter o mais recente)
DELETE FROM public.weight_entries a
USING public.weight_entries b
WHERE a.user_id = b.user_id 
AND a.date = b.date 
AND a.created_at < b.created_at;

-- 20. Verificar e corrigir timestamps futuros
UPDATE public.user_profiles 
SET created_at = NOW() 
WHERE created_at > NOW();

UPDATE public.user_profiles 
SET updated_at = NOW() 
WHERE updated_at > NOW();

UPDATE public.user_stats 
SET created_at = NOW() 
WHERE created_at > NOW();

UPDATE public.user_stats 
SET updated_at = NOW() 
WHERE updated_at > NOW();

UPDATE public.user_subscriptions 
SET created_at = NOW() 
WHERE created_at > NOW();

UPDATE public.user_subscriptions 
SET updated_at = NOW() 
WHERE updated_at > NOW();

UPDATE public.weight_entries 
SET created_at = NOW() 
WHERE created_at > NOW();

UPDATE public.fasting_sessions 
SET created_at = NOW() 
WHERE created_at > NOW();

UPDATE public.fasting_sessions 
SET updated_at = NOW() 
WHERE updated_at > NOW();

UPDATE public.food_analyses 
SET created_at = NOW() 
WHERE created_at > NOW();

-- 21. Recriar índices para melhor performance (se necessário)
REINDEX TABLE public.user_profiles;
REINDEX TABLE public.user_stats;
REINDEX TABLE public.user_subscriptions;
REINDEX TABLE public.weight_entries;
REINDEX TABLE public.fasting_sessions;
REINDEX TABLE public.food_analyses;

-- 22. Atualizar estatísticas das tabelas
ANALYZE public.user_profiles;
ANALYZE public.user_stats;
ANALYZE public.user_subscriptions;
ANALYZE public.weight_entries;
ANALYZE public.fasting_sessions;
ANALYZE public.food_analyses;
