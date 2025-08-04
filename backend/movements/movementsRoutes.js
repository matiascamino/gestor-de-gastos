const express = require('express');
const router = express.Router();
const controller = require('./movementsController');
const verificarToken = require('../auth/authMiddleware');


// Todas las rutas deben validar token (usuario logueado)
router.use(verificarToken);

// GET /api/movements - obtener movimientos solo del usuario logueado
router.get('/', controller.obtenerMovimientos);

// GET /api/movements/:id - obtener movimiento por id solo si pertenece al usuario
router.get('/:id', controller.obtenerMovimientoPorId);

// POST /api/movements - crear movimiento para el usuario logueado
router.post('/', controller.crearMovimiento);

// PUT /api/movements/:id - editar movimiento solo si pertenece al usuario
router.put('/:id', controller.editarMovimiento);

// DELETE /api/movements/:id - eliminar movimiento solo si pertenece al usuario
router.delete('/:id', controller.eliminarMovimiento);

module.exports = router;
