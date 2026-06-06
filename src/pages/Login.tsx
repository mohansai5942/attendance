import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { User as UserType } from '../types';

const DEMO_USERS: UserType[] = [
  {
    id: 'FAC001',
    name: 'Dr. Jane Smith',
    role: 'Faculty',
    department: 'CSE',
    email: 'jane.smith@college.edu'
  },
  {
    id: 'ADM001',
    name: 'Admin User',
    role: 'Admin',
    email: 'admin@college.edu'
  }
];

export default function Login() {
    const { login } = useApp();
    const [selectedUser, setSelectedUser] = useState<UserType>(DEMO_USERS[0]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(selectedUser);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                        <GraduationCap className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        College Attendance Pro
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Secure Access Portal
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Demo Account</p>
                        <div className="grid grid-cols-1 gap-4">
                            {DEMO_USERS.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => setSelectedUser(user)}
                                    className={`relative flex items-center p-4 rounded-xl border-2 transition-all ${
                                        selectedUser.id === user.id
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${
                                        selectedUser.id === user.id 
                                            ? 'bg-indigo-600 text-white dark:bg-indigo-500' 
                                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                        {user.role === 'Admin' ? <ShieldCheck className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                    </div>
                                    <div className="ml-4 text-left">
                                        <p className={`text-sm font-semibold ${
                                            selectedUser.id === user.id ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'
                                        }`}>
                                            {user.name}
                                        </p>
                                        <p className={`text-xs ${
                                            selectedUser.id === user.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'
                                        }`}>
                                            {user.role} {user.department ? `· ${user.department}` : ''}
                                        </p>
                                    </div>
                                    {selectedUser.id === user.id && (
                                        <div className="absolute right-4 text-indigo-600 dark:text-indigo-400">
                                            <div className="h-2 w-2 rounded-full bg-current"></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-colors shadow-lg shadow-indigo-600/20"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <ArrowRight className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition-colors" aria-hidden="true" />
                            </span>
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
