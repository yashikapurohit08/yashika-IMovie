const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('imovies_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Auth
  register: (body) => apiRequest('/auth/register', { method: 'POST', body }),
  login: (body) => apiRequest('/auth/login', { method: 'POST', body }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (body) => apiRequest('/auth/profile', { method: 'PUT', body }),

  // Movies
  getMovies: (params = '') => apiRequest(`/movies${params}`),
  getMovieById: (id) => apiRequest(`/movies/${id}`),
  createMovie: (body) => apiRequest('/movies', { method: 'POST', body }),
  updateMovie: (id, body) => apiRequest(`/movies/${id}`, { method: 'PUT', body }),
  deleteMovie: (id) => apiRequest(`/movies/${id}`, { method: 'DELETE' }),

  // Theatres
  getTheatres: (params = '') => apiRequest(`/theatres${params}`),
  getTheatreById: (id) => apiRequest(`/theatres/${id}`),
  createTheatre: (body) => apiRequest('/theatres', { method: 'POST', body }),
  updateTheatre: (id, body) => apiRequest(`/theatres/${id}`, { method: 'PUT', body }),
  deleteTheatre: (id) => apiRequest(`/theatres/${id}`, { method: 'DELETE' }),

  // Shows
  getShows: (params = '') => apiRequest(`/shows${params}`),
  getShowById: (id) => apiRequest(`/shows/${id}`),
  holdSeats: (id, body) => apiRequest(`/shows/${id}/hold`, { method: 'POST', body }),
  releaseSeats: (id, body) => apiRequest(`/shows/${id}/release`, { method: 'POST', body }),
  createShow: (body) => apiRequest('/shows', { method: 'POST', body }),
  updateShow: (id, body) => apiRequest(`/shows/${id}`, { method: 'PUT', body }),
  deleteShow: (id) => apiRequest(`/shows/${id}`, { method: 'DELETE' }),

  // Bookings
  createBooking: (body) => apiRequest('/bookings', { method: 'POST', body }),
  getMyBookings: () => apiRequest('/bookings/my-bookings'),
  getBookingById: (id) => apiRequest(`/bookings/${id}`),
  cancelBooking: (id, body = {}) => apiRequest(`/bookings/${id}/cancel`, { method: 'PUT', body }),

  // Admin
  getAdminStats: () => apiRequest('/admin/stats'),
  getAllBookings: (params = '') => apiRequest(`/admin/bookings${params}`),
  getAllUsers: () => apiRequest('/admin/users')
};
