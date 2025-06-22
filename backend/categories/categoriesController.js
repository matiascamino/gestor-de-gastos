const pool = require('../db');

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
  const usuarioId = req.usuario.id;
  try {
    const result = await pool.query(
      'SELECT * FROM categorias WHERE usuario_id IS NULL OR usuario_id = $1',
      [usuarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};


// Crear nueva categoría
const crearCategoria = async (req, res) => {
  const { nombre } = req.body;
  const usuarioId = req.usuario.id; // Esto viene del middleware verificarToken

  try {
    const result = await pool.query(
      'INSERT INTO categorias (nombre, usuario_id) VALUES ($1, $2) RETURNING *',
      [nombre, usuarioId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};


const editarCategoria = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre } = req.body;
  const usuarioId = req.usuario.id;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
  }

  try {
    // Solo permite editar categorías que pertenezcan al usuario
    const result = await pool.query(
      'UPDATE categorias SET nombre = $1 WHERE id = $2 AND usuario_id = $3 RETURNING *',
      [nombre.trim(), id, usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada o no autorizada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al editar categoría:', error);
    res.status(500).json({ error: 'Error al editar categoría' });
  }
};

const eliminarCategoria = async (req, res) => {
  const id = parseInt(req.params.id);
  const usuarioId = req.usuario.id;

  try {
    const result = await pool.query(
      'DELETE FROM categorias WHERE id = $1 AND usuario_id = $2 RETURNING *',
      [id, usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada o no autorizada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};

module.exports = {
  obtenerCategorias,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
};
