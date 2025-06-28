import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgregarMovimientoPage from './pages/AgregarMovimientoPage';
import MovementsPage from './pages/MovementsPage';
import EditarMovimientoPage from './pages/EditarMovimientoPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute'; 
import './app.css'; 

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<PrivateRoute><MovementsPage /></PrivateRoute>} />
        <Route path="/agregar" element={<PrivateRoute><AgregarMovimientoPage /></PrivateRoute>} />
        <Route path="/movimientos/editar/:id" element={<PrivateRoute><EditarMovimientoPage /></PrivateRoute>} />
        <Route path="/movimientos" element={<PrivateRoute><MovementsPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
