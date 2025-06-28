import MovementForm from '../components/MovementForm';
import { useState, useEffect } from 'react';
import './styles/AgregarMovimientoPage.css';
import { Link } from 'react-router-dom';

function AgregarMovimientoPage() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            alert('Token inválido o expirado. Por favor inicia sesión nuevamente.');
            localStorage.removeItem('token');
          }
          throw new Error('Error al cargar categorías');
        }
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Respuesta inválida');
        }
        setCategorias(data.map(cat => cat.nombre));
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const agregarCategoria = async (nombreCategoria) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    const nuevaCategoria = { nombre: nombreCategoria };
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(nuevaCategoria),
    });

    if (!res.ok) {
      alert('Error al crear categoría');
      return;
    }

    const data = await res.json();
    setCategorias(prev => [...prev, data.nombre]);
  };

  const agregarMovimiento = async (movimiento) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(movimiento),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al agregar movimiento');
    }

    alert('Movimiento agregado correctamente');
    return data;
  };

  return (
    <>
      <div className="volver-wrapper">
        <Link to="/" className="volver-btn">← Volver a Movimientos</Link>
      </div>
      <div className="container">
        <div className="form-wrapper">
          <h2 className="title">Agregar Movimiento</h2>
          <MovementForm
            agregarMovimiento={agregarMovimiento}
            categorias={categorias}
            agregarCategoria={agregarCategoria}
          />
        </div>
      </div>
    </>
  );

}

export default AgregarMovimientoPage;
