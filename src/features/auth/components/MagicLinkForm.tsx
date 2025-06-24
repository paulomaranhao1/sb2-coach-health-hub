
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import { usePasswordAuth } from '@/hooks/auth/usePasswordAuth';

interface MagicLinkFormProps {
  onBack: () => void;
  onEmailSent: (email: string) => void;
}

const MagicLinkForm = ({ onBack, onEmailSent }: MagicLinkFormProps) => {
  const [email, setEmail] = useState('');
  const { handleMagicLink, loading } = usePasswordAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await handleMagicLink(email);
    if (success) {
      onEmailSent(email);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="font-bold text-foreground">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || !email.trim()}
        >
          {loading ? 'Enviando...' : 'Enviar Link Mágico'}
        </Button>
      </form>

      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-sm"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao login
        </Button>
      </div>
    </div>
  );
};

export default MagicLinkForm;
