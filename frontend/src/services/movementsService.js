export async function crearMovimientoAPI(movimiento) {
  const response = await fetch('http://localhost:3001/api/movements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movimiento),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al crear movimiento');
  }
  return response.json();
}
export async function obtenerMovimientosAPI() {
  const response = await fetch('http://localhost:3001/api/movements');
  if (!response.ok) {
    throw new Error('Error al obtener movimientos');
  }
  return response.json();
}
export async function editarMovimientoAPI(id, movimiento) {
  const response = await fetch(`http://localhost:3001/api/movements/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movimiento),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al editar movimiento');
  }
  return response.json();
}