import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { ChannelListPage } from './pages/ChannelListPage';
import { AboutPage } from './pages/AboutPage';
import type { Channel } from './types';
import { Page } from './types';
import { getChannels } from './services/iptvService';
import { useErrorHandler, categorizeError } from './hooks/useErrorHandler';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { error, handleError, clearError, retry, shouldShowRetry } = useErrorHandler();

  const fetchChannels = useCallback(async () => {
    try {
      setIsLoading(true);
      clearError();
      const fetchedChannels = await getChannels();
      setChannels(fetchedChannels);
      if (fetchedChannels.length > 0) {
        setSelectedChannel(fetchedChannels[0]);
      }
    } catch (err) {
      const errorType = categorizeError(err as Error);
      handleError(err as Error, errorType, true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const handleRetry = () => {
    retry();
    fetchChannels();
  };

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setCurrentPage(Page.HOME);
    setIsSidebarOpen(false); // Close sidebar on channel selection
  };
  
  const handleSetCurrentPage = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); // Close sidebar on page navigation
  };

  const renderContent = () => {
    if (isLoading) {
        return <div className="flex items-center justify-center h-full p-4 text-center"><p className="text-xl">Loading channels...</p></div>;
    }
    if (error) {
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center space-y-4">
            <p className="text-xl text-red-500">{error.message}</p>
            <p className="text-sm text-gray-400">
              Error Type: {error.type.toUpperCase()}
            </p>
            {shouldShowRetry && (
              <button 
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        );
    }

    switch (currentPage) {
      case Page.HOME:
        return <HomePage selectedChannel={selectedChannel} />;
      case Page.CHANNEL_LIST:
        return <ChannelListPage channels={channels} onSelectChannel={handleSelectChannel} />;
      case Page.ABOUT:
        return <AboutPage />;
      default:
        return <HomePage selectedChannel={selectedChannel} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={handleSetCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-800 shadow-md shrink-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-white p-2 rounded-md hover:bg-slate-700 transition-colors"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">IPTV Player</h1>
            <div className="w-8"></div> {/* Spacer */}
        </header>
        
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;