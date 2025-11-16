import React from 'react';
import type { Channel } from '../types';
import { VideoPlayer } from '../components/VideoPlayer';
import { LiveChat } from '../components/LiveChat';

interface HomePageProps {
  selectedChannel: Channel | null;
}

export const HomePage: React.FC<HomePageProps> = ({ selectedChannel }) => {
  const videoPlayerRef = React.useRef<{ restart: () => void }>(null);

  const handleRestartPlayer = () => {
    // Force page reload as fallback since ref might not work
    window.location.reload();
  };

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
    <div className="p-4 md:p-8 flex flex-col lg:flex-row lg:gap-6 lg:items-start lg:h-screen lg:overflow-hidden">
      {/* Player Section */}
      <div className="flex-1 flex flex-col">
        <div className="w-full max-w-4xl mx-auto lg:mx-0" style={{ width: '100%' }}>
          <VideoPlayer ref={videoPlayerRef} src={selectedChannel.url} channelName={selectedChannel.name} />
          
          {/* Restart Button */}
          <div className="flex justify-center mt-3">
            <button
              onClick={handleRestartPlayer}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-lg"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reiniciar Player
            </button>
          </div>
          
          <h1 className="text-2xl font-bold mt-4 mb-4 text-gray-900 dark:text-white text-center lg:text-left">Tocando agora: {selectedChannel.name}</h1>
        </div>
      </div>
      
      {/* Chat Section - Mobile: below, Desktop: sidebar */}
      <div className="w-full lg:w-80 lg:flex-shrink-0 lg:h-full">
        <LiveChat channelName={selectedChannel.name} />
      </div>
    </div>
  );
};