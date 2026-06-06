import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, AttendanceRecord, User, Department, Year, Section } from '../types';
import { generateStudents, generateAttendanceRecords } from '../data/generator';

interface AppState {
  user: User | null;
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  isDarkMode: boolean;
}

interface AppContextType extends AppState {
  login: (user: User) => void;
  logout: () => void;
  toggleDarkMode: () => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  markAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'college_attendance_state';

const defaultUser: User = {
    id: 'FAC001',
    name: 'Dr. Jane Smith',
    role: 'Faculty',
    department: 'CSE',
    email: 'jane.smith@college.edu'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return {
            ...parsed,
            // Ensure no lingering dark mode class misalignment
            isDarkMode: parsed.isDarkMode ?? false
        };
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    
    // Initial data generation
    const newStudents = generateStudents();
    const newAttendance = generateAttendanceRecords(newStudents);
    
    return {
      user: defaultUser, // Default login for demonstration
      students: newStudents,
      attendanceRecords: newAttendance,
      isDarkMode: false
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const toggleDarkMode = () => setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  const login = (user: User) => setState(prev => ({ ...prev, user }));
  const logout = () => setState(prev => ({ ...prev, user: null }));

  const addStudent = (student: Omit<Student, 'id'>) => {
    setState(prev => {
        const newId = `STU${(prev.students.length + 1).toString().padStart(4, '0')}`;
        return {
            ...prev,
            students: [...prev.students, { ...student, id: newId }]
        };
    });
  };

  const updateStudent = (student: Student) => {
    setState(prev => ({
        ...prev,
        students: prev.students.map(s => s.id === student.id ? student : s)
    }));
  };

  const deleteStudent = (id: string) => {
    setState(prev => ({
        ...prev,
        students: prev.students.filter(s => s.id !== id),
        attendanceRecords: prev.attendanceRecords.filter(a => a.studentId !== id)
    }));
  };

  const markAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
      setState(prev => {
          let idCounter = prev.attendanceRecords.length + 1;
          const newRecords = records.map(r => ({ ...r, id: `ATT${idCounter++}` }));
          
          // Remove existing records for the same student, date, and subject
          const recordsMap = new Map<string, AttendanceRecord>();
          prev.attendanceRecords.forEach(r => {
             recordsMap.set(`${r.studentId}-${r.date}-${r.subject}`, r); 
          });

          newRecords.forEach(r => {
              recordsMap.set(`${r.studentId}-${r.date}-${r.subject}`, r as AttendanceRecord);
          });

          return {
              ...prev,
              attendanceRecords: Array.from(recordsMap.values())
          };
      });
  };

  return (
    <AppContext.Provider value={{
      ...state,
      login, logout, toggleDarkMode,
      addStudent, updateStudent, deleteStudent,
      markAttendance
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
