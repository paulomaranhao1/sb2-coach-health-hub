
-- Remover o trigger problemático que não está funcionando
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS initialize_user_stats();

-- Manter apenas a tabela e as políticas RLS que já estão funcionando
