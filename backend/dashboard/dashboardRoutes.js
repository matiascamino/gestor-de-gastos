const express = require('express');
const router = express.Router();
const controller = require('./dashboardController');
const verificarToken = require('../auth/authMiddleware');

router.get('/', verificarToken, controller.obtenerResumenMensual);

module.exports = router;
