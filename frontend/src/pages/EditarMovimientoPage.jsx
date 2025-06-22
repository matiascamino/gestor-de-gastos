import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovementForm from '../components/MovementForm';

function EditarMovimientoPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movimiento, setMovimiento] = useState(null);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL;

        // Traer categorías con autorización (si es necesario)
        fetch(`${baseUrl}/api/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al obtener categorías');
                return res.json();
            })
            .then(data => setCategorias(data.map(cat => cat.nombre)))
            .catch(err => {
                console.error(err);
                alert('Error al cargar categorías');
            });

        // Traer movimiento por id con autorización
        fetch(`${baseUrl}/api/movements/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al obtener movimiento');
                return res.json();
            })
            .then(data => setMovimiento(data))
            .catch(() => alert('Error al cargar movimiento'));
    }, [id]);

    const editarMovimiento = async (movimientoEditado) => {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL;

        const res = await fetch(`${baseUrl}/api/movements/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(movimientoEditado)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error al editar movimiento');
        }

        alert('Movimiento editado con éxito');
        navigate('/movimientos');
    };

    const agregarCategoria = async (nombreCategoria) => {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL;

        const nuevaCategoria = { nombre: nombreCategoria };
        const res = await fetch(`${baseUrl}/api/categories`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(nuevaCategoria),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error al crear categoría');
        }

        setCategorias((prev) => [...prev, data.nombre]);
        return data;
    };

    if (!movimiento) return <div>Cargando...</div>;

    return (
        <div>
            <h2>Editar Movimiento</h2>
            <MovementForm
                categorias={categorias}
                agregarCategoria={agregarCategoria}
                movimientoInicial={movimiento}
                onSubmit={editarMovimiento}
            />
        </div>
    );
}

export default EditarMovimientoPage;
