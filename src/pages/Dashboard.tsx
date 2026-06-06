import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

export default function Dashboard() {
    const { students, attendanceRecords } = useApp();

    const stats = useMemo(() => {
        const today = new Date();
        const todayStr = format(today, 'yyyy-MM-dd');
        
        const datesWithRecords = Array.from(new Set(attendanceRecords.map(r => r.date))).sort();
        const latestRecordDateStr = datesWithRecords.length > 0 ? datesWithRecords[datesWithRecords.length - 1] : todayStr;
        
        const latestRecords = attendanceRecords.filter(r => r.date === latestRecordDateStr);
        
        const presentCount = latestRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
        const absentCount = latestRecords.filter(r => r.status === 'Absent').length;
        const totalMarked = latestRecords.length;
        const percentage = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

        return {
            totalStudents: students.length,
            presentCount,
            absentCount,
            percentage,
            latestDate: latestRecordDateStr
        };
    }, [students, attendanceRecords]);

    const departmentStats = useMemo(() => {
        const latestRecordDateStr = Array.from(new Set(attendanceRecords.map(r => r.date))).sort().reverse()[0] || format(new Date(), 'yyyy-MM-dd');
        const latestRecords = attendanceRecords.filter(r => r.date === latestRecordDateStr);

        const deptMap = new Map();
        
        students.forEach(s => {
            if (!deptMap.has(s.department)) {
                deptMap.set(s.department, { name: s.department, present: 0, absent: 0, total: 0 });
            }
        });

        latestRecords.forEach(record => {
            const student = students.find(s => s.id === record.studentId);
            if (student) {
                const stat = deptMap.get(student.department);
                stat.total++;
                if (record.status === 'Present' || record.status === 'Late') stat.present++;
                else stat.absent++;
                deptMap.set(student.department, stat);
            }
        });

        return Array.from(deptMap.values()).map(d => ({
            ...d,
            attendance: d.total > 0 ? Math.round((d.present / d.total) * 100) : 0
        }));
    }, [students, attendanceRecords]);

    const recentRecords = useMemo(() => {
        let sorted = [...attendanceRecords].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return sorted.slice(0, 5).map(r => {
            const student = students.find(s => s.id === r.studentId);
            return {
                ...r,
                studentName: student?.name || 'Unknown',
                rollNumber: student?.rollNumber || 'Unknown',
                department: student?.department || 'Unknown'
            };
        });
    }, [attendanceRecords, students]);

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
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Total Students', value: stats.totalStudents, color: 'text-slate-400', stat: 'Across 5 Depts', borderColor: 'border-slate-200 dark:border-slate-800' },
                    { title: 'Present Today', value: stats.presentCount, color: 'text-blue-500', stat: '+3.2% ↑', statColor: 'text-emerald-500 dark:text-emerald-400 font-bold', borderColor: 'border-slate-200 dark:border-slate-800' },
                    { title: 'Absent Students', value: stats.absentCount, color: 'text-orange-500', stat: 'ID Verified', statColor: 'text-slate-400 font-medium font-mono', borderColor: 'border-slate-200 dark:border-slate-800' },
                    { title: 'Avg Attendance', value: `${stats.percentage}%`, color: 'text-slate-400', stat: 'Semester Avg', statColor: 'text-slate-400', borderColor: 'border-b-4 border-slate-200 dark:border-slate-800 border-b-blue-500 dark:border-b-blue-500' },
                ].map((item, i) => (
                    <div key={i} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm ${item.borderColor}`}>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${item.color}`}>{item.title}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-black text-slate-800 dark:text-white">{item.value}</span>
                            <span className={`text-[10px] ${item.statColor || 'text-slate-400'}`}>{item.stat}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[460px]">
                {/* Recent Table */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 dark:text-white">Recent Attendance Records</h3>
                        <div className="flex gap-2">
                            <select className="text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none text-slate-700 dark:text-slate-300">
                                <option>All Years</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">ID Number</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {recentRecords.map((record) => {
                                    const c = getDeptColor(record.department);
                                    return (
                                    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{record.studentName}</td>
                                        <td className="px-6 py-3 font-mono text-xs text-slate-500">{record.rollNumber}</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-1 bg-${c}-50 text-${c}-600 dark:bg-${c}-500/10 dark:text-${c}-400 rounded text-[10px] font-bold uppercase tracking-tight`}>
                                                {record.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className={`flex items-center gap-1.5 font-semibold text-xs ${
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
                                        <td className="px-6 py-3">
                                            <button className="text-blue-500 font-bold text-xs hover:text-blue-600">Edit</button>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Side Panels */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-6">Department Distribution</h3>
                        <div className="space-y-5">
                            {departmentStats.map((dept) => {
                                const c = getDeptColor(dept.name);
                                return (
                                <div key={dept.name} className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-slate-600 dark:text-slate-400">{dept.name}</span>
                                        <span className="text-slate-900 dark:text-white">{dept.attendance}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full bg-${c}-500`} style={{ width: `${dept.attendance}%` }}></div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                    <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-3xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-xs font-bold opacity-60 uppercase mb-2">Weekly Report Status</h4>
                            <p className="text-sm font-medium">Detailed analytics for Semester 1 (2023) is now ready for export.</p>
                            <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition-all">Download PDF Report</button>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
