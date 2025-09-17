import { useState, useCallback } from 'react';

export interface ErrorState {
  message: string;
  type: 'network' | 'parsing' | 'proxy' | 'general';
  timestamp: number;
  canRetry: boolean;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const handleError = useCallback((err: Error | string, type: ErrorState['type'] = 'general', canRetry = true) => {
    const errorMessage = typeof err === 'string' ? err : err.message;
    
    setError({
      message: errorMessage,
      type,
      timestamp: Date.now(),
      canRetry
    });
    
    console.error(`[${type.toUpperCase()}] Error:`, errorMessage);
  }, []);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    clearError();
  }, [clearError]);

  const isNetworkError = error?.type === 'network' || error?.type === 'proxy';
  const shouldShowRetry = error?.canRetry && retryCount < 3;

  return {
    error,
    retryCount,
    clearError,
    handleError,
    retry,
    isNetworkError,
    shouldShowRetry
  };
};

/**
 * Utility function to categorize errors based on their message
 */
export const categorizeError = (error: Error): ErrorState['type'] => {
  const message = error.message.toLowerCase();
  
  if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
    return 'network';
  }
  
  if (message.includes('proxy') || message.includes('cors') || message.includes('html instead of')) {
    return 'proxy';
  }
  
  if (message.includes('parse') || message.includes('xml') || message.includes('json')) {
    return 'parsing';
  }
  
  return 'general';
};
