import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './pages/MainLayout';
import AddCarPlate from './pages/AddCarPlate';
import LandingPage from './pages/LandingPage';
import ManualFilter from './pages/ManualFilter';
import './App.css';

import { WarningProvider } from './context/WarningContext';
import WarningModal from './components/WarningModal';

function App() {
  return (
    <WarningProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<MainLayout />} />
          <Route path="/addcarplate" element={<AddCarPlate />} />
          <Route path="/manualfilter" element={<ManualFilter />} />
        </Routes>
      </Router>
      <WarningModal />
    </WarningProvider>
  );
}

export default App;
