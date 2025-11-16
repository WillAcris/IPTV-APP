import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { ChannelListPage } from './pages/ChannelListPage';
import { SettingsPage } from './pages/SettingsPage';
import type { Channel } from './types';
import { Page } from './types';
import { getChannels } from './services/iptvService';
import { BottomNavBar } from './components/BottomNavBar';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const fetchChannels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedChannels = await getChannels();
      setChannels(fetchedChannels);
      if (fetchedChannels.length > 0) {
        setSelectedChannel(fetchedChannels[0]);
      }
    } catch (err) {
      setError('Falha ao carregar os canais. Por favor, tente novamente mais tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setCurrentPage(Page.HOME);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const renderContent = () => {
    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><p className="text-xl text-gray-700 dark:text-gray-200">Carregando canais...</p></div>;
    }
    if (error) {
        return <div className="flex items-center justify-center h-full"><p className="text-xl text-red-500">{error}</p></div>;
    }

    switch (currentPage) {
      case Page.HOME:
        return <HomePage selectedChannel={selectedChannel} />;
      case Page.CHANNEL_LIST:
        return <ChannelListPage channels={channels} onSelectChannel={handleSelectChannel} />;
      case Page.SETTINGS:
        return <SettingsPage />;
      default:
        return <HomePage selectedChannel={selectedChannel} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 font-sans">
      <div className="hidden md:flex">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          isCollapsed={isSidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
      </div>
      <main className={`flex-1 overflow-y-auto transition-all duration-300 md:ml-0 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-0'} pb-20 md:pb-0`}>
        {renderContent()}
      </main>
      <div className="md:hidden">
        <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default App;