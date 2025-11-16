import React, { useState, useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  channelName: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, channelName }) => {
  const [playerSrc, setPlayerSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPlayerSrc(null);
    setIsLoading(true);

    const timer = setTimeout(() => {
      setPlayerSrc(src);
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [src]);

  useEffect(() => {
    const handleResize = () => {
      if (playerRef.current) {
        playerRef.current.style.height = `${playerRef.current.offsetWidth * 0.5625}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isEmbed = src.includes('embedcanais.com');

  if (isEmbed) {
    return (
      <div
        ref={playerRef}
        className="w-full bg-black rounded-lg shadow-2xl overflow-hidden flex items-center justify-center"
      >
        {isLoading ? (
          <div className="text-white flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span>Carregando canal...</span>
          </div>
        ) : playerSrc ? (
          <iframe
            key={`${channelName}-${Date.now()}`}
            src={playerSrc}
            title={channelName}
            allowFullScreen
            frameBorder="0"
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            referrerPolicy="no-referrer"
          >
            Seu navegador não suporta iframes.
          </iframe>
        ) : (
          <div className="text-white">Erro ao carregar canal</div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className="w-full bg-black rounded-lg shadow-2xl overflow-hidden flex items-center justify-center"
    >
      {isLoading ? (
        <div className="text-gray-700 dark:text-white flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          <span>Carregando canal...</span>
        </div>
      ) : playerSrc ? (
        <video
          key={`${channelName}-${Date.now()}`}
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