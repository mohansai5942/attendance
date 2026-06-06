import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import MarkAttendance from './pages/MarkAttendance';
import Reports from './pages/Reports';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<StudentList />} />
            <Route path="attendance" element={<MarkAttendance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<div className="p-8 text-slate-500">Settings panel under construction</div>} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}
