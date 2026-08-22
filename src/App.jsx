import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './pages/MainLayout';
import AddCarPlate from './pages/AddCarPlate';
import LandingPage from './pages/LandingPage';
import ManualFilter from './pages/ManualFilter';
import AppLayout from './pages/AppLayout';
import NewSearchPage from './pages/NewSearchPage';
import ConfigPage from './pages/ConfigPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import AdminPage from './pages/AdminPage';
import SearchHistory from './components/SearchHistory';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

import { WarningProvider } from './context/WarningContext';
import { AuthProvider } from './context/AuthContext';
import WarningModal from './components/WarningModal';

const HistorialPage = () => {
  const navigate = useNavigate();
  return (
    <SearchHistory
      onSelectPlate={(plate) => navigate(`/new-search?plate=${plate}`)}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <WarningProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Protected routes nested in AppLayout */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/new-search" element={<NewSearchPage />} />
              <Route path="/historial" element={<HistorialPage />} />
              <Route path="/configurar" element={<ConfigPage />} />
            </Route>

            {/* Other protected routes */}
            <Route path="/search" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
            <Route path="/addcarplate" element={<ProtectedRoute><AddCarPlate /></ProtectedRoute>} />
            <Route path="/manualfilter" element={<ProtectedRoute><ManualFilter /></ProtectedRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />
          </Routes>
        </Router>
        <WarningModal />
      </WarningProvider>
    </AuthProvider>
  );
}

export default App;
