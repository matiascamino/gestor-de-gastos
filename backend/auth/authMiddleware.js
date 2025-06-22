// auth/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Usá process.env.JWT_SECRET en producción

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1]; // Formato: "Bearer token"

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });

    req.usuario = decoded; // Guardamos el payload del token (tiene el id y email)
    next();
  });
}

module.exports = verificarToken;
