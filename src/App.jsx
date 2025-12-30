import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './pages/MainLayout';
import AddCarPlate from './pages/AddCarPlate';
import './App.css';

import { WarningProvider } from './context/WarningContext';
import WarningModal from './components/WarningModal';

function App() {
  return (
    <WarningProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/addcarplate" element={<AddCarPlate />} />
        </Routes>
      </Router>
      <WarningModal />
    </WarningProvider>
  );
}

export default App;
