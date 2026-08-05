import API from './axios';

export const getBookings = () => API.get('/api/bookings');
export const createBooking = (data) => API.post('/api/bookings', data);
export const getBooking = (id) => API.get(`/api/bookings/${id}`);
export const updateBookingStatus = (id, data) => API.put(`/api/bookings/${id}/status`, data);
export const deleteBooking = (id) => API.delete(`/api/bookings/${id}`);
