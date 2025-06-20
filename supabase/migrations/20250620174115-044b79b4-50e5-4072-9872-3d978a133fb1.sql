
-- Primeiro, vamos remover a constraint existente
ALTER TABLE public.user_subscriptions 
DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_fkey;

-- Agora vamos recriar a constraint com ON DELETE CASCADE
ALTER TABLE public.user_subscriptions 
ADD CONSTRAINT user_subscriptions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
