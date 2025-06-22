const pool = require('../db');

// Validación de movimiento
function validarMovimiento(req) {
  const { descripcion, monto, tipo, categoria, fecha } = req.body;

  if (!descripcion || !monto || !categoria || !fecha) {
    return 'Todos los campos son obligatorios.';
  }

  if (descripcion.length > 100) {
    return 'La descripción no puede superar los 100 caracteres.';
  }

  const montoFloat = parseFloat(monto);
  if (isNaN(montoFloat)) {
    return 'El monto debe ser un número válido.';
  }

  if (montoFloat < 0) {
    return 'El monto no puede ser negativo.';
  }

  if (monto.toString().replace('.', '').length > 8) {
    return 'El monto no puede superar los 8 dígitos.';
  }

  if (!['Ingreso', 'Gasto'].includes(tipo)) {
    return 'El tipo debe ser "Ingreso" o "Gasto".';
  }

  if (isNaN(Date.parse(fecha))) {
    return 'Fecha inválida.';
  }

  return null; // Todo OK
}

// Obtener todos los movimientos del usuario autenticado
const obtenerMovimientos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const result = await pool.query(
      'SELECT * FROM movimientos WHERE usuario_id = $1 ORDER BY fecha DESC',
      [usuarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({ error: 'Error al obtener movimientos' });
  }
};

// Crear movimiento para el usuario autenticado
const crearMovimiento = async (req, res) => {
  const errorValidacion = validarMovimiento(req);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const { descripcion, monto, tipo, categoria, fecha } = req.body;
  const usuarioId = req.usuario.id;
  try {
    const result = await pool.query(
      'INSERT INTO movimientos (descripcion, monto, tipo, categoria, fecha, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [descripcion, monto, tipo, categoria, fecha, usuarioId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    res.status(500).json({ error: 'Error al crear movimiento' });
  }
};

// Editar movimiento solo si pertenece al usuario
const editarMovimiento = async (req, res) => {
  const errorValidacion = validarMovimiento(req);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }

  const id = parseInt(req.params.id);
  const { descripcion, monto, tipo, categoria, fecha } = req.body;
  const usuarioId = req.usuario.id;
  try {
    const result = await pool.query(
      'UPDATE movimientos SET descripcion = $1, monto = $2, tipo = $3, categoria = $4, fecha = $5 WHERE id = $6 AND usuario_id = $7 RETURNING *',
      [descripcion, monto, tipo, categoria, fecha, id, usuarioId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al editar movimiento:', error);
    res.status(500).json({ error: 'Error al editar movimiento' });
  }
};

// Eliminar movimiento solo si pertenece al usuario
const eliminarMovimiento = async (req, res) => {
  const id = parseInt(req.params.id);
  const usuarioId = req.usuario.id;
  try {
    const result = await pool.query(
      'DELETE FROM movimientos WHERE id = $1 AND usuario_id = $2 RETURNING *',
      [id, usuarioId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al eliminar movimiento:', error);
    res.status(500).json({ error: 'Error al eliminar movimiento' });
  }
};

// Obtener movimiento por ID solo si pertenece al usuario
const obtenerMovimientoPorId = async (req, res) => {
  const id = parseInt(req.params.id);
  const usuarioId = req.usuario.id;
  try {
    const result = await pool.query(
      'SELECT * FROM movimientos WHERE id = $1 AND usuario_id = $2',
      [id, usuarioId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener movimiento por id:', error);
    res.status(500).json({ error: 'Error al obtener movimiento por id' });
  }
};

module.exports = {
  obtenerMovimientos,
  crearMovimiento,
  editarMovimiento,
  eliminarMovimiento,
  obtenerMovimientoPorId
};
