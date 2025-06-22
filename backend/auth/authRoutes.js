const express = require('express');
const router = express.Router();
const authController = require('./authController');
const verificarToken = require('./authMiddleware');
const pool = require('../db');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Nueva ruta: obtener datos del usuario autenticado
router.get('/me', verificarToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, email FROM usuarios WHERE id = $1', [req.usuario.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

module.exports = router;
