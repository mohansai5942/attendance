import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';
import Login from '../../pages/Login';

export default function Layout() {
    const { user } = useApp();

    if (!user) {
        return <Login />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200 font-sans text-slate-900 dark:text-slate-50">
            <Sidebar />
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                <Header />
                <main className="flex-1 relative overflow-y-auto focus:outline-none p-6 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
