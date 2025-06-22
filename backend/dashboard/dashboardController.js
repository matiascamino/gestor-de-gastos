const pool = require('../db');

// GET /api/dashboard?anio=2025&mes=6
const obtenerResumenMensual = async (req, res) => {
  const { anio, mes } = req.query;

  if (!anio || !mes) {
    return res.status(400).json({ error: 'Debes proporcionar el año y el mes' });
  }

  const inicioMes = `${anio}-${mes.toString().padStart(2, '0')}-01`;
  const ultimoDia = new Date(anio, mes, 0).getDate();
  const finMes = `${anio}-${mes.toString().padStart(2, '0')}-${ultimoDia}`;
  const usuarioId = req.usuario.id;

  try {
    const result = await pool.query(
      `SELECT tipo, SUM(monto) AS total
       FROM movimientos
       WHERE fecha BETWEEN $1 AND $2 AND usuario_id = $3
       GROUP BY tipo`,
      [inicioMes, finMes, usuarioId]
    );

    let ingresos = 0;
    let gastos = 0;

    result.rows.forEach(row => {
      if (row.tipo === 'Ingreso') ingresos = parseFloat(row.total);
      else if (row.tipo === 'Gasto') gastos = parseFloat(row.total);
    });

    const balance = ingresos - gastos;

    res.json({ ingresos, gastos, balance });
  } catch (error) {
    console.error('Error al obtener resumen mensual:', error);
    res.status(500).json({ error: 'Error al obtener resumen mensual' });
  }
};

module.exports = {
  obtenerResumenMensual
};
