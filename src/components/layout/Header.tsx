import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { format } from 'date-fns';

export default function Header() {
    const { isDarkMode, toggleDarkMode } = useApp();
    const today = format(new Date(), 'MMM d, yyyy');

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex items-center justify-between px-6 sm:px-8 z-10 transition-colors duration-200">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight hidden sm:block">System Overview</h2>
                <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wide">
                    Live Status
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Current Date</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{today}</p>
                </div>
                
                <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                
                <div className="flex items-center gap-3">
                    <div className="relative hidden lg:block w-48 mr-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-lg border-0 py-1.5 pl-9 pr-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-xs transition-colors outline-none"
                            placeholder="Quick search..."
                        />
                    </div>
                    <button 
                        onClick={toggleDarkMode}
                        className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                    <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
                    </button>
                </div>
            </div>
        </header>
    );
}
