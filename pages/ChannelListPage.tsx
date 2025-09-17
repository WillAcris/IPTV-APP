import React, { useMemo } from 'react';
import type { Channel } from '../types';

interface ChannelListPageProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
}

interface GroupedChannels {
    [groupName: string]: Channel[];
}

export const ChannelListPage: React.FC<ChannelListPageProps> = ({ channels, onSelectChannel }) => {
  const groupedChannels = useMemo(() => {
    return channels.reduce((acc, channel) => {
      const group = channel.group || 'Uncategorized';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(channel);
      return acc;
    }, {} as GroupedChannels);
  }, [channels]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">All Channels</h1>
      {Object.entries(groupedChannels).map(([groupName, channelsInGroup]) => (
        <div key={groupName} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-slate-700 text-blue-300">{groupName}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {/* FIX: Cast channelsInGroup to Channel[] to resolve "Property 'map' does not exist on type 'unknown'" */}
            {(channelsInGroup as Channel[]).map((channel) => (
              <div
                key={channel.id}
                className="bg-slate-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 hover:shadow-blue-500/50 transition-all duration-300 group"
                onClick={() => onSelectChannel(channel)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && onSelectChannel(channel)}
              >
                <div className="aspect-square bg-slate-700 flex items-center justify-center overflow-hidden">
                    <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-white truncate text-sm sm:text-base">{channel.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};