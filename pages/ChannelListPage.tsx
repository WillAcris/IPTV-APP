import React, { useMemo } from 'react';
import type { Channel } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';

interface ChannelListPageProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

interface GroupedChannels {
    [groupName: string]: Channel[];
}

const StarIcon: React.FC<{ isFavorite: boolean }> = ({ isFavorite }) => (
  isFavorite ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
);


export const ChannelListPage: React.FC<ChannelListPageProps> = ({ channels, onSelectChannel }) => {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleToggleFavorite = (e: React.MouseEvent, channelId: string) => {
    e.stopPropagation(); // Prevent channel selection when toggling favorite
    if (isFavorite(channelId)) {
      removeFavorite(channelId);
    } else {
      addFavorite(channelId);
    }
  };

  const groupedChannels = useMemo(() => {
    const favoriteChannels = channels.filter(c => favorites.includes(c.id));
    const nonFavoriteChannels = channels.filter(c => !favorites.includes(c.id));

    const groups: GroupedChannels = {};

    if (favoriteChannels.length > 0) {
      groups['⭐ Favoritos'] = favoriteChannels;
    }
    
    return nonFavoriteChannels.reduce((acc, channel) => {
      const group = channel.group || 'Sem Categoria';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(channel);
      return acc;
    }, groups);

  }, [channels, favorites]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Todos os Canais</h1>
      {Object.entries(groupedChannels).map(([groupName, channelsInGroup]) => (
        <div key={groupName} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-200 dark:border-slate-700 text-blue-600 dark:text-blue-300">{groupName}</h2>
          <div className="space-y-3">
            {(channelsInGroup as Channel[]).map((channel) => (
              <div
                key={channel.id}
                className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                onClick={() => onSelectChannel(channel)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectChannel(channel); }}
                aria-label={`Selecionar canal ${channel.name}`}
              >
                <div className="w-14 h-14 flex-shrink-0 bg-gray-100 dark:bg-slate-900/50 rounded-md flex items-center justify-center overflow-hidden mr-4 shadow-md">
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex-1">{channel.name}</h3>
                <button
                  onClick={(e) => handleToggleFavorite(e, channel.id)}
                  className="ml-4 p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={isFavorite(channel.id) ? `Remover ${channel.name} dos favoritos` : `Adicionar ${channel.name} aos favoritos`}
                >
                  <StarIcon isFavorite={isFavorite(channel.id)} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};