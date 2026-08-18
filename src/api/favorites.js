import API from './axios';

export const getFavorites = () => API.get('/api/favorites');
export const addFavorite = (motorcycleId) => API.post('/api/favorites', { motorcycleId });
export const removeFavorite = (motorcycleId) => API.delete(`/api/favorites/${motorcycleId}`);
