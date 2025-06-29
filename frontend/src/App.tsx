import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Dashboard } from './pages/Dashboard';
import { CommunicationCoach } from './pages/CommunicationCoach';
import { TherapyChat } from './pages/TherapyChat';
import { SessionHistory } from './pages/SessionHistory';
// import { PostCommunication } from './pages/admin/PostCommunication';
// import { PostTherapy } from './pages/admin/PostTherapy';
// import { PostBadge } from './pages/admin/PostBadge';
import Achievements from './pages/Achievements';
import VoiceAssistant from './pages/VoiceAssistant';
import SessionReport from './pages/SessionReport';
import ArticlesList from './pages/ArticlesList';
import ArticleDetail from './pages/ArticleDetail';
import GrowthStories from './pages/GrowthStories';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Layout wrapper that shows/hides navbar/sidebar based on login
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize(); // Set initial sidebar state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex pt-16">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className={`flex-1 transition-all duration-300 overflow-auto ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

// Split inner routes for access to auth context
const InnerApp = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <Routes>
        {/* Redirect / to /dashboard if logged in */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
        />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/conversation" element={<ProtectedRoute><CommunicationCoach /></ProtectedRoute>} />
        <Route path="/therapy" element={<ProtectedRoute><TherapyChat /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><SessionHistory /></ProtectedRoute>} />
        <Route path="/articles" element={<ProtectedRoute><ArticlesList /></ProtectedRoute>} />
        <Route path="/articles/:id" element={<ProtectedRoute><ArticleDetail /></ProtectedRoute>} />
        <Route path="/growth-stories" element={<ProtectedRoute><GrowthStories /></ProtectedRoute>} />
        <Route path="/voice-assistant/:type/:id" element={<ProtectedRoute><VoiceAssistant /></ProtectedRoute>} />
        <Route path="/session-report/:sessionId" element={<ProtectedRoute><SessionReport /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
        {/* <Route path="/post/communication" element={<ProtectedRoute><PostCommunication /></ProtectedRoute>} />
        <Route path="/post/therapy" element={<ProtectedRoute><PostTherapy /></ProtectedRoute>} />
        <Route path="/post/badge" element={<ProtectedRoute><PostBadge /></ProtectedRoute>} /> */}
      </Routes>
    </AppLayout>
  );
};

// Main App wrapper
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <InnerApp />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
