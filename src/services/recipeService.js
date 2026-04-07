import api from './api';

export const getRecipes    = (params) => api.get('/recipes', { params });
export const getRecipe     = (id)     => api.get(`/recipes/${id}`);
export const createRecipe  = (data)   => api.post('/recipes', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateRecipe  = (id, data) => api.put(`/recipes/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteRecipe  = (id)     => api.delete(`/recipes/${id}`);
export const toggleLike    = (id)     => api.put(`/recipes/${id}/like`);
export const rateRecipe    = (id, score) => api.post(`/recipes/${id}/rate`, { score });

export const getComments   = (recipeId) => api.get(`/recipes/${recipeId}/comments`);
export const addComment    = (recipeId, text) => api.post(`/recipes/${recipeId}/comments`, { text });
export const deleteComment = (id)       => api.delete(`/comments/${id}`);

export const getUserProfile  = (id)       => api.get(`/users/${id}`);
export const updateProfile   = (data)     => api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const toggleFavorite  = (recipeId) => api.put(`/users/favorites/${recipeId}`);
export const getFavorites    = ()         => api.get('/users/me/favorites');
