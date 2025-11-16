import React, { useState, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  channelName: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, channelName }) => {
  const [playerSrc, setPlayerSrc] = useState<string | null>(null);

  useEffect(() => {
    setPlayerSrc(null);

    const timer = setTimeout(() => {
      setPlayerSrc(src);
    }, 100); 

    return () => {
      clearTimeout(timer);
    };
  }, [src]);

  const isEmbed = src.includes('embedcanais.com');

  if (isEmbed) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden flex items-center justify-center">
        {playerSrc ? (
          <iframe
            key={playerSrc}
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
          <div className="text-white">Carregando canal...</div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden flex items-center justify-center">
      {playerSrc ? (
        <video
          key={playerSrc}
          className="w-full h-full"
          controls
          autoPlay
          playsInline
        >
          <source src={playerSrc} type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
      ) : (
         <div className="text-gray-700 dark:text-white">Carregando canal...</div>
      )}
    </div>
  );
};