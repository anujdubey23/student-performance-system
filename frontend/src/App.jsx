import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { StudentFormModal } from './components/StudentFormModal';
import { Dashboard } from './pages/Dashboard';
import { Performance } from './pages/Performance';
import { Subjects } from './pages/Subjects';
import { AIStudyPlan } from './pages/AIStudyPlan';
import { Reports } from './pages/Reports';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { DataEntry } from './pages/DataEntry';
import { Login } from './pages/Login';
import { apiService } from './services/api';
import { 
  DEFAULT_STUDENT_DATA, 
  DEFAULT_PREDICTION, 
  DEFAULT_SUBJECT_ANALYSIS 
} from './data/defaultData';

function Layout({ children, student, prediction, subjectAnalysis, healthStatus, onOpenForm }) {
  const location = useLocation();

  // Determine navbar title & subtitle based on active path
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: 'Student Academic Dashboard',
          subtitle: 'Real-time performance metrics and predictive indicators'
        };
      case '/data-entry':
        return {
          title: 'Student Academic Data Entry',
          subtitle: 'Input student details, coursework marks, and continuous assessment metrics'
        };
      case '/performance':
        return {
          title: 'Performance Analysis & ML Explainability',
          subtitle: 'Random Forest model confidence, risk factors, and evaluation metrics'
        };
      case '/simulator':
        return {
          title: '"What-If" Habit Simulator',
          subtitle: 'Real-time counterfactual analysis and prescriptive performance roadmap'
        };
      case '/subjects':
        return {
          title: 'Subject-Wise Coursework',
          subtitle: 'Continuous internal assessment marks and attendance analysis'
        };
      case '/study-plan':
        return {
          title: 'AI Personalized Study Plan',
          subtitle: '7-day adaptive curriculum and personalized advisor feedback'
        };
      case '/reports':
        return {
          title: 'Academic Performance Report',
          subtitle: 'Formal printable evaluation transcript and ML advisory record'
        };
      default:
        return {
          title: 'Student Portal',
          subtitle: 'AI-Driven Learning System'
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          student={student}
          healthStatus={healthStatus}
          onOpenForm={onOpenForm}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function App() {
  const [student, setStudent] = useState(DEFAULT_STUDENT_DATA);
  const [prediction, setPrediction] = useState(DEFAULT_PREDICTION);
  const [subjectAnalysis, setSubjectAnalysis] = useState(DEFAULT_SUBJECT_ANALYSIS);
  const [healthStatus, setHealthStatus] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize data on startup
  useEffect(() => {
    async function initSystem() {
      try {
        const health = await apiService.checkHealth();
        setHealthStatus(health);

        // Fetch default student and compute initial prediction
        const initialStudent = await apiService.getDefaultStudent();
        setStudent(initialStudent);

        const predRes = await apiService.predictPerformance(initialStudent);
        if (predRes?.prediction) {
          setPrediction(predRes.prediction);
        }
        if (predRes?.subject_analysis) {
          setSubjectAnalysis(predRes.subject_analysis);
        }
      } catch (err) {
        console.warn('Initialization using fallback baseline:', err);
      }
    }
    initSystem();
  }, []);

  // Handle student updates and re-trigger ML inference
  const handleStudentUpdate = async (updatedStudent) => {
    setLoading(true);
    setStudent(updatedStudent);
    try {
      const predRes = await apiService.predictPerformance(updatedStudent);
      if (predRes?.prediction) {
        setPrediction(predRes.prediction);
      }
      if (predRes?.subject_analysis) {
        setSubjectAnalysis(predRes.subject_analysis);
      }
    } catch (err) {
      console.error('Failed to re-calculate prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle dynamic login so the logged-in student's identity is active everywhere
  const handleLoginSuccess = (userData) => {
    if (userData?.student_name) {
      const updated = {
        ...student,
        student_name: userData.student_name,
        student_id: userData.student_id || student.student_id,
        email: userData.email || student.email
      };
      setStudent(updated);
      apiService.predictPerformance(updated).then(res => {
        if (res?.prediction) setPrediction(res.prediction);
        if (res?.subject_analysis) setSubjectAnalysis(res.subject_analysis);
      });
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/*"
          element={
            <Layout
              student={student}
              prediction={prediction}
              subjectAnalysis={subjectAnalysis}
              healthStatus={healthStatus}
              onOpenForm={() => setIsFormOpen(true)}
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <Dashboard
                      student={student}
                      prediction={prediction}
                      subjectAnalysis={subjectAnalysis}
                      onOpenForm={() => setIsFormOpen(true)}
                    />
                  }
                />
                <Route
                  path="/data-entry"
                  element={
                    <DataEntry
                      student={student}
                      onUpdateStudent={handleStudentUpdate}
                    />
                  }
                />
                <Route
                  path="/performance"
                  element={
                    <Performance
                      student={student}
                      prediction={prediction}
                      subjectAnalysis={subjectAnalysis}
                    />
                  }
                />
                <Route
                  path="/simulator"
                  element={
                    <WhatIfSimulator
                      student={student}
                      currentPrediction={prediction}
                      onApplySimulation={handleStudentUpdate}
                    />
                  }
                />
                <Route
                  path="/subjects"
                  element={
                    <Subjects
                      student={student}
                      subjectAnalysis={subjectAnalysis}
                      onOpenForm={() => setIsFormOpen(true)}
                    />
                  }
                />
                <Route
                  path="/study-plan"
                  element={
                    <AIStudyPlan
                      student={student}
                      prediction={prediction}
                      subjectAnalysis={subjectAnalysis}
                      healthStatus={healthStatus}
                    />
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <Reports
                      student={student}
                      prediction={prediction}
                      subjectAnalysis={subjectAnalysis}
                    />
                  }
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>

      {/* Interactive Student Update Modal */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        currentData={student}
        onSubmit={handleStudentUpdate}
      />
    </BrowserRouter>
  );
}

export default App;
