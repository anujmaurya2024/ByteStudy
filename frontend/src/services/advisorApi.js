import { getAuthToken, hasRemoteAuthApi, refreshActiveSession } from './authApi';

const API_BASE_URL = (import.meta.env.VITE_AUTH_API_URL || '').replace(/\/$/, '');

export const askAdvisor = async (text) => {
  if (!hasRemoteAuthApi() || !getAuthToken()) {
    throw new Error('The remote advisor is not configured for this session.');
  }

  const request = () => fetch(`${API_BASE_URL}/advisor/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
    body: JSON.stringify({ text }),
  });
  let response = await request();
  if ((response.status === 401 || response.status === 403) && getAuthToken()) {
    try { await refreshActiveSession(); response = await request(); } catch { /* Use the original API error below. */ }
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.text) {
    throw new Error(data.message || 'ByteAI could not answer right now.');
  }

  return data;
};
