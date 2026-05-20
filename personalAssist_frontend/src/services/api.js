const API_BASE_URL = 'http://localhost:8080/api/auth';

export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error(`API Error in ${endpoint}:`, error);
        throw error;
    }
};

export const login = (email, password) => {
    return apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const signup = (email, password, firstName, lastName) => {
    return apiRequest('/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName }),
    });
};

export const forgotPassword = (email) => {
    return apiRequest('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
};

export const resetPassword = (token, newPassword) => {
    return apiRequest('/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
    });
};

export const getMe = () => {
    return apiRequest('/me', {
        method: 'GET',
    });
};
