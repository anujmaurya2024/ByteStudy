import { getAuthToken, hasRemoteAuthApi } from './authApi';

const API_BASE_URL = (import.meta.env.VITE_AUTH_API_URL || '').replace(/\/$/, '');

export async function buildCareerRoadmap({ goal, phase, semester }) {
  if (!hasRemoteAuthApi() || !getAuthToken()) throw new Error('Sign in to build a personalized roadmap.');
  const response = await fetch(`${API_BASE_URL}/career/roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getAuthToken()}` },
    body: JSON.stringify({ goal, phase, semester }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.roadmap) throw new Error(data.message || 'The AI roadmap could not be generated.');
  return data.roadmap;
}
