import React from 'react';
import { Navigate } from 'react-router-dom';
import BaseAdminPanel from '../components/AdminPanel';

const getStoredUser = () => {
    try {
        const rawUser = localStorage.getItem('user');
        return rawUser ? JSON.parse(rawUser) : null;
    } catch {
        return null;
    }
};

export default function AdminPanelPage() {
    const user = getStoredUser();
    const isAdmin = String(user?.role || '').toLowerCase() === 'admin';

    if (!user || !isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return <BaseAdminPanel />;
}
