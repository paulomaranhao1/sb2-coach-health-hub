
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Share2 } from 'lucide-react';

interface Sticker {
  id: string;
  name: string;
  emoji: string;
  rarity: string;
}

interface StickersAlbumProps {
  stickers: Sticker[];
  userStickers: string[];
  onShareSticker: (stickerId: string) => void;
}

const StickersAlbum = ({ stickers, userStickers, onShareSticker }: StickersAlbumProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'comum': return 'bg-gray-200 text-gray-900';
      case 'raro': return 'bg-blue-100 text-blue-900';  
      case 'épico': return 'bg-purple-100 text-purple-900';
      case 'lendário': return 'bg-red-100 text-red-900';
      default: return 'bg-gray-200 text-gray-900';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Star className="w-5 h-5" />
          Álbum de Figurinhas
        </CardTitle>
        <CardDescription className="text-gray-700">
          Colecione figurinhas épicas e compartilhe suas conquistas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stickers.map((sticker) => {
            const isCollected = userStickers.includes(sticker.id);
            return (
              <div 
                key={sticker.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCollected 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-300 bg-gray-100 opacity-60'
                }`}
              >
                <div className="text-3xl mb-2 text-center">{sticker.emoji}</div>
                <h3 className="font-semibold text-center mb-1 text-gray-900">{sticker.name}</h3>
                <Badge className={`w-full mb-2 justify-center font-semibold ${getRarityColor(sticker.rarity)}`}>
                  {sticker.rarity}
                </Badge>
                {isCollected ? (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full text-gray-900 border-gray-400 hover:bg-gray-100"
                    onClick={() => onShareSticker(sticker.id)}
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Compartilhar
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full opacity-50 text-gray-600 border-gray-300"
                    disabled
                  >
                    Não coletada
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StickersAlbum;
