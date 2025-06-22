const express = require('express');
const router = express.Router();
const controller = require('./categoriesController');
const verificarToken = require('../auth/authMiddleware');

// Todas las rutas deben validar token (usuario logueado)
router.get('/', verificarToken, controller.obtenerCategorias);
router.post('/', verificarToken, controller.crearCategoria);
router.put('/:id', verificarToken, controller.editarCategoria);
router.delete('/:id', verificarToken, controller.eliminarCategoria);


module.exports = router;
