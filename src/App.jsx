import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './pages/MainLayout';
import AddCarPlate from './pages/AddCarPlate';
import LandingPage from './pages/LandingPage';
import ManualFilter from './pages/ManualFilter';
import AppLayout from './pages/AppLayout';
import NewSearchPage from './pages/NewSearchPage';
import ConfigPage from './pages/ConfigPage';
import SearchHistory from './components/SearchHistory';
import './App.css';

import { WarningProvider } from './context/WarningContext';
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
    <WarningProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<MainLayout />} />
          <Route path="/addcarplate" element={<AddCarPlate />} />
          <Route path="/manualfilter" element={<ManualFilter />} />
          <Route element={<AppLayout />}>
            <Route path="/new-search" element={<NewSearchPage />} />
            <Route path="/historial" element={<HistorialPage />} />
            <Route path="/configurar" element={<ConfigPage />} />
          </Route>
        </Routes>
      </Router>
      <WarningModal />
    </WarningProvider>
  );
}

export default App;
