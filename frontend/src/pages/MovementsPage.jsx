import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/MovementsPage.css'; // Asegúrate de que este archivo exista y tenga estilos adecuados
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';


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
    <div className="container">
      <h2 className="title">Movimientos</h2>
      <button className="filter-btn">Filtrar</button>
      <div className='movimientos-wrapper'>
        <div className="movimientos-box">
          {error && <p className="error">{error}</p>}
          {movimientos.map(mov => (
            <div key={mov.id} className="movimiento-card">
              <div className="movimiento-info">
                <div className="categoria">{mov.categoria}</div>
                <div className="tipo">tipo: {mov.tipo}</div>
                <div className="descripcion">{mov.descripcion}</div>
              </div>
              <div className="movimiento-derecha">
                <button className="delete-btn" onClick={() => eliminarMovimiento(mov.id)}>X</button>
                <div className="monto">${parseFloat(mov.monto).toFixed(2)}</div>
                <div className="fecha">{new Date(mov.fecha).toLocaleDateString('es-AR')}</div>
                <div className="acciones">
                  <Link to={`/movimientos/editar/${mov.id}`} className="edit-btn">Editar</Link>

                </div>
              </div>
            </div>

          ))}
        </div>
       </div>
      

        <div className="agregar-wrapper">
          <Link to="/agregar" className="agregar-btn">Agregar Nuevo Movimiento</Link>
        </div>
      </div>
      )
}

      export default MovementsPage;
