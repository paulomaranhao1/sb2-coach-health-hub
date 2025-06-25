
-- FASE 1: CORREÇÃO DE SEGURANÇA - Limpeza de políticas RLS
-- Remover políticas duplicadas e recriar com validações adequadas

-- Limpar políticas existentes para user_stats
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;

-- Limpar políticas existentes para user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Limpar políticas existentes para weight_entries
DROP POLICY IF EXISTS "Users can view own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can insert own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can update own weight entries" ON public.weight_entries;
DROP POLICY IF EXISTS "Users can delete own weight entries" ON public.weight_entries;

-- Limpar políticas existentes para fasting_sessions
DROP POLICY IF EXISTS "Users can view own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users can insert own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users can update own fasting sessions" ON public.fasting_sessions;
DROP POLICY IF EXISTS "Users can delete own fasting sessions" ON public.fasting_sessions;

-- Limpar políticas existentes para food_analyses
DROP POLICY IF EXISTS "Users can view own food analyses" ON public.food_analyses;
DROP POLICY IF EXISTS "Users can insert own food analyses" ON public.food_analyses;
DROP POLICY IF EXISTS "Users can update own food analyses" ON public.food_analyses;
DROP POLICY IF EXISTS "Users can delete own food analyses" ON public.food_analyses;

-- Limpar políticas existentes para user_subscriptions
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;

-- RECRIAR POLÍTICAS CORRETAS COM VALIDAÇÕES ADEQUADAS

-- Políticas para user_stats (com validação user_id)
CREATE POLICY "user_stats_select_policy" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_stats_insert_policy" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "user_stats_update_policy" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas para user_profiles (com validação user_id)
CREATE POLICY "user_profiles_select_policy" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_profiles_insert_policy" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "user_profiles_update_policy" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas para weight_entries (com validação user_id)
CREATE POLICY "weight_entries_select_policy" ON public.weight_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "weight_entries_insert_policy" ON public.weight_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "weight_entries_update_policy" ON public.weight_entries
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "weight_entries_delete_policy" ON public.weight_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para fasting_sessions (com validação user_id)
CREATE POLICY "fasting_sessions_select_policy" ON public.fasting_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "fasting_sessions_insert_policy" ON public.fasting_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "fasting_sessions_update_policy" ON public.fasting_sessions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "fasting_sessions_delete_policy" ON public.fasting_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para food_analyses (com validação user_id)
CREATE POLICY "food_analyses_select_policy" ON public.food_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "food_analyses_insert_policy" ON public.food_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "food_analyses_update_policy" ON public.food_analyses
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "food_analyses_delete_policy" ON public.food_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_subscriptions (com validação user_id)
CREATE POLICY "user_subscriptions_select_policy" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_subscriptions_insert_policy" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "user_subscriptions_update_policy" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TRIGGERS PARA AUTOMATIZAR GAMIFICAÇÃO
-- Função para atualizar pontos quando peso é registrado
CREATE OR REPLACE FUNCTION public.award_points_for_weight_entry()
RETURNS TRIGGER AS $$
DECLARE
    current_date_str DATE := CURRENT_DATE;
    last_entry_date DATE;
    streak_count INTEGER := 1;
    points_to_add INTEGER := 10;
    is_first_entry BOOLEAN := false;
BEGIN
    -- Verificar se é a primeira entrada de peso do usuário
    SELECT COUNT(*) = 0 INTO is_first_entry
    FROM public.weight_entries 
    WHERE user_id = NEW.user_id AND id != NEW.id;
    
    -- Se é primeira entrada, dar pontos bônus
    IF is_first_entry THEN
        points_to_add := 50;
    ELSE
        -- Calcular streak baseado em entradas consecutivas
        SELECT date INTO last_entry_date
        FROM public.weight_entries 
        WHERE user_id = NEW.user_id AND id != NEW.id
        ORDER BY date DESC 
        LIMIT 1;
        
        -- Se entrada é do dia seguinte, aumentar streak
        IF last_entry_date = current_date_str - INTERVAL '1 day' THEN
            SELECT COALESCE(streak, 0) + 1 INTO streak_count
            FROM public.user_stats 
            WHERE user_id = NEW.user_id;
            
            -- Pontos bônus por streak
            IF streak_count >= 7 THEN
                points_to_add := points_to_add + 15;
            END IF;
        END IF;
    END IF;
    
    -- Atualizar ou inserir estatísticas do usuário
    INSERT INTO public.user_stats (
        user_id, 
        points, 
        level, 
        streak, 
        last_activity_date,
        shields,
        stickers
    ) VALUES (
        NEW.user_id,
        points_to_add,
        GREATEST(1, points_to_add / 100 + 1),
        streak_count,
        current_date_str,
        CASE WHEN is_first_entry THEN ARRAY['first_weight'] ELSE ARRAY[]::text[] END,
        ARRAY[]::text[]
    )
    ON CONFLICT (user_id) DO UPDATE SET
        points = user_stats.points + points_to_add,
        level = GREATEST(user_stats.level, (user_stats.points + points_to_add) / 100 + 1),
        streak = streak_count,
        last_activity_date = current_date_str,
        shields = CASE 
            WHEN is_first_entry AND NOT 'first_weight' = ANY(user_stats.shields) 
            THEN array_append(user_stats.shields, 'first_weight')
            ELSE user_stats.shields
        END,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para peso
CREATE TRIGGER trigger_award_points_weight
    AFTER INSERT ON public.weight_entries
    FOR EACH ROW EXECUTE FUNCTION public.award_points_for_weight_entry();

-- Função para atualizar pontos quando jejum é completado
CREATE OR REPLACE FUNCTION public.award_points_for_fasting()
RETURNS TRIGGER AS $$
DECLARE
    points_to_add INTEGER := 0;
    duration_hours INTEGER;
    is_first_fast BOOLEAN := false;
BEGIN
    -- Só processar se o jejum foi completado
    IF NEW.completed = true AND (OLD IS NULL OR OLD.completed = false) THEN
        
        -- Calcular duração em horas
        duration_hours := NEW.duration / 3600;
        
        -- Verificar se é o primeiro jejum
        SELECT COUNT(*) = 1 INTO is_first_fast
        FROM public.fasting_sessions 
        WHERE user_id = NEW.user_id AND completed = true;
        
        -- Calcular pontos baseado na duração
        IF duration_hours >= 12 AND duration_hours < 16 THEN
            points_to_add := 15;
        ELSIF duration_hours >= 16 AND duration_hours < 20 THEN
            points_to_add := 25;
        ELSIF duration_hours >= 20 AND duration_hours < 24 THEN
            points_to_add := 35;
        ELSIF duration_hours >= 24 THEN
            points_to_add := 50;
        ELSE
            points_to_add := 10; -- Jejum básico
        END IF;
        
        -- Bônus para primeiro jejum
        IF is_first_fast THEN
            points_to_add := points_to_add + 25;
        END IF;
        
        -- Atualizar estatísticas
        INSERT INTO public.user_stats (
            user_id, 
            points, 
            level, 
            last_activity_date,
            shields,
            stickers
        ) VALUES (
            NEW.user_id,
            points_to_add,
            GREATEST(1, points_to_add / 100 + 1),
            CURRENT_DATE,
            CASE WHEN is_first_fast THEN ARRAY['first_fast'] ELSE ARRAY[]::text[] END,
            ARRAY[]::text[]
        )
        ON CONFLICT (user_id) DO UPDATE SET
            points = user_stats.points + points_to_add,
            level = GREATEST(user_stats.level, (user_stats.points + points_to_add) / 100 + 1),
            last_activity_date = CURRENT_DATE,
            shields = CASE 
                WHEN is_first_fast AND NOT 'first_fast' = ANY(user_stats.shields) 
                THEN array_append(user_stats.shields, 'first_fast')
                ELSE user_stats.shields
            END,
            updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para jejum
CREATE TRIGGER trigger_award_points_fasting
    AFTER INSERT OR UPDATE ON public.fasting_sessions
    FOR EACH ROW EXECUTE FUNCTION public.award_points_for_fasting();

-- Função para pontos por análise de comida
CREATE OR REPLACE FUNCTION public.award_points_for_food_analysis()
RETURNS TRIGGER AS $$
DECLARE
    points_to_add INTEGER := 5;
    is_first_analysis BOOLEAN := false;
BEGIN
    -- Verificar se é a primeira análise
    SELECT COUNT(*) = 1 INTO is_first_analysis
    FROM public.food_analyses 
    WHERE user_id = NEW.user_id;
    
    -- Bônus para primeira análise
    IF is_first_analysis THEN
        points_to_add := 20;
    END IF;
    
    -- Atualizar estatísticas
    INSERT INTO public.user_stats (
        user_id, 
        points, 
        level, 
        last_activity_date,
        total_photos_analyzed,
        total_calories_tracked,
        shields,
        stickers
    ) VALUES (
        NEW.user_id,
        points_to_add,
        GREATEST(1, points_to_add / 100 + 1),
        CURRENT_DATE,
        1,
        NEW.total_calories,
        CASE WHEN is_first_analysis THEN ARRAY['first_photo'] ELSE ARRAY[]::text[] END,
        ARRAY[]::text[]
    )
    ON CONFLICT (user_id) DO UPDATE SET
        points = user_stats.points + points_to_add,
        level = GREATEST(user_stats.level, (user_stats.points + points_to_add) / 100 + 1),
        last_activity_date = CURRENT_DATE,
        total_photos_analyzed = COALESCE(user_stats.total_photos_analyzed, 0) + 1,
        total_calories_tracked = COALESCE(user_stats.total_calories_tracked, 0) + NEW.total_calories,
        shields = CASE 
            WHEN is_first_analysis AND NOT 'first_photo' = ANY(user_stats.shields) 
            THEN array_append(user_stats.shields, 'first_photo')
            ELSE user_stats.shields
        END,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para análise de comida
CREATE TRIGGER trigger_award_points_food_analysis
    AFTER INSERT ON public.food_analyses
    FOR EACH ROW EXECUTE FUNCTION public.award_points_for_food_analysis();
