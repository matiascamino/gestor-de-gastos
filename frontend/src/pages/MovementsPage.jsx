import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function MovementsPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado. Por favor inicia sesión.');
      setMovimientos([]);
      return;
    }

    fetch(`${API_URL}/api/movements`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar movimientos');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setMovimientos(data);
          setError(null);
        } else {
          setMovimientos([]);
          setError('Respuesta inválida del servidor');
        }
      })
      .catch(() => {
        setMovimientos([]);
        setError('Error al cargar movimientos');
      });
  };

  const eliminarMovimiento = async (id) => {
    if (!window.confirm('¿Querés eliminar este movimiento?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado. Por favor inicia sesión.');
        return;
      }

      const res = await fetch(`${API_URL}/api/movements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setMovimientos(movimientos.filter(mov => mov.id !== id));
        alert('Movimiento eliminado');
      } else {
        alert(data.error || 'Error al eliminar el movimiento');
      }
    } catch (error) {
      alert('Error al eliminar el movimiento');
    }
  };

  return (
    <div>
      <h2>Movimientos Registrados</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {movimientos.map(mov => (
          <li key={mov.id}>
            {new Date(mov.fecha).toLocaleDateString('es-AR')} - {mov.descripcion} - {mov.tipo} - {mov.categoria} - ${mov.monto}
            {' '}
            <Link to={`/movimientos/editar/${mov.id}`} style={{ marginLeft: '10px' }}>Editar</Link>
            {' '}
            <button onClick={() => eliminarMovimiento(mov.id)} style={{ marginLeft: '10px' }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovementsPage;
