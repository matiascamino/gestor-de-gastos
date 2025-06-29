const express = require('express');
const router = express.Router();
const verificarToken = require('../auth/authMiddleware'); 
const {
  obtenerPresupuesto,
  guardarPresupuesto
} = require('./budgetControllers');

router.get('/', verificarToken, obtenerPresupuesto);
router.post('/', verificarToken, guardarPresupuesto);

module.exports = router;
