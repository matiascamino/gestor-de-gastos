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



return (
  <div>

    <h1>Control de gastos </h1>
    <MovementForm 
    agregarMovimiento={agregarMovimiento} 
    categorias={categorias} 
    agregarCategoria={agregarCategoria} 
    />

    <h2>Movimientos ingresados: </h2>
    <ul>
      {movimientos.map((mov, index) => (
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
