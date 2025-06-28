import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './styles/NavBar.css'; // Asegurate de crear este archivo para los estilos

function Navbar() {
  const { usuario, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <p className="navbar-title">Gestor de gastos</p>
        <Link to="/" className="nav-link">Movimientos</Link>
        
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
      </div>

      <div className="navbar-right">
        {!usuario && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Registrarse</Link>
          </>
        )}

        {usuario && (
          <>
            <span className="usuario-email">Hola {usuario.email}</span>
            <button onClick={logout} className="logout-btn">Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
