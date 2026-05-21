import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SkillsProvider } from './context/SkillsContext';
import { TasksProvider } from './context/TasksContext';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import SkillsPage from './pages/SkillsPage';
import SkillDetailPage from './pages/SkillDetailPage';
import TasksPage from './pages/TasksPage';
import SchedulerSettingsPage from './pages/SchedulerSettingsPage';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-500"></div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const { token, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-500"></div>
            </div>
        );
    }

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SkillsProvider>
                    <TasksProvider>
                        <Routes>
                            <Route 
                                path="/login" 
                                element={
                                    <PublicRoute>
                                        <Login />
                                    </PublicRoute>
                                } 
                            />
                            <Route 
                                path="/signup" 
                                element={
                                    <PublicRoute>
                                        <Signup />
                                    </PublicRoute>
                                } 
                            />
                            <Route 
                                path="/forgot-password" 
                                element={
                                    <PublicRoute>
                                        <ForgotPassword />
                                    </PublicRoute>
                                } 
                            />
                            <Route 
                                path="/reset-password" 
                                element={
                                    <PublicRoute>
                                        <ResetPassword />
                                    </PublicRoute>
                                } 
                            />
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/skills" 
                                element={
                                    <ProtectedRoute>
                                        <SkillsPage />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/skills/:id" 
                                element={
                                    <ProtectedRoute>
                                        <SkillDetailPage />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/tasks" 
                                element={
                                    <ProtectedRoute>
                                        <TasksPage />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/scheduler-settings" 
                                element={
                                    <ProtectedRoute>
                                        <SchedulerSettingsPage />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </TasksProvider>
                </SkillsProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

