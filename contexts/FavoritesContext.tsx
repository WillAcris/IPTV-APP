import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (channelId: string) => void;
  removeFavorite: (channelId: string) => void;
  isFavorite: (channelId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'iptv_favorites';

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error('Error reading favorites from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage', error);
    }
  }, [favorites]);

  const addFavorite = useCallback((channelId: string) => {
    setFavorites((prev) => {
      if (prev.includes(channelId)) return prev;
      return [...prev, channelId];
    });
  }, []);

  const removeFavorite = useCallback((channelId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== channelId));
  }, []);

  const isFavorite = useCallback(
    (channelId: string) => {
      return favorites.includes(channelId);
    },
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};