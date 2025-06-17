import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import StudentTable from './components/StudentTable';
import StudentProfile from './components/StudentProfile';
import Navbar from './components/Navbar';
import './styles/main.css';
import './styles/lightTheme.css';
import './styles/darkTheme.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" exact element={<StudentTable />} />
              <Route path="/student/:id" element={<StudentProfile />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;