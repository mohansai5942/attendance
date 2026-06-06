import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    ClipboardCheck, 
    FileText, 
    Settings, 
    LogOut,
    GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export default function Sidebar() {
    const { user, logout } = useApp();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Student Directory', path: '/students', icon: Users },
        { name: 'Mark Attendance', path: '/attendance', icon: ClipboardCheck },
        { name: 'Reports', path: '/reports', icon: FileText },
        ...(user?.role === 'Admin' ? [{ name: 'Settings', path: '/settings', icon: Settings }] : []),
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-colors duration-200">
            <div className="p-6 flex items-center gap-3 bg-slate-950">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                   <h1 className="text-white font-bold text-sm tracking-tight">EDU-TRACK PRO</h1>
                   <p className="text-[10px] text-slate-400 uppercase tracking-widest">College Mgmt</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 pb-2">Main Menu</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                            isActive 
                                ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                                : "hover:bg-slate-800 text-slate-300 border border-transparent"
                        )}
                    >
                        <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    Sign Out
                </button>
                <div className="mt-4 flex items-center gap-3 bg-slate-800/50 p-2 rounded-xl">
                    <img
                        className="h-8 w-8 rounded-full border border-slate-500 bg-slate-600"
                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=1e293b&color=cbd5e1`}
                        alt=""
                    />
                    <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-[10px] opacity-60 text-slate-300">{user?.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
