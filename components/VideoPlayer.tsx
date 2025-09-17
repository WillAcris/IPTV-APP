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
  const uiRef = useRef<any>(null);
  const currentProxyIndexRef = useRef<number>(0);
  const isLoadingRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Ensure Shaka Player is loaded
    if (!window.shaka) {
        console.error('Shaka Player library not loaded!');
        return;
    }

    // Ensure Shaka Player UI is loaded
    if (!window.shaka.ui) {
        console.error('Shaka Player UI library not loaded!');
        return;
    }

    // Prevent multiple initializations
    if (isLoadingRef.current) {
        console.log('Player already loading, skipping...');
        return;
    }

    const player = new window.shaka.Player();
    playerRef.current = player;
    
    // Initialize the player UI
    const ui = new window.shaka.ui.Overlay(player, container, video);
    uiRef.current = ui;
    
    // Configure UI if needed
    // ui.configure({...});
    
    const onError = (error: any) => {
        // Prevent error handling during loading process
        if (isLoadingRef.current) {
            return;
        }
        
        console.error('Shaka Player Error:', error.code, 'Object', error);
        
        // Enhanced error handling for common proxy-related issues
        if (error.code === 4000) {
            console.error('Manifest parsing failed - likely due to proxy issues or invalid stream format');
        } else if (error.code === 1001) {
            console.error('Network error - proxy might be failing or stream is unavailable');
        } else if (error.code === 3016) {
            console.error('Content is not supported - stream format might be incompatible');
        } else if (error.code === 6007) {
            console.error('Operation aborted - likely due to source change or component unmount');
        }
        
        // Log additional error details for better debugging
        if (error.detail) {
            console.error('Error details:', error.detail);
        }
        
        // Log the current proxy being used
        console.error(`Error occurred with proxy index: ${currentProxyIndexRef.current}`);
    };
    
    const tryLoadWithProxy = async (proxyIndex: number = 0): Promise<void> => {
        // Check if we should abort (component unmounting or src changed)
        if (!playerRef.current || !src) {
            throw new Error('Player or source not available');
        }
        
        try {
            const proxiedSrc = getProxiedUrl(src, proxyIndex);
            console.log(`Trying proxy ${proxyIndex}: ${proxiedSrc}`);
            
            // Validate the proxied URL
            if (!proxiedSrc || proxiedSrc.trim() === '') {
                throw new Error('Invalid proxied URL');
            }
            
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
                throw new Error(`All proxy methods failed. Last error: ${error}`);
            }
        }
    };

    const initPlayer = async () => {
        try {
            isLoadingRef.current = true;
            console.log(`Initializing player for source: ${src}`);
            
            await player.attach(video);
            player.addEventListener('error', onError);
            
            // Try loading with different proxies
            await tryLoadWithProxy(0);
            console.log('The video has been loaded successfully!');
        } catch (e) {
            console.error('Failed to initialize player after all attempts:', e);
            onError(e);
        } finally {
            isLoadingRef.current = false;
        }
    };
    
    initPlayer();

    // Cleanup on component unmount or src change
    return () => {
      isLoadingRef.current = false;
      
      if (uiRef.current) {
        try {
          uiRef.current.destroy();
          console.log('Shaka Player UI destroyed.');
        } catch (e) {
          console.warn('Error destroying UI:', e);
        }
        uiRef.current = null;
      }
      
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          console.log('Shaka Player instance destroyed.');
        } catch (e) {
          console.warn('Error destroying player:', e);
        }
        playerRef.current = null;
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