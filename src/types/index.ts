export type Department = 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL';
export type Year = '1st' | '2nd' | '3rd' | '4th';
export type Section = 'A' | 'B' | 'C';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late';
export type Role = 'Admin' | 'Faculty';

export interface User {
  id: string;
  name: string;
  role: Role;
  department?: Department; // Admin might not have a specific department
  email: string;
}

export interface Student {
  id: string;
  name: string;
  department: Department;
  year: Year;
  section: Section;
  rollNumber: string;
  email: string;
  phoneNumber: string;
  photoUrl: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // ISO Date string (YYYY-MM-DD)
  studentId: string;
  status: AttendanceStatus;
  subject: string;
  facultyId: string;
}

export interface Subject {
  id: string;
  name: string;
  department: Department;
  year: Year;
}
