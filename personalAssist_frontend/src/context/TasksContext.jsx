import React, { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../services/api';

const TasksContext = createContext();

export const useTasks = () => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};

export const TasksProvider = ({ children }) => {
    const [todayTasks, setTodayTasks] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [revisions, setRevisions] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDailyData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [today, overdue, revs] = await Promise.all([
                api.getTodayTasks(),
                api.getOverdueTasks(),
                api.getTodayRevisions()
            ]);
            setTodayTasks(today || []);
            setOverdueTasks(overdue || []);
            setRevisions(revs || []);
        } catch (err) {
            console.error('Error fetching daily tasks & revisions:', err);
            setError(err.message || 'Failed to load daily dashboard data');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTasksPageData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [today, upcoming, overdue] = await Promise.all([
                api.getTodayTasks(),
                api.getUpcomingTasks(),
                api.getOverdueTasks()
            ]);
            setTodayTasks(today || []);
            setUpcomingTasks(upcoming || []);
            setOverdueTasks(overdue || []);
        } catch (err) {
            console.error('Error fetching task lists:', err);
            setError(err.message || 'Failed to load task lists');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPreferences = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const prefs = await api.getSchedulerPreferences();
            setPreferences(prefs || []);
        } catch (err) {
            console.error('Error fetching preferences:', err);
            setError(err.message || 'Failed to load scheduler preferences');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTaskStatus = useCallback(async (id, newStatus) => {
        // Optimistic update
        let previousToday = [...todayTasks];
        let previousUpcoming = [...upcomingTasks];
        let previousOverdue = [...overdueTasks];

        const updateList = (list) =>
            list.map((t) => (t.id === id ? { ...t, status: newStatus, completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : null } : t));

        setTodayTasks((prev) => updateList(prev));
        setUpcomingTasks((prev) => updateList(prev));
        setOverdueTasks((prev) => updateList(prev));

        try {
            const updatedTask = await api.updateTaskStatus(id, newStatus);
            
            // Sync with actual response
            const syncList = (list) =>
                list.map((t) => (t.id === id ? updatedTask : t));

            setTodayTasks((prev) => syncList(prev));
            setUpcomingTasks((prev) => syncList(prev));
            setOverdueTasks((prev) => syncList(prev));

            // If we completed a task, we should refresh revisions due today just in case,
            // or if we complete a task we can reload the today lists to see if subtopics updated.
            if (newStatus === 'COMPLETED') {
                fetchDailyData();
            }
        } catch (err) {
            console.error('Failed to update task status, rolling back:', err);
            setTodayTasks(previousToday);
            setUpcomingTasks(previousUpcoming);
            setOverdueTasks(previousOverdue);
            throw err;
        }
    }, [todayTasks, upcomingTasks, overdueTasks, fetchDailyData]);

    const completeRevision = useCallback(async (id) => {
        // Optimistic update
        let previousRevisions = [...revisions];
        setRevisions((prev) => prev.filter((r) => r.id !== id));

        try {
            await api.completeRevision(id);
        } catch (err) {
            console.error('Failed to complete revision, rolling back:', err);
            setRevisions(previousRevisions);
            throw err;
        }
    }, [revisions]);

    const triggerScheduler = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await api.runDailyScheduler();
            await fetchDailyData();
        } catch (err) {
            console.error('Scheduler failure:', err);
            setError(err.message || 'Scheduler failed to run');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchDailyData]);

    const savePreference = useCallback(async (pref) => {
        setLoading(true);
        setError(null);
        try {
            const saved = await api.saveSchedulerPreference(pref);
            setPreferences((prev) => {
                const filtered = prev.filter((p) => p.skillId !== pref.skillId);
                return [...filtered, saved];
            });
        } catch (err) {
            console.error('Failed to save scheduler preference:', err);
            setError(err.message || 'Failed to save scheduler settings');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteTask = useCallback(async (id) => {
        // Optimistic update
        let previousToday = [...todayTasks];
        let previousUpcoming = [...upcomingTasks];
        let previousOverdue = [...overdueTasks];

        setTodayTasks((prev) => prev.filter((t) => t.id !== id));
        setUpcomingTasks((prev) => prev.filter((t) => t.id !== id));
        setOverdueTasks((prev) => prev.filter((t) => t.id !== id));

        try {
            await api.deleteTask(id);
        } catch (err) {
            console.error('Failed to delete task, rolling back:', err);
            setTodayTasks(previousToday);
            setUpcomingTasks(previousUpcoming);
            setOverdueTasks(previousOverdue);
            throw err;
        }
    }, [todayTasks, upcomingTasks, overdueTasks]);

    const value = {
        todayTasks,
        upcomingTasks,
        overdueTasks,
        revisions,
        preferences,
        loading,
        error,
        fetchDailyData,
        fetchTasksPageData,
        fetchPreferences,
        updateTaskStatus,
        completeRevision,
        triggerScheduler,
        savePreference,
        deleteTask,
    };

    return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
