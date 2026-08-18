import API from './axios';

/**
 * POST /api/chat
 * @param {string} message - El mensaje del usuario
 * @param {Array<{role: string, content: string}>} history - Historial de conversación
 */
export const sendChatMessage = (message, history = []) =>
  API.post('/api/chat', { message, history });
