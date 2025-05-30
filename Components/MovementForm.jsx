import { useState } from 'react';

function MovementForm({ agregarMovimiento, categorias, agregarCategoria }) {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('Ingreso');
  const [categoria, setCategoria] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [fecha, setFecha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (descripcion.length > 100) {
      alert('La descripción no puede superar los 100 caracteres.');
      return;
    }
    if (parseFloat(monto) < 0) {
      alert('El monto no puede ser negativo.');
      return;
    }
    if (monto.length > 8) {
      alert('El monto no puede superar los 8 dígitos.');
      return;
    }
    if (descripcion && monto && categoria && fecha) {
      agregarMovimiento({
        id: Date.now(),
        descripcion,
        monto: parseFloat(monto),
        tipo,
        categoria,
        fecha,
      });
      setDescripcion('');
      setMonto('');
      setCategoria('');
      setFecha('');
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  const handleAgregarCategoria = (e) => {
    e.preventDefault();
    if (nuevaCategoria) {
      agregarCategoria(nuevaCategoria);
      setNuevaCategoria('');
    } else {
      alert('Por favor, ingresa un nombre para la nueva categoría.');
    }
  };

  const handleCategoriaChange = (e) => {
    const selectedCategoria = e.target.value;
    setCategoria(selectedCategoria);
    if (selectedCategoria !== 'Otro') {
      setNuevaCategoria(''); // Limpiar el input de nueva categoría si no se selecciona "Otro"
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setDescripcion(e.target.value);
            } else {
              alert('La descripción no puede superar los 100 caracteres.');
            }
          }}
        />
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => {
            const value = e.target.value;
            // Permitir vacío, o hasta 8 dígitos
            if (value === '' || value.length <= 8) {
              setMonto(value);
            } else {
              alert('El monto no puede superar los 8 dígitos.');
            }
          }}
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Gasto</option>
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
            <button
              type="button"
              onClick={() => {
                if (nuevaCategoria.length > 30) {
                  alert('La categoría no puede superar los 30 caracteres.');
                  return;
                }
                if (nuevaCategoria) {
                  agregarCategoria(nuevaCategoria);
                  setCategoria(nuevaCategoria); // Seleccionar automáticamente la nueva categoría
                  setNuevaCategoria('');
                  alert('Categoría creada correctamente.');
                } else {
                  alert('Por favor, ingresa un nombre para la nueva categoría.');
                }
              }}
            >
              Agregar Categoría
            </button>
          </div>
        )}
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <button type="submit">Agregar Movimiento</button>
      </form>
    </div>
  );
}

export default MovementForm;
