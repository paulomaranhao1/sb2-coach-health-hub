
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface UseAIChatProps {
  userId?: string;
  hasPremiumAccess: boolean;
  onShowOffers: () => void;
}

export const useAIChat = ({ userId, hasPremiumAccess, onShowOffers }: UseAIChatProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Olá! 👋 Sou seu AI Coach pessoal especializado em nutrição e emagrecimento. Como posso ajudar você hoje na sua jornada com o SB2 Turbo?",
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!userId) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    if (!messageText.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: messageText,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Preparar histórico da conversa
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      console.log('Sending message to AI Chat:', messageText);

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: messageText,
          userId: userId,
          conversationHistory: conversationHistory
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.message || 'Erro ao processar mensagem');
      }

      // Adicionar resposta da IA
      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.response,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro na conversa",
        description: error.message || "Erro ao enviar mensagem. Tente novamente.",
        variant: "destructive",
      });

      // Remover mensagem do usuário em caso de erro
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast, messages]);

  return {
    messages,
    sendMessage,
    isLoading
  };
};
