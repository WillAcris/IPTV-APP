import React, { useState, useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  channelName: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, channelName }) => {
  const [playerSrc, setPlayerSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [forceReload, setForceReload] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const restartIframe = () => {
    setIsLoading(true);
    setPlayerSrc(null);
    
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    
    setTimeout(() => {
      setForceReload(prev => prev + 1);
      setPlayerSrc(src);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    // Clear previous iframe completely
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    
    setPlayerSrc(null);
    setIsLoading(true);

    const timer = setTimeout(() => {
      setPlayerSrc(src);
      setIsLoading(false);
    }, 1000); // Longer delay to ensure previous session is fully closed

    return () => {
      clearTimeout(timer);
      // Force cleanup of iframe
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank';
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      setPlayerSrc(null);
    };
  }, [src]);

  const isEmbed = src.includes('embedcanais.com');

  const playerElement = () => {
    if (isEmbed) {
      return (
        <div className="w-full">
          <div className="aspect-video bg-black rounded-lg shadow-2xl overflow-hidden flex items-center justify-center">
            {isLoading ? (
              <div className="text-white flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span>Preparando canal...</span>
              </div>
            ) : playerSrc ? (
              <div ref={containerRef} className="w-full h-full">
                <iframe
                  ref={iframeRef}
                  key={`iframe-${channelName}-${Date.now()}-${forceReload}`}
                  src={playerSrc}
                  title={channelName}
                  allowFullScreen
                  frameBorder="0"
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-top-navigation allow-popups"
                  referrerPolicy="no-referrer"
                  onLoad={() => console.log(`Iframe loaded for ${channelName}`)}
                >
                  Seu navegador não suporta iframes.
                </iframe>
              </div>
            ) : (
              <div className="text-white">Erro ao carregar canal</div>
            )}
          </div>
          <div className="mt-3 flex justify-center">
            <button
              onClick={restartIframe}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading ? 'Reiniciando...' : 'Reiniciar Player'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden flex items-center justify-center">
        {isLoading ? (
          <div className="text-gray-700 dark:text-white flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            <span>Carregando canal...</span>
          </div>
        ) : playerSrc ? (
          <video
            key={`video-${channelName}-${Date.now()}`}
            className="w-full h-full"
            controls
            autoPlay
            playsInline
          >
            <source src={playerSrc} type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
          </video>
        ) : (
           <div className="text-gray-700 dark:text-white">Erro ao carregar canal</div>
        )}
      </div>
    );
  };

  return playerElement();
};