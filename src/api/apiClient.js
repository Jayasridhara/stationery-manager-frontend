// API Configuration
const BASE_URL ='http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }
    return response.json();
};

// Authentication API
export const authAPI = {
    login: async (username, password) => {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        return handleResponse(response);
    },
    register: async (username, password, role) => {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        });
        return handleResponse(response);
    },
};

// Categories API
export const categoriesAPI = {
    getAll: async () => {
        const response = await fetch(`${BASE_URL}/categories`);
        return handleResponse(response);
    },
    create: async (name) => {
        const response = await fetch(`${BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        return handleResponse(response);
    },
    delete: async (categoryId) => {
        const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.status === 204) return null;
        return handleResponse(response);
    },
};

// Items API
export const itemsAPI = {
    getAll: async () => {
        const response = await fetch(`${BASE_URL}/items`);
        return handleResponse(response);
    },
    create: async (itemData) => {
        const response = await fetch(`${BASE_URL}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData),
        });
        return handleResponse(response);
    },
    update: async (itemId, itemData) => {
        const response = await fetch(`${BASE_URL}/items/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData),
        });
        return handleResponse(response);
    },
    delete: async (itemId) => {
        const response = await fetch(`${BASE_URL}/items/${itemId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.status === 204) return null;
        return handleResponse(response);
    },
};
