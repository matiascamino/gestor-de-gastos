import { useEffect, useState } from 'react';

function DashboardPage() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState(null);

  const obtenerResumen = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard?anio=${anio}&mes=${mes}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al obtener datos');
      setResumen(data);
      setError(null);
    } catch (err) {
      setResumen(null);
      setError(err.message);
    }
  };

  useEffect(() => {
    obtenerResumen();
  }, [anio, mes]);

  return (
    <div>
      <h2>Dashboard Mensual</h2>

      <div>
        <label>
          Año:
          <input
            type="number"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            min="2000"
          />
        </label>
        <label>
          Mes:
          <input
            type="number"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            min="1"
            max="12"
          />
        </label>
        <button onClick={obtenerResumen}>Actualizar</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {resumen && (
        <div>
          <p><strong>Ingresos:</strong> ${resumen.ingresos.toFixed(2)}</p>
          <p><strong>Gastos:</strong> ${resumen.gastos.toFixed(2)}</p>
          <p><strong>Balance:</strong> ${resumen.balance.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
