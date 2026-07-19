const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json.data;
}

export const api = {
  players: {
    list: () => request('/players'),
    create: (data) => request('/players', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/players/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/players/${id}`, { method: 'DELETE' }),
  },
  clubs: {
    list: () => request('/clubs'),
    create: (data) => request('/clubs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/clubs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/clubs/${id}`, { method: 'DELETE' }),
  },
  matches: {
    list: () => request('/matches'),
    create: (data) => request('/matches', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => request(`/matches/${id}`, { method: 'DELETE' }),
  },
  seasons: {
    list: () => request('/seasons'),
    create: (data) => request('/seasons', { method: 'POST', body: JSON.stringify(data) }),
    toggle: (id) => request(`/seasons/${id}/toggle`, { method: 'PATCH' }),
    delete: (id) => request(`/seasons/${id}`, { method: 'DELETE' }),
  },
  rankings: {
    players: () => request('/rankings/players'),
    clubs: () => request('/rankings/clubs'),
  },
};
