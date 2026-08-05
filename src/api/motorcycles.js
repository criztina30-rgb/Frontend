import API from './axios';

export const getMotorcycles = (params) => API.get('/api/motorcycles', { params });
export const getMotorcycle = (id) => API.get(`/api/motorcycles/${id}`);
export const createMotorcycle = (data) => API.post('/api/motorcycles', data);
export const updateMotorcycle = (id, data) => API.put(`/api/motorcycles/${id}`, data);
export const deleteMotorcycle = (id) => API.delete(`/api/motorcycles/${id}`);
