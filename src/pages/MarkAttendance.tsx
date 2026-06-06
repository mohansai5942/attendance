import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Department, Year, Section, AttendanceStatus, AttendanceRecord } from '../types';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, Save } from 'lucide-react';

const DEPARTMENTS: Department[] = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const YEARS: Year[] = ['1st', '2nd', '3rd', '4th'];
const SECTIONS: Section[] = ['A', 'B', 'C'];

export default function MarkAttendance() {
    const { students, user, markAttendance } = useApp();
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [dept, setDept] = useState<Department>('CSE');
    const [year, setYear] = useState<Year>('1st');
    const [section, setSection] = useState<Section>('A');
    const [subject, setSubject] = useState<string>('Core Subject 101');
    const [isSaving, setIsSaving] = useState(false);

    // Filter students by selected class
    const classStudents = useMemo(() => {
        return students.filter(s => s.department === dept && s.year === year && s.section === section);
    }, [students, dept, year, section]);

    // Local state for attendance marking
    const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});

    // Initialize all as present when class changes
    React.useEffect(() => {
        const initialMap: Record<string, AttendanceStatus> = {};
        classStudents.forEach(s => {
            initialMap[s.id] = 'Present';
        });
        setAttendanceMap(initialMap);
    }, [classStudents]);

    const handleMarkAll = (status: AttendanceStatus) => {
        const newMap: Record<string, AttendanceStatus> = {};
        classStudents.forEach(s => {
            newMap[s.id] = status;
        });
        setAttendanceMap(newMap);
    };

    const handleSave = () => {
        setIsSaving(true);
        const records: Omit<AttendanceRecord, 'id'>[] = classStudents.map(student => ({
            date: selectedDate,
            studentId: student.id,
            status: attendanceMap[student.id] || 'Present',
            subject,
            facultyId: user?.id || 'Unknown'
        }));

        setTimeout(() => {
            markAttendance(records);
            setIsSaving(false);
            // Could add a toast notification here
        }, 600);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Mark Attendance</h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                        Record daily attendance for classes
                    </p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-900/50 uppercase tracking-widest">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(new Date(selectedDate), 'MMM do yyyy')}</span>
                </div>
            </div>

            {/* Selection Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Department</label>
                        <select value={dept} onChange={(e) => setDept(e.target.value as Department)} className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Year</label>
                        <select value={year} onChange={(e) => setYear(e.target.value as Year)} className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Section</label>
                        <select value={section} onChange={(e) => setSection(e.target.value as Section)} className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                            {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 px-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                            placeholder="e.g. Data Structures"
                        />
                    </div>
                </div>
            </div>

            {/* Marking Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex space-x-2">
                        <button onClick={() => handleMarkAll('Present')} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 transition-colors">
                            Mark All Present
                        </button>
                        <button onClick={() => handleMarkAll('Absent')} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 transition-colors">
                            Mark All Absent
                        </button>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {classStudents.length} Students Selected
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4">ID Number</th>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4 border-l border-slate-100 dark:border-slate-800">Status Selection</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {classStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No students found in this class.
                                    </td>
                                </tr>
                            ) : classStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{student.rollNumber}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center">
                                            <span className="font-medium text-slate-900 dark:text-white">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 border-l border-slate-50 dark:border-slate-800/50">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setAttendanceMap(prev => ({ ...prev, [student.id]: 'Present' }))}
                                                className={`flex items-center justify-center px-3 py-1 rounded text-xs font-bold uppercase tracking-tight transition-all ${
                                                    attendanceMap[student.id] === 'Present'
                                                        ? 'bg-emerald-500 text-white shadow-sm'
                                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-500'
                                                }`}
                                            >
                                                Present
                                            </button>
                                            <button
                                                onClick={() => setAttendanceMap(prev => ({ ...prev, [student.id]: 'Late' }))}
                                                className={`flex items-center justify-center px-3 py-1 rounded text-xs font-bold uppercase tracking-tight transition-all ${
                                                    attendanceMap[student.id] === 'Late'
                                                        ? 'bg-orange-500 text-white shadow-sm'
                                                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/10 dark:text-orange-500'
                                                }`}
                                            >
                                                Late
                                            </button>
                                            <button
                                                onClick={() => setAttendanceMap(prev => ({ ...prev, [student.id]: 'Absent' }))}
                                                className={`flex items-center justify-center px-3 py-1 rounded text-xs font-bold uppercase tracking-tight transition-all ${
                                                    attendanceMap[student.id] === 'Absent'
                                                        ? 'bg-rose-500 text-white shadow-sm'
                                                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/10 dark:text-rose-500'
                                                }`}
                                            >
                                                Absent
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Save Button floating or fixed bottom */}
            {classStudents.length > 0 && (
                <div className="flex justify-end pt-2 pb-8">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70"
                    >
                        {isSaving ? 'Saving...' : '+ Save Attendance'}
                    </button>
                </div>
            )}
        </div>
    );
}
