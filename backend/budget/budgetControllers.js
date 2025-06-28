const pool = require('../db'); // Asegurate que sea tu conexión a PostgreSQL

exports.obtenerPresupuesto = async (req, res) => {
  const { anio, mes } = req.query;
  const usuarioId = req.usuario.id;

  try {
    const result = await pool.query(
      'SELECT presupuesto FROM presupuestos WHERE usuario_id = $1 AND anio = $2 AND mes = $3',
      [usuarioId, anio, mes]
    );

    if (result.rows.length === 0) {
      return res.json({ presupuesto: null }); // no hay presupuesto aún
    }

    res.json({ presupuesto: result.rows[0].presupuesto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener presupuesto' });
  }
};

exports.guardarPresupuesto = async (req, res) => {
  const { anio, mes, presupuesto } = req.body;
  const usuarioId = req.usuario.id;

  try {
    await pool.query(
      `INSERT INTO presupuestos (usuario_id, anio, mes, presupuesto)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (usuario_id, anio, mes)
       DO UPDATE SET presupuesto = EXCLUDED.presupuesto`,
      [usuarioId, anio, mes, presupuesto]
    );

    res.json({ message: 'Presupuesto guardado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar presupuesto' });
  }
};
