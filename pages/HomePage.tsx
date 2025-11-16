import React from 'react';
import type { Channel } from '../types';
import { VideoPlayer } from '../components/VideoPlayer';
import { LiveChat } from '../components/LiveChat';

interface HomePageProps {
  selectedChannel: Channel | null;
}

export const HomePage: React.FC<HomePageProps> = ({ selectedChannel }) => {
  if (!selectedChannel) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">Nenhum Canal Selecionado</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Por favor, selecione um canal da lista para começar a assistir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center lg:text-left">Tocando agora: {selectedChannel.name}</h1>
      
      {/* Player e Chat na mesma div com aspect-video para garantir mesma altura */}
      <div className="aspect-video flex flex-col lg:flex-row gap-4">
        {/* Player Section */}
        <div className="flex-1 h-full">
          <VideoPlayer src={selectedChannel.url} channelName={selectedChannel.name} />
        </div>
        
        {/* Chat Section */}
        <div className="w-full lg:w-80 h-full">
          <LiveChat channelName={selectedChannel.name} />
        </div>
      </div>
    </div>
  );
};