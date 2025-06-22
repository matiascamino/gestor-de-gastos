const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;// Usar .env en producción

// Registro
// Registro
const register = async (req, res) => {
  const { nombre, email, contraseña } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, contraseña) VALUES ($1, $2, $3) RETURNING *',
      [nombre, email, hashedPassword]
    );

    const usuario = result.rows[0];

    // ⚠️ FALTABA ESTO: generar token
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '2h' });

    // 🔥 Devolver el token para que el frontend lo use
    res.status(201).json({ mensaje: 'Usuario registrado', token });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Este correo ya está registrado' });
    }

    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};



// Login
const login = async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const usuario = result.rows[0];
    const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { register, login };
