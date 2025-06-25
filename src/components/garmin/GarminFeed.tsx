
import { Heart, MessageCircle, Share, MapPin, Clock } from "lucide-react";

const GarminFeed = () => {
  const feedItems = [
    {
      id: 1,
      user: {
        name: 'Paulo Maranhão',
        avatar: '/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png'
      },
      activity: {
        type: 'Corrida',
        date: '28 de mar.',
        isPrivate: true,
        stats: {
          distance: '5,57 km',
          time: '1:48:43',
          pace: '19:32 /km'
        },
        map: true
      },
      likes: 0,
      comments: 0,
      callToAction: 'Seja a primeira pessoa a curtir isto'
    },
    {
      id: 2,
      user: {
        name: 'Paulo Maranhão',
        avatar: '/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png'
      },
      activity: {
        type: 'Caminhada',
        date: '28 de mar.',
        isPrivate: true,
        stats: {
          distance: '5,90 km',
          time: '4:53:45',
          pace: '49:54 /km'
        },
        map: false
      },
      likes: 0,
      comments: 0,
      callToAction: 'Seja a primeira pessoa a curtir isto'
    }
  ];

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="garmin-card">
        <h1 className="text-2xl font-bold text-primary mb-2">Feed de notícias</h1>
        <p className="text-secondary">Acompanhe suas atividades e de seus amigos</p>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {feedItems.map((item) => (
          <div key={item.id} className="garmin-card-large">
            {/* User Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={item.user.avatar} 
                  alt={item.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-primary">{item.user.name}</span>
                  <span className="text-orange-500">🏃</span>
                  <span className="text-sm text-secondary">{item.activity.date}</span>
                  {item.activity.isPrivate && (
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">🔒</span>
                  )}
                </div>
              </div>
              <button className="text-secondary hover:text-primary">
                <span className="text-lg">⋯</span>
              </button>
            </div>

            {/* Activity Details */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-primary mb-3">{item.activity.type}</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-primary">{item.activity.stats.distance}</div>
                  <div className="text-sm text-muted uppercase">Distância</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{item.activity.stats.time}</div>
                  <div className="text-sm text-muted uppercase">Tempo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{item.activity.stats.pace}</div>
                  <div className="text-sm text-muted uppercase">Ritmo</div>
                </div>
              </div>

              {/* Map Placeholder */}
              {item.activity.map && (
                <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Mapa da atividade</p>
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="text-center py-3 mb-4 text-secondary text-sm">
              {item.callToAction}
            </div>

            {/* Interaction Buttons */}
            <div className="flex justify-center space-x-8 pt-4 border-t border-gray-700">
              <button className="flex items-center space-x-2 text-secondary hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm">{item.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-secondary hover:text-blue-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{item.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No More Activities */}
      <div className="garmin-card text-center py-8">
        <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-primary mb-2">Fim das atividades</h3>
        <p className="text-secondary">Você está em dia com todas as novidades!</p>
      </div>
    </div>
  );
};

export default GarminFeed;
