import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Department, AttendanceStatus } from '../types';
import { format } from 'date-fns';
import { Download, FileText, Search, Printer } from 'lucide-react';

const DEPARTMENTS: Department[] = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];

export default function Reports() {
    const { students, attendanceRecords } = useApp();
    const [dateFilter, setDateFilter] = useState('');
    const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All');
    const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const formattedRecords = useMemo(() => {
        let filtered = attendanceRecords.map(record => {
            const student = students.find(s => s.id === record.studentId);
            return {
                ...record,
                studentName: student?.name || 'Unknown',
                rollNumber: student?.rollNumber || 'Unknown',
                department: student?.department || 'Unknown',
                year: student?.year || 'Unknown',
                section: student?.section || 'Unknown'
            };
        });

        // Apply filters
        if (dateFilter) {
            filtered = filtered.filter(r => r.date === dateFilter);
        }
        if (deptFilter !== 'All') {
            filtered = filtered.filter(r => r.department === deptFilter);
        }
        if (statusFilter !== 'All') {
            filtered = filtered.filter(r => r.status === statusFilter);
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(r => 
                r.studentName.toLowerCase().includes(term) || 
                r.rollNumber.toLowerCase().includes(term)
            );
        }

        // Sort by date desc
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [attendanceRecords, students, dateFilter, deptFilter, statusFilter, searchTerm]);

    const handlePrint = () => {
        window.print();
    };

    const getDeptColor = (dept: string) => {
        const map: Record<string, string> = {
            'CSE': 'blue',
            'ECE': 'purple',
            'EEE': 'cyan',
            'MECH': 'amber',
            'CIVIL': 'slate'
        };
        return map[dept] || 'slate';
    };

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">System Reports</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        View, filter, and export attendance history
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={handlePrint}
                        className="inline-flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-widest rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-sm transition-colors"
                    >
                        <Printer className="h-4 w-4 mr-2 text-slate-500" />
                        Print
                    </button>
                    <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold uppercase tracking-widest rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all active:scale-95">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 print:hidden shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 pl-10 px-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                            placeholder="Search Name or Roll No"
                        />
                    </div>
                    <div>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                        />
                    </div>
                    <div>
                        <select
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value as any)}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                        >
                            <option value="All">All Departments</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Present">Present</option>
                            <option value="Late">Late</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col flex-1">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20 print:hidden shrink-0">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                        <FileText className="h-3 w-3 mr-2" />
                        Showing {formattedRecords.length} records
                    </div>
                    {(dateFilter || deptFilter !== 'All' || statusFilter !== 'All' || searchTerm) && (
                        <button 
                            onClick={() => {
                                setDateFilter(''); setDeptFilter('All'); setStatusFilter('All'); setSearchTerm('');
                            }}
                            className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-600"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
                
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 sticky top-0 backdrop-blur-md">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">ID Number</th>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Department & Class</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {formattedRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No attendance records found matching filters.
                                    </td>
                                </tr>
                            ) : formattedRecords.slice(0, 100).map((record) => {
                                const c = getDeptColor(record.department);
                                return (
                                <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs">
                                        {format(new Date(record.date), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{record.rollNumber}</td>
                                    <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{record.studentName}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 bg-${c}-50 text-${c}-600 dark:bg-${c}-500/10 dark:text-${c}-400 rounded text-[10px] font-bold uppercase tracking-tight`}>
                                                {record.department}
                                            </span>
                                            <span className="text-xs text-slate-500">{record.year}-{record.section}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                       <div className={`inline-flex items-center gap-1.5 font-semibold text-xs justify-center ${
                                            record.status === 'Present' ? 'text-emerald-600 dark:text-emerald-400' :
                                            record.status === 'Late' ? 'text-orange-600 dark:text-orange-400' :
                                            'text-rose-600 dark:text-rose-400'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                record.status === 'Present' ? 'bg-emerald-500' :
                                                record.status === 'Late' ? 'bg-orange-500' :
                                                'bg-rose-500'
                                            }`}></span> 
                                            {record.status}
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                {formattedRecords.length > 100 && (
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0 print:hidden">
                        Showing first 100 recent records. Please export to view all.
                    </div>
                )}
            </div>
        </div>
    );
}
