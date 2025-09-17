import { useEffect, useRef } from 'react';
import { getProxiedUrl } from '../services/iptvService';

// Make Shaka Player available in the window scope from the script tag in index.html
declare global {
  interface Window {
    shaka: any;
  }
}

interface VideoPlayerProps {
  src: string;
  channelName: string; // Keep for potential future use (e.g., analytics)
}

export const VideoPlayer = ({ src }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const currentProxyIndexRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Ensure Shaka Player is loaded
    if (!window.shaka) {
        console.error('Shaka Player library not loaded!');
        return;
    }

    const player = new window.shaka.Player();
    playerRef.current = player;
    
    // Initialize the player UI
    const ui = new window.shaka.ui.Overlay(player, container, video);
    // You can configure the UI controls here if needed
    // ui.configure({...});
    
    const onError = (error: any) => {
        console.error('Shaka Player Error:', error.code, 'Object', error);
        
        // Enhanced error handling for common proxy-related issues
        if (error.code === 4000) {
            console.error('Manifest parsing failed - likely due to proxy issues or invalid stream format');
        } else if (error.code === 1001) {
            console.error('Network error - proxy might be failing or stream is unavailable');
        }
        
        // Log additional error details for better debugging
        if (error.detail) {
            console.error('Error details:', error.detail);
        }
    };
    
    const tryLoadWithProxy = async (proxyIndex: number = 0): Promise<void> => {
        try {
            const proxiedSrc = getProxiedUrl(src, proxyIndex);
            console.log(`Trying proxy ${proxyIndex}: ${proxiedSrc}`);
            
            const loadPromise = player.load(proxiedSrc);
            const timeoutPromise = new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error('Loading timeout after 15 seconds')), 15000)
            );
            
            await Promise.race([loadPromise, timeoutPromise]);
            console.log(`Successfully loaded with proxy ${proxyIndex}`);
            currentProxyIndexRef.current = proxyIndex;
        } catch (error) {
            console.warn(`Proxy ${proxyIndex} failed:`, error);
            
            // Try next proxy if available (max 4 proxies)
            if (proxyIndex < 3) {
                await tryLoadWithProxy(proxyIndex + 1);
            } else {
                throw new Error('All proxy methods failed');
            }
        }
    };

    const initPlayer = async () => {
        try {
            console.log(`Initializing player for source: ${src}`);
            
            await player.attach(video);
            player.addEventListener('error', onError);
            
            // Try loading with different proxies
            await tryLoadWithProxy(0);
            console.log('The video has been loaded successfully!');
        } catch (e) {
            console.error('Failed to initialize player after all attempts:', e);
            onError(e);
        }
    };
    
    initPlayer();

    // Cleanup on component unmount or src change
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        console.log('Shaka Player instance destroyed.');
      }
    };
  }, [src]); // Re-run effect when the 'src' prop changes

  return (
    <div 
        ref={containerRef}
        className="w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden"
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        autoPlay
        playsInline
        // The poster can be used to show a logo or loading image
        // poster="//shaka-player-demo.appspot.com/assets/poster.jpg"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};