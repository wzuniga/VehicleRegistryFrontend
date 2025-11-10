import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AddCarPlate from './pages/AddCarPlate';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/addcarplate" element={<AddCarPlate />} />
        <Route path="/" element={<Navigate to="/addcarplate" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
