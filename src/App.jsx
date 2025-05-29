import { useState } from 'react';
import MovementForm from '../Components/MovementForm';
import './App.css'; // Import the CSS file

function App() {
  const [movimientos, setMovimientos] = useState([]);
  const [categorias, setCategorias] = useState(["Alimentos", "Transporte", "Entretenimiento"]); // Default categories

  const agregarMovimiento = (nuevo) => {
    setMovimientos([...movimientos, nuevo]);
  };
 const eliminarMovimiento = (id) => {
  if (window.confirm("¿Estás seguro de que deseas eliminar este movimiento?")) {
    setMovimientos(movimientos.filter((mov) => mov.id !== id));
  }
 };

 const agregarCategoria = (nuevaCategoria) => {
  if (!categorias.includes(nuevaCategoria)) {
    setCategorias([...categorias, nuevaCategoria]);
  } else {
    alert("La categoría ya existe.");
  }
 };

  // Calcular totales
  const totalIngresos = movimientos
    .filter(mov => mov.tipo === "Ingreso")
    .reduce((acc, mov) => acc + mov.monto, 0);

  const totalGastos = movimientos
    .filter(mov => mov.tipo === "Gasto" || mov.tipo === "Egreso")
    .reduce((acc, mov) => acc + mov.monto, 0);

  const balance = totalIngresos - totalGastos;

  return (
    <div>
      <h1>Control de gastos </h1>
      <MovementForm 
        agregarMovimiento={agregarMovimiento} 
        categorias={categorias} 
        agregarCategoria={agregarCategoria} 
      />

      <h2>Balance</h2>
      <p>Ingresos: ${totalIngresos}</p>
      <p>Gastos: ${totalGastos}</p>
      <p>Balance: ${balance}</p>

      <h2>Movimientos ingresados: </h2>
      <ul>
        {[...movimientos]
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .map((mov, index) => (
            <li key={index}>
              {mov.descripcion}- ${mov.monto} -  {mov.tipo} - {mov.categoria} - {mov.fecha}
              <button onClick={() => eliminarMovimiento(mov.id)}>x</button>
            </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
