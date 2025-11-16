import React, { useState, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  channelName: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, channelName }) => {
  const [playerSrc, setPlayerSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPlayerSrc(null);
    setIsLoading(true);

    const timer = setTimeout(() => {
      setPlayerSrc(src);
      setIsLoading(false);
    }, 500); // Increased delay to prevent multiple instances

    return () => {
      clearTimeout(timer);
      setPlayerSrc(null); // Force cleanup
    };
  }, [src]);

  const isEmbed = src.includes('embedcanais.com');

  if (isEmbed) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden flex items-center justify-center">
        {isLoading ? (
          <div className="text-white">Carregando canal...</div>
        ) : playerSrc ? (
          <iframe
            key={`${playerSrc}-${Date.now()}`} // Unique key to force remount
            src={playerSrc}
            title={channelName}
            allowFullScreen
            frameBorder="0"
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-top-navigation"
            referrerPolicy="no-referrer"
          >
            Seu navegador não suporta iframes.
          </iframe>
        ) : (
          <div className="text-white">Preparando player...</div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden flex items-center justify-center">
      {isLoading ? (
        <div className="text-gray-700 dark:text-white">Carregando canal...</div>
      ) : playerSrc ? (
        <video
          key={`${playerSrc}-${Date.now()}`}
          className="w-full h-full"
          controls
          autoPlay
          playsInline
        >
          <source src={playerSrc} type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
      ) : (
         <div className="text-gray-700 dark:text-white">Preparando player...</div>
      )}
    </div>
  );
};