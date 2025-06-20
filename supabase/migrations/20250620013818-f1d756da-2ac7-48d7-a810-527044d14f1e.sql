
-- Corrigir a função handle_new_user para usar campos corretos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id, 
    name, 
    email, 
    auth_provider,
    email_verified_at,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name', 'Usuário'),
    NEW.email,
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'provider' = 'google' THEN 'google'
      WHEN NEW.raw_user_meta_data ->> 'auth_method' = 'magic_link' THEN 'magic_link'
      ELSE 'email'
    END,
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN NEW.email_confirmed_at ELSE NULL END,
    false
  )
  ON CONFLICT (user_id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, user_profiles.name),
    email = EXCLUDED.email,
    auth_provider = EXCLUDED.auth_provider,
    email_verified_at = COALESCE(EXCLUDED.email_verified_at, user_profiles.email_verified_at);
  
  RETURN NEW;
END;
$$;
