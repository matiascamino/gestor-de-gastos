import { useEffect, useState } from 'react';
import './styles/DashboardPage.css';

function DashboardPage() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState(null);
  const [presupuesto, setPresupuesto] = useState('');
  const [presupuestoGuardado, setPresupuestoGuardado] = useState(null);
  const [notificacionPresupuesto, setNotificacionPresupuesto] = useState('');
  const [notificacionAdvertencia, setNotificacionAdvertencia] = useState('');

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

  const obtenerPresupuesto = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/budget?anio=${anio}&mes=${mes}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al obtener presupuesto');
      setPresupuestoGuardado(data.presupuesto);
    } catch (err) {
      setPresupuestoGuardado(null);
    }
  };

  const guardarPresupuesto = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          anio,
          mes,
          presupuesto: Number(presupuesto)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar presupuesto');
      setPresupuestoGuardado(Number(presupuesto));
      setPresupuesto('');
      setNotificacionPresupuesto('¡Presupuesto guardado exitosamente!');
      setTimeout(() => setNotificacionPresupuesto(''), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    obtenerResumen();
    obtenerPresupuesto();
  }, [anio, mes]);

  // Notificación si superó presupuesto
  useEffect(() => {
    if (resumen && presupuestoGuardado !== null && resumen.gastos > presupuestoGuardado) {
      setNotificacionAdvertencia('⚠️ Has superado el presupuesto mensual.');
    } else {
      setNotificacionAdvertencia('');
    }
  }, [resumen, presupuestoGuardado]);

  const balanceClase = resumen && resumen.balance >= 0 ? 'balance-positivo' : 'balance-negativo';

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Mensual</h2>

      <div className="dashboard-filtros">
        <label>
          Año:
          <input
            type="number"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            min="2000"
          />
        </label>

        <label>
          Mes:
          <input
            type="number"
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            min="1"
            max="12"
          />
        </label>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {resumen && (
        <div className="resumen-cards">
          <div className="resumen-card">
            <div className="resumen-titulo">Ingresos</div>
            <div className="resumen-valor">${resumen.ingresos.toFixed(2)}</div>
          </div>
          <div className="resumen-card">
            <div className="resumen-titulo">Gastos</div>
            <div className="resumen-valor">${resumen.gastos.toFixed(2)}</div>
          </div>
          <div className="resumen-card">
            <div className="resumen-titulo">Balance</div>
            <div className={`resumen-valor ${balanceClase}`}>
              ${resumen.balance.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      <div className="presupuesto-section">
        <label>
          Presupuesto mensual:
          <input
            type="number"
            value={presupuesto}
            onChange={(e) => setPresupuesto(e.target.value)}
            placeholder="Ej: 50000"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                guardarPresupuesto();
              }
            }}
          />
        </label>
        <button onClick={guardarPresupuesto}>Guardar</button>

        {presupuestoGuardado != null && !isNaN(presupuestoGuardado) && (
          <p>Presupuesto guardado: ${Number(presupuestoGuardado).toFixed(2)}</p>
        )}

        {notificacionPresupuesto && (
          <p style={{ color: 'green', fontWeight: 'bold' }}>{notificacionPresupuesto}</p>
        )}
        {notificacionAdvertencia && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>{notificacionAdvertencia}</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
