import { useState, useEffect } from 'react';

function MovementForm({ agregarMovimiento, categorias, agregarCategoria, movimientoInicial, onSubmit }) {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('Ingreso');
  const [categoria, setCategoria] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [fecha, setFecha] = useState('');
  const [errorMensaje, setErrorMensaje] = useState(null); // para mostrar errores del backend

  useEffect(() => {
    if (movimientoInicial) {
      setDescripcion(movimientoInicial.descripcion || '');
      setMonto(movimientoInicial.monto?.toString() || '');
      setTipo(movimientoInicial.tipo || 'Ingreso');
      setCategoria(movimientoInicial.categoria || '');
      setFecha(movimientoInicial.fecha?.slice(0, 10) || '');
    }
  }, [movimientoInicial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje(null); // limpiar errores previos

    const movimientoObj = {
      descripcion,
      monto: parseFloat(monto),
      tipo,
      categoria,
      fecha,
    };

    try {
      if (onSubmit) {
        await onSubmit(movimientoObj); // para editar
      } else if (agregarMovimiento) {
        await agregarMovimiento(movimientoObj); // para crear
        // limpiar solo si es creación
        setDescripcion('');
        setMonto('');
        setCategoria('');
        setFecha('');
      }
    } catch (error) {
      // Mostrar mensaje del backend si viene con fetch o axios
      setErrorMensaje(error?.response?.data?.error || error.message || 'Error al procesar movimiento');
    }
  };

  const handleAgregarCategoria = (e) => {
    e.preventDefault();
    if (!nuevaCategoria) {
      alert('Por favor, ingresa un nombre para la nueva categoría.');
      return;
    }
    if (nuevaCategoria.length > 30) {
      alert('La categoría no puede superar los 30 caracteres.');
      return;
    }
    agregarCategoria(nuevaCategoria);
    setCategoria(nuevaCategoria);
    setNuevaCategoria('');
    alert('Categoría creada correctamente.');
  };

  const handleCategoriaChange = (e) => {
    const selectedCategoria = e.target.value;
    setCategoria(selectedCategoria);
    if (selectedCategoria !== 'Otro') {
      setNuevaCategoria('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="Ingreso">Ingreso</option>
          <option value="Gasto">Gasto</option>
        </select>
        <select value={categoria} onChange={handleCategoriaChange}>
          <option value="">Seleccionar categoría</option>
          {categorias.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
          <option value="Otro">Otro</option>
        </select>
        {categoria === 'Otro' && (
          <div>
            <input
              type="text"
              placeholder="Nueva categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
            />
            <button type="button" onClick={handleAgregarCategoria}>
              Agregar Categoría
            </button>
          </div>
        )}
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        {/* Mostrar error si existe */}
        {errorMensaje && <p style={{ color: 'red' }}>{errorMensaje}</p>}

        <button type="submit">
          {onSubmit ? 'Guardar Cambios' : 'Agregar Movimiento'}
        </button>
      </form>
    </div>
  );
}

export default MovementForm;
