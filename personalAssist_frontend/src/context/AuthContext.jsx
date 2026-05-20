import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            if (token) {
                try {
                    const userData = await api.getMe();
                    setUser(userData);
                } catch (error) {
                    console.error("Session verification failed, logging out...", error);
                    logoutUser();
                }
            }
            setLoading(false);
        };
        verifySession();
    }, [token]);

    const loginUser = async (email, password) => {
        try {
            const data = await api.login(email, password);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName
            });
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signupUser = async (email, password, firstName, lastName) => {
        try {
            const data = await api.signup(email, password, firstName, lastName);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName
            });
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const forgotPasswordUser = async (email) => {
        try {
            return await api.forgotPassword(email);
        } catch (error) {
            throw error;
        }
    };

    const resetPasswordUser = async (resetToken, newPassword) => {
        try {
            return await api.resetPassword(resetToken, newPassword);
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            loginUser,
            signupUser,
            logoutUser,
            forgotPasswordUser,
            resetPasswordUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
