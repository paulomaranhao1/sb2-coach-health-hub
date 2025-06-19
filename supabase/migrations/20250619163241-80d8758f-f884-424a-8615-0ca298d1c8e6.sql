
-- Adicionar campo phone_number à tabela user_profiles
ALTER TABLE user_profiles 
ADD COLUMN phone_number text;

-- Criar tabela para controlar assinaturas e acesso premium
CREATE TABLE public.user_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  subscription_type text NOT NULL DEFAULT 'free', -- 'free', 'premium', 'client'
  is_active boolean NOT NULL DEFAULT false,
  verification_status text NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  verification_method text, -- 'purchase_proof', 'client_code', 'payment'
  verification_data jsonb, -- Para armazenar dados de verificação
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS na tabela user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas sua própria assinatura
CREATE POLICY "Users can view their own subscription" 
  ON public.user_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para usuários atualizarem apenas sua própria assinatura
CREATE POLICY "Users can update their own subscription" 
  ON public.user_subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para inserir assinatura do próprio usuário
CREATE POLICY "Users can insert their own subscription" 
  ON public.user_subscriptions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Função para verificar se usuário tem acesso premium
CREATE OR REPLACE FUNCTION public.has_premium_access(user_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT is_active AND subscription_type IN ('premium', 'client') 
     FROM public.user_subscriptions 
     WHERE user_id = user_id_param),
    false
  );
$$;

-- Trigger para criar assinatura gratuita quando usuário faz onboarding
CREATE OR REPLACE FUNCTION public.create_default_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, subscription_type, is_active)
  VALUES (NEW.user_id, 'free', true)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_subscription();
