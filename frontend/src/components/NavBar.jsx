import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Navbar() {
  const { usuario, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Movimientos</Link> |{' '}
      <Link to="/agregar">Agregar Movimiento</Link> |{' '}
      <Link to="/dashboard">Dashboard</Link> |{' '}
      {!usuario && <Link to="/login">Login</Link>} |{' '}
      {!usuario && <Link to="/register">Registrarse</Link>}
      {usuario && (
        <>
          <span style={{ marginLeft: '1rem' }}>Hola {usuario.email}</span>
          <button onClick={logout} style={{ marginLeft: '1rem' }}>
            Cerrar sesión
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
