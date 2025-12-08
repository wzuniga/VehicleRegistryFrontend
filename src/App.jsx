import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './pages/MainLayout';
import AddCarPlate from './pages/AddCarPlate';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/addcarplate" element={<AddCarPlate />} />
      </Routes>
    </Router>
  );
}

export default App;
