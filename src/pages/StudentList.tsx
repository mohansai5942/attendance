import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Student, Department, Year, Section } from '../types';
import { Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';

const DEPARTMENTS: Department[] = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const YEARS: Year[] = ['1st', '2nd', '3rd', '4th'];

export default function StudentList() {
    const { students, deleteStudent } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All');
    const [yearFilter, setYearFilter] = useState<Year | 'All'>('All');

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = deptFilter === 'All' || student.department === deptFilter;
            const matchesYear = yearFilter === 'All' || student.year === yearFilter;
            
            return matchesSearch && matchesDept && matchesYear;
        });
    }, [students, searchTerm, deptFilter, yearFilter]);

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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Student Database</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage {students.length} enrolled students across departments
                    </p>
                </div>
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold rounded-lg text-white bg-slate-900 hover:shadow-lg dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all active:scale-95">
                    <Plus className="h-4 w-4 mr-2" />
                    New Student
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 pl-10 pr-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                            placeholder="Search by name or ID..."
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <select
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value as any)}
                            className="block w-40 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 pl-3 pr-10 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                        >
                            <option value="All">All Departments</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value as any)}
                            className="block w-32 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 pl-3 pr-10 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-colors"
                        >
                            <option value="All">All Years</option>
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">ID Number</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Year & Sec</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No students found matching the criteria.
                                    </td>
                                </tr>
                            ) : filteredStudents.slice(0, 50).map((student) => {
                                const c = getDeptColor(student.department);
                                return (
                                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{student.rollNumber}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 bg-${c}-50 text-${c}-600 dark:bg-${c}-500/10 dark:text-${c}-400 rounded text-[10px] font-bold uppercase tracking-tight`}>
                                            {student.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-slate-500">{student.year} - {student.section}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button className="text-blue-500 font-bold text-[10px] uppercase tracking-widest hover:text-blue-600 mr-3">Edit</button>
                                        <button 
                                            onClick={() => deleteStudent(student.id)}
                                            className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-rose-500 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                {filteredStudents.length > 50 && (
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500">
                        Showing first 50 results of {filteredStudents.length}
                    </div>
                )}
            </div>
        </div>
    );
}
