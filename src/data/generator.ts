import { Student, Department, Year, Section, AttendanceRecord, AttendanceStatus } from '../types';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const FIRST_NAMES = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Rohan', 'Kabir', 'Aryan', 'Dhruv', 'Ishaan', 'Ananya', 'Diya', 'Aditi', 'Riya', 'Saanvi', 'Kavya', 'Neha', 'Prisha', 'Ishita', 'Sneha', 'John', 'Sarah', 'Michael', 'Emma', 'David', 'Sophia', 'James', 'Olivia', 'Robert', 'Ava'];
const LAST_NAMES = ['Sharma', 'Reddy', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Rao', 'Das', 'Roy', 'Chowdhury', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const DEPARTMENTS: Department[] = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const YEARS: Year[] = ['1st', '2nd', '3rd', '4th'];
const SECTIONS: Section[] = ['A', 'B', 'C'];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateStudents(): Student[] {
  const students: Student[] = [];
  let idCounter = 1;

  DEPARTMENTS.forEach(dept => {
    // Generate exactly 100 students per department
    for (let i = 0; i < 100; i++) {
        const year = YEARS[Math.floor(i / 25)]; // 25 students per year
        const section = SECTIONS[i % 3]; // Spread across sections

        const firstName = getRandomElement(FIRST_NAMES);
        const lastName = getRandomElement(LAST_NAMES);
        const name = `${firstName} ${lastName}`;
        
        const rollNumber = `${dept}${year.substring(0, 1)}${(i+1).toString().padStart(3, '0')}`;
        
        students.push({
            id: `STU${idCounter.toString().padStart(4, '0')}`,
            name,
            department: dept,
            year,
            section,
            rollNumber,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${idCounter}@college.edu`,
            phoneNumber: `+91 9${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
            photoUrl: `https://i.pravatar.cc/150?u=${idCounter}`
        });
        idCounter++;
    }
  });

  return students;
}

export function generateAttendanceRecords(students: Student[]): AttendanceRecord[] {
    const records: AttendanceRecord[] = [];
    let idCounter = 1;
    const endDate = new Date();
    const startDate = subDays(endDate, 30); // Last 30 days of attendance
    const dates = eachDayOfInterval({ start: startDate, end: endDate });

    const FACULTY_ID = 'FAC001';
    const SUBJECT = 'Core Engineering';

    // To prevent massive local storage sizes, let's only generate records for the last 5 days
    // Otherwise 500 students * 30 days = 15,000 records. Let's do 7 days.
    const recentDates = dates.slice(-7);

    recentDates.forEach(dateObj => {
        // Skip Sundays
        if (dateObj.getDay() === 0) return;

        const dateStr = format(dateObj, 'yyyy-MM-dd');
        
        students.forEach(student => {
            // Randomize attendance: ~80% present, 15% absent, 5% late
            const rand = Math.random();
            let status: AttendanceStatus = 'Present';
            if (rand > 0.95) status = 'Late';
            else if (rand > 0.8) status = 'Absent';

            records.push({
                id: `ATT${idCounter.toString().padStart(6, '0')}`,
                date: dateStr,
                studentId: student.id,
                status,
                subject: SUBJECT,
                facultyId: FACULTY_ID
            });
            idCounter++;
        });
    });

    return records;
}
