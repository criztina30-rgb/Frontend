import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorites';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getFavorites();
      setFavorites(res.data);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = (motorcycleId) => {
    return favorites.some(fav => fav.id === motorcycleId);
  };

  const toggleFavorite = async (motorcycleId) => {
    if (!user) return false;

    const currentlyFavorite = isFavorite(motorcycleId);

    try {
      if (currentlyFavorite) {
        // Optimistic update
        setFavorites(prev => prev.filter(f => f.id !== motorcycleId));
        await removeFavorite(motorcycleId);
      } else {
        // Since we need the full motorcycle object, we might just re-fetch, 
        // or add a placeholder. It's safer to re-fetch to get all fields.
        await addFavorite(motorcycleId);
        await fetchFavorites();
      }
      return true;
    } catch (err) {
      console.error("Failed to toggle favorite", err);
      // Revert on error
      await fetchFavorites();
      return false;
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}
