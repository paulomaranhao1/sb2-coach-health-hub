
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Subscription = Database['public']['Tables']['user_subscriptions']['Row'];

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Erro ao buscar assinatura:', error);
          return;
        }

        setSubscription(data);
        
        if (data) {
          setHasPremiumAccess(
            data.is_active && ['premium', 'client'].includes(data.subscription_type)
          );
        }
      }
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (updates: Partial<Subscription>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !subscription) return;

      const { error } = await supabase
        .from('user_subscriptions')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchSubscription();
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error);
      throw error;
    }
  };

  return {
    subscription,
    isLoading,
    hasPremiumAccess,
    updateSubscription,
    refetch: fetchSubscription
  };
};
